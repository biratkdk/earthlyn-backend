const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { getUserPreferences, upsertUserPreferences } = require('../db/userPreferencesRepository');
const { listGoodreadsImports, importGoodreadsEntries } = require('../db/goodreadsRepository');
const { fromReferencePreferencesInput, parseReferenceGoodreadsCsv, toReferencePreferences } = require('../services/referenceApiService');

const router = express.Router();
router.use(requireAuth);

router.get('/', async (req, res, next) => {
  try {
    const [preferences, imports] = await Promise.all([
      getUserPreferences(req.auth.userId),
      listGoodreadsImports({ userId: req.auth.userId, limit: 200 })
    ]);

    res.json({
      preferences: toReferencePreferences(req.auth, preferences, imports)
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const input = fromReferencePreferencesInput(req.body || {});
    const preferences = await upsertUserPreferences({
      userId: req.auth.userId,
      genres: input.genres,
      pace: input.pace,
      lengthPreference: input.lengthPreference,
      favoriteAuthors: input.favoriteAuthors,
      lovedBooks: input.lovedBooks,
      minRating: input.minRating
    });

    res.json({
      success: true,
      preferences: toReferencePreferences(req.auth, preferences, [])
    });
  } catch (error) {
    next(error);
  }
});

router.post('/goodreads', async (req, res, next) => {
  try {
    const csvData = String(req.body?.csvData || '');
    const maxBytes = Number(process.env.GOODREADS_IMPORT_MAX_BYTES || 8 * 1024 * 1024);
    if (Buffer.byteLength(csvData, 'utf8') > maxBytes) {
      return res.status(413).json({ error: 'Goodreads CSV is too large' });
    }
    const maxRows = Number(process.env.GOODREADS_IMPORT_MAX_ROWS || 1000);
    const entries = parseReferenceGoodreadsCsv(csvData).slice(0, maxRows);
    if (!entries.length) {
      return res.status(400).json({ error: 'No CSV data provided' });
    }

    const imports = await importGoodreadsEntries({
      userId: req.auth.userId,
      entries
    });

    res.json({
      success: true,
      imported: imports.length,
      message: `Successfully imported ${imports.length} books from Goodreads`
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
