const express = require("express");
const multer = require("multer");
const { optionalAuth } = require("../middleware/auth");
const { scanLimiter } = require("../middleware/rateLimit");
const { recordScan, listScanHistory } = require("../db/scanHistoryRepository");
const { enrichBookData } = require("../services/bookMetadataService");
const { detectBooksFromImageUpload } = require("../services/referenceScanUploadService");
const logger = require("../utils/logger");

const router = express.Router();

function hasKnownImageSignature(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length < 12) return false;
  const hex = buffer.subarray(0, 12).toString("hex");
  const ascii = buffer.subarray(0, 12).toString("ascii");
  const ftypBrand = buffer.subarray(8, 12).toString("ascii");
  const supportedFtypBrands = new Set(["avif", "avis", "mif1", "msf1", "heic", "heix", "hevc", "hevx"]);
  return (
    hex.startsWith("ffd8ff") ||
    hex.startsWith("89504e470d0a1a0a") ||
    ascii.startsWith("GIF87a") ||
    ascii.startsWith("GIF89a") ||
    (ascii.startsWith("RIFF") && buffer.subarray(8, 12).toString("ascii") === "WEBP") ||
    (buffer.subarray(4, 8).toString("ascii") === "ftyp" && supportedFtypBrands.has(ftypBrand))
  );
}

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

// Multer — store image in memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
  fileFilter(req, file, cb) {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"), false);
  },
});

// ── POST /api/scan ───────────────────────────────────────────
router.post(
  "/",
  optionalAuth,
  scanLimiter,
  upload.single("image"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image provided" });
      }

      const { buffer, mimetype } = req.file;
      if (!hasKnownImageSignature(buffer)) {
        return res.status(400).json({ success: false, error: "Uploaded file is not a supported image" });
      }
      const userId = req.auth?.userId || null;

      logger.info("Scanning shelf image", { authenticated: Boolean(userId) });

      // Step 1 — Detect books from the image
      const detection = await detectBooksFromImageUpload(buffer, mimetype);

      // Step 2 — Handle failure cases
      if (!detection.detectedBooks.length) {
        if (detection.detectionProvider === "none") {
          return res.status(422).json({
            error:
              "Could not detect any books. Please try a clearer photo with visible book spines.",
          });
        }
        return res.status(422).json({
          error:
            "Could not detect any books. Please try a clearer photo.",
        });
      }

      logger.info("Scan provider result", {
        provider: detection.detectionProvider,
        detected: detection.detectedBooks.length,
      });

      // Step 3 — Enrich with metadata (covers, pricing, links)
      const books = await mapWithConcurrency(
        detection.detectedBooks.slice(0, 15),
        4,
        async (book, index) => {
          const enriched = await enrichBookData(book.title, book.author);
          return {
            ...enriched,
            // Always preserve the original detected title
            title: book.title || enriched.title,
            author:
              book.author && book.author !== "Unknown"
                ? book.author
                : enriched.author,
            detectedTitle: book.title,
            detectedAuthor: book.author,
            confidence: book.confidence || null,
            match_score: book.confidence || null,
            visibleText: book.visibleText || "",
            boundingBox: book.boundingBox || null,
            scanRank: index + 1,
          };
        }
      );

      const bestMatch = books[0] || null;
      const scanMethod = detection.usedFallback
        ? "reference-vision-fallback"
        : "reference-image-scan";

      // Step 4 — Save scan to history (only if authenticated)
      if (userId) {
        await recordScan({
          userId,
          deviceId: req.get("X-Device-ID") || "",
          scanMethod,
          scannedTitle: detection.detectedBooks[0]?.title || "",
          scannedAuthor: detection.detectedBooks[0]?.author || "",
          ocrText: detection.rawOcrText || "",
          metadata: {
            total_detected: detection.detectedBooks.length,
            used_fallback: detection.usedFallback,
            detection_provider: detection.detectionProvider,
            visible_books: detection.visibleBooks,
            shelf_orientation: detection.shelfOrientation,
            detected_titles: detection.detectedBooks
              .map((b) => b.title)
              .filter(Boolean),
            geometry_available: detection.detectedBooks.some((b) => b.boundingBox),
          },
        });
      }

      // Step 5 — Return results
      res.json({
        success: true,
        usedFallback: detection.usedFallback,
        totalDetected: detection.detectedBooks.length,
        books,
        detected: detection.detectedBooks
          .map((b) => b.title)
          .filter(Boolean),
        detectionProvider: detection.detectionProvider,
        candidates: books,
        bestMatch,
        detections: detection.detectedBooks.map((book, index) => ({
          title: book.title,
          author: book.author,
          confidence: book.confidence || null,
          visibleText: book.visibleText || "",
          boundingBox: book.boundingBox || null,
          scanRank: index + 1,
        })),
        scan: {
          scan_method: scanMethod,
          detection_provider: detection.detectionProvider,
          visible_books: detection.visibleBooks,
          detected_books: books.length,
          shelf_orientation: detection.shelfOrientation,
          ocrText: detection.rawOcrText || "",
          geometry_available: books.some((book) => book.boundingBox),
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// ── POST /api/scan/fallback-summary ──────────────────────────
router.post("/fallback-summary", optionalAuth, scanLimiter, async (req, res, next) => {
  try {
    const userId = req.auth?.userId || null;
    const scan = req.body?.scan || {};
    const bestMatch = req.body?.bestMatch || null;
    const candidates = Array.isArray(req.body?.candidates)
      ? req.body.candidates
      : [];

    if (userId) {
      const summaryRecord = await recordScan({
        userId,
        deviceId: req.get("X-Device-ID") || "",
        scanMethod: scan.scan_method || "shelf-photo-fallback",
        scannedTitle: bestMatch?.title || "",
        scannedAuthor: bestMatch?.author || "",
        ocrText: scan.ocrText || "",
        matchedBookId: bestMatch?.book_id || null,
        matchedConfidence: bestMatch?.match_score || null,
        metadata: {
          visible_books: scan.visible_books || 0,
          detected_books: scan.detected_books || candidates.length,
          shelf_orientation: scan.shelf_orientation || "unknown",
          detection_provider: scan.detection_provider || "unknown",
          detected_titles: candidates
            .map((c) => c.title)
            .filter(Boolean)
            .slice(0, 20),
        },
      });
      return res.json({ success: true, scan: summaryRecord });
    }

    res.json({ success: true, scan: null });
  } catch (error) {
    next(error);
  }
});

// ── GET /api/scan/history (auth required) ────────────────────
router.get("/history", optionalAuth, async (req, res, next) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.json({ scans: [] });
    }
    const scans = await listScanHistory({
      userId,
      limit: 10,
    });
    res.json({ scans });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
