const { normalizeText } = require('./bookMetadataService');

function splitList(value) {
  return String(value || '')
    .split(/[\n,;]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function hasReferencePreferences(preferences, goodreadsData = []) {
  return Boolean(
    (preferences?.genres || []).length ||
    preferences?.pace ||
    preferences?.length_preference ||
    preferences?.favorite_authors ||
    preferences?.loved_books ||
    Number(preferences?.min_rating || 0) > 0 ||
    goodreadsData.length
  );
}

function toReferencePreferences(auth, preferences = {}, goodreadsData = []) {
  if (!hasReferencePreferences(preferences, goodreadsData)) {
    return null;
  }

  return {
    userId: auth.userId,
    email: auth.email,
    genres: preferences.genres || [],
    pace: preferences.pace || '',
    length: preferences.length_preference || '',
    authors: preferences.favorite_authors || '',
    loved: preferences.loved_books || '',
    minRating: Number(preferences.min_rating || 0),
    goodreadsData
  };
}

function fromReferencePreferencesInput(body = {}) {
  return {
    genres: Array.isArray(body.genres) ? body.genres : splitList(body.genres),
    pace: body.pace || '',
    lengthPreference: body.lengthPreference || body.length || '',
    favoriteAuthors: body.favoriteAuthors || body.authors || '',
    lovedBooks: body.lovedBooks || body.loved || '',
    minRating: Number(body.minRating || 0)
  };
}

function parseCsvLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"') {
      if (inQuotes && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current);
  return values.map((item) => item.trim());
}

function parseReferenceGoodreadsCsv(csvData = '') {
  const lines = String(csvData || '').split(/\r?\n/).filter((line) => line.trim());
  if (lines.length < 2) {
    return [];
  }
  const headers = parseCsvLine(lines[0]).map((item) => item.toLowerCase());
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    return {
      title: row.title || row['book title'] || '',
      author: row.author || row['author l-f'] || '',
      rating: row['my rating'] || row.rating || '',
      exclusiveShelf: row['exclusive shelf'] || row.shelf || '',
      dateRead: row['date read'] || '',
      raw_payload: row
    };
  }).filter((entry) => String(entry.title || '').trim());
}

function buildDiscoverQueries(preferences = {}) {
  const queries = [];
  const genres = preferences.genres || [];
  const authors = splitList(preferences.authors || preferences.favorite_authors || '');
  const loved = splitList(preferences.loved || preferences.loved_books || '');

  genres.slice(0, 3).forEach((genre) => {
    queries.push(`subject:${genre}`);
    queries.push(`${genre} fiction popular`);
  });

  authors.slice(0, 2).forEach((author) => {
    queries.push(`inauthor:${author}`);
  });

  loved.slice(0, 2).forEach((book) => {
    queries.push(book);
  });

  if (!queries.length) {
    queries.push('bestseller fiction');
  }

  if (genres.length) {
    queries.push(`${genres[0]} books bestseller`);
  }

  return queries;
}

function mapReadingListItem(item) {
  const metadata = item.metadata || {};
  return {
    readingListId: item.reading_list_id,
    title: item.title,
    author: item.author || 'Unknown',
    coverImage: item.cover_image || null,
    rating: metadata.rating || null,
    ratingsCount: metadata.ratingsCount || null,
    pageCount: metadata.pageCount || null,
    publishedDate: metadata.publishedDate || null,
    categories: Array.isArray(metadata.categories) ? metadata.categories : [],
    description: metadata.description || null,
    amazonUrl: item.amazon_url || null,
    googleUrl: item.google_url || null,
    openLibUrl: item.open_library_url || null,
    savedAt: item.created_at,
    source: item.source || 'catalog'
  };
}

function dedupeExternalBooks(books) {
  const seen = new Set();
  return books.filter((book) => {
    const key = book.googleBooksId || `${normalizeText(book.title)}::${normalizeText(book.author)}`;
    if (!normalizeText(book.title) || seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function buildReason(book, matches, hasPreferences) {
  if (!hasPreferences) {
    return 'Ranked by general popularity, metadata quality, and overall readability signals.';
  }
  if (matches.length) {
    return `Matches your taste through ${matches.join(', ')}.`;
  }
  return 'Less aligned with your saved taste signals, but still surfaced as a potential crossover pick.';
}

function rankBooksForPreferences(books, preferences = {}) {
  const genres = (preferences.genres || []).map(normalizeText);
  const authors = splitList(preferences.authors || preferences.favorite_authors || '').map(normalizeText);
  const loved = splitList(preferences.loved || preferences.loved_books || '').map(normalizeText);
  const minRating = Number(preferences.minRating || preferences.min_rating || 0);
  const hasPreferences = Boolean(genres.length || authors.length || loved.length || minRating > 0);

  return books.map((book, index) => {
    const title = normalizeText(book.title);
    const author = normalizeText(book.author);
    const categories = (book.categories || [book.genre]).filter(Boolean).map(normalizeText);
    const matches = [];
    let score = 42;

    if (genres.some((genre) => categories.some((category) => category.includes(genre)))) {
      score += 24;
      matches.push('your preferred genres');
    }

    if (authors.some((favoriteAuthor) => author.includes(favoriteAuthor))) {
      score += 28;
      matches.push('favorite authors');
    }

    if (loved.some((lovedBook) => title.includes(lovedBook) || lovedBook.includes(title))) {
      score += 20;
      matches.push('books you loved');
    }

    if (book.rating != null) {
      score += Math.min(12, Math.round(Number(book.rating) * 2));
      if (minRating > 0 && Number(book.rating) < minRating) {
        score -= 14;
      }
    } else if (minRating > 0) {
      score -= 6;
    }

    score -= Math.min(index, 10);
    score = Math.max(18, Math.min(98, score));

    return {
      ...book,
      matchPercent: `${score}%`,
      matchLevel: score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low',
      reason: buildReason(book, matches, hasPreferences)
    };
  }).sort((left, right) => Number.parseInt(right.matchPercent, 10) - Number.parseInt(left.matchPercent, 10));
}

module.exports = {
  toReferencePreferences,
  fromReferencePreferencesInput,
  parseReferenceGoodreadsCsv,
  buildDiscoverQueries,
  mapReadingListItem,
  dedupeExternalBooks,
  rankBooksForPreferences,
  hasReferencePreferences
};
