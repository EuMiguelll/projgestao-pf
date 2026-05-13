export default function EmptyState({ title, description, action, variant = 'default' }) {
  return (
    <div className="card p-12 flex flex-col items-center text-center gap-5 animate-fade-in">
      <BooksIllustration />
      <div className="space-y-1 max-w-md">
        <h3 className="font-display text-2xl text-ink display-feature">{title}</h3>
        <p className="text-muted text-sm leading-relaxed">{description}</p>
      </div>
      {variant !== 'compact' && action ? <div className="pt-1">{action}</div> : null}
    </div>
  );
}

function BooksIllustration() {
  return (
    <svg width="120" height="96" viewBox="0 0 120 96" fill="none" aria-hidden>
      <rect x="14" y="36" width="22" height="52" rx="2" fill="#0B1B2B" />
      <rect x="14" y="36" width="22" height="6" fill="#B8862A" />
      <rect x="20" y="50" width="10" height="1.5" rx=".75" fill="#E8D9B5" />
      <rect x="20" y="56" width="10" height="1.5" rx=".75" fill="#E8D9B5" />

      <rect x="40" y="44" width="22" height="44" rx="2" fill="#E8D9B5" />
      <rect x="40" y="44" width="22" height="6" fill="#B8862A" />
      <rect x="46" y="58" width="10" height="1.5" rx=".75" fill="#0B1B2B" opacity=".4" />

      <rect x="66" y="28" width="22" height="60" rx="2" fill="#F7F4EC" stroke="#E2DCCB" />
      <rect x="66" y="28" width="22" height="6" fill="#0B1B2B" />
      <rect x="72" y="44" width="10" height="1.5" rx=".75" fill="#0B1B2B" opacity=".5" />
      <rect x="72" y="50" width="10" height="1.5" rx=".75" fill="#0B1B2B" opacity=".3" />

      <rect x="92" y="50" width="14" height="38" rx="2" fill="#9C2A2A" opacity=".85" />
      <rect x="92" y="50" width="14" height="5" fill="#0B1B2B" opacity=".4" />

      <line x1="6" y1="88" x2="114" y2="88" stroke="#E2DCCB" strokeWidth="1.5" />
    </svg>
  );
}
