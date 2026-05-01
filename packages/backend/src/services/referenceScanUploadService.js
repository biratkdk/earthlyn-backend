const { GoogleGenerativeAI } = require("@google/generative-ai");
const crypto = require("crypto");
const { normalizeText } = require("./bookMetadataService");
const { DEMO_CALIBRATION_BOOKS: RAW_DEMO_CALIBRATION_BOOKS, DEMO_IMAGE_SHA256 } = require("../data/demoCalibrationBooks");
const logger = require("../utils/logger");

// ── Gemini setup ─────────────────────────────────────────────
const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

// Model fallback chain — cycles through models on quota/rate errors
const GEMINI_MODELS = [
  process.env.GEMINI_MODEL || "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-flash-latest",
];

// ── Helpers ──────────────────────────────────────────────────
function withTimeout(promise, ms = 25000) {
  let timeout;
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      timeout = setTimeout(() => reject(new Error("Request timed out")), ms);
    }),
  ]).finally(() => clearTimeout(timeout));
}

function stripCodeFences(value) {
  return String(value || "")
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();
}

function parseJsonArray(value) {
  const stripped = stripCodeFences(value);
  try {
    const parsed = JSON.parse(stripped);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_) {
    const start = stripped.indexOf("[");
    const end = stripped.lastIndexOf("]");
    if (start === -1 || end === -1 || end <= start) return [];
    try { return JSON.parse(stripped.slice(start, end + 1)); } catch (_) { return []; }
  }
}

function dedupeBooks(books) {
  const seen = new Set();
  return books.filter((book) => {
    const key = `${normalizeText(book.title)}::${normalizeText(book.author)}`;
    if (!normalizeText(book.title) || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function clampUnit(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return null;
  return Math.max(0, Math.min(1, numeric));
}

function normalizeBoundingBox(box) {
  const normalized = {
    x: clampUnit(box?.x),
    y: clampUnit(box?.y),
    width: clampUnit(box?.width),
    height: clampUnit(box?.height),
  };

  if ([normalized.x, normalized.y, normalized.width, normalized.height].some((value) => value === null)) {
    return null;
  }

  if (normalized.width <= 0 || normalized.height <= 0) {
    return null;
  }

  return normalized;
}

function normalizeParsedBooks(rawBooks) {
  return dedupeBooks(
    (Array.isArray(rawBooks) ? rawBooks : [])
      .map((b) => ({
        title: String(b?.title || "").trim(),
        author: String(b?.author || "").trim() || "Unknown",
        confidence: Number(b?.confidence || 0) || null,
        visibleText: String(b?.visible_text || b?.visibleText || "").trim(),
        boundingBox: normalizeBoundingBox(b?.bounding_box || b?.boundingBox),
      }))
      .filter((b) => b.title.length >= 2)
  ).slice(0, 20);
}

const DEMO_CALIBRATION_BOOKS = normalizeParsedBooks(RAW_DEMO_CALIBRATION_BOOKS);

function isBundledDemoImage(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex") === DEMO_IMAGE_SHA256;
}

// ── The optimised Gemini prompt ──────────────────────────────
const GEMINI_PROMPT = `You are an expert book spine reader with exceptional ability to read text at any angle, orientation, and lighting condition.

Carefully examine this bookshelf image and extract EVERY book you can identify.

READING RULES:
- Read ALL visible spines — vertical, horizontal, tilted, upside-down
- Read text even if partially obscured, faded, worn, or at an angle
- If you can read at least 2-3 words of a title, include it
- Include books even if partially hidden behind other books
- Look for both title AND author on each spine
- If author is not visible or unreadable, use "Unknown"
- Do NOT invent or guess books — only report what you can actually read
- Do NOT include publisher names, shelf labels, or decorative text
- Prioritise accuracy over quantity

Return ONLY a valid JSON array in this exact format, no other text:
[
  { "title": "Book Title Here", "author": "Author Name Here", "confidence": 0.9, "visible_text": "words visible on spine", "bounding_box": { "x": 0.12, "y": 0.18, "width": 0.08, "height": 0.55 } },
  { "title": "Another Book", "author": "Unknown", "confidence": 0.7, "visible_text": "partial readable text", "bounding_box": { "x": 0.24, "y": 0.21, "width": 0.07, "height": 0.48 } }
]

confidence: 0.0 to 1.0 — how confident you are in the reading.
bounding_box: normalized 0.0 to 1.0 position of the visible spine in the full image. If you cannot locate it, use null.
Return ONLY the JSON array. No markdown, no explanation, no wrapping.`;

// ── Gemini multi-model fallback ──────────────────────────────
async function runGeminiWithFallback(promptArgs) {
  if (!genAI) return null;

  const startedAt = Date.now();
  const totalTimeoutMs = Number(process.env.GEMINI_SCAN_TOTAL_TIMEOUT_MS || 55000);
  const perModelTimeoutMs = Number(process.env.GEMINI_SCAN_MODEL_TIMEOUT_MS || 12000);

  for (const modelName of GEMINI_MODELS) {
    try {
      const remainingMs = totalTimeoutMs - (Date.now() - startedAt);
      if (remainingMs <= 1000) {
        logger.warn("Gemini scan model budget exhausted");
        break;
      }
      logger.info("Trying Gemini scan model", modelName);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await withTimeout(model.generateContent(promptArgs), Math.min(perModelTimeoutMs, remainingMs));
      logger.info("Gemini scan model succeeded", modelName);
      return { result, modelName };
    } catch (err) {
      const status = err.status || err.httpCode || 0;
      const msg = err.message || "";
      logger.warn("Gemini scan model failed", { modelName, status, message: msg });

      // Retry-able errors — try next model
      if (
        status === 429 || status === 503 || status === 404 || status === 400 ||
        msg.includes("quota") || msg.includes("rate") ||
        msg.includes("overloaded") || msg.includes("not found") ||
        msg.includes("Timed out") || msg.includes("timed out") ||
        msg.includes("Request timed out")
      ) {
        logger.info("Retrying scan with next Gemini model", modelName);
        continue;
      }
      // Non-retryable — throw
      throw err;
    }
  }
  logger.warn("All Gemini scan models exhausted");
  return null;
}

// ── Extract books via Gemini Vision ──────────────────────────
async function extractBooksFromGemini(buffer, mimeType) {
  try {
    const geminiResult = await runGeminiWithFallback([
      { text: GEMINI_PROMPT },
      {
        inlineData: {
          mimeType,
          data: buffer.toString("base64"),
        },
      },
    ]);

    if (!geminiResult) return { books: [], modelUsed: null };

    const response = await geminiResult.result.response;
    const rawText = response.text();
    const books = normalizeParsedBooks(parseJsonArray(rawText));

    logger.info("Gemini detected books", { modelName: geminiResult.modelName, count: books.length });
    return { books, modelUsed: geminiResult.modelName };
  } catch (error) {
    logger.warn("Gemini extraction error", error.message);
    return { books: [], modelUsed: null };
  }
}

// ── Google Vision API fallback ───────────────────────────────
async function extractTextFromGoogleVision(buffer) {
  const apiKey = process.env.GOOGLE_CLOUD_API_KEY;
  if (!apiKey) return [];

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
      {
        method: "POST",
        signal: controller.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requests: [
            {
              image: { content: buffer.toString("base64") },
              features: [
                { type: "TEXT_DETECTION", maxResults: 50 },
                { type: "DOCUMENT_TEXT_DETECTION", maxResults: 50 },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      logger.warn("Google Vision API status", response.status);
      return [];
    }

    const payload = await response.json();
    const fullText =
      payload.responses?.[0]?.textAnnotations?.[0]?.description || "";

    return fullText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 3 && line.length < 100)
      .filter((line) => !/^\d+$/.test(line));
  } catch (error) {
    logger.warn("Google Vision error", error.name === "AbortError" ? "Request timed out" : error.message);
    return [];
  } finally {
    clearTimeout(timeout);
  }
}

function parseBooksFromTextLines(textLines) {
  const filtered = textLines.filter((line) => {
    const lower = line.toLowerCase();
    return (
      !lower.includes("bestseller") &&
      !lower.includes("www.") &&
      !lower.includes("isbn") &&
      !lower.includes("price") &&
      !lower.includes("edition") &&
      line.length > 3
    );
  });

  return dedupeBooks(
    filtered.map((title) => ({
      title,
      author: "Unknown",
      confidence: null,
    }))
  ).slice(0, 15);
}

async function extractBooksFromVision(buffer) {
  const textLines = await extractTextFromGoogleVision(buffer);
  if (!textLines.length) return { books: [], textLines: [] };

  const books = parseBooksFromTextLines(textLines);
  logger.info("Google Vision detected books from text", books.length);
  return { books, textLines };
}

// ── Main detection pipeline ──────────────────────────────────
async function detectBooksFromImageUpload(buffer, mimeType = "image/jpeg") {
  // Step 1 — Try Gemini with multi-model fallback
  const geminiResult = await extractBooksFromGemini(buffer, mimeType);
  if (geminiResult.books.length) {
    return {
      detectedBooks: geminiResult.books,
      usedFallback: false,
      detectionProvider: `gemini:${geminiResult.modelUsed}`,
      visibleBooks: geminiResult.books.length,
      shelfOrientation: "unknown",
      rawOcrText: geminiResult.books.map((b) => b.title).join(" | "),
    };
  }

  // Step 2 — Fall back to Google Vision API
  const visionResult = await extractBooksFromVision(buffer);
  if (visionResult.books.length) {
    return {
      detectedBooks: visionResult.books,
      usedFallback: true,
      detectionProvider: "google-vision",
      visibleBooks: visionResult.books.length,
      shelfOrientation: "unknown",
      rawOcrText: visionResult.textLines.join(" | "),
    };
  }

  // Step 3 - Exact bundled demo image fallback. Real uploads still fail honestly.
  if (isBundledDemoImage(buffer)) {
    logger.info("Using bundled demo calibration result");
    return {
      detectedBooks: DEMO_CALIBRATION_BOOKS,
      usedFallback: true,
      detectionProvider: "demo-calibration",
      visibleBooks: DEMO_CALIBRATION_BOOKS.length,
      shelfOrientation: "upright",
      rawOcrText: DEMO_CALIBRATION_BOOKS.map((book) => book.visibleText).join(" | "),
    };
  }

  // Step 4 — No books detected at all → honest failure
  logger.warn("All scan providers failed to detect books");
  return {
    detectedBooks: [],
    usedFallback: true,
    detectionProvider: "none",
    visibleBooks: 0,
    shelfOrientation: "unknown",
    rawOcrText: "",
  };
}

module.exports = { detectBooksFromImageUpload };
