"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { PROFILE } from "@/lib/data";
import { prefersReducedMotion } from "@/lib/hooks";
import { scrollToTarget } from "@/lib/scroll";

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const vid = useRef<HTMLVideoElement>(null);
  const [soundOn, setSoundOn] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const inView = useRef(true);
  const userPaused = useRef(false);

  const playWithSound = useCallback(async () => {
    const v = vid.current; if (!v) return false;
    v.muted = false;
    try { await v.play(); setSoundOn(true); setBlocked(false); return true; }
    catch { v.muted = true; v.play().catch(() => {}); setSoundOn(false); return false; }
  }, []);

  // autoplay: try with sound, fall back to muted
  useEffect(() => {
    if (prefersReducedMotion()) { setBlocked(false); return; }
    playWithSound().then((ok) => { if (!ok) setBlocked(true); });
  }, [playWithSound]);

  // unlock sound on the first real gesture
  useEffect(() => {
    if (!blocked) return;
    const unlock = (e: Event) => {
      if ((e.target as HTMLElement | null)?.closest?.("[data-sound-btn]")) return;
      if (inView.current) playWithSound();
      off();
    };
    const evs = ["pointerdown", "keydown", "touchend"] as const;
    const off = () => evs.forEach((n) => window.removeEventListener(n, unlock));
    evs.forEach((n) => window.addEventListener(n, unlock, { passive: true }));
    return off;
  }, [blocked, playWithSound]);

  // pause (and silence) the voice once less than 35% of the hero is visible
  useEffect(() => {
    const el = heroRef.current, v = vid.current; if (!el || !v) return;
    const io = new IntersectionObserver(([e]) => {
      inView.current = e.intersectionRatio >= 0.35;
      if (!inView.current) v.pause();
      else if (!userPaused.current && !prefersReducedMotion()) v.play().catch(() => {});
    }, { threshold: [0, 0.35, 0.36, 1] });
    io.observe(el);
    const onVis = () => { if (document.hidden) v.pause(); else if (inView.current && !prefersReducedMotion()) v.play().catch(() => {}); };
    document.addEventListener("visibilitychange", onVis);
    return () => { io.disconnect(); document.removeEventListener("visibilitychange", onVis); };
  }, []);

  const toggle = async () => {
    const v = vid.current; if (!v) return;
    if (soundOn) { v.muted = true; setSoundOn(false); return; }
    userPaused.current = false;
    await playWithSound();
  };

  return (
    <section id="top" ref={heroRef} className="hero" aria-label="Introduction">
      <div className="hero-ghost" aria-hidden="true">{PROFILE.first.toUpperCase()}</div>
      <div className="hero-stage">
        <video ref={vid} muted loop playsInline preload="auto" poster="/hero/poster.webp"
          aria-label={`Animated intro clip of ${PROFILE.name} introducing himself. It loops and has a voice track; use the round button to turn sound on or off.`}>
          <source src="/hero/hero.webm" type="video/webm" />
          <source src="/hero/hero.mp4" type="video/mp4" />
        </video>
        <button data-sound-btn className={`hero-snd ${blocked ? "is-blocked" : ""}`} onClick={toggle} aria-pressed={soundOn} aria-label={soundOn ? "Turn sound off" : "Turn sound on"}>
          {soundOn ? (
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><rect x="3" y="2" width="3.5" height="12" rx="1" fill="currentColor" /><rect x="9.5" y="2" width="3.5" height="12" rx="1" fill="currentColor" /></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.2v11.6a.6.6 0 0 0 .9.5l9-5.8a.6.6 0 0 0 0-1L4.9 1.7A.6.6 0 0 0 4 2.2Z" fill="currentColor" /></svg>
          )}
        </button>
      </div>
      <div className="wrap hero-copy">
        <h1 className="hero-h1"><span className="rv-mask is-in"><span>{PROFILE.role}.</span></span></h1>
        <div className="hero-cta">
          <a className="btn btn-primary" href="#experience" onClick={(e) => { e.preventDefault(); scrollToTarget("experience"); }}>See experience</a>
          <a className="btn btn-ghost" href="#contact" onClick={(e) => { e.preventDefault(); scrollToTarget("contact"); }}>Let&apos;s talk</a>
          <a className="btn btn-ghost" href={PROFILE.resume} download>Résumé ↓</a>
        </div>
      </div>
      <style>{`
        .hero{position:relative;padding-top:72px;padding-bottom:clamp(40px,8vh,90px);overflow:hidden}
        .hero-ghost{position:absolute;left:50%;top:clamp(110px,22vh,230px);transform:translateX(-50%);font-weight:800;letter-spacing:-.06em;line-height:.8;font-size:clamp(90px,21vw,360px);color:transparent;-webkit-text-stroke:1.5px rgba(13,13,13,.16);white-space:nowrap;user-select:none;pointer-events:none}
        .hero-stage{position:relative;margin:0 auto;height:min(96svh,1040px);aspect-ratio:768/960;max-width:100%}
        .hero-stage video{width:100%;height:100%;object-fit:cover;mix-blend-mode:multiply}
        .hero-snd{position:absolute;right:4%;bottom:6%;width:46px;height:46px;border-radius:50%;background:var(--ink);color:#fff;display:grid;place-items:center;transition:transform .5s var(--ease)}
        .hero-snd:hover{transform:scale(1.08)}
        .hero-snd.is-blocked::after{content:"";position:absolute;inset:-2px;border-radius:50%;border:2px solid var(--ink);animation:ping 2s var(--ease) infinite}
        @keyframes ping{0%{transform:scale(1);opacity:.5}100%{transform:scale(1.9);opacity:0}}
        .hero-copy{position:relative;display:flex;flex-wrap:wrap;gap:24px 40px;align-items:flex-end;justify-content:space-between;margin-top:clamp(-120px,-9vh,-40px)}
        .hero-h1{font-weight:700;letter-spacing:-.045em;line-height:1;font-size:clamp(40px,6.4vw,96px);max-width:11ch}
        .hero-cta{display:flex;flex-wrap:wrap;gap:12px}
        @media (max-width:700px){.hero-stage{height:62svh}.hero-copy{margin-top:-16px}}
      `}</style>
    </section>
  );
}
