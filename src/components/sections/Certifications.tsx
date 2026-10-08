import { CERTIFICATIONS } from "@/lib/data";

export default function Certifications() {
  return (
    <section id="certifications" className="section certs" aria-labelledby="certs-h">
      <div className="wrap ct-grid">
        <header className="ct-head">
          <p className="tag rv"><i>03</i> — Certifications</p>
          <h2 id="certs-h" className="h2">
            <span className="rv-mask"><span>Always</span></span>
            <span className="rv-mask" style={{ ["--i" as string]: 1 }}><span><em className="serif">learning.</em></span></span>
          </h2>
          <p className="mono rv ct-count">{String(CERTIFICATIONS.length).padStart(2, "0")} certifications · Microsoft &amp; Google</p>
        </header>
        <ol className="ct-list">
          {CERTIFICATIONS.map((c, i) => (
            <li key={c.title} className="rv ct-row" tabIndex={0} style={{ ["--i" as string]: i }}>
              <span className="mono ct-n">{String(i + 1).padStart(2, "0")}</span>
              <span className="ct-t">{c.title}</span>
              <span className="ct-i">{c.issuer}</span>
              <span className="ct-ok" aria-hidden="true">✓</span>
            </li>
          ))}
        </ol>
      </div>
      <style>{`
        .certs{background:var(--card);border-block:1px solid var(--line)}
        .ct-grid{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:clamp(32px,6vw,96px);align-items:start}
        .ct-head{position:sticky;top:110px}
        .ct-count{margin-top:28px;font-size:12px;color:var(--mute)}
        .ct-list{border-top:1px solid var(--line)}
        .ct-row{position:relative;display:grid;grid-template-columns:48px minmax(0,1fr) auto 28px;align-items:center;gap:16px;padding:28px 18px;border-bottom:1px solid var(--line);overflow:hidden;isolation:isolate;transition:color .5s var(--ease),opacity .9s var(--ease),transform .9s var(--ease)}
        .ct-row::before{content:"";position:absolute;inset:0;background:var(--ink);transform:scaleX(0);transform-origin:0 50%;transition:transform .7s var(--ease);z-index:-1}
        .ct-row:hover,.ct-row:focus-visible{color:#fff}
        .ct-row:hover::before,.ct-row:focus-visible::before{transform:scaleX(1)}
        .ct-row:focus-visible{outline-offset:-3px;outline-color:var(--paper)}
        .ct-n{font-size:12px;opacity:.55}
        .ct-t{font-weight:600;font-size:clamp(20px,2.4vw,32px);letter-spacing:-.03em;line-height:1.1}
        .ct-i{font-size:14px;opacity:.6}
        .ct-ok{transform:translateX(-14px);opacity:0;transition:transform .6s var(--ease),opacity .6s var(--ease)}
        .ct-row:hover .ct-ok,.ct-row:focus-visible .ct-ok{transform:none;opacity:1}
        @media (max-width:900px){.ct-grid{grid-template-columns:1fr}.ct-head{position:static}.ct-row{grid-template-columns:36px minmax(0,1fr) 24px;padding:22px 10px}.ct-i{grid-column:2;grid-row:2;margin-top:-10px}.ct-ok{grid-row:1;grid-column:3}}
      `}</style>
    </section>
  );
}
