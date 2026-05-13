import { useState, useRef, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useRole } from '../hooks/useRole.js';

function initials(name = '') {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? '')
    .join('') || '·';
}

function Logo() {
  return (
    <div className="flex items-center gap-3 select-none">
      <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden>
        <rect width="32" height="32" rx="7" fill="#0B1B2B" />
        <path d="M8 13l8-5 8 5-8 4-8-4z" fill="#B8862A" />
        <path d="M11 16v5c0 1.2 2.2 2.2 5 2.2s5-1 5-2.2v-5" stroke="#E8D9B5" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </svg>
      <div className="leading-tight">
        <div className="font-display text-[15px] font-semibold text-ink display-feature">Universitas</div>
        <div className="text-[10px] uppercase tracking-[0.18em] text-muted">Sistema de Cursos</div>
      </div>
    </div>
  );
}

function RoleChip({ role }) {
  if (role === 'ADMIN') {
    return (
      <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-bold tracking-[0.14em] uppercase border border-accent/40 text-accent bg-accent/5 rounded">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Admin
      </span>
    );
  }
  if (role === 'USER') {
    return (
      <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-bold tracking-[0.14em] uppercase border border-line text-muted rounded">
        Estudante
      </span>
    );
  }
  return (
    <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-bold tracking-[0.14em] uppercase border border-danger/40 text-danger bg-danger/5 rounded">
      Sem papel
    </span>
  );
}

export default function Header() {
  const { user, logout } = useAuth0();
  const { primaryRole } = useRole();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onClick = (e) => {
      if (!menuRef.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const displayName = user?.name || user?.nickname || user?.email || 'Usuário';
  const email = user?.email || '';

  return (
    <header className="sticky top-0 z-30 bg-paper/85 backdrop-blur-md border-b border-line">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Logo />
          <span className="hidden md:inline-block h-5 w-px bg-line" />
          <nav className="hidden md:flex items-center gap-1 text-sm text-muted">
            <span className="text-ink/70">Catálogo</span>
          </nav>
        </div>

        <div className="relative flex items-center gap-3" ref={menuRef}>
          <RoleChip role={primaryRole} />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="group flex items-center gap-2 px-2 py-1.5 -mr-1 rounded-lg hover:bg-paper-deep transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            aria-haspopup="menu"
            aria-expanded={open}
          >
            {user?.picture ? (
              <img
                src={user.picture}
                alt=""
                className="h-8 w-8 rounded-full object-cover border border-line"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="h-8 w-8 rounded-full bg-ink text-paper text-xs font-semibold inline-flex items-center justify-center">
                {initials(displayName)}
              </span>
            )}
            <span className="hidden sm:block text-left leading-tight">
              <span className="block text-sm font-medium text-ink max-w-[160px] truncate">{displayName}</span>
              {email ? <span className="block text-[11px] text-muted max-w-[160px] truncate">{email}</span> : null}
            </span>
            <svg className={`text-muted transition ${open ? 'rotate-180' : ''}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {open ? (
            <div
              role="menu"
              className="absolute right-0 top-full mt-2 w-64 card p-1.5 animate-fade-in-fast z-40"
            >
              <div className="px-3 py-2.5 border-b border-line">
                <div className="text-sm font-medium text-ink truncate">{displayName}</div>
                {email ? <div className="text-xs text-muted truncate">{email}</div> : null}
                <div className="mt-2"><RoleChip role={primaryRole} /></div>
              </div>
              <button
                type="button"
                onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                role="menuitem"
                className="w-full text-left px-3 py-2 text-sm text-ink hover:bg-paper-deep rounded-md flex items-center gap-2 transition"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Sair
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
