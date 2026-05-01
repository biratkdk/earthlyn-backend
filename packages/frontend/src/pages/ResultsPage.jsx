import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Bookmark,
  BookmarkCheck,
  Camera,
  CheckCircle,
  Lightbulb,
  Plus,
  ShoppingCart,
  Sparkles,
  Trash2,
} from "lucide-react";
import { getRecommendations, removeBook, saveBook } from "../services/api";
import { amazonSearchUrl } from "../services/storeLinks";
import { bookIdentity, sameBook } from "../utils/bookIdentity";
import BookModal from "../components/BookModal";
import { useReveal } from "../hooks/useReveal";
import SmartBookCover from "../components/SmartBookCover";

const MATCH_COLORS = {
  high: { border: "var(--green)", label: "Great match" },
  medium: { border: "var(--amber)", label: "Decent match" },
  low: { border: "var(--muted)", label: "Low match" },
  unknown: { border: "var(--muted)", label: "" },
};

function makeReviewId(book, index) {
  return book?.reviewId || `review-${book?.scanRank || index + 1}-${index}`;
}

function normalizeDetectedBook(book, index) {
  if (typeof book === "string") {
    return {
      reviewId: `detected-string-${index}`,
      title: book,
      author: "Unknown",
      confidence: null,
      scanRank: index + 1,
    };
  }

  return {
    ...book,
    reviewId: makeReviewId(book, index),
    title: book?.title || book?.detectedTitle || "",
    author: book?.author || book?.detectedAuthor || "Unknown",
    confidence: book?.confidence ?? book?.match_score ?? null,
    visibleText: book?.visibleText || book?.visible_text || "",
    boundingBox: book?.boundingBox || book?.bounding_box || null,
    verified: book?.verified ?? true,
    scanRank: book?.scanRank || index + 1,
  };
}

function formatConfidence(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric <= 0) return "Needs check";
  const percent = numeric <= 1 ? Math.round(numeric * 100) : Math.round(numeric);
  return `${Math.max(1, Math.min(100, percent))}%`;
}

function confidenceLevel(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric <= 0) return "review";
  const percent = numeric <= 1 ? numeric * 100 : numeric;
  if (percent >= 82) return "high";
  if (percent >= 58) return "medium";
  return "review";
}

function formatBoxStyle(box) {
  if (!box) return null;
  const x = Number(box.x);
  const y = Number(box.y);
  const width = Number(box.width);
  const height = Number(box.height);
  if (![x, y, width, height].every(Number.isFinite)) return null;
  return {
    "--x": `${Math.max(0, Math.min(1, x)) * 100}%`,
    "--y": `${Math.max(0, Math.min(1, y)) * 100}%`,
    "--w": `${Math.max(0.02, Math.min(1, width)) * 100}%`,
    "--h": `${Math.max(0.02, Math.min(1, height)) * 100}%`,
  };
}

function parseMatchPercent(value) {
  const numeric = Number(String(value || "").replace("%", ""));
  if (!Number.isFinite(numeric)) return 0;
  return Math.max(0, Math.min(100, numeric));
}

export default function ResultsPage({
  saved,
  setSaved,
  showToast,
  results,
  setResults,
  isAuthenticated,
  setPage,
}) {
  const [tab, setTab] = useState("recommended");
  const [filter, setFilter] = useState("all");
  const [modalBook, setModalBook] = useState(null);
  const [reviewBooks, setReviewBooks] = useState([]);
  const [recommending, setRecommending] = useState(false);
  const recommendAbortRef = useRef(null);
  const revealResults = useReveal();

  const pendingReview = Boolean(results?.pendingReview);
  const detectedBooks = Array.isArray(results?.detected) ? results.detected : [];
  const recommendations = Array.isArray(results?.recommendations) ? results.recommendations : [];
  const hasPreferences = results?.hasPreferences ?? true;
  const topBook = recommendations[0];
  const greatMatches = recommendations.filter((book) => book.matchLevel === "high").length;
  const lowMatches = recommendations.filter((book) => ["low", "unknown", "review"].includes(book.matchLevel || "unknown")).length;
  const hasResultContext = Boolean(results && (pendingReview || detectedBooks.length || recommendations.length));
  const scanMode = results?.mode === "sample" ? "Sample scan" : "Live scan";
  const geometryCount = detectedBooks.filter((book) => formatBoxStyle(book.boundingBox || book.bounding_box)).length;

  useEffect(() => {
    if (pendingReview) {
      setReviewBooks((results?.detected || []).map(normalizeDetectedBook));
    }
  }, [pendingReview, results]);

  useEffect(() => () => {
    recommendAbortRef.current?.abort();
  }, []);

  const filteredBooks = filter === "all"
    ? recommendations
    : recommendations.filter((book) => book.matchLevel === filter);

  const isSaved = (book) => saved.some((savedBook) => sameBook(savedBook, book));

  const toggleSave = async (book) => {
    if (!isAuthenticated) {
      showToast("Sign in to save books to your reading list");
      setPage("auth");
      return;
    }

    const alreadySaved = saved.find((item) => sameBook(item, book));
    try {
      if (alreadySaved) {
        await removeBook(alreadySaved);
        const removeId = alreadySaved.readingListId || alreadySaved.reading_list_id;
        setSaved((items) => items.filter((item) => (
          removeId
            ? (item.readingListId || item.reading_list_id) !== removeId
            : !sameBook(item, book)
        )));
        showToast("Removed from reading list");
      } else {
        const response = await saveBook({
          title: book.title,
          author: book.author,
          coverImage: book.coverImage,
          rating: book.rating,
          ratingsCount: book.ratingsCount,
          pageCount: book.pageCount,
          publishedDate: book.publishedDate,
          categories: book.categories,
          description: book.description,
          amazonUrl: book.pricing?.amazon?.buyUrl,
          googleUrl: book.pricing?.google?.buyUrl,
          openLibUrl: book.pricing?.openLibrary?.buyUrl,
        });
        if (!response.book?.readingListId && !response.book?.reading_list_id) {
          throw new Error("Saved book id was not returned");
        }
        setSaved((items) => [...items, response.book]);
        showToast(`"${book.title}" added to your list`);
      }
    } catch (error) {
      showToast(error.message || (alreadySaved ? "Could not remove book" : "Could not save book"));
    }
  };

  const updateReviewBook = (index, field, value) => {
    setReviewBooks((books) => books.map((book, currentIndex) => (
      currentIndex === index ? { ...book, [field]: value } : book
    )));
  };

  const removeReviewBook = (index) => {
    setReviewBooks((books) => books.filter((_, currentIndex) => currentIndex !== index));
  };

  const duplicateReviewBook = (index) => {
    setReviewBooks((books) => {
      const source = books[index];
      if (!source) return books;
      const next = [
        ...books.slice(0, index + 1),
        {
          ...source,
          title: "",
          author: source.author || "Unknown",
          confidence: null,
          visibleText: source.visibleText || "",
          boundingBox: null,
          reviewId: `split-${Date.now()}-${index}`,
          scanRank: index + 2,
        },
        ...books.slice(index + 1),
      ];
      return next.map((book, currentIndex) => ({ ...book, scanRank: currentIndex + 1 }));
    });
  };

  const mergeReviewBookUp = (index) => {
    if (index <= 0) return;
    setReviewBooks((books) => {
      const previous = books[index - 1];
      const current = books[index];
      if (!previous || !current) return books;
      const merged = {
        ...previous,
        title: [previous.title, current.title].filter(Boolean).join(" / "),
        author: previous.author !== "Unknown" ? previous.author : current.author,
        visibleText: [previous.visibleText, current.visibleText].filter(Boolean).join(" | "),
        confidence: Math.max(Number(previous.confidence) || 0, Number(current.confidence) || 0) || null,
      };
      return [
        ...books.slice(0, index - 1),
        merged,
        ...books.slice(index + 1),
      ].map((book, currentIndex) => ({ ...book, scanRank: currentIndex + 1 }));
    });
  };

  const addReviewBook = () => {
    setReviewBooks((books) => [
      ...books,
      { reviewId: `manual-${Date.now()}-${books.length}`, title: "", author: "Unknown", confidence: null, scanRank: books.length + 1, verified: true },
    ]);
  };

  const moveReviewBook = (index, direction) => {
    setReviewBooks((books) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= books.length) return books;
      const next = [...books];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next.map((book, currentIndex) => ({ ...book, scanRank: currentIndex + 1 }));
    });
  };

  const toggleVerifiedBook = (index) => {
    setReviewBooks((books) => books.map((book, currentIndex) => (
      currentIndex === index ? { ...book, verified: !(book.verified !== false) } : book
    )));
  };

  const confirmBooks = async () => {
    const confirmedBooks = reviewBooks
      .filter((book) => book.verified !== false)
      .map((book) => ({
        ...book,
        title: String(book.title || "").trim(),
        author: String(book.author || "").trim() || "Unknown",
      }))
      .filter((book) => book.title);

    if (!confirmedBooks.length) {
      showToast("Add at least one confirmed book");
      return;
    }

    setRecommending(true);
    recommendAbortRef.current?.abort();
    const controller = new AbortController();
    recommendAbortRef.current = controller;
    try {
      const simpleBooks = confirmedBooks.map((book) => ({
        title: book.title,
        author: book.author,
      }));
      const recResult = await getRecommendations(simpleBooks, { signal: controller.signal });
      setResults({
        ...results,
        detected: confirmedBooks,
        recommendations: recResult.recommendations || [],
        hasPreferences: recResult.hasPreferences,
        pendingReview: false,
      });
      setTab("recommended");
      showToast(`Ranked ${confirmedBooks.length} confirmed books`);
    } catch (error) {
      if (controller.signal.aborted) return;
      showToast(error.message || "Recommendations failed");
    } finally {
      if (!controller.signal.aborted) {
        setRecommending(false);
      }
    }
  };

  const rankingSignals = (book) => {
    const match = parseMatchPercent(book.matchPercent);
    const quality = book.rating ? `${book.rating} rating` : "catalog fallback";
    const availability = book.pricing?.google?.price
      ? "priced"
      : book.pricing?.openLibrary?.available
        ? "free read"
        : "store search";
    const metadata = [
      book.coverImage,
      book.description,
      book.pageCount,
      book.rating,
      book.ratingsCount,
    ].filter(Boolean).length;

    return [
      ["Taste", hasPreferences ? `${match || "partial"}%` : "popular fallback", hasPreferences ? "Preference match from saved taste" : "No taste profile was available"],
      ["Quality", quality, book.rating ? "Catalog rating signal" : "No rating returned by catalog"],
      ["Availability", availability, "Store/free-read availability status"],
      ["Metadata", `${metadata}/5`, "Cover, description, pages, rating, review count"],
    ];
  };

  if (!hasResultContext) {
    return (
      <div className="page">
        <div className="results-wrap reveal reveal-stagger" ref={revealResults}>
          <div className="results-empty">
            <div className="results-empty-icon"><Camera size={34} /></div>
            <div>
              <div className="scanner-kicker">
                <Sparkles size={15} /> live results only
              </div>
              <h2>No shelf scan yet</h2>
              <p>
                Results are now generated only from a real upload or the explicit calibration sample.
                Scan a shelf first, then review the detected titles before ranking.
              </p>
            </div>
            <div className="results-empty-actions">
              <button className="btn-primary" onClick={() => setPage("scanner")}>
                <Camera size={17} /> Scan a shelf
              </button>
              <button className="btn-secondary" onClick={() => setPage("home")}>
                Set taste profile
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (pendingReview) {
    return (
      <div className="page">
        <div className="results-wrap reveal reveal-stagger" ref={revealResults}>
          <div className="results-header">
            <div className="scanner-kicker">
              <Sparkles size={15} /> review gate
            </div>
            <h2>Review detected books</h2>
            <p>
              {reviewBooks.length} candidates
              {results?.scanSummary?.detectionProvider ? ` - ${results.scanSummary.detectionProvider}` : ""}
            </p>
            <div className="data-provenance" aria-label="Scan data provenance">
              <span><strong>{scanMode}</strong> {results?.scanSummary?.detectionProvider || "local upload"}</span>
              <span><strong>{results?.scanSummary?.visibleBooks || reviewBooks.length}</strong> visible books</span>
              <span><strong>{geometryCount}</strong> geometry boxes</span>
            </div>
          </div>

          <div className="review-panel">
            <div className="review-scan-proof">
              <div>
                <span>Review policy</span>
                <strong>Only approved rows are ranked</strong>
                <small>Use move controls to correct shelf order, edit titles inline, or remove noisy OCR.</small>
              </div>
              <div>
                <span>Image quality</span>
                <strong>
                  {results?.scanSummary?.imageQuality?.width
                    ? `${results.scanSummary.imageQuality.width} x ${results.scanSummary.imageQuality.height}px`
                    : "not available"}
                </strong>
                <small>{results?.scanSummary?.imageSource === "demo" ? "Calibration sample" : "User upload"}</small>
              </div>
            </div>

            {reviewBooks.some((book) => formatBoxStyle(book.boundingBox)) && (
              <div className="review-geometry-map" aria-label="Detected spine geometry">
                {reviewBooks.map((book, index) => {
                  const boxStyle = formatBoxStyle(book.boundingBox);
                  if (!boxStyle) return null;
                  return (
                    <span key={`box-${book.reviewId || index}`} style={boxStyle}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  );
                })}
              </div>
            )}

            <div className="review-table">
              {reviewBooks.map((book, index) => (
                <div
                  className={`review-row confidence-${confidenceLevel(book.confidence)}${book.verified === false ? " is-muted" : ""}`}
                  key={book.reviewId || `${bookIdentity(book)}-${book.scanRank || index}`}
                >
                  <div className="review-rank">{String(index + 1).padStart(2, "0")}</div>
                  <div className="review-fields">
                    <label htmlFor={`review-title-${index}`}>
                      <span>Title</span>
                      <input
                        id={`review-title-${index}`}
                        value={book.title}
                        onChange={(event) => updateReviewBook(index, "title", event.target.value)}
                      />
                    </label>
                    <label htmlFor={`review-author-${index}`}>
                      <span>Author</span>
                      <input
                        id={`review-author-${index}`}
                        value={book.author}
                        onChange={(event) => updateReviewBook(index, "author", event.target.value)}
                      />
                    </label>
                  </div>
                  <div className="review-confidence">
                    <strong>{formatConfidence(book.confidence)}</strong>
                    {book.visibleText && <small>{book.visibleText}</small>}
                  </div>
                  <div className="review-row-actions">
                    <button
                      className={`review-verify${book.verified === false ? "" : " active"}`}
                      onClick={() => toggleVerifiedBook(index)}
                      aria-label={book.verified === false ? "Approve detected book" : "Mark detected book as ignored"}
                    >
                      <CheckCircle size={16} />
                    </button>
                    <button className="review-tool" onClick={() => duplicateReviewBook(index)} aria-label="Split this detected row into another editable row">
                      <Plus size={15} /> Split
                    </button>
                    <button className="review-tool" onClick={() => mergeReviewBookUp(index)} disabled={index === 0} aria-label="Merge this detected row with the previous row">
                      Merge
                    </button>
                    <button className="review-move" onClick={() => moveReviewBook(index, -1)} disabled={index === 0} aria-label="Move detected book up">
                      <ArrowUp size={15} />
                    </button>
                    <button className="review-move" onClick={() => moveReviewBook(index, 1)} disabled={index === reviewBooks.length - 1} aria-label="Move detected book down">
                      <ArrowDown size={15} />
                    </button>
                    <button className="review-remove" onClick={() => removeReviewBook(index)} aria-label="Remove detected book">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="review-actions">
              <button className="btn-secondary review-add" onClick={addReviewBook}>
                <Plus size={16} /> Add book
              </button>
              <button className="btn-primary" onClick={confirmBooks} disabled={recommending}>
                <Sparkles size={17} /> {recommending ? "Ranking books..." : "Confirm and rank"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="results-wrap reveal reveal-stagger" ref={revealResults}>
        <div className="results-header">
          <div className="scanner-kicker">
            <Sparkles size={15} /> shelf decision engine
          </div>
          <h2>Shelf results</h2>
          <p>
            Found {detectedBooks.length} books on the shelf - {recommendations.length} ranked by{" "}
            {hasPreferences ? "your preferences" : "popularity"}
          </p>
          <div className="results-intel-bar" aria-label="ShelfScanner ranking signals">
            <span><strong>{detectedBooks.length}</strong> confirmed titles</span>
            <span><strong>{recommendations.length}</strong> ranked options</span>
            <span><strong>{hasPreferences ? "taste" : "popular"}</strong> sorting model</span>
          </div>
          <div className="data-provenance" aria-label="Recommendation data provenance">
            <span><strong>{scanMode}</strong> {results?.scanSummary?.detectionProvider || "confirmed list"}</span>
            <span><strong>{results?.scanSummary?.geometryAvailable ? "real" : "none"}</strong> spine geometry</span>
            <span><strong>{hasPreferences ? "personal" : "fallback"}</strong> ranking signal</span>
          </div>
          {!hasPreferences && (
            <div className="preference-tip">
              <strong>Tip:</strong> Set your reading preferences on the home page to get personalised rankings.
            </div>
          )}
        </div>

        <div className="results-decision-board" aria-label="Ranking decision summary">
          <div className="decision-card decision-primary">
            <span>Best next read</span>
            <strong>{topBook?.title || "No ranked pick yet"}</strong>
            <small>{topBook?.reason || "Confirm scanned books to generate a ranked shortlist."}</small>
          </div>
          <div className="decision-card">
            <span>High-confidence picks</span>
            <strong>{greatMatches}</strong>
            <small>{hasPreferences ? "Matched against your taste profile" : "Using popularity fallback"}</small>
          </div>
          <div className="decision-card">
            <span>Review risk</span>
            <strong>{lowMatches}</strong>
            <small>Lower-fit books surfaced for transparent comparison</small>
          </div>
        </div>

        <div className="results-tabs">
          {[
            ["recommended", "Ranked books"],
            ["all", "All detected"],
          ].map(([value, label]) => (
            <button
              key={value}
              className={`tab-btn${tab === value ? " active" : ""}`}
              onClick={() => setTab(value)}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "all" && (
          <div className="detected-shelf">
            <h4>Books detected on shelf</h4>
            <div className="detected-book-grid">
              {detectedBooks.map((book, index) => {
                const detected = normalizeDetectedBook(book, index);
                return (
                  <button
                    type="button"
                    className="detected-book-card"
                    key={`${bookIdentity(detected)}-${index}`}
                    onClick={() => setModalBook(detected)}
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{detected.title}</strong>
                    <small>{detected.author || "Unknown author"}</small>
                    <em>{formatConfidence(detected.confidence)}</em>
                    <b>Open details</b>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {tab === "recommended" && hasPreferences && (
          <div className="match-filter-bar">
            {[
              ["all", "All books"],
              ["high", "Great match"],
              ["medium", "Decent match"],
              ["low", "Low match"],
            ].map(([value, label]) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={`match-filter-btn${filter === value ? " active" : ""}`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {tab === "recommended" && filteredBooks.length === 0 && (
          <div className="discover-state">
            <Sparkles size={34} />
            <h3>No ranked books yet</h3>
            <p>Confirm detected titles or adjust your taste profile to generate a clean shortlist.</p>
            <button className="btn-secondary" onClick={() => setPage("scanner")}>
              Scan another shelf
            </button>
          </div>
        )}

        {tab === "recommended" && filteredBooks.length > 0 && (
          <div className="book-cards">
            {filteredBooks.map((book, index) => {
              const matchStyle = MATCH_COLORS[book.matchLevel || "unknown"];
              return (
                <div
                  className="book-card"
                  key={`${bookIdentity(book)}-${index}`}
                  style={{
                    "--match-border": matchStyle.border,
                    "--match": `${parseMatchPercent(book.matchPercent)}%`,
                  }}
                >
                  <div className="rank-medal">#{String(index + 1).padStart(2, "0")}</div>

                  <div className="book-card-topline">
                    <span>{matchStyle.label || "Shelf pick"}</span>
                    <strong>{book.matchPercent || "scan"}</strong>
                  </div>

                  <div className="book-cover">
                    <SmartBookCover book={book} rank={index + 1} />
                  </div>

                  <div className="book-info">
                    <div className="book-title">{book.title}</div>
                    <div className="book-author">{book.author}</div>

                    {matchStyle.label && (
                      <div className="match-pill">{matchStyle.label}</div>
                    )}

                    <div className="match-meter" aria-label={`Match strength ${book.matchPercent || "unknown"}`}>
                      <span />
                    </div>

                    {book.rating && (
                      <div className="book-meta">
                        Rating {book.rating}
                        {book.pageCount ? ` - ${book.pageCount} pages` : ""}
                      </div>
                    )}

                    <p className="book-why">
                      <Lightbulb size={14} />
                      {book.reason}
                    </p>

                    <div className="reason-tags" aria-label="Ranking evidence">
                      <span>Taste fit</span>
                      <span>{book.pageCount ? `${book.pageCount}p` : "Shelf signal"}</span>
                      <span>{book.pricing?.google?.price ? "priced" : "store search"}</span>
                    </div>

                    <div className="ranking-evidence" aria-label={`${book.title} ranking evidence`}>
                      {rankingSignals(book).map(([label, value, note]) => (
                        <div key={label}>
                          <span>{label}</span>
                          <strong>{value}</strong>
                          <small>{note}</small>
                        </div>
                      ))}
                    </div>

                    <div className="price-panel">
                      <div className="price-title">Where to buy</div>

                      {book.pricing?.google?.price && (
                        <div>
                          <span>Google Play</span>
                          <a href={book.pricing.google.buyUrl} target="_blank" rel="noreferrer">
                            {book.pricing.google.price}
                          </a>
                        </div>
                      )}

                      <div>
                        <span>Amazon</span>
                        <a href={amazonSearchUrl(book.title, book.pricing?.amazon?.buyUrl)} target="_blank" rel="noreferrer">
                          Search
                        </a>
                      </div>

                      {book.pricing?.openLibrary?.buyUrl && (
                        <div>
                          <span>Open Library</span>
                          <a href={book.pricing.openLibrary.buyUrl} target="_blank" rel="noreferrer">
                            Free
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="book-actions">
                      <button
                        className="btn-save"
                        onClick={() => setModalBook(book)}
                      >
                        Details
                      </button>
                      <button
                        className={`btn-save${isSaved(book) ? " saved" : ""}`}
                        onClick={(event) => {
                          event.stopPropagation();
                          toggleSave(book);
                        }}
                      >
                        {isSaved(book)
                          ? <><BookmarkCheck size={14} /> Saved</>
                          : <><Bookmark size={14} /> Save</>
                        }
                      </button>
                      <button
                        className="btn-amazon"
                        onClick={(event) => {
                          event.stopPropagation();
                          window.open(amazonSearchUrl(book.title, book.pricing?.amazon?.buyUrl), "_blank", "noopener,noreferrer");
                        }}
                      >
                        <ShoppingCart size={14} /> Amazon
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <BookModal
        book={modalBook}
        onClose={() => setModalBook(null)}
        saved={saved}
        setSaved={setSaved}
        showToast={showToast}
        isAuthenticated={isAuthenticated}
        setPage={setPage}
      />
    </div>
  );
}
