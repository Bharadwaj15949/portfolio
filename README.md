# Bharadwaj Pasumarthi · portfolio

Quiet white / black / gray portfolio built with Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4 and Lenis.
All content comes from the résumé and lives in `src/lib/data.ts`.

## Run

```bash
npm install        # also copies fonts to src/fonts and the Terraform / PowerShell logos to public/logos
npm run dev        # http://localhost:3000
npm run build && npm start
```

`npm install` runs `scripts/setup-assets.mjs`. If fonts or logos are ever missing, run `npm run setup`.
Fonts (Inter Tight, Instrument Serif, JetBrains Mono) are self-hosted through `next/font/local`. Nothing loads from a CDN at runtime.

## Sections

| # | Section | Component | Motion |
|---|---------|-----------|--------|
| – | Hero | `hero/Hero.tsx` | Looping intro video with voice, paused below 35 % visibility |
| 01 | About | `sections/About.tsx` | Lanyard ID card: damped pendulum, idle sway, 3D flip |
| 02 | Skills | `sections/Skills.tsx` | Periodic table, diagonal wave reveal, family filter, logo inspector |
| 03 | Certifications | `sections/Certifications.tsx` | Ink-flood rows |
| 04 | Experience | `sections/Experience.tsx` | Scroll-drawn timeline (education + roles) |
| 05 | Achievements | `sections/Achievements.tsx` | Pinned horizontal gallery |
| 06 | Contact | `sections/Contact.tsx` | Letter hop, copy chip, spinning badge |

**Left out on purpose** because the résumé has no data for them: Work/projects, GitHub and LinkedIn links, location, CGPA, coding-platform numbers.
To add any of them, fill `PROFILE.github`, `PROFILE.linkedin` etc. in `data.ts`. The About buttons and Contact links appear automatically.

## Rebuild the hero video

Needs `ffmpeg` (libx264, libvpx-vp9, libopus, libwebp) and `numpy`.

```bash
python3 scripts/build-hero-assets.py path/to/intro.mp4
# optional: --crop w:h:x:y   --portrait-time 5.0   --head-offset 0.057   --photo face.jpg
```

It detects the person, crops head to toe, scales to 768 px wide, whitens the backdrop, and cross-fades the last 0.5 s into the first 0.5 s
(picture with ffmpeg `xfade`, audio sample-accurately in numpy), so the loop has no jump and no click. Nothing is retimed, so lips stay in sync.
It writes `public/hero/hero.mp4`, `hero.webm`, `poster.webp`, `public/portrait-bust.webp` and `public/og.jpg`.
The committed assets were built from the supplied clip (crop `528:660:343:36`, 9.5 s loop).

## Credits and licences

- Terraform and PowerShell logos: [devicon](https://github.com/devicons/devicon), MIT. Licence copied to `public/logos/LICENSE-devicon.txt`. Logos remain trademarks of their owners.
- Fonts: Inter Tight (OFL), Instrument Serif (OFL), JetBrains Mono (OFL), via Fontsource.
- All other icons are hand-drawn line SVGs.

## Checks to run locally

```bash
npm run lint && npm run build
npx playwright install chromium   # then screenshot 1440x900 and 390x844 and assert
# document.documentElement.scrollWidth === window.innerWidth
npx lighthouse http://localhost:3000 --view
```
