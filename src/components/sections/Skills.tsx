"use client";
import { useMemo, useState } from "react";
import { SKILL_GROUPS, usedAt } from "@/lib/data";
import { useInView } from "@/lib/hooks";
import SectionHead from "../ui/SectionHead";
import TechLogo from "../ui/TechLogo";

const symbol = (name: string) => {
  const w = name.replace(/[^A-Za-z ]/g, " ").split(/\s+/).filter(Boolean);
  const first = w[0] ?? "?";
  if (w.length > 1) return first[0].toUpperCase() + w[1][0].toLowerCase();
  return first[0].toUpperCase() + (first[1] ?? "").toLowerCase();
};

export default function Skills() {
  const tiles = useMemo(() => {
    let n = 0;
    return SKILL_GROUPS.flatMap((g) => g.skills.map((sk) => ({ ...sk, family: g.family, num: ++n, sym: symbol(sk.name) })));
  }, []);
  const [gridRef, seen] = useInView<HTMLUListElement>({ once: true, threshold: 0.08 });
  const families = SKILL_GROUPS.map((g) => g.family);
  const [filter, setFilter] = useState<string>("All");
  const [active, setActive] = useState<(typeof tiles)[number] | null>(null);
  const shown = active ?? tiles.find((t) => t.name === "Terraform") ?? tiles[0];
  const used = usedAt(shown);

  return (
    <section id="skills" className="section skills" aria-labelledby="skills-h">
      <div className="wrap">
        <div id="skills-h"><SectionHead n="02" label="Skills" lead="The periodic table of" accent="my stack." /></div>
        <div className="sk-chips rv" role="group" aria-label="Filter skills by family">
          {["All", ...families].map((f) => (
            <button key={f} className={`sk-chip ${filter === f ? "on" : ""}`} aria-pressed={filter === f} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
        <div className="sk-grid-wrap">
          <ul className={`sk-grid ${seen ? "seen" : ""}`} ref={gridRef} aria-label="Skills">
            {tiles.map((t, i) => {
              const dim = filter !== "All" && t.family !== filter;
              const row8 = Math.floor(i / 8), col8 = i % 8, row4 = Math.floor(i / 4), col4 = i % 4;
              return (
                <li key={t.name} style={{ ["--d8" as string]: row8 + col8, ["--d4" as string]: row4 + col4 }}>
                  <button className={`sk-tile ${dim ? "dim" : ""} ${shown.name === t.name ? "sel" : ""}`}
                    onMouseEnter={() => setActive(t)} onFocus={() => setActive(t)} onClick={() => setActive(t)}
                    aria-label={`${t.name}, ${t.family}, element ${t.num}`}>
                    <span className="mono sk-n">{t.num}</span>
                    <span className="sk-sym">{t.sym}</span>
                    <span className="sk-name">{t.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <aside className="sk-insp card" aria-live="polite">
            <div className="sk-logo" key={shown.name}><TechLogo name={shown.name} family={shown.family} /></div>
            <h3 className="sk-in-name">{shown.name}</h3>
            <p className="mono sk-in-fam">{shown.family}</p>
            <p className="sk-in-used">{used.length ? <>Used at {used.join(", ")}</> : <>Listed in my résumé skills.</>}</p>
          </aside>
        </div>
      </div>
      <style>{`
        .sk-chips{display:flex;flex-wrap:wrap;gap:8px;margin:36px 0 28px}
        .sk-chip{height:38px;padding:0 16px;border-radius:999px;font-size:14px;font-weight:500;box-shadow:inset 0 0 0 1px rgba(13,13,13,.2);transition:background .4s var(--ease),color .4s var(--ease)}
        .sk-chip:hover{box-shadow:inset 0 0 0 1px var(--ink)}
        .sk-chip.on{background:var(--ink);color:#fff;box-shadow:none}
        .sk-grid-wrap{display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:28px;align-items:start}
        .sk-grid{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:8px}
        .sk-grid li{opacity:0}
        .sk-grid.seen li{animation:wave .9s var(--ease) both;animation-delay:calc(var(--d8) * 40ms)}
        @keyframes wave{from{opacity:0;transform:translateY(18px) scale(.94)}to{opacity:1;transform:none}}
        .sk-tile{position:relative;display:flex;flex-direction:column;align-items:flex-start;justify-content:space-between;width:100%;aspect-ratio:1;padding:9px 10px;border-radius:14px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line);text-align:left;transition:transform .5s var(--ease),opacity .4s var(--ease),background .4s var(--ease),color .4s var(--ease)}
        .sk-tile:hover,.sk-tile.sel{background:var(--ink);color:#fff;transform:translateY(-3px)}
        .sk-tile.dim{opacity:.16}
        .sk-n{font-size:10px;color:var(--mute)} .sk-tile:hover .sk-n,.sk-tile.sel .sk-n{color:#bdbab4}
        .sk-sym{font-weight:700;font-size:clamp(20px,2.4vw,30px);letter-spacing:-.04em;line-height:1}
        .sk-name{font-size:10.5px;line-height:1.15;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;max-width:100%}
        .sk-insp{position:sticky;top:96px;padding:28px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:6px;min-height:380px;box-shadow:inset 0 0 0 1px var(--line),0 30px 60px -30px rgba(13,13,13,.18)}
        .sk-logo{margin-bottom:10px;height:150px}
        .sk-in-name{font-size:26px;font-weight:700;letter-spacing:-.035em;line-height:1.1}
        .sk-in-fam{font-size:12px;color:var(--mute)}
        .sk-in-used{font-size:14px;color:var(--ink-2);margin-top:10px}
        @media (max-width:1000px){.sk-grid-wrap{grid-template-columns:1fr}.sk-insp{position:relative;top:0;min-height:0}}
        @media (max-width:700px){.sk-grid{grid-template-columns:repeat(4,minmax(0,1fr));gap:6px}.sk-grid.seen li{animation-delay:calc(var(--d4) * 40ms)}.sk-tile{padding:7px 8px}.sk-name{font-size:9.5px}.sk-sym{font-size:20px}}
      `}</style>
    </section>
  );
}
