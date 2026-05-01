const logger = require('../utils/logger');

const GOOGLE_BOOKS_CACHE = new Map();
const GOOGLE_BOOKS_CACHE_TTL_MS = Number(process.env.GOOGLE_BOOKS_CACHE_TTL_MS || 10 * 60 * 1000);
const GOOGLE_BOOKS_CACHE_MAX = Number(process.env.GOOGLE_BOOKS_CACHE_MAX || 250);

function normalizeText(value) {
  return String(value || '').trim().toLowerCase();
}

function buildBookUrls(title, author, info = {}, saleInfo = {}) {
  const resolvedTitle = info.title || title || '';
  const resolvedAuthor = info.authors?.[0] || author || 'Unknown';
  return {
    amazonUrl: `https://www.amazon.com/s?k=${encodeURIComponent(`${resolvedTitle} ${resolvedAuthor}`.trim())}`,
    googleUrl: normalizeUrlProtocol(saleInfo?.buyLink || info.previewLink || null),
    openLibUrl: `https://openlibrary.org/search?q=${encodeURIComponent(resolvedTitle)}`
  };
}

function normalizeUrlProtocol(url) {
  return url ? String(url).replace(/^http:\/\//i, 'https://') : null;
}

function formatRetailPrice(retailPrice = {}) {
  const amount = retailPrice.amount;
  if (!amount) return null;
  const currency = retailPrice.currencyCode || 'USD';
  return `${currency} ${amount}`;
}

function mapGoogleBooksItem(item, fallback = {}) {
  const info = item?.volumeInfo || {};
  const saleInfo = item?.saleInfo || {};
  const links = buildBookUrls(fallback.title, fallback.author, info, saleInfo);
  return {
    googleBooksId: item?.id || null,
    title: info.title || fallback.title || '',
    author: info.authors?.[0] || fallback.author || 'Unknown',
    coverImage: info.imageLinks?.thumbnail?.replace('http://', 'https://') || null,
    description: info.description || null,
    pageCount: info.pageCount || null,
    rating: info.averageRating || null,
    ratingsCount: info.ratingsCount || null,
    publishedDate: info.publishedDate || null,
    categories: Array.isArray(info.categories) ? info.categories : [],
    pricing: {
      amazon: {
        price: null,
        buyUrl: links.amazonUrl,
        label: 'Amazon'
      },
      google: {
        price: formatRetailPrice(saleInfo?.retailPrice),
        buyUrl: links.googleUrl,
        label: 'Google Play Books'
      },
      openLibrary: {
        price: 'FREE',
        buyUrl: links.openLibUrl,
        label: 'Open Library',
        available: true
      }
    },
    amazonUrl: links.amazonUrl,
    googleUrl: links.googleUrl,
    openLibUrl: links.openLibUrl
  };
}

function buildFallbackBook(title, author = '') {
  const links = buildBookUrls(title, author);
  return {
    title,
    author: author || 'Unknown',
    coverImage: null,
    description: null,
    pageCount: null,
    rating: null,
    ratingsCount: null,
    publishedDate: null,
    categories: [],
    pricing: {
      amazon: {
        price: null,
        buyUrl: links.amazonUrl,
        label: 'Amazon'
      },
      google: {
        price: null,
        buyUrl: links.googleUrl,
        label: 'Google Play Books'
      },
      openLibrary: {
        price: 'FREE',
        buyUrl: links.openLibUrl,
        label: 'Open Library',
        available: true
      }
    },
    amazonUrl: links.amazonUrl,
    googleUrl: links.googleUrl,
    openLibUrl: links.openLibUrl
  };
}

async function fetchGoogleBooks(url) {
  const cached = GOOGLE_BOOKS_CACHE.get(url);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.payload;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), Number(process.env.GOOGLE_BOOKS_TIMEOUT_MS || 8000));
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' }
    });

    if (!response.ok) {
      throw new Error(`Google Books request failed with status ${response.status}`);
    }

    const payload = await response.json();
    if (GOOGLE_BOOKS_CACHE.size >= GOOGLE_BOOKS_CACHE_MAX) {
      GOOGLE_BOOKS_CACHE.delete(GOOGLE_BOOKS_CACHE.keys().next().value);
    }
    GOOGLE_BOOKS_CACHE.set(url, {
      payload,
      expiresAt: Date.now() + GOOGLE_BOOKS_CACHE_TTL_MS
    });
    return payload;
  } finally {
    clearTimeout(timeout);
  }
}

function buildBooksApiUrl(query, maxResults = 1) {
  const key = process.env.GOOGLE_BOOKS_API_KEY || '';
  const params = new URLSearchParams({
    q: query,
    maxResults: String(maxResults),
    country: process.env.GOOGLE_BOOKS_COUNTRY || 'US',
    orderBy: 'relevance'
  });
  if (key) {
    params.set('key', key);
  }
  return `https://www.googleapis.com/books/v1/volumes?${params.toString()}`;
}

async function enrichBookData(title, author = '') {
  const query = `${title || ''} ${author || ''}`.trim();
  if (!query) {
    return buildFallbackBook('', author);
  }

  try {
    const payload = await fetchGoogleBooks(buildBooksApiUrl(query, 1));
    const item = payload.items?.[0];
    if (!item) {
      return buildFallbackBook(title, author);
    }
    return mapGoogleBooksItem(item, { title, author });
  } catch (error) {
    logger.warn('Google Books enrichment fallback used', error.message);
    return buildFallbackBook(title, author);
  }
}

async function searchGoogleBooks(query, maxResults = 6) {
  if (!String(query || '').trim()) {
    return [];
  }

  try {
    const payload = await fetchGoogleBooks(buildBooksApiUrl(query, maxResults));
    return (payload.items || []).map((item) => mapGoogleBooksItem(item, { title: query, author: '' }));
  } catch (error) {
    logger.warn('Google Books search fallback used', error.message);
    return [];
  }
}

module.exports = {
  enrichBookData,
  searchGoogleBooks,
  buildFallbackBook,
  normalizeText
};
