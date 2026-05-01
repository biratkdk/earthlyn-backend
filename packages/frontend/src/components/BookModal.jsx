import { useEffect, useRef } from "react";
import {
  Bookmark,
  BookmarkCheck,
  Calendar,
  FileText,
  Headphones,
  ShoppingCart,
  Star,
  X,
} from "lucide-react";
import { saveBook, removeBook } from "../services/api";
import { amazonSearchUrl, audibleSearchUrl } from "../services/storeLinks";
import SmartBookCover from "./SmartBookCover";
import { sameBook } from "../utils/bookIdentity";


export default function BookModal({ book, onClose, saved, setSaved, showToast, isAuthenticated, setPage }) {
  const closeRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (!book) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const previousFocus = document.activeElement;
    closeRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
      if (event.key === "Tab") {
        const focusable = modalRef.current?.querySelectorAll(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      if (previousFocus && document.contains(previousFocus)) {
        previousFocus.focus?.();
      }
    };
  }, [book]);

  if (!book) return null;

  const isSaved = saved.some(b => sameBook(b, book));
  const amazonUrl = amazonSearchUrl(book.title, book.pricing?.amazon?.buyUrl || book.amazonUrl);
  const audibleUrl = audibleSearchUrl(book.title);

  const toggleSave = async () => {
    if (!isAuthenticated) {
      showToast("Sign in to save books to your reading list");
      setPage("auth");
      return;
    }
    try {
      if (isSaved) {
        const savedBook = saved.find(b => sameBook(b, book));
        await removeBook(savedBook || book);
        const removeId = savedBook?.readingListId || savedBook?.reading_list_id;
        setSaved(s => s.filter(b => (
          removeId
            ? (b.readingListId || b.reading_list_id) !== removeId
            : !sameBook(b, book)
        )));
        showToast("Removed from reading list");
      } else {
        const response = await saveBook({
          title:      book.title,
          author:     book.author,
          coverImage: book.coverImage,
          rating: book.rating,
          ratingsCount: book.ratingsCount,
          pageCount: book.pageCount,
          publishedDate: book.publishedDate,
          categories: book.categories,
          description: book.description,
          amazonUrl:  book.pricing?.amazon?.buyUrl,
          googleUrl:  book.pricing?.google?.buyUrl,
          openLibUrl: book.pricing?.openLibrary?.buyUrl,
        });
        if (!response.book?.readingListId && !response.book?.reading_list_id) {
          throw new Error("Saved book id was not returned");
        }
        setSaved(s => [...s, response.book]);
        showToast(`"${book.title}" added to your list`);
      }
    } catch (err) {
      showToast(err.message || (isSaved ? "Could not remove book" : "Could not save book"));
    }
  };

  return (
    <>
      <div className="modal-backdrop" onClick={onClose} />

      <div ref={modalRef} className="book-modal" role="dialog" aria-modal="true" aria-label={`${book.title} details`}>
        <button
          ref={closeRef}
          onClick={onClose}
          className="modal-close"
          aria-label="Close book details"
        >
          <X size={18} />
        </button>

        <div className="modal-hero">
          <div className="modal-cover">
            <SmartBookCover book={book} variant="modal" />
          </div>

          <div className="modal-info">
            <div className="scanner-kicker">book intelligence</div>
            <h2>{book.title}</h2>
            <p className="modal-author">{book.author}</p>

            <div className="modal-metrics">
                {book.rating && (
                  <span>
                    <Star size={15} /> {book.rating} {book.ratingsCount ? `(${book.ratingsCount.toLocaleString()})` : ""}
                  </span>
                )}
                {book.pageCount && (
                  <span>
                    <FileText size={15} /> {book.pageCount} pages
                  </span>
                )}
                {book.publishedDate && (
                  <span>
                    <Calendar size={15} /> {book.publishedDate?.slice(0, 4)}
                  </span>
                )}
            </div>

            {book.matchPercent && (
              <div className="modal-match">
                <strong>{book.matchPercent} match</strong>
                <span>{book.reason}</span>
              </div>
            )}
            <div className="modal-quick-actions">
              <button
                onClick={toggleSave}
                className={`modal-save${isSaved ? " saved" : ""}`}
              >
                {isSaved
                  ? <><BookmarkCheck size={18}/> Saved</>
                  : <><Bookmark size={18}/> Save</>
                }
              </button>
              <a href={amazonUrl} target="_blank" rel="noreferrer" className="btn-amazon">
                <ShoppingCart size={15}/> Search Amazon
              </a>
            </div>
          </div>
        </div>

        <div className="modal-body">
          {book.description && (
            <div className="modal-section">
              <h4>About this book</h4>
              <p>{book.description}</p>
            </div>
          )}

          <div className="modal-section">
            <h4>Availability</h4>
            <div className="modal-availability">
              <div className={book.pricing?.openLibrary?.buyUrl ? "available" : ""}>
                <FileText size={20} />
                <strong>Free to Read</strong>
                {book.pricing?.openLibrary?.buyUrl ? (
                  <a href={book.pricing.openLibrary.buyUrl} target="_blank" rel="noreferrer">
                    Open Library available
                  </a>
                ) : (
                  <span>No free copy found</span>
                )}
              </div>

              <div>
                <Headphones size={20} />
                <strong>Audiobook</strong>
                <a
                  href={audibleUrl}
                  target="_blank" rel="noreferrer"
                >
                  Search Audible catalog
                </a>
              </div>

              <div className={book.pricing?.google?.price ? "available" : ""}>
                <ShoppingCart size={20} />
                <strong>Google Play</strong>
                {book.pricing?.google?.price ? (
                  <a href={book.pricing.google.buyUrl} target="_blank" rel="noreferrer">
                    {book.pricing.google.price}
                  </a>
                ) : (
                  <span>No returned price</span>
                )}
              </div>
            </div>
          </div>

          <div className="modal-section">
            <h4>Where to buy</h4>
            <div className="modal-buy-grid">
              <a href={amazonUrl} target="_blank" rel="noreferrer"
                className="btn-amazon">
                <ShoppingCart size={15}/> Search Amazon
              </a>
              {(book.pricing?.google?.buyUrl || book.googleUrl) && (
                <a href={book.pricing?.google?.buyUrl || book.googleUrl} target="_blank" rel="noreferrer"
                  className="btn-secondary">
                  Google Play
                </a>
              )}
            </div>
          </div>

          <p className="modal-trust-note">Availability links are search or catalog results unless a returned price is shown.</p>
        </div>
      </div>
    </>
  );
}
