import { useEffect, useMemo, useState } from "react";
import {
  Bookmark,
  BookmarkCheck,
  BookOpen,
  LockKeyhole,
  RefreshCw,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import { getDiscover, removeBook, saveBook } from "../services/api";
import { amazonSearchUrl } from "../services/storeLinks";
import { bookIdentity, sameBook } from "../utils/bookIdentity";
import BookModal from "../components/BookModal";
import { useReveal } from "../hooks/useReveal";
import SmartBookCover from "../components/SmartBookCover";

const FILTERS = [
  ["all", "All"],
  ["rated", "Top rated"],
  ["priced", "Available to buy"],
  ["free", "Free to read"],
];

const LOCKED_VALUE_PREVIEW = [
  ["Taste graph", "Genres, authors, loved books, and saved shelf signals become ranking inputs."],
  ["Decision reasons", "Every pick explains whether it matched mood, length, rating, price, or availability."],
  ["Portable shelf", "Saved books turn into a working reading queue instead of another static list."],
];

function scoreFromRating(rating) {
  const numeric = Number(rating);
  if (!Number.isFinite(numeric)) return 54;
  return Math.max(20, Math.min(100, Math.round(numeric * 20)));
}

export default function DiscoverPage({ saved, setSaved, showToast, setPage, isAuthenticated }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("relevance");
  const [sortDirection, setSortDirection] = useState("desc");
  const [search, setSearch] = useState("");
  const [basedOn, setBasedOn] = useState({ genres: [], authors: "" });
  const [modalBook, setModalBook] = useState(null);
  const revealDiscover = useReveal();

  useEffect(() => {
    if (!isAuthenticated) {
      setBooks([]);
      setBasedOn({ genres: [], authors: "" });
      setError("Sign in to unlock personalised discovery");
      setLoading(false);
      return;
    }

    fetchDiscoverBooks();
    // fetchDiscoverBooks only depends on the current authentication state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const fetchDiscoverBooks = async () => {
    if (!isAuthenticated) {
      setError("Sign in to unlock personalised discovery");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await getDiscover();
      setBooks(result.books || []);
      setBasedOn(result.basedOn || { genres: [], authors: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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

  const isSaved = (book) => saved.some((savedBook) => sameBook(savedBook, book));
  const needsSignIn = error === "Sign in to unlock personalised discovery";
  const needsPreferences = /preferences/i.test(error || "");

  const displayBooks = useMemo(() => (
    books
      .filter((book) => {
        if (filter === "rated") return book.rating >= 4;
        if (filter === "priced") return book.pricing?.google?.price;
        if (filter === "free") return book.pricing?.openLibrary?.available;
        return true;
      })
      .filter((book) => {
        if (!search) return true;
        const term = search.toLowerCase();
        return (
          String(book.title || "").toLowerCase().includes(term) ||
          String(book.author || "").toLowerCase().includes(term)
        );
      })
      .sort((a, b) => {
        const direction = sortDirection === "asc" ? 1 : -1;
        if (sort === "rating") return ((a.rating || 0) - (b.rating || 0)) * direction;
        if (sort === "pages") return ((a.pageCount || 0) - (b.pageCount || 0)) * direction;
        return 0;
      })
  ), [books, filter, search, sort, sortDirection]);

  return (
    <div className="page">
      <div className="results-wrap discover-wrap reveal reveal-stagger" ref={revealDiscover} aria-busy={loading}>
        <div className="results-header discover-header">
          <div className="scanner-kicker">
            <Sparkles size={15} /> discovery engine
          </div>
          <h2>Discover books</h2>
          <p>
            Personalised picks based on your reading taste
            {basedOn.genres?.length > 0 && <span> - {basedOn.genres.join(", ")}</span>}
          </p>

          {basedOn.genres?.length > 0 && (
            <div className="discover-tags">
              {basedOn.genres.map((genre) => (
                <span key={genre}>{genre}</span>
              ))}
            </div>
          )}
        </div>

        {!error && (
          <div className="discover-command" aria-label="Discovery profile summary">
            <div className="taste-orbit" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <div>
              <span>taste profile</span>
              <strong>{basedOn.genres?.length ? basedOn.genres.slice(0, 3).join(" / ") : "No genres set"}</strong>
              <small>{basedOn.genres?.length ? (basedOn.authors || "Preference engine is using your saved shelf signals.") : "Go to Home to personalize recommendations."}</small>
            </div>
            <div>
              <span>active filter</span>
              <strong>{FILTERS.find(([value]) => value === filter)?.[1] || "All"}</strong>
              <small>{displayBooks.length} books visible</small>
            </div>
            <div>
              <span>author signal</span>
              <strong>{basedOn.authors ? "active" : "not set"}</strong>
              <small>{basedOn.authors || "Add favourite authors on Home to sharpen picks."}</small>
            </div>
          </div>
        )}

        {!error && (
          <div className="discover-toolbar">
            <label className="discover-search" htmlFor="discover-search">
              <span className="sr-only">Search discovery results</span>
              <Search size={16} />
              <input
                id="discover-search"
                type="text"
                placeholder="Search within results"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              {search && (
                <button
                  className="search-clear"
                  aria-label="Clear search"
                  onClick={() => setSearch("")}
                >
                  <X size={14} />
                </button>
              )}
            </label>

            <div className="discover-controls">
              <SlidersHorizontal size={15} />
              {FILTERS.map(([value, label]) => (
                <button
                  key={value}
                  className={`match-filter-btn${filter === value ? " active" : ""}`}
                  onClick={() => setFilter(value)}
                >
                  {label}
                </button>
              ))}
              <select aria-label="Sort discovery results" value={sort} onChange={(event) => setSort(event.target.value)}>
                <option value="relevance">Relevance</option>
                <option value="rating">Rating</option>
                <option value="pages">Page count</option>
              </select>
              <button
                className="match-filter-btn"
                type="button"
                onClick={() => setSortDirection((current) => current === "desc" ? "asc" : "desc")}
                aria-label={`Sort ${sortDirection === "desc" ? "descending" : "ascending"}`}
              >
                {sortDirection === "desc" ? "High first" : "Low first"}
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div className="skeleton-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div className="skeleton-card" key={i}>
                <div className="skeleton-cover" />
                <div className="skeleton-line" />
                <div className="skeleton-line short" />
                <div className="skeleton-line xshort" />
              </div>
            ))}
          </div>
        )}

        {error && !loading && (
          <div className="discover-state">
            {needsSignIn ? <LockKeyhole size={34} /> : <Sparkles size={34} />}
            <h3>{needsSignIn ? "Personal discovery is locked" : "Discovery needs one more step"}</h3>
            <p>
              {needsSignIn
                ? "Sign in to use personalised discovery and save your book taste."
                : needsPreferences
                  ? "Set your reading preferences on the home page first."
                  : error}
            </p>

            {needsSignIn && (
              <div className="locked-preview" aria-label="Personal discovery preview">
                {LOCKED_VALUE_PREVIEW.map(([label, copy], index) => (
                  <div key={label}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{label}</strong>
                    <small>{copy}</small>
                  </div>
                ))}
              </div>
            )}

            <div className="locked-preview-actions">
              <button
                className="btn-primary"
                onClick={() => {
                  if (needsSignIn) {
                    setPage("auth");
                  } else if (needsPreferences) {
                    setPage("home");
                  } else {
                    fetchDiscoverBooks();
                  }
                }}
              >
                {needsSignIn ? "Sign in" : needsPreferences ? "Go to preferences" : "Try again"}
              </button>
              {needsSignIn && (
                <button className="btn-secondary" onClick={() => setPage("scanner")}>
                  Scan without account
                </button>
              )}
            </div>
          </div>
        )}

        {!loading && !error && displayBooks.length === 0 && (
          <div className="discover-state">
            <Search size={34} />
            <h3>No books found</h3>
            <p>Try clearing the filter or searching a broader title or author.</p>
            <button className="btn-secondary" onClick={() => setFilter("all")}>
              Clear filter
            </button>
          </div>
        )}

        {!loading && !error && displayBooks.length > 0 && (
          <div className="book-cards discover-book-grid">
            {displayBooks.map((book, index) => (
              <div
                className="book-card discover-book-card"
                key={`${bookIdentity(book)}-${index}`}
                style={{ "--match": `${scoreFromRating(book.rating)}%` }}
              >
                <div className="book-card-topline">
                  <span>Browse pick</span>
                  <strong>{book.rating ? `${book.rating}` : "new"}</strong>
                </div>

                <div className="book-cover">
                  <SmartBookCover book={book} rank={index + 1} />
                </div>

                <div className="book-info">
                  <div className="book-title">{book.title}</div>
                  <div className="book-author">{book.author}</div>

                  {book.rating && (
                    <div className="book-meta">
                      {book.rating} rating
                      {book.ratingsCount ? ` - ${book.ratingsCount.toLocaleString()} reviews` : ""}
                      {book.pageCount ? ` - ${book.pageCount} pages` : ""}
                    </div>
                  )}

                  <div className="match-meter" aria-label="Discovery fit strength">
                    <span />
                  </div>

                  {book.description && (
                    <p className="book-description">{book.description}</p>
                  )}

                  <div className="reason-tags" aria-label="Discovery evidence">
                    <span>{book.pageCount ? `${book.pageCount}p` : "catalog"}</span>
                    <span>{book.pricing?.openLibrary?.available ? "free read" : "store"}</span>
                    <span>{book.rating ? "rated" : "fresh"}</span>
                    {basedOn.genres?.[0] && <span>{basedOn.genres[0]}</span>}
                  </div>

                  <div className="price-panel">
                    <div className="price-title">Where to buy</div>
                    {book.pricing?.google?.price && (
                      <div>
                        <span>Google Play</span>
                        <a href={book.pricing.google.buyUrl} target="_blank" rel="noreferrer">{book.pricing.google.price}</a>
                      </div>
                    )}
                    <div>
                      <span>Amazon</span>
                      <a href={amazonSearchUrl(book.title, book.pricing?.amazon?.buyUrl)} target="_blank" rel="noreferrer">Search</a>
                    </div>
                    {book.pricing?.openLibrary?.available && book.pricing?.openLibrary?.buyUrl && (
                      <div>
                        <span>Open Library</span>
                        <a href={book.pricing.openLibrary.buyUrl} target="_blank" rel="noreferrer">Free</a>
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
                      {isSaved(book) ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
                      {isSaved(book) ? "Saved" : "Save"}
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
            ))}
          </div>
        )}

        {!loading && !error && books.length > 0 && (
          <div className="discover-refresh">
            <button className="btn-secondary" onClick={fetchDiscoverBooks}>
              <RefreshCw size={15} /> Refresh recommendations
            </button>
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
