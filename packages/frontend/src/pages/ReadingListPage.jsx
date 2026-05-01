import { BookOpen, Camera, Compass, ShoppingCart, Star, Trash2, X } from "lucide-react";
import { removeBook } from "../services/api";
import { amazonSearchUrl } from "../services/storeLinks";
import BookModal from "../components/BookModal";
import { useState } from "react";
import { useReveal } from "../hooks/useReveal";
import SmartBookCover from "../components/SmartBookCover";
import { bookIdentity, sameBook } from "../utils/bookIdentity";

export default function ReadingListPage({ saved, setSaved, setPage, showToast, isAuthenticated }) {
  const [modalBook, setModalBook] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const revealList = useReveal();

  const remove = async book => {
    setPendingDelete(null);
    try {
      await removeBook(book);
    } catch (err) {
      showToast(err.message || "Could not remove book");
      return;
    }
    const removeId = book.readingListId || book.reading_list_id;
    setSaved(s => s.filter(b => (
      removeId
        ? (b.readingListId || b.reading_list_id) !== removeId
        : !sameBook(b, book)
    )));
    showToast("Removed from reading list");
  };

  const formatDate = dateStr => {
    try {
      const date = new Date(dateStr);
      if (Number.isNaN(date.getTime())) return "date unknown";
      return date.toLocaleDateString(undefined, {
        day: "numeric", month: "short", year: "numeric"
      });
    } catch {
      return "date unknown";
    }
  };

  const ratedBooks = saved.filter((book) => Number.isFinite(Number(book.rating)) && Number(book.rating) > 0);
  const averageRating = ratedBooks.length
    ? ratedBooks.reduce((sum, book) => sum + Number(book.rating), 0) / ratedBooks.length
    : 0;

  const openBuyLink = (book) => {
    const opened = window.open(
      amazonSearchUrl(book.title, book.pricing?.amazon?.buyUrl || book.amazonUrl),
      "_blank",
      "noopener,noreferrer"
    );
    if (!opened) {
      showToast("Popup blocked. Open book details to use the buy link.");
    }
  };

  return (
    <div className="page reading-list-page">
      <div className="list-wrap reveal reveal-stagger" ref={revealList}>

        <div className="list-header">
          <div className="scanner-kicker">
            <BookOpen size={15} /> saved shelf
          </div>
          <h2>Your reading list</h2>
          <p>{saved.length} {saved.length === 1 ? "book" : "books"} saved for later</p>
        </div>

        <div className="list-command" aria-label="Reading list summary">
          <div>
            <span>saved shelf</span>
            <strong>{saved.length}</strong>
            <small>books ready for review</small>
          </div>
          <div>
            <span>avg rating</span>
            <strong>{averageRating ? averageRating.toFixed(1) : "new"}</strong>
            <small>from saved catalog metadata</small>
          </div>
          <div>
            <span>next action</span>
            <strong>{saved.length ? "compare" : "scan"}</strong>
            <small>{saved.length ? "Open a book for details" : "Build your first shortlist"}</small>
          </div>
        </div>

        {saved.length === 0 ? (
          <div className="list-empty">
            <div className="list-empty-icon">
              <BookOpen size={42} />
            </div>
            <h3>Your list is empty</h3>
            <p>Scan a bookshelf or discover books and save ones you'd like to read.</p>
            <div className="list-empty-actions">
              <button className="btn-primary" onClick={() => setPage("scanner")}>
                <Camera size={16}/> Scan a shelf
              </button>
              <button className="btn-secondary" onClick={() => setPage("discover")}>
                <Compass size={16} /> Discover books
              </button>
            </div>
          </div>
        ) : (
          <div className="shelf-lane" aria-label="Personal reading shelf">
            <div className="shelf-lane-head">
              <span>personal queue</span>
              <strong>Saved from scans and discovery</strong>
              <small>Open a book to compare details, buy options, or remove it from the shelf.</small>
            </div>
            <div className="list-items">
              {saved.map((book, index) => (
                <div
                  className="list-item"
                  key={book.readingListId || book.reading_list_id || `${bookIdentity(book)}-${index}`}
                >
                {/* Cover image */}
                <div className="list-item-cover">
                  <SmartBookCover book={book} rank={index + 1} variant="list" />
                </div>

                {/* Info */}
                <div className="list-item-info">
                  <div className="list-item-title">{book.title}</div>
                  <div className="list-item-author">{book.author}</div>
                  {book.rating && (
                    <div className="list-item-rating">
                      <Star size={13} /> {book.rating}
                      {book.pageCount ? ` - ${book.pageCount} pages` : ""}
                    </div>
                  )}
                  <div className="list-item-date">Saved {formatDate(book.savedAt)}</div>
                  <div className="list-item-tags" aria-label="Book queue status">
                    <span>{index === 0 ? "next up" : "queued"}</span>
                    {book.pricing?.openLibrary?.available && <span>free read</span>}
                    {book.pricing?.amazon?.buyUrl && <span>buy link</span>}
                  </div>
                </div>

                {/* Actions */}
                <div className="list-item-actions">
                  <button className="btn-save" onClick={() => setModalBook(book)}>
                    Details
                  </button>
                  <button className="btn-amazon" onClick={() => openBuyLink(book)}>
                    <ShoppingCart size={13}/> Buy
                  </button>
                  {pendingDelete === (book.readingListId || book.reading_list_id || bookIdentity(book)) ? (
                    <>
                      <button className="btn-remove confirm-remove" onClick={() => remove(book)} aria-label="Confirm remove">
                        Confirm
                      </button>
                      <button className="btn-remove" onClick={() => setPendingDelete(null)} aria-label="Cancel remove">
                        <X size={13}/>
                      </button>
                    </>
                  ) : (
                    <button className="btn-remove" onClick={() => setPendingDelete(book.readingListId || book.reading_list_id || bookIdentity(book))} aria-label={`Remove ${book.title}`}>
                      <Trash2 size={14}/>
                    </button>
                  )}
                </div>

                </div>
              ))}
            </div>
          </div>
        )}

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
    </div>
  );
}
