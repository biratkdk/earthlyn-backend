const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { listReadingList, addReadingListItem, removeReadingListItem } = require('../db/readingListRepository');
const { getUserPreferences } = require('../db/userPreferencesRepository');
const { listGoodreadsImports } = require('../db/goodreadsRepository');
const { getTrendingBooks, searchBooks } = require('../db/booksRepository');
const { enrichBookData, searchGoogleBooks } = require('../services/bookMetadataService');
const { buildDiscoverQueries, dedupeExternalBooks, mapReadingListItem, toReferencePreferences } = require('../services/referenceApiService');
const { boundedNullableString, boundedNumber, boundedString, boundedStringList, boundedUrl } = require('../utils/validation');

const router = express.Router();
router.use(requireAuth);

async function mapWithConcurrency(items, limit, mapper) {
  const results = new Array(items.length);
  let cursor = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await mapper(items[index], index);
    }
  });
  await Promise.all(workers);
  return results;
}

router.get('/search', async (req, res, next) => {
  try {
    const q = String(req.query.q || '').trim();
    if (!q) {
      return res.status(400).json({ error: 'Query required' });
    }

    const book = await enrichBookData(q, '');
    res.json({ success: true, book });
  } catch (error) {
    next(error);
  }
});

router.get('/list', async (req, res, next) => {
  try {
    const books = await listReadingList({ userId: req.auth.userId, limit: 200 });
    res.json({ success: true, books: books.map(mapReadingListItem) });
  } catch (error) {
    next(error);
  }
});

router.post('/save', async (req, res, next) => {
  try {
    const title = boundedString(req.body?.title, { max: 240 });
    if (!title) {
      return res.status(400).json({ error: 'Title required' });
    }

    const author = boundedString(req.body?.author, { max: 180, fallback: 'Unknown' });
    const existing = (await listReadingList({ userId: req.auth.userId, limit: 200 }))
      .find((item) => (
        item.title.toLowerCase() === title.toLowerCase()
        && String(item.author || '').toLowerCase() === author.toLowerCase()
      ));
    if (existing) {
      return res.json({ success: true, message: 'Already saved', book: mapReadingListItem(existing) });
    }

    const item = await addReadingListItem({
      userId: req.auth.userId,
      title,
      author,
      coverImage: boundedUrl(req.body?.coverImage),
      amazonUrl: boundedUrl(req.body?.amazonUrl),
      googleUrl: boundedUrl(req.body?.googleUrl),
      openLibraryUrl: boundedUrl(req.body?.openLibUrl || req.body?.openLibraryUrl),
      metadata: {
        rating: boundedNumber(req.body?.rating, { min: 0, max: 5 }),
        ratingsCount: boundedNumber(req.body?.ratingsCount, { min: 0, max: 100000000 }),
        pageCount: boundedNumber(req.body?.pageCount, { min: 1, max: 10000 }),
        publishedDate: boundedNullableString(req.body?.publishedDate, { max: 40 }),
        categories: boundedStringList(req.body?.categories, { maxItems: 10, maxLength: 80 }),
        description: boundedNullableString(req.body?.description, { max: 4000 })
      },
      source: boundedString(req.body?.source, { max: 40, fallback: 'external' })
    });

    res.json({ success: true, book: mapReadingListItem(item) });
  } catch (error) {
    next(error);
  }
});

router.delete('/remove/id/:id', async (req, res, next) => {
  try {
    const readingListId = Number(req.params.id);
    if (!Number.isInteger(readingListId) || readingListId <= 0) {
      return res.status(400).json({ error: 'Valid reading list id required' });
    }
    await removeReadingListItem({ userId: req.auth.userId, readingListId });
    res.json({ success: true, message: 'Book removed from reading list' });
  } catch (error) {
    next(error);
  }
});

router.get('/discover', async (req, res, next) => {
  try {
    const [preferences, imports] = await Promise.all([
      getUserPreferences(req.auth.userId),
      listGoodreadsImports({ userId: req.auth.userId, limit: 200 })
    ]);
    const referencePreferences = toReferencePreferences(req.auth, preferences, imports);
    if (!referencePreferences) {
      return res.status(400).json({ error: 'Please set your preferences first' });
    }

    const queries = buildDiscoverQueries(referencePreferences);
    const results = await mapWithConcurrency(queries, 3, (query) => searchGoogleBooks(query, 6));
    let books = dedupeExternalBooks(results.flat());

    if (!books.length) {
      const fallbackCatalog = await mapWithConcurrency((await getTrendingBooks()).slice(0, 6), 3, (book) => enrichBookData(book.title, book.author));
      books = dedupeExternalBooks(fallbackCatalog);
    }

    if (!books.length && referencePreferences.genres?.length) {
      const catalogMatches = await searchBooks({ genre: referencePreferences.genres[0] });
      books = dedupeExternalBooks(await mapWithConcurrency(catalogMatches.slice(0, 6), 3, (book) => enrichBookData(book.title, book.author)));
    }

    res.json({
      success: true,
      total: books.length,
      books,
      basedOn: {
        genres: referencePreferences.genres || [],
        authors: referencePreferences.authors || ''
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
