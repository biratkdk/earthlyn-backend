const { hasDatabaseConnection, query } = require('./client');

const fallbackScanHistory = [];
let nextScanId = 1;

function serializeScan(record) {
  if (!record) {
    return null;
  }

  return {
    scan_id: Number(record.scan_id),
    user_id: record.user_id == null ? null : Number(record.user_id),
    device_id: record.device_id || '',
    scan_method: record.scan_method,
    scanned_title: record.scanned_title || '',
    scanned_author: record.scanned_author || '',
    scanned_isbn: record.scanned_isbn || '',
    ocr_text: record.ocr_text || '',
    matched_book_id: record.matched_book_id == null ? null : Number(record.matched_book_id),
    matched_confidence: record.matched_confidence == null ? null : Number(record.matched_confidence),
    metadata: record.metadata || {},
    created_at: record.created_at || new Date().toISOString()
  };
}

async function recordScan({
  userId = null,
  deviceId = '',
  scanMethod = 'ocr',
  scannedTitle = '',
  scannedAuthor = '',
  scannedIsbn = '',
  ocrText = '',
  matchedBookId = null,
  matchedConfidence = null,
  metadata = {}
}) {
  if (hasDatabaseConnection) {
    const result = await query(
      `INSERT INTO scan_history (
        user_id,
        device_id,
        scan_method,
        scanned_title,
        scanned_author,
        scanned_isbn,
        ocr_text,
        matched_book_id,
        matched_confidence,
        metadata
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING scan_id, user_id, device_id, scan_method, scanned_title, scanned_author, scanned_isbn, ocr_text, matched_book_id, matched_confidence, metadata, created_at`,
      [userId, deviceId, scanMethod, scannedTitle, scannedAuthor, scannedIsbn, ocrText, matchedBookId, matchedConfidence, metadata]
    );
    return serializeScan(result.rows[0]);
  }

  const record = {
    scan_id: nextScanId++,
    user_id: userId,
    device_id: deviceId,
    scan_method: scanMethod,
    scanned_title: scannedTitle,
    scanned_author: scannedAuthor,
    scanned_isbn: scannedIsbn,
    ocr_text: ocrText,
    matched_book_id: matchedBookId,
    matched_confidence: matchedConfidence,
    metadata,
    created_at: new Date().toISOString()
  };

  fallbackScanHistory.unshift(record);
  return serializeScan(record);
}

async function listScanHistory({ userId = null, deviceId = '', limit = 20 } = {}) {
  const normalizedLimit = Math.max(1, Math.min(Number(limit) || 20, 100));

  if (hasDatabaseConnection) {
    const values = [];
    const where = [];

    if (userId) {
      values.push(userId);
      where.push(`user_id = $${values.length}`);
    } else if (deviceId) {
      values.push(deviceId);
      where.push(`device_id = $${values.length}`);
    }

    values.push(normalizedLimit);
    const sql = `SELECT scan_id, user_id, device_id, scan_method, scanned_title, scanned_author, scanned_isbn, ocr_text, matched_book_id, matched_confidence, metadata, created_at FROM scan_history ${where.length ? `WHERE ${where.join(' AND ')}` : ''} ORDER BY created_at DESC LIMIT $${values.length}`;
    const result = await query(sql, values);
    return result.rows.map(serializeScan);
  }

  return fallbackScanHistory
    .filter((record) => {
      if (userId) {
        return Number(record.user_id) === Number(userId);
      }
      if (deviceId) {
        return record.device_id === deviceId;
      }
      return true;
    })
    .slice(0, normalizedLimit)
    .map(serializeScan);
}

module.exports = {
  recordScan,
  listScanHistory
};
