"use client";
import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { prefersReducedMotion } from "./hooks";

let lenis: Lenis | null = null;

export function ScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const l = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4) });
    lenis = l;
    let raf = requestAnimationFrame(function loop(time) { l.raf(time); raf = requestAnimationFrame(loop); });
    return () => { cancelAnimationFrame(raf); l.destroy(); lenis = null; };
  }, []);
  return <>{children}</>;
}

/** Scroll to an element id (or the top) through Lenis, falling back to native scrolling. */
export function scrollToTarget(target: string | number) {
  const reduced = prefersReducedMotion();
  if (lenis) { lenis.scrollTo(typeof target === "string" ? `#${target}` : target, { duration: 1.4 }); return; }
  if (typeof target === "number") window.scrollTo({ top: target, behavior: reduced ? "auto" : "smooth" });
  else document.getElementById(target)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
}

export function setScrollLocked(locked: boolean) {
  if (locked) lenis?.stop(); else lenis?.start();
  document.documentElement.style.overflow = locked ? "hidden" : "";
}
