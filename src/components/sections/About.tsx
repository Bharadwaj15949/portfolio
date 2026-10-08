/* eslint-disable @next/next/no-img-element -- small static images, no optimiser needed */
"use client";
import { useEffect, useRef, useState } from "react";
import { EDUCATION, EXPERIENCE, PROFILE } from "@/lib/data";
import { prefersReducedMotion, useInView } from "@/lib/hooks";

const bars = Array.from(PROFILE.name.replace(/\s/g, "").repeat(3)).slice(0, 34).map((c, i) => 1 + ((c.charCodeAt(0) + i * 7) % 4));

function Lanyard() {
  const [secRef, inView] = useInView<HTMLDivElement>({ threshold: 0.1 });
  const swing = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    const host = secRef.current, el = swing.current;
    if (!host || !el || !inView) return;
    const reduced = prefersReducedMotion();
    let angle = 0, vel = 0, lastX = -1, push = 0, raf = 0;
    const t0 = performance.now();
    const onMove = (e: PointerEvent) => { if (lastX < 0) { lastX = e.clientX; return; } const dx = e.clientX - lastX; lastX = e.clientX; push += Math.max(-60, Math.min(60, dx)) * 0.012; };
    if (!reduced) window.addEventListener("pointermove", onMove, { passive: true });
    const loop = (now: number) => {
      // damped spring: velocity from the pointer pushes the angle, the spring pulls it back
      vel += (-0.018 * angle - 0.045 * vel) + push; push = 0;
      angle += vel;
      const idle = reduced ? 0 : Math.sin((now - t0) / 1300) * 1.6;
      el.style.transform = `rotate(${(angle + idle).toFixed(3)}deg)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("pointermove", onMove); };
  }, [inView, secRef]);

  const degree = EDUCATION[0];
  return (
    <div className="lan" ref={secRef}>
      <div className="lan-swing" ref={swing}>
        <div className="lan-strap" aria-hidden="true"><div className="lan-txt">{Array.from({ length: 6 }).map((_, i) => <span key={i}>{PROFILE.name} · {PROFILE.role} ·&nbsp;</span>)}</div></div>
        <div className="lan-clip" aria-hidden="true" />
        <button className={`idc ${flipped ? "is-flipped" : ""}`} onClick={() => setFlipped((f) => !f)} aria-pressed={flipped} aria-label={`${PROFILE.name} developer ID card. Press to flip it over.`}>
          <span className="idc-in">
            <span className="idc-face idc-front">
              <span className="idc-band mono">DEVELOPER ID</span>
              <span className="idc-photo"><img src="/portrait-bust.webp" alt={`Portrait of ${PROFILE.name}`} width={128} height={156} /></span>
              <span className="idc-name">{PROFILE.name}</span>
              <span className="idc-role">{PROFILE.role}</span>
              <span className="idc-rows mono">
                <span><b>Experience</b>{PROFILE.years}</span>
                <span><b>Degree</b>B.Tech · ECE</span>
                <span><b>Class of</b>{degree.end}</span>
              </span>
              <span className="idc-foot" aria-hidden="true">
                <span className="idc-bars">{bars.map((w, i) => <i key={i} style={{ width: w }} />)}</span>
                <span className="idc-holo" />
              </span>
            </span>
            <span className="idc-face idc-back">
              <span className="idc-band mono">WHAT I AM</span>
              <span className="idc-list">
                <span>{PROFILE.role}, {PROFILE.years}</span>
                <span>B.Tech (ECE), JNTUH, {degree.start}–{degree.end}</span>
                <span>50+ enterprise clients at Cloud4C</span>
                <span>Terraform &amp; PowerShell automation</span>
                <span>Best Employee award · Best Team Player</span>
              </span>
              <span className="idc-sign serif">{PROFILE.name}</span>
              <span className="idc-find mono">If found, say hello · {PROFILE.email}</span>
            </span>
          </span>
        </button>
      </div>
    </div>
  );
}

export default function About() {
  const now = EXPERIENCE[EXPERIENCE.length - 1];
  const facts = [
    ["Education", `B.Tech (ECE), ${EDUCATION[0].end}`],
    ["Current role", `${PROFILE.role}, ${now.company}`],
    ["Since", now.start],
    ["Email", PROFILE.email],
    ["Phone", PROFILE.phone],
  ];
  return (
    <section id="about" className="section about" aria-labelledby="about-h">
      <div className="wrap">
        <p className="tag rv"><i>01</i> — About</p>
        <div className="ab-grid">
          <div className="ab-l">
            <h2 id="about-h" className="h2"><span className="rv-mask"><span>Hi, I&apos;m {PROFILE.first}.</span></span></h2>
            <p className="rv ab-sum">{PROFILE.resumeSummary}</p>
            <p className="rv ab-extra" style={{ ["--i" as string]: 1 }}>{PROFILE.extraLine}</p>
            <div className="ab-btns rv" style={{ ["--i" as string]: 2 }}>
              <a className="btn btn-primary" href={PROFILE.resume} download>Résumé ↓</a>
              {PROFILE.github && <a className="btn btn-ghost" href={PROFILE.github}>GitHub ↗</a>}
              {PROFILE.linkedin && <a className="btn btn-ghost" href={PROFILE.linkedin}>LinkedIn ↗</a>}
              <a className="btn btn-ghost" href={`mailto:${PROFILE.email}`}>Email</a>
            </div>
          </div>
          <Lanyard />
          <aside className="ab-r" aria-label="Quick facts">
            <h3 className="mono ab-qf">Quick facts</h3>
            <dl>
              {facts.map(([k, v], i) => (
                <div key={k} className="rv ab-row" style={{ ["--i" as string]: i }}><dt>{k}</dt><dd>{v}</dd></div>
              ))}
            </dl>
            <blockquote className="serif ab-q rv">“{PROFILE.quote}”</blockquote>
          </aside>
        </div>
      </div>
      <style>{`
        .about{padding-top:0}
        .about .tag{padding-top:var(--pad-y)}
        .ab-grid{display:grid;grid-template-columns:minmax(0,1fr) 320px minmax(0,1fr);gap:clamp(24px,4vw,64px);align-items:stretch}
        .ab-l{display:flex;flex-direction:column;gap:22px;padding-top:12px}
        .ab-l .h2{font-size:clamp(40px,5vw,72px)}
        .ab-sum{color:var(--ink-2);font-size:17px;max-width:56ch}
        .ab-extra{color:var(--mute);font-size:15px;max-width:56ch}
        .ab-btns{display:flex;flex-wrap:wrap;gap:10px;margin-top:auto}
        .ab-r{display:flex;flex-direction:column;gap:24px;padding-top:12px}
        .ab-qf{font-size:12px;font-weight:500;color:var(--mute);margin:0;letter-spacing:.04em}
        .ab-row{display:grid;grid-template-columns:110px 1fr;gap:14px;padding:14px 0;border-top:1px solid var(--line);font-size:15px}
        .ab-row dt{color:var(--mute)} .ab-row dd{margin:0;overflow-wrap:anywhere}
        .ab-q{margin-top:auto;font-size:clamp(24px,2.2vw,32px);line-height:1.2;color:var(--ink-2)}
        .lan{position:relative;display:flex;justify-content:center;min-height:620px}
        .lan-swing{position:absolute;top:calc(-1 * (var(--pad-y) + 34px));transform-origin:50% 0;display:flex;flex-direction:column;align-items:center;will-change:transform}
        .lan-strap{width:30px;height:calc(var(--pad-y) + 96px);background:var(--ink);overflow:hidden;position:relative;border-radius:0 0 3px 3px}
        .lan-txt{position:absolute;left:50%;top:0;writing-mode:vertical-rl;white-space:nowrap;font:500 10px/30px var(--font-mono);letter-spacing:.14em;color:#d9d6d0;text-transform:uppercase;animation:strap 24s linear infinite;transform:translateX(-50%)}
        .lan-txt span{display:inline}
        @keyframes strap{from{transform:translate(-50%,-50%)}to{transform:translate(-50%,0)}}
        .lan-clip{width:22px;height:30px;margin-top:-2px;border-radius:5px 5px 9px 9px;background:#c9c6c0;box-shadow:inset 0 0 0 1px rgba(13,13,13,.25),inset 0 -6px 0 #a9a6a0;position:relative;z-index:2}
        .idc{display:block;width:300px;height:404px;margin-top:-10px;perspective:1100px;text-align:left}
        .idc-in{position:relative;display:block;width:100%;height:100%;transform-style:preserve-3d;transition:transform .9s var(--ease)}
        .idc.is-flipped .idc-in{transform:rotateY(180deg)}
        @media (hover:hover){.idc:hover .idc-in{transform:rotateY(180deg)}.idc.is-flipped:hover .idc-in{transform:rotateY(0)}}
        .idc-face{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;background:#fff;border-radius:22px;overflow:hidden;backface-visibility:hidden;-webkit-backface-visibility:hidden;box-shadow:inset 0 0 0 1px var(--line),0 30px 60px -20px rgba(13,13,13,.28)}
        .idc-back{transform:rotateY(180deg)}
        .idc-band{width:100%;background:var(--ink);color:#fff;text-align:center;padding:12px 0;font-size:11px;letter-spacing:.28em}
        .idc-photo{margin-top:20px;width:128px;height:156px;border-radius:20px;padding:3px;background:linear-gradient(145deg,#cfcdc8,#6b6963);box-shadow:0 0 0 7px rgba(13,13,13,.05),0 14px 30px -10px rgba(13,13,13,.3);overflow:hidden;position:relative}
        .idc-photo img{width:100%;height:100%;object-fit:cover;object-position:50% 12%;border-radius:17px;transition:transform .8s var(--ease)}
        .idc:hover .idc-photo img{transform:scale(1.07)}
        .idc-name{margin-top:16px;font-weight:700;font-size:21px;letter-spacing:-.03em;line-height:1.1;text-align:center;padding:0 14px}
        .idc-role{font-size:13px;color:var(--mute);margin-top:2px}
        .idc-rows{display:grid;gap:5px;width:100%;padding:12px 24px 0;font-size:11px}
        .idc-rows span{display:flex;justify-content:space-between;border-bottom:1px dashed var(--line);padding-bottom:4px}
        .idc-rows b{font-weight:500;color:var(--mute)}
        .idc-foot{margin-top:auto;width:100%;display:flex;align-items:flex-end;justify-content:space-between;padding:0 24px 18px}
        .idc-bars{display:flex;align-items:flex-end;gap:2px;height:30px}
        .idc-bars i{display:block;height:100%;background:var(--ink)}
        .idc-holo{width:34px;height:34px;border-radius:50%;background:conic-gradient(from 20deg,#e6e4df,#8d8b85,#f4f2ee,#a9a6a0,#e6e4df);box-shadow:inset 0 0 0 1px rgba(13,13,13,.2)}
        .idc-list{display:grid;gap:10px;width:100%;padding:24px 24px 0;font-size:14px;line-height:1.3}
        .idc-list span{padding-bottom:10px;border-bottom:1px solid var(--line)}
        .idc-sign{margin-top:auto;font-size:30px;color:var(--ink)}
        .idc-find{font-size:9.5px;color:var(--mute);padding:8px 14px 18px;text-align:center;overflow-wrap:anywhere}
        @media (max-width:1080px){
          .ab-grid{grid-template-columns:1fr}
          .lan{order:-1;min-height:560px;margin-bottom:24px}
          .ab-btns{margin-top:6px} .ab-q{margin-top:8px}
        }
      `}</style>
    </section>
  );
}
