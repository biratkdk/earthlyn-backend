import { useAppAuth } from "../contexts/AuthContext";

export default function Footer({ setPage }) {
  const { isAuthenticated } = useAppAuth();
  const year = new Date().getFullYear();
  const openLibrary = () => setPage?.(isAuthenticated ? "list" : "auth");

  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-brand">
          <strong>ShelfScanner</strong>
          <span>Scan a shelf. Review the reads. Leave with the right books.</span>
        </div>
        <nav className="footer-nav" aria-label="Footer navigation">
          <button onClick={() => setPage?.("scanner")}>Scanner</button>
          <button onClick={() => setPage?.("discover")}>Discover</button>
          <button onClick={openLibrary}>{isAuthenticated ? "Reading List" : "Save Books"}</button>
          {!isAuthenticated && <button onClick={() => setPage?.("auth")}>Sign in</button>}
        </nav>
        <span className="footer-copy">&copy; {year} ShelfScanner</span>
      </div>
    </footer>
  );
}
