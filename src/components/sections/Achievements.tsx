"use client";
import { useEffect, useRef, useState } from "react";
import { ACHIEVEMENTS } from "@/lib/data";

export default function Achievements() {
  const outer = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [travel, setTravel] = useState(0);
  const [mid, setMid] = useState(0);
  const items = [...ACHIEVEMENTS.map((a, i) => ({ ...a, i })), null];

  useEffect(() => {
    const measure = () => { const t = track.current; if (t) setTravel(Math.max(0, t.scrollWidth - window.innerWidth)); };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    window.addEventListener("resize", measure);
    return () => { ro.disconnect(); window.removeEventListener("resize", measure); };
  }, []);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = 0;
      const o = outer.current, t = track.current; if (!o || !t) return;
      const r = o.getBoundingClientRect();
      const p = travel > 0 ? Math.min(1, Math.max(0, -r.top / travel)) : 0;
      t.style.transform = `translate3d(${-p * travel}px,0,0)`;
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
      const cards = Array.from(t.querySelectorAll<HTMLElement>("[data-card]"));
      let best = 0, bd = Infinity;
      cards.forEach((c, i) => { const b = c.getBoundingClientRect(); const d = Math.abs(b.left + b.width / 2 - window.innerWidth / 2); if (d < bd) { bd = d; best = i; } });
      setMid((m) => (m === best ? m : best));
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(tick); };
    tick();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); if (raf) cancelAnimationFrame(raf); };
  }, [travel]);

  return (
    <section id="achievements" ref={outer} className="ach" style={{ height: `calc(100svh + ${travel}px)` }} aria-labelledby="ach-h">
      <div className="ach-pin">
        <div className="wrap ach-top">
          <div>
            <p className="tag"><i>05</i> — Achievements</p>
            <h2 id="ach-h" className="h2 ach-h">Quietly <em className="serif">recognised.</em></h2>
          </div>
          <span className="ach-prog" aria-hidden="true"><span ref={bar} /></span>
        </div>
        <div className="ach-track" ref={track}>
          {items.map((a, k) =>
            a ? (
              <article key={a.label} data-card className={`ach-card card ${mid === k ? "mid" : ""}`}>
                <div className="ach-t">
                  <span className="ach-logo" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#0d0d0d" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M8 4h8v5a4 4 0 0 1-8 0V4ZM8 6H5v1a3 3 0 0 0 3 3M16 6h3v1a3 3 0 0 1-3 3M12 13v4M8.5 20h7M10 17h4" /></svg>
                  </span>
                  <span className="mono ach-idx">{String(a.i + 1).padStart(2, "0")} / {String(ACHIEVEMENTS.length).padStart(2, "0")}</span>
                </div>
                <div className="ach-b">
                  <div>
                    <h3 className="ach-l">{a.label}</h3>
                    <p className="ach-c">{a.caption}</p>
                    <p className="mono ach-d">{a.detail}</p>
                  </div>
                  <span className="ach-big" aria-hidden="true">{String(a.i + 1).padStart(2, "0")}</span>
                </div>
              </article>
            ) : (
              <div key="end" data-card className="ach-end serif">and counting →</div>
            ),
          )}
        </div>
      </div>
      <style>{`
        .ach{position:relative}
        .ach-pin{position:sticky;top:0;height:100svh;overflow:hidden;display:flex;flex-direction:column;justify-content:center;gap:clamp(28px,6vh,64px)}
        .ach-top{display:flex;align-items:flex-end;justify-content:space-between;gap:24px;width:100%}
        .ach-top .tag{margin-bottom:16px}
        .ach-h{font-size:clamp(36px,5.4vw,80px)}
        .ach-prog{display:block;width:clamp(80px,16vw,220px);height:2px;background:var(--line);margin-bottom:14px;flex:none}
        .ach-prog span{display:block;height:100%;background:var(--ink);transform-origin:0 50%;transform:scaleX(0)}
        .ach-track{display:flex;gap:clamp(16px,2vw,28px);padding:30px var(--gutter);width:max-content;will-change:transform;align-items:center}
        .ach-card{flex:none;width:clamp(340px,40vw,540px);height:clamp(260px,36vh,310px);padding:26px 28px;display:flex;flex-direction:column;justify-content:space-between;border-radius:28px;transition:transform .8s var(--ease),box-shadow .8s var(--ease)}
        .ach-card.mid{transform:translateY(-12px);box-shadow:inset 0 0 0 1px var(--line),0 40px 70px -28px rgba(13,13,13,.28)}
        .ach-t{display:flex;justify-content:space-between;align-items:flex-start}
        .ach-logo{position:relative;display:grid;place-items:center;width:72px;height:72px;border-radius:20px;background:var(--paper);box-shadow:inset 0 0 0 1px var(--line)}
        .ach-logo::before{content:"";position:absolute;inset:8px;border-radius:50%;background:rgba(13,13,13,.06);filter:blur(12px);transition:background .8s var(--ease)}
        .ach-card.mid .ach-logo::before{background:rgba(13,13,13,.16)}
        .ach-logo svg{position:relative}
        .ach-idx{font-size:12px;color:var(--mute)}
        .ach-b{display:flex;justify-content:space-between;align-items:flex-end;gap:16px}
        .ach-l{font-size:clamp(24px,2.4vw,32px);font-weight:700;letter-spacing:-.035em;line-height:1.05}
        .ach-c{color:var(--ink-2);font-size:14.5px;margin-top:6px;max-width:26ch}
        .ach-d{font-size:11.5px;color:var(--mute);margin-top:8px}
        .ach-big{font-weight:800;letter-spacing:-.06em;line-height:.8;font-size:clamp(72px,9vw,128px);color:var(--ink)}
        .ach-end{flex:none;font-size:clamp(40px,6vw,88px);padding:0 clamp(32px,8vw,120px) 0 24px;white-space:nowrap;color:var(--mute)}
      `}</style>
    </section>
  );
}
