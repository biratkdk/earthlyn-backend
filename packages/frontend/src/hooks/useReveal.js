import { useCallback, useRef } from "react";

/**
 * Attaches an IntersectionObserver to the returned ref.
 * When the element enters the viewport, adds class "revealed".
 * Use with CSS: .reveal { opacity:0; transform:translateY(28px); }
 *               .reveal.revealed { opacity:1; transform:none; transition: ... }
 */
export function useReveal(options = {}) {
  const observerRef = useRef(null);

  return useCallback((node) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    if (!node) return;

    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      node.classList.add("revealed");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add("revealed");
          observer.unobserve(node);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px", ...options }
    );

    observer.observe(node);
    observerRef.current = observer;
  }, []);
}
