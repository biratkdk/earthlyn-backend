const { OpenAI } = require('openai');
const { getTrendingBooks, searchBooks } = require('../db/booksRepository');
const logger = require('../utils/logger');

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

function isSameBook(left, right) {
  return String(left.title || '').trim().toLowerCase() === String(right.title || '').trim().toLowerCase()
    && String(left.author || '').trim().toLowerCase() === String(right.author || '').trim().toLowerCase();
}

function mergeUniqueBooks(...groups) {
  const merged = [];

  for (const group of groups) {
    for (const book of group || []) {
      if (!merged.some((existing) => isSameBook(existing, book))) {
        merged.push(book);
      }
    }
  }

  return merged;
}

function buildShortSummary(book) {
  const tags = (book.tags || []).slice(0, 2);
  if (tags.length) {
    return `${book.title} is a ${book.genre.toLowerCase()} read centered on ${tags.join(' and ')}.`;
  }

  return `${book.title} is a ${book.genre.toLowerCase()} recommendation from ${book.author}.`;
}

function buildKeyTakeaway(sourceBook, book) {
  if (book.genre === sourceBook.genre) {
    return `Strong match if you want another ${book.genre.toLowerCase()} title with a similar feel.`;
  }

  return `Good crossover pick if you want to expand from ${sourceBook.genre.toLowerCase()} into adjacent themes.`;
}

function buildDiscussionQuestion(sourceBook, book) {
  return `How does ${book.title} expand on the ideas you liked in ${sourceBook.title}?`;
}

function buildFallbackRecommendations(sourceBook, libraryBooks) {
  return libraryBooks
    .filter((book) => String(book.book_id) !== String(sourceBook.book_id))
    .filter((book) => !isSameBook(book, sourceBook))
    .slice(0, 3)
    .map((book) => {
      const keyTakeaway = buildKeyTakeaway(sourceBook, book);
      return {
        title: book.title,
        author: book.author,
        genre: book.genre,
        shelf_location: book.shelf_location,
        summary: buildShortSummary(book),
        key_takeaway: keyTakeaway,
        takeaway: keyTakeaway,
        discussion_question: buildDiscussionQuestion(sourceBook, book)
      };
    });
}

function normalizeRecommendation(item, sourceBook) {
  const keyTakeaway = item.key_takeaway || item.takeaway || `Pairs well with ${sourceBook.title}.`;
  return {
    title: item.title,
    author: item.author,
    genre: item.genre,
    shelf_location: item.shelf_location,
    summary: item.summary,
    key_takeaway: keyTakeaway,
    takeaway: keyTakeaway,
    discussion_question: item.discussion_question || item.discussionQuestion || buildDiscussionQuestion(sourceBook, item)
  };
}

async function getRecommendationPool(sourceBook) {
  const genreMatches = sourceBook.genre ? await searchBooks({ query: sourceBook.genre }) : [];
  const tagMatches = sourceBook.tags?.[0] ? await searchBooks({ query: sourceBook.tags[0] }) : [];
  const trending = await getTrendingBooks();

  return mergeUniqueBooks(genreMatches, tagMatches, trending)
    .filter((book) => !isSameBook(book, sourceBook));
}

async function getRecommendations(sourceBook) {
  const candidateBooks = await getRecommendationPool(sourceBook);

  if (!openai) {
    return buildFallbackRecommendations(sourceBook, candidateBooks);
  }

  try {
    let timeout;
    const response = await Promise.race([
      openai.responses.create({
        model: process.env.OPENAI_RECOMMENDATION_MODEL || 'gpt-4.1-mini',
        input: [
          {
            role: 'system',
            content: [
              {
                type: 'input_text',
                text: 'You create concise bookstore recommendations. Return valid JSON only. Do not recommend the same book as the source input.'
              }
            ]
          },
          {
            role: 'user',
            content: [
              {
                type: 'input_text',
                text: JSON.stringify({
                  sourceBook,
                  candidateBooks: candidateBooks.map((book) => ({
                    title: book.title,
                    author: book.author,
                    genre: book.genre,
                    shelf_location: book.shelf_location,
                    tags: book.tags
                  })),
                  instructions: 'Recommend exactly 3 different books. Return JSON array items with title, author, genre, shelf_location, summary, key_takeaway, and discussion_question.'
                })
              }
            ]
          }
        ]
      }),
      new Promise((_, reject) => {
        timeout = setTimeout(() => reject(new Error('Recommendation request timed out')), 4000);
      })
    ]).finally(() => clearTimeout(timeout));

    const outputText = response.output_text || '[]';
    const parsed = JSON.parse(outputText);
    if (!Array.isArray(parsed)) {
      return buildFallbackRecommendations(sourceBook, candidateBooks);
    }

    const normalized = parsed
      .filter((item) => !isSameBook(item, sourceBook))
      .map((item) => normalizeRecommendation(item, sourceBook))
      .slice(0, 3);

    if (normalized.length === 3) {
      return normalized;
    }

    const fallback = buildFallbackRecommendations(sourceBook, candidateBooks);
    const merged = [...normalized];
    for (const item of fallback) {
      if (!merged.some((existing) => isSameBook(existing, item))) {
        merged.push(item);
      }
      if (merged.length === 3) {
        break;
      }
    }

    return merged.slice(0, 3);
  } catch (error) {
    logger.warn('Recommendation AI fallback used', error.message);
    return buildFallbackRecommendations(sourceBook, candidateBooks);
  }
}

module.exports = { getRecommendations };
