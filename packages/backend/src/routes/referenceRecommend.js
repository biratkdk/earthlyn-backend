const express = require('express');
const { optionalAuth } = require('../middleware/auth');
const { recommendLimiter } = require('../middleware/rateLimit');
const { getUserPreferences } = require('../db/userPreferencesRepository');
const { listGoodreadsImports } = require('../db/goodreadsRepository');
const { enrichBookData } = require('../services/bookMetadataService');
const { rankBooksForPreferences, toReferencePreferences } = require('../services/referenceApiService');

const router = express.Router();
router.use(optionalAuth);

router.post('/', recommendLimiter, async (req, res, next) => {
  try {
    const books = Array.isArray(req.body?.books) ? req.body.books : [];
    if (!books.length) {
      return res.status(400).json({ error: 'No books provided' });
    }

    let referencePreferences = {};
    const userId = req.auth?.userId;

    if (userId) {
      const [preferences, imports] = await Promise.all([
        getUserPreferences(userId),
        listGoodreadsImports({ userId, limit: 200 })
      ]);
      referencePreferences = toReferencePreferences(req.auth, preferences, imports) || {};
    }

    const ranked = rankBooksForPreferences(books, referencePreferences);
    const recommendations = await Promise.all(ranked.map(async (book) => ({
      ...(await enrichBookData(book.title, book.author)),
      matchPercent: book.matchPercent,
      matchLevel: book.matchLevel,
      reason: book.reason
    })));

    res.json({
      success: true,
      hasPreferences: Boolean(referencePreferences.genres?.length || referencePreferences.authors || referencePreferences.loved),
      totalRecommendations: recommendations.length,
      recommendations
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
