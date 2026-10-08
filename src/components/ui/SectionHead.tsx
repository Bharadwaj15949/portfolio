export default function SectionHead({ n, label, lead, accent }: { n: string; label: string; lead: string; accent: string }) {
  return (
    <header>
      <p className="tag rv"><i>{n}</i> — {label}</p>
      <h2 className="h2">
        <span className="rv-mask"><span>{lead}</span></span>
        <span className="rv-mask" style={{ ["--i" as string]: 1 }}><span><em className="serif">{accent}</em></span></span>
      </h2>
    </header>
  );
}
