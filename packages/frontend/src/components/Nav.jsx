import { useAppAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import {
  BarChart3,
  BookMarked,
  Camera,
  Compass,
  Home,
  LogOut,
  UserRound,
} from "lucide-react";

export default function Nav({ page, setPage }) {
  const { isAuthenticated, signOut, name, email } = useAppAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`top-nav${scrolled ? " is-scrolled" : ""}`}>
      <div className="nav-energy" aria-hidden="true" />

      <button
        className="nav-brand"
        onClick={() => setPage("home")}
        aria-label="ShelfScanner home"
        type="button"
      >
        <div className="nav-brand-mark elite-mark" aria-hidden="true">
          <span className="mark-slab mark-slab-a" />
          <span className="mark-slab mark-slab-b" />
          <span className="mark-slab mark-slab-c" />
          <span className="mark-scan" />
        </div>
        <span className="brand-word">
          ShelfScanner
        </span>
      </button>

      <div className="nav-links">
        {/* Nav links visible to everyone */}
        {[
          ["home", "Home", Home],
          ["discover", "Discover", Compass],
          ["results", "Results", BarChart3],
          ...(isAuthenticated ? [["list", "Library", BookMarked]] : []),
          ["scanner", "Scan", Camera, "nav-mobile-only"],
        ].map(([p, label, Icon]) => (
          <button
            key={p}
            className={`nav-link${page === p ? " active" : ""}${Icon === Camera ? " nav-mobile-only" : ""}`}
            aria-current={page === p ? "page" : undefined}
            onClick={() => setPage(p)}
          >
            <Icon size={15} strokeWidth={2.2} />
            {label}
          </button>
        ))}
        <button className="nav-cta" onClick={() => setPage("scanner")}>
          <Camera size={15} strokeWidth={2.5} /> Scan Now
        </button>

        {isAuthenticated ? (
          <div className="nav-user">
            <div className="nav-avatar-shell">
              <div className="nav-avatar">
                {(name || email || "U")[0].toUpperCase()}
              </div>
            </div>
            <span className="nav-user-name">
              {name || email}
            </span>
            <button
              onClick={signOut}
              className="nav-signout"
            >
              Sign out
            </button>
          </div>
        ) : (
          <button className="nav-cta nav-auth" onClick={() => setPage("auth")}>
            Sign in
          </button>
        )}
        {isAuthenticated ? (
          <button className="nav-link nav-mobile-account" onClick={signOut}>
            <LogOut size={15} strokeWidth={2.2} /> Out
          </button>
        ) : (
          <button className={`nav-link nav-mobile-account${page === "auth" ? " active" : ""}`} onClick={() => setPage("auth")}>
            <UserRound size={15} strokeWidth={2.2} /> Sign in
          </button>
        )}
      </div>
    </nav>
  );
}
