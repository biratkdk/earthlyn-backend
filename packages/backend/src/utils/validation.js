function boundedString(value, { max = 500, fallback = '' } = {}) {
  const text = String(value ?? '').trim();
  if (!text) return fallback;
  return text.slice(0, max);
}

function boundedNullableString(value, { max = 2000 } = {}) {
  const text = boundedString(value, { max, fallback: '' });
  return text || null;
}

function boundedNumber(value, { min = 0, max = Number.MAX_SAFE_INTEGER } = {}) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return null;
  return Math.max(min, Math.min(max, numeric));
}

function boundedStringList(value, { maxItems = 12, maxLength = 80 } = {}) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => boundedString(item, { max: maxLength }))
    .filter(Boolean)
    .slice(0, maxItems);
}

function boundedUrl(value) {
  const text = boundedString(value, { max: 1000 });
  if (!text) return null;
  try {
    const url = new URL(text);
    return url.protocol === 'https:' ? url.toString() : null;
  } catch {
    return null;
  }
}

module.exports = {
  boundedString,
  boundedNullableString,
  boundedNumber,
  boundedStringList,
  boundedUrl
};
