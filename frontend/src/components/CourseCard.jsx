import StatusBadge from './StatusBadge.jsx';

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

function formatDate(iso) {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return dateFormatter.format(date).replace('.', '');
}

export default function CourseCard({ course, canDelete, onDelete }) {
  return (
    <article className="group card p-5 flex flex-col gap-4 min-h-[200px] transition-shadow hover:shadow-lift relative overflow-hidden">
      <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <header className="flex items-start justify-between gap-3">
        <span className="font-mono text-[11px] tracking-wider text-muted bg-paper-deep border border-line px-2 py-0.5 rounded">
          {course.code}
        </span>
        <StatusBadge status={course.status} />
      </header>

      <div className="space-y-1">
        <h3 className="font-display text-[1.35rem] leading-snug text-ink display-feature line-clamp-2">
          {course.name}
        </h3>
        <p className="text-sm text-ink/70">
          <span className="text-muted">Instrutor · </span>
          <span className="font-medium">{course.instructor_name}</span>
        </p>
      </div>

      <footer className="mt-auto pt-3 border-t border-line flex items-end justify-between gap-3">
        <div className="text-xs text-muted leading-relaxed space-y-0.5 min-w-0">
          <div className="flex items-center gap-1.5">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span>Cadastrado em {formatDate(course.registered_at)}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70 flex-shrink-0">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <span className="truncate" title={course.admin_email}>por {course.admin_email}</span>
          </div>
        </div>

        {canDelete ? (
          <button
            type="button"
            onClick={() => onDelete?.(course)}
            className="flex-shrink-0 p-2 -mr-2 -mb-1 rounded-md text-muted hover:text-danger hover:bg-danger/5 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-danger/30"
            aria-label={`Deletar curso ${course.code}`}
            title="Deletar curso"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        ) : null}
      </footer>
    </article>
  );
}
