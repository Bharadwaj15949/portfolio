"use client";
import { useEffect, useRef, useState } from "react";
import { NAV, PROFILE } from "@/lib/data";
import { scrollToTarget, setScrollLocked } from "@/lib/scroll";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [ind, setInd] = useState({ x: 0, w: 0, show: false });
  const bar = useRef<HTMLDivElement>(null);
  const links = useRef<Record<string, HTMLAnchorElement | null>>({});
  const pill = useRef<HTMLUListElement>(null);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
      setScrolled(window.scrollY > 40);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(tick); };
    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    NAV.forEach((n) => { const el = document.getElementById(n.id); if (el) io.observe(el); });
    // clear the highlight when we are back on the hero / in a section without a nav link
    const hero = document.getElementById("top");
    const ioHero = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActive(""); }, { rootMargin: "-45% 0px -50% 0px" });
    if (hero) ioHero.observe(hero);
    return () => { io.disconnect(); ioHero.disconnect(); };
  }, []);

  useEffect(() => {
    const el = links.current[active];
    const host = pill.current;
    if (!el || !host) { setInd((p) => ({ ...p, show: false })); return; }
    const a = el.getBoundingClientRect(), b = host.getBoundingClientRect();
    setInd({ x: a.left - b.left, w: a.width, show: true });
  }, [active, scrolled]);

  useEffect(() => {
    setScrollLocked(open);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); setScrollLocked(false); };
  }, [open]);

  const go = (id: string) => (e: React.MouseEvent) => { e.preventDefault(); setOpen(false); setTimeout(() => scrollToTarget(id), open ? 50 : 0); };

  return (
    <>
      <div className="nv-progress" ref={bar} aria-hidden="true" />
      <header className={`nv ${scrolled ? "is-scrolled" : ""}`}>
        <a href="#top" className="nv-brand" onClick={(e) => { e.preventDefault(); scrollToTarget(0); }} aria-label={`${PROFILE.name}, back to top`}>
          <span className="nv-mark" aria-hidden="true">{PROFILE.initials}</span>
          <span className="nv-name">{PROFILE.name}</span>
        </a>
        <nav aria-label="Primary" className="nv-desk">
          <ul className="nv-pill" ref={pill}>
            <li aria-hidden="true" className="nv-ind" style={{ transform: `translateX(${ind.x}px)`, width: ind.w, opacity: ind.show ? 1 : 0 }} />
            {NAV.map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`} ref={(el) => { links.current[n.id] = el; }} className={active === n.id ? "on" : ""} aria-current={active === n.id ? "true" : undefined} onClick={go(n.id)}>{n.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <button className="nv-menu" aria-expanded={open} aria-controls="nv-overlay" onClick={() => setOpen((o) => !o)}>{open ? "Close" : "Menu"}</button>
      </header>
      <div id="nv-overlay" className={`nv-ov ${open ? "is-open" : ""}`} aria-hidden={!open} inert={!open}>
        <ol>
          {NAV.map((n, i) => (
            <li key={n.id} style={{ ["--i" as string]: i }}>
              <a href={`#${n.id}`} onClick={go(n.id)}><span className="mono">0{i + 1}</span>{n.label}</a>
            </li>
          ))}
        </ol>
      </div>
      <style>{`
        .nv-progress{position:fixed;inset:0 0 auto 0;height:2px;background:var(--ink);transform-origin:0 50%;transform:scaleX(0);z-index:60}
        .nv{position:fixed;top:0;left:0;right:0;z-index:50;display:flex;align-items:center;justify-content:space-between;padding:18px var(--gutter);pointer-events:none}
        .nv>*{pointer-events:auto}
        .nv-brand{display:flex;align-items:center;gap:12px;font-weight:600;letter-spacing:-.01em}
        .nv-mark{display:grid;place-items:center;width:44px;height:44px;border-radius:50%;font:600 13px var(--font-mono);box-shadow:inset 0 0 0 1.5px var(--ink);transition:background .5s var(--ease),color .5s var(--ease),transform .9s var(--ease)}
        .nv.is-scrolled .nv-mark{background:var(--ink);color:var(--paper)}
        .nv-brand:hover .nv-mark{transform:rotate(360deg)}
        .nv-name{transition:opacity .5s var(--ease),transform .5s var(--ease)}
        .nv.is-scrolled .nv-name{opacity:0;transform:translateX(-8px);pointer-events:none}
        .nv-pill{position:relative;display:flex;gap:2px;padding:5px;border-radius:999px;transition:background .5s var(--ease),box-shadow .5s var(--ease),backdrop-filter .5s}
        .nv.is-scrolled .nv-pill{background:rgba(255,255,255,.72);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);box-shadow:inset 0 0 0 1px var(--line),0 8px 30px rgba(13,13,13,.06)}
        .nv-pill a{position:relative;z-index:1;display:block;padding:9px 18px;border-radius:999px;font-size:14.5px;font-weight:500;transition:color .4s var(--ease)}
        .nv-pill a.on{color:#fff}
        .nv-ind{position:absolute;z-index:0;top:5px;bottom:5px;left:5px;border-radius:999px;background:var(--ink);transition:transform .6s var(--ease),width .6s var(--ease),opacity .3s}
        .nv-menu{display:none;height:44px;padding:0 20px;border-radius:999px;font-weight:500;background:rgba(255,255,255,.8);backdrop-filter:blur(12px);box-shadow:inset 0 0 0 1px var(--line)}
        .nv-ov{position:fixed;inset:0;z-index:45;background:var(--paper);clip-path:inset(0 0 100% 0);transition:clip-path .9s var(--ease);display:flex;align-items:center;padding:0 var(--gutter)}
        .nv-ov.is-open{clip-path:inset(0 0 0 0)}
        .nv-ov ol{display:grid;gap:6px;width:100%}
        .nv-ov a{display:flex;align-items:baseline;gap:16px;font-size:clamp(40px,12vw,64px);font-weight:700;letter-spacing:-.045em;line-height:1.1}
        .nv-ov a span{font-size:13px;font-weight:500;color:var(--mute)}
        .nv-ov li{opacity:0;transform:translateY(30px);transition:opacity .7s var(--ease),transform .7s var(--ease)}
        .nv-ov.is-open li{opacity:1;transform:none;transition-delay:calc(.25s + var(--i)*70ms)}
        @media (max-width:860px){.nv-desk{display:none}.nv-menu{display:block;position:relative;z-index:55}.nv-name{display:none}.nv-brand{position:relative;z-index:55}}
      `}</style>
    </>
  );
}
