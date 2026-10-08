"use client";
import { useRef } from "react";
import { EDUCATION, EXPERIENCE } from "@/lib/data";
import { useScrollProgress } from "@/lib/hooks";
import SectionHead from "../ui/SectionHead";

type Stop = { key: string; when: string; title: string; place: string; detail: string[] };

const edu: Stop[] = EDUCATION.map((e) => ({ key: "edu", when: `${e.start} – ${e.end}`, title: e.title, place: e.place, detail: [e.detail] }));
const work: Stop[] = EXPERIENCE.map((r) => ({ key: r.company, when: `${r.start} – ${r.end}`, title: r.company, place: r.client ?? "Azure infrastructure", detail: r.points }));
const STOPS = [...edu, ...work]; // chronological: 2017 → today

export default function Experience() {
  const ref = useRef<HTMLDivElement>(null);
  const p = useScrollProgress(ref, 0.65);
  return (
    <section id="experience" className="section exp" aria-labelledby="exp-h">
      <div className="wrap">
        <div id="exp-h"><SectionHead n="04" label="Experience & education" lead="Where I've" accent="been." /></div>
        <div className="ex-path" ref={ref}>
          <span className="ex-spine" aria-hidden="true"><i style={{ transform: `scaleY(${p})` }} /></span>
          <ol>
            {STOPS.map((s, i) => {
              const lit = p >= (i + 0.35) / (STOPS.length + 0.9);
              return (
                <li key={s.title} className={`ex-stop ${lit ? "lit" : ""}`}>
                  <span className="ex-dot" aria-hidden="true" />
                  <p className="mono ex-when">{s.when}</p>
                  <h3 className="ex-title">{s.title}</h3>
                  <p className="ex-place">{s.place}</p>
                  <ul className="ex-detail">{s.detail.map((d) => <li key={d}>{d}</li>)}</ul>
                </li>
              );
            })}
            <li className={`ex-stop ex-next ${p > 0.92 ? "lit" : ""}`}>
              <span className="ex-dot" aria-hidden="true" />
              <div className="ex-card"><p className="mono">Next</p><h3 className="ex-title">Your team?</h3></div>
            </li>
          </ol>
        </div>
      </div>
      <style>{`
        .ex-path{position:relative;margin-top:clamp(48px,8vh,96px);padding-left:clamp(32px,6vw,96px)}
        .ex-spine{position:absolute;left:7px;top:8px;bottom:8px;width:2px;background:var(--line)}
        .ex-spine i{display:block;width:100%;height:100%;background:var(--ink);transform-origin:50% 0;will-change:transform}
        .ex-stop{position:relative;padding-bottom:clamp(48px,8vh,88px);max-width:880px;opacity:.28;transition:opacity .7s var(--ease)}
        .ex-stop.lit{opacity:1}
        .ex-dot{position:absolute;left:calc(-1 * clamp(32px,6vw,96px));top:6px;width:16px;height:16px;border-radius:50%;background:var(--paper);box-shadow:inset 0 0 0 2px var(--faint);transition:background .5s var(--ease),box-shadow .5s var(--ease),transform .6s var(--ease)}
        .ex-stop.lit .ex-dot{background:var(--ink);box-shadow:inset 0 0 0 2px var(--ink),0 0 0 6px rgba(13,13,13,.08);transform:scale(1.1)}
        .ex-when{font-size:12px;color:var(--mute)}
        .ex-title{font-size:clamp(28px,3.6vw,52px);font-weight:700;letter-spacing:-.04em;line-height:1.05;margin-top:8px}
        .ex-place{color:var(--mute);margin-top:6px}
        .ex-detail{display:grid;gap:10px;margin-top:20px;color:var(--ink-2);font-size:16px}
        .ex-detail li{padding-left:18px;position:relative}
        .ex-detail li::before{content:"";position:absolute;left:0;top:.7em;width:7px;height:1px;background:var(--ink)}
        .ex-next{padding-bottom:0}
        .ex-card{border:1.5px dashed rgba(13,13,13,.3);border-radius:24px;padding:28px 32px;display:inline-block;min-width:min(100%,340px)}
        .ex-card p{font-size:12px;color:var(--mute)}
      `}</style>
    </section>
  );
}
