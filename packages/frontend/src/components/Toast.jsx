import { CheckCircle } from "lucide-react";

export default function Toast({ msg, onDone }) {
  return (
    <div
      className="toast"
      role="status"
      aria-live="polite"
      onAnimationEnd={e => e.animationName === "toastOut" && onDone()}
    >
      <CheckCircle size={17} /> {msg}
    </div>
  );
}
