import { useState } from "react";
import { BookOpen } from "lucide-react";

const COVER_THEMES = [
  ["#F0A843", "#C47B28"],
  ["#8B5E3C", "#6B3F1A"],
  ["#E8924A", "#D4803A"],
  ["#F5B865", "#F0A843"],
  ["#A0522D", "#8B5E3C"],
];

function hashText(value = "") {
  return Array.from(value).reduce((hash, char) => (
    (hash * 31 + char.charCodeAt(0)) >>> 0
  ), 7);
}

function initials(title = "") {
  const words = String(title).trim().split(/\s+/).filter(Boolean);
  if (!words.length) return "SS";
  return words.slice(0, 2).map((word) => word[0]).join("").toUpperCase();
}

export default function SmartBookCover({ book, rank, variant = "card" }) {
  const [coverFailed, setCoverFailed] = useState(false);
  const title = book?.title || "Untitled";
  const author = book?.author || "Unknown";
  const hasRealCover = Boolean(book?.coverImage && !coverFailed);
  const [toneA, toneB] = COVER_THEMES[hashText(title) % COVER_THEMES.length];

  if (hasRealCover) {
    return (
      <img
        className="real-book-cover"
        src={book.coverImage}
        alt={`${title} cover`}
        loading="lazy"
        decoding="async"
        onError={() => setCoverFailed(true)}
      />
    );
  }

  return (
    <div
      className={`smart-cover smart-cover-${variant}`}
      style={{ "--cover-a": toneA, "--cover-b": toneB }}
      aria-label={`${title} editorial fallback cover`}
    >
      <div className="smart-cover-spine" aria-hidden="true" />
      <div className="smart-cover-grid" aria-hidden="true" />
      <span className="smart-cover-rank">{rank ? `#${String(rank).padStart(2, "0")}` : "scan"}</span>
      <strong>{variant === "modal" ? title.slice(0, 24) : initials(title)}</strong>
      <small>{author}</small>
      <BookOpen size={variant === "list" ? 15 : 20} strokeWidth={1.8} />
    </div>
  );
}
