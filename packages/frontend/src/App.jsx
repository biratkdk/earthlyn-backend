import { useAppAuth } from "./contexts/AuthContext";
import { useState, useEffect, useCallback } from "react";
import Nav          from "./components/Nav";
import Footer       from "./components/Footer";
import Toast        from "./components/Toast";
import HomePage     from "./pages/HomePage";
import ScannerPage  from "./pages/ScannerPage";
import ResultsPage  from "./pages/ResultsPage";
import ReadingListPage from "./pages/ReadingListPage";
import DiscoverPage from "./pages/DiscoverPage";
import AuthPage     from "./pages/AuthPage";
import { getPreferences, getReadingList } from "./services/api";
import { AlertTriangle, BookOpen } from "lucide-react";

const VALID_PAGES = new Set(["home", "scanner", "results", "list", "discover", "auth"]);
const RESULTS_STORAGE_KEY = "shelfscanner-results-v1";
const PREFS_STORAGE_KEY = "shelfscanner-preferences-draft-v1";
const DEFAULT_PREFS = { genres: [], pace: "", length: "", authors: "", loved: "", minRating: 0 };

function pageFromLocation() {
  const fromHash = window.location.hash.replace(/^#\/?/, "");
  return VALID_PAGES.has(fromHash) ? fromHash : "home";
}

function loadStoredResults() {
  try {
    const raw = window.sessionStorage.getItem(RESULTS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (!parsed || typeof parsed !== "object") return null;
    const hasKnownShape = Array.isArray(parsed.detected)
      || Array.isArray(parsed.recommendations)
      || parsed.pendingReview === true;
    return hasKnownShape ? parsed : null;
  } catch {
    return null;
  }
}

function loadStoredPreferences() {
  try {
    const raw = window.sessionStorage.getItem(PREFS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return {
      genres: Array.isArray(parsed.genres) ? parsed.genres.filter(Boolean) : [],
      pace: typeof parsed.pace === "string" ? parsed.pace : "",
      length: typeof parsed.length === "string" ? parsed.length : "",
      authors: typeof parsed.authors === "string" ? parsed.authors : "",
      loved: typeof parsed.loved === "string" ? parsed.loved : "",
      minRating: Math.max(0, Math.min(5, Number(parsed.minRating || 0))),
    };
  } catch {
    return {};
  }
}

export default function App() {
  const auth = useAppAuth();
  const [page, setPageState] = useState(pageFromLocation);
  const [saved, setSaved] = useState([]);
  const [savedLoaded, setSavedLoaded] = useState(false);
  const [toastQueue, setToastQueue] = useState([]);
  const [results, setResults] = useState(loadStoredResults);
  const [prefs,   setPrefs]   = useState(() => ({
    ...DEFAULT_PREFS,
    ...loadStoredPreferences(),
  }));

  const showToast = msg => {
    if (!msg) return;
    setToastQueue((queue) => [...queue, msg].slice(-3));
  };

  const setPage = useCallback((nextPage) => {
    const safePage = VALID_PAGES.has(nextPage) ? nextPage : "home";
    setPageState(safePage);
    const nextHash = `#/${safePage}`;
    if (window.location.hash !== nextHash) {
      window.history.pushState({ page: safePage }, "", nextHash);
    }
  }, []);

  const skipToMain = (event) => {
    event.preventDefault();
    const main = document.getElementById("main-content");
    main?.focus();
    main?.scrollIntoView({ block: "start" });
  };

  // Load reading list from backend on login
  useEffect(() => {
    if (auth.isAuthenticated && !savedLoaded) {
      getReadingList()
        .then(res => {
          setSaved(res.books || []);
          setSavedLoaded(true);
        })
        .catch(() => {
          showToast("Could not load reading list");
          setSavedLoaded(true);
        });
    }
  }, [auth.isAuthenticated, savedLoaded]);

  useEffect(() => {
    setSaved([]);
    setSavedLoaded(false);
  }, [auth.email]);

  useEffect(() => {
    if (!auth.isAuthenticated) return;
    getPreferences()
      .then((res) => {
        if (!res.preferences) return;
        setPrefs((current) => ({
          ...current,
          genres: Array.isArray(res.preferences.genres) ? res.preferences.genres : [],
          pace: res.preferences.pace || "",
          length: res.preferences.length || "",
          authors: res.preferences.authors || "",
          loved: res.preferences.loved || "",
          minRating: Number(res.preferences.minRating || 0),
        }));
      })
      .catch(() => showToast("Could not load saved preferences"));
  }, [auth.isAuthenticated]);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    try {
      if (results) {
        window.sessionStorage.setItem(RESULTS_STORAGE_KEY, JSON.stringify(results));
      } else {
        window.sessionStorage.removeItem(RESULTS_STORAGE_KEY);
      }
    } catch {
      // Session persistence is a convenience; scanning still works without it.
    }
  }, [results]);

  useEffect(() => {
    try {
      window.sessionStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      // Draft preferences are optional; authenticated saves remain the source of truth.
    }
  }, [prefs]);

  useEffect(() => {
    const syncPage = () => setPageState(pageFromLocation());
    window.addEventListener("popstate", syncPage);
    window.addEventListener("hashchange", syncPage);
    return () => {
      window.removeEventListener("popstate", syncPage);
      window.removeEventListener("hashchange", syncPage);
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const titles = {
      home: "ShelfScanner - Scan, Review, Rank",
      scanner: "Scanner - ShelfScanner",
      results: "Shelf Results - ShelfScanner",
      list: "Reading List - ShelfScanner",
      discover: "Discover Books - ShelfScanner",
      auth: "Sign In - ShelfScanner",
    };
    document.title = titles[page] || "ShelfScanner";
  }, [page]);

  // Loading screen
  if (auth.isLoading) {
    return (
      <div className="app-state-screen">
        <div className="state-orbit"><BookOpen size={34} /></div>
        <p>Loading ShelfScanner</p>
      </div>
    );
  }

  // Error screen
  if (auth.error) {
    return (
      <div className="app-state-screen app-error-screen">
        <div className="state-orbit"><AlertTriangle size={34} /></div>
        <p>{auth.error.message}</p>
        <button className="btn-primary" onClick={() => window.location.reload()}>
          Try again
        </button>
      </div>
    );
  }

  // Auth page (only when user navigates to it)
  if (page === "auth") {
    return (
      <div className="app-shell">
        <a className="skip-link" href="#main-content" onClick={skipToMain}>Skip to main content</a>
        <Nav page={page} setPage={setPage} />
        <main id="main-content" className="page-transition" tabIndex={-1}>
          <AuthPage onSuccess={() => setPage("home")} />
        </main>
        <Footer setPage={setPage} />
      </div>
    );
  }

  // Full app - accessible to everyone (no auth required)
  const pages = {
    home:     <HomePage      setPage={setPage} prefs={prefs} setPrefs={setPrefs} showToast={showToast} />,
    scanner:  <ScannerPage   setPage={setPage} showToast={showToast} setResults={setResults} />,
    results:  <ResultsPage   saved={saved} setSaved={setSaved} showToast={showToast} results={results} setResults={setResults} isAuthenticated={auth.isAuthenticated} setPage={setPage} />,
    list:     auth.isAuthenticated
                ? <ReadingListPage saved={saved} setSaved={setSaved} setPage={setPage} showToast={showToast} isAuthenticated={auth.isAuthenticated} />
                : <div className="page list-wrap">
                    <div className="list-empty">
                      <div className="list-empty-icon"><BookOpen size={42} /></div>
                      <h2>Reading List</h2>
                      <p>Sign in to save books and manage your reading list.</p>
                    <button className="btn-primary" onClick={() => setPage("auth")}>Sign in</button>
                    </div>
                  </div>,
    discover: <DiscoverPage  saved={saved} setSaved={setSaved} showToast={showToast} setPage={setPage} isAuthenticated={auth.isAuthenticated} />,
  };

  return (
    <div className="app-shell" data-page={page}>
      <a className="skip-link" href="#main-content" onClick={skipToMain}>Skip to main content</a>
      <div className="ambient-field" aria-hidden="true">
        <div className="ambient-scanline" />
        <div className="ambient-radar" />
      </div>
      <Nav page={page} setPage={setPage} />
      <main id="main-content" className="page-transition" key={page} data-route={page} tabIndex={-1}>
        {pages[page]}
      </main>
      <Footer setPage={setPage} />
      {toastQueue[0] && <Toast msg={toastQueue[0]} onDone={() => setToastQueue((queue) => queue.slice(1))} />}
    </div>
  );
}
