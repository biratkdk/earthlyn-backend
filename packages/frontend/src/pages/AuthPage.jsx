import { useState } from "react";
import { useAppAuth } from "../contexts/AuthContext";
import { ArrowRight, BookOpen, Eye, EyeOff, ScanLine, ShieldCheck, Sparkles } from "lucide-react";

export default function AuthPage({ onSuccess }) {
  const { login, register } = useAppAuth();
  const [tab, setTab] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event?.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (tab === "signup" && password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (tab === "signup" && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      if (tab === "signup") await register(name, email, password);
      else await login(email, password);
      onSuccess?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fieldHasError = (field) => {
    const message = error.toLowerCase();
    if (!message) return false;
    if (field === "password") return message.includes("password") || message.includes("fields");
    if (field === "confirm") return message.includes("match") || message.includes("password");
    if (field === "email") return message.includes("email") || message.includes("fields") || message.includes("invalid");
    if (field === "name") return message.includes("name") || message.includes("display");
    return false;
  };

  const passwordScore = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;

  return (
    <div className="page auth-page">
      <div className="auth-shell">
        <section className="auth-brief">
          <div className="scanner-kicker">
            <ShieldCheck size={15} /> private shelf profile
          </div>
          <h2>Save taste once. Rank every shelf faster.</h2>
          <p>
            Sign in to keep reading preferences, saved books, and reviewed scan history tied
            to your account.
          </p>
          <div className="auth-signal-grid">
            <span><ScanLine size={16} /> Review-gated scans</span>
            <span><Sparkles size={16} /> Personal discovery</span>
            <span><BookOpen size={16} /> Saved reading list</span>
          </div>
        </section>

        <section className="auth-card">
          <div className="auth-logo">
            <div className="elite-mark auth-mark" aria-hidden="true">
              <span className="mark-slab mark-slab-a" />
              <span className="mark-slab mark-slab-b" />
              <span className="mark-slab mark-slab-c" />
              <span className="mark-scan" />
            </div>
            <h1>ShelfScanner</h1>
            <p>Continue to your book intelligence workspace.</p>
          </div>

          <div className="auth-tabs" role="tablist" aria-label="Authentication mode">
            {[["signin", "Sign In"], ["signup", "Sign Up"]].map(([t, l]) => (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={tab === t}
                aria-pressed={tab === t}
                onClick={() => { setTab(t); setError(""); setConfirmPassword(""); }}
                className={tab === t ? "active" : ""}
              >
                {l}
              </button>
            ))}
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate={false}>

            {tab === "signup" && (
              <div className="form-group">
                <label className="form-label" htmlFor="auth-name">Your name</label>
                <input
                  id="auth-name"
                  className={`form-input${fieldHasError("name") ? " input-error" : ""}`}
                  type="text"
                  placeholder="e.g. Jane Austen"
                  autoComplete="name"
                  required
                  minLength={2}
                  value={name}
                  onChange={e => { setError(""); setName(e.target.value); }}
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="auth-email">Email address</label>
              <input
                id="auth-email"
                className={`form-input${fieldHasError("email") ? " input-error" : ""}`}
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
                value={email}
                onChange={e => { setError(""); setEmail(e.target.value); }}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="auth-password">Password</label>
              <div className="password-wrap">
                <input
                  id="auth-password"
                  className={`form-input${fieldHasError("password") ? " input-error" : ""}`}
                  type={showPassword ? "text" : "password"}
                  placeholder={tab === "signup" ? "Min. 8 characters" : "Your password"}
                  autoComplete={tab === "signup" ? "new-password" : "current-password"}
                  required
                  minLength={tab === "signup" ? 8 : undefined}
                  value={password}
                  onChange={e => { setError(""); setPassword(e.target.value); }}
                />
                <button
                  type="button"
                  className="password-toggle"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword(v => !v)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {tab === "signup" && (
                <div className="password-strength" aria-live="polite">
                  <span style={{ "--strength": `${passwordScore * 25}%` }} />
                  <small>
                    {passwordScore >= 3 ? "Strong enough for signup" : "Use 8+ chars with a mix of letters, numbers, or symbols"}
                  </small>
                </div>
              )}
            </div>

            {tab === "signup" && (
              <div className="form-group">
                <label className="form-label" htmlFor="auth-confirm-password">Confirm password</label>
                <div className="password-wrap">
                  <input
                    id="auth-confirm-password"
                    className={`form-input${fieldHasError("confirm") ? " input-error" : ""}`}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={e => { setError(""); setConfirmPassword(e.target.value); }}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    aria-label={showConfirmPassword ? "Hide confirmed password" : "Show confirmed password"}
                    onClick={() => setShowConfirmPassword(v => !v)}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            )}

            {error && (
              <p className="auth-error" role="alert">{error}</p>
            )}

            <button
              type="submit"
              className="btn-primary auth-submit"
              disabled={loading}
            >
              {loading ? (tab === "signin" ? "Signing in..." : "Creating account...") : tab === "signin" ? "Sign In" : "Create Account"}
              {!loading && <ArrowRight size={16} />}
            </button>

          </form>

          <p className="auth-note">No credit card required. Your profile can stay local-first.</p>
        </section>
      </div>
    </div>
  );
}
