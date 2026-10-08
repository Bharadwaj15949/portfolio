/* eslint-disable @next/next/no-img-element -- small static images, no optimiser needed */
"use client";
import { useState } from "react";

/** Real brand logos (devicon, MIT) copied into /public/logos by scripts/setup-assets.mjs, with a soft brand-tint glow. */
export const BRAND: Record<string, { src: string; glow: string }> = {
  Terraform: { src: "/logos/terraform.svg", glow: "rgba(123,66,188,.16)" },
  PowerShell: { src: "/logos/powershell.svg", glow: "rgba(83,145,254,.18)" },
};
export const isBrand = (name: string) => name in BRAND;

/** Thin line icons for everything that has no brand logo, one per skill family. */
export const CONCEPT: Record<string, React.ReactNode> = {
  Networking: <><circle cx="12" cy="5" r="2.2" /><circle cx="5" cy="18" r="2.2" /><circle cx="19" cy="18" r="2.2" /><path d="M11 7 6 16M13 7l5 9M7.2 18h9.6" /></>,
  Security: <><path d="M12 3 5 6v5.5c0 4.2 2.9 7.6 7 9.5 4.1-1.9 7-5.3 7-9.5V6l-7-3Z" /><path d="m9 12 2.2 2.2L15.5 10" /></>,
  "Traffic & Delivery": <><path d="M3 12h12M11 7l5 5-5 5" /><path d="M18 5v14" /></>,
  "Compute & Migration": <><rect x="4" y="5" width="16" height="6" rx="1.5" /><rect x="4" y="13" width="16" height="6" rx="1.5" /><path d="M8 8h.01M8 16h.01" /></>,
  "Web & Storage": <><ellipse cx="12" cy="6" rx="7" ry="2.8" /><path d="M5 6v12c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8V6M5 12c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8" /></>,
  "Identity & Access": <><circle cx="9" cy="9" r="3.4" /><path d="M3.5 19c.6-3 3-4.6 5.5-4.6M14 14.5h7M18 14.5V18M21 14.5V17" /></>,
  "Scripting & Tools": <><path d="m8 8-4 4 4 4M16 8l4 4-4 4M13.5 6l-3 12" /></>,
  "Monitoring & DevOps": <><path d="M3 12h4l2.5-6 4 12 2.5-6H21" /></>,
};

export default function TechLogo({ name, family, size = 150 }: { name: string; family: string; size?: number }) {
  const [broken, setBroken] = useState(false);
  const brand = BRAND[name];
  if (brand && !broken) {
    return (
      <span className="tl" style={{ width: size, height: size, ["--glow" as string]: brand.glow }} role="img" aria-label={`${name} logo`}>
        <img src={brand.src} alt="" width={size * 0.62} height={size * 0.62} onError={() => setBroken(true)} />
        <style>{TL_CSS}</style>
      </span>
    );
  }
  return (
    <span className="tl" style={{ width: size, height: size }} role="img" aria-label={`${family} icon`}>
      <svg viewBox="0 0 24 24" width={size * 0.5} height={size * 0.5} fill="none" stroke="#0d0d0d" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {CONCEPT[family] ?? CONCEPT.Networking}
      </svg>
      <style>{TL_CSS}</style>
    </span>
  );
}

const TL_CSS = `
.tl{position:relative;display:grid;place-items:center;border-radius:50%;animation:tlpop .7s var(--ease) both}
.tl::before{content:"";position:absolute;inset:6%;border-radius:50%;background:var(--glow,rgba(13,13,13,.05));filter:blur(18px)}
.tl>*{position:relative}
@keyframes tlpop{from{opacity:0;transform:scale(.6) rotate(-6deg)}to{opacity:1;transform:none}}
`;
