// Copies self-hosted fonts (from @fontsource) into src/fonts and the real Terraform / PowerShell
// brand SVGs (from devicon, MIT) into public/logos. Runs automatically after `npm install`.
import { copyFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const nm = (p) => join(root, "node_modules", p);
mkdirSync(join(root, "src/fonts"), { recursive: true });
mkdirSync(join(root, "public/logos"), { recursive: true });

function pick(dir, re) {
  if (!existsSync(dir)) return null;
  const f = readdirSync(dir).find((n) => re.test(n));
  return f ? join(dir, f) : null;
}
const fonts = [
  ["@fontsource-variable/inter-tight/files", /^inter-tight-latin-wght-normal\.woff2$/, "InterTight-Variable.woff2"],
  ["@fontsource/instrument-serif/files", /^instrument-serif-latin-400-normal\.woff2$/, "InstrumentSerif-Regular.woff2"],
  ["@fontsource/instrument-serif/files", /^instrument-serif-latin-400-italic\.woff2$/, "InstrumentSerif-Italic.woff2"],
  ["@fontsource-variable/jetbrains-mono/files", /^jetbrains-mono-latin-wght-normal\.woff2$/, "JetBrainsMono-Variable.woff2"],
];
for (const [dir, re, out] of fonts) {
  const src = pick(nm(dir), re);
  if (src) copyFileSync(src, join(root, "src/fonts", out));
  else console.warn(`[setup] font not found for ${out} - run npm install first`);
}
const logos = [
  ["devicon/icons/terraform/terraform-original.svg", "terraform.svg"],
  ["devicon/icons/powershell/powershell-original.svg", "powershell.svg"],
];
for (const [src, out] of logos) {
  if (existsSync(nm(src))) copyFileSync(nm(src), join(root, "public/logos", out));
  else console.warn(`[setup] logo not found: ${src}`);
}
if (existsSync(nm("devicon/LICENSE"))) copyFileSync(nm("devicon/LICENSE"), join(root, "public/logos/LICENSE-devicon.txt"));
console.log("[setup] fonts and logos ready");
