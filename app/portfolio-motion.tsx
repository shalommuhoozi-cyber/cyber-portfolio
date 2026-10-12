"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const MotionContext = createContext({ motion: false, toggleMotion: () => {} });
const motionKey = "shalom-portfolio-motion";

export function usePortfolioMotion() {
  return useContext(MotionContext);
}

export default function PortfolioMotion({ children }: { children: ReactNode }) {
  const [motion, setMotion] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      let saved: string | null = null;
      try { saved = localStorage.getItem(motionKey); } catch { /* Storage is optional. */ }
      setMotion(!preference.matches && saved !== "paused");
    };
    sync();
    preference.addEventListener("change", sync);
    window.addEventListener("storage", sync);
    return () => {
      preference.removeEventListener("change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.motion = motion ? "on" : "off";
    if (!motion) return;

    // Animate only on entry. Content remains visible if JavaScript or observers fail.
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("reveal-entry");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    document.querySelectorAll("[data-reveal]").forEach((element) => observer.observe(element));

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const spotlight = (event: PointerEvent) => {
      if (!finePointer.matches || !(event.target instanceof Element)) return;
      const card = event.target.closest<HTMLElement>("[data-spotlight]");
      if (!card) return;
      const bounds = card.getBoundingClientRect();
      card.style.setProperty("--pointer-x", `${event.clientX - bounds.left}px`);
      card.style.setProperty("--pointer-y", `${event.clientY - bounds.top}px`);
    };
    document.addEventListener("pointermove", spotlight, { passive: true });
    return () => {
      observer.disconnect();
      document.removeEventListener("pointermove", spotlight);
    };
  }, [motion]);

  const toggleMotion = () => {
    setMotion((current) => {
      const next = !current;
      try { localStorage.setItem(motionKey, next ? "playing" : "paused"); } catch { /* Optional. */ }
      return next;
    });
  };

  return <MotionContext.Provider value={{ motion, toggleMotion }}>{children}</MotionContext.Provider>;
}
