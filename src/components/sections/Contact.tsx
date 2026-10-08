"use client";
import { useRef, useState } from "react";
import { PROFILE } from "@/lib/data";
import { scrollToTarget } from "@/lib/scroll";

const Letters = ({ text }: { text: string }) => (
  <>
    {Array.from(text).map((c, i) => (c === " " ? " " : <span key={i} className="ct-l" aria-hidden="true" onMouseEnter={(e) => { const el = e.currentTarget; el.classList.remove("hop"); void el.offsetWidth; el.classList.add("hop"); }}>{c}</span>))}
  </>
);

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const t = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copy = async () => {
    try { await navigator.clipboard.writeText(PROFILE.email); } catch { /* clipboard may be blocked; the mailto link still works */ }
    setCopied(true);
    if (t.current) clearTimeout(t.current);
    t.current = setTimeout(() => setCopied(false), 2000);
  };
  const badge = "say hello • say hello • say hello • ";
  return (
    <section id="contact" className="section contact" aria-labelledby="contact-h">
      <div className="wrap">
        <p className="tag rv"><i>06</i> — Contact</p>
        <h2 id="contact-h" className="ctc-h" aria-label="Let's build something together.">
          <span className="ctc-line"><Letters text="Let's build" /></span>
          <span className="ctc-line"><Letters text="something together." /></span>
        </h2>
        <div className="ctc-body">
          <div className="ctc-mail">
            <a className="ctc-email" href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
            <button className="ctc-copy mono" onClick={copy}>{copied ? "Copied ✓" : "Copy"}</button>
            <span className="sr-only" aria-live="polite">{copied ? "Email address copied" : ""}</span>
          </div>
          <ul className="ctc-links">
            <li><a href={PROFILE.phoneHref}>{PROFILE.phone}</a></li>
            {PROFILE.github && <li><a href={PROFILE.github}>GitHub ↗</a></li>}
            {PROFILE.linkedin && <li><a href={PROFILE.linkedin}>LinkedIn ↗</a></li>}
            <li><a href={PROFILE.resume} download>Résumé ↓</a></li>
          </ul>
          <svg className="ctc-badge" viewBox="0 0 200 200" width="132" height="132" aria-hidden="true">
            <defs><path id="circ" d="M100 100m-76 0a76 76 0 1 1 152 0a76 76 0 1 1-152 0" /></defs>
            <text fontSize="15" fontFamily="var(--font-mono)" letterSpacing="3.2" fill="#0d0d0d"><textPath href="#circ">{badge}</textPath></text>
            <circle cx="100" cy="100" r="5" fill="#0d0d0d" />
          </svg>
        </div>
      </div>
      <footer className="wrap ctc-foot">
        <p>© {new Date().getFullYear()} {PROFILE.name}</p>
        <a href="#top" onClick={(e) => { e.preventDefault(); scrollToTarget(0); }}>Back to top ↑</a>
        <p>Built with Next.js</p>
      </footer>
      <style>{`
        .contact{padding-bottom:40px}
        .ctc-h{font-weight:700;letter-spacing:-.05em;line-height:.98;font-size:clamp(46px,10.5vw,176px)}
        .ctc-line{display:block}
        .ct-l{display:inline-block;will-change:transform}
        .ct-l.hop{animation:hop .6s var(--ease)}
        @keyframes hop{0%{transform:none}35%{transform:translateY(-.14em)}100%{transform:none}}
        .ctc-body{position:relative;margin-top:clamp(40px,8vh,88px);display:grid;gap:28px}
        .ctc-mail{display:flex;flex-wrap:wrap;align-items:center;gap:14px 18px}
        .ctc-email{font-size:clamp(20px,3.6vw,52px);font-weight:600;letter-spacing:-.035em;text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:.14em;overflow-wrap:anywhere}
        .ctc-copy{height:34px;padding:0 14px;border-radius:999px;font-size:12px;box-shadow:inset 0 0 0 1px rgba(13,13,13,.3);transition:background .4s var(--ease),color .4s var(--ease);min-width:84px}
        .ctc-copy:hover{background:var(--ink);color:#fff}
        .ctc-links{display:flex;flex-wrap:wrap;gap:10px 28px;font-size:18px;font-weight:500}
        .ctc-links a{border-bottom:1px solid var(--line);padding-bottom:2px;transition:border-color .3s}
        .ctc-links a:hover{border-color:var(--ink)}
        .ctc-badge{position:absolute;right:0;top:-8px;animation:spin 22s linear infinite}
        @keyframes spin{to{transform:rotate(360deg)}}
        .ctc-foot{display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px 24px;margin-top:clamp(72px,14vh,150px);padding-top:24px;border-top:1px solid var(--line);font-size:14px;color:var(--mute)}
        .ctc-foot a:hover{color:var(--ink)}
        @media (max-width:700px){.ctc-badge{position:static;margin-top:8px}}
      `}</style>
    </section>
  );
}
