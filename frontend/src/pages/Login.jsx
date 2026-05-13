import { useAuth0 } from '@auth0/auth0-react';

export default function Login() {
  const { loginWithRedirect, isLoading } = useAuth0();
  const currentYear = new Date().getFullYear();

  return (
    <div className="relative min-h-screen overflow-hidden bg-paper paper-grain">
      <BackgroundDecor />
      <div className="relative z-10 min-h-screen flex flex-col">
        <header className="px-6 py-5 flex items-center gap-3">
          <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden>
            <rect width="32" height="32" rx="7" fill="#0B1B2B" />
            <path d="M8 13l8-5 8 5-8 4-8-4z" fill="#B8862A" />
            <path d="M11 16v5c0 1.2 2.2 2.2 5 2.2s5-1 5-2.2v-5" stroke="#E8D9B5" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </svg>
          <div className="leading-tight">
            <div className="font-display text-[15px] font-semibold text-ink display-feature">Universitas</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted">Sistema de Cursos</div>
          </div>
        </header>

        <main className="flex-1 grid place-items-center px-4 sm:px-6 -mt-6">
          <div className="w-full max-w-md">
            <div className="text-center mb-8 animate-fade-in">
              <span className="inline-flex items-center gap-2 text-[10px] font-semibold tracking-[0.22em] uppercase text-accent">
                <span className="h-px w-6 bg-accent" /> Acesso restrito <span className="h-px w-6 bg-accent" />
              </span>
              <h1 className="mt-4 font-display text-4xl sm:text-5xl text-ink display-feature leading-[1.05]">
                Catálogo<br />
                <em className="not-italic text-accent">acadêmico</em>
              </h1>
              <p className="mt-4 text-muted text-sm leading-relaxed max-w-sm mx-auto">
                Gerencie os cursos oferecidos pela universidade. Faça login para visualizar o catálogo
                ou administrar a oferta.
              </p>
            </div>

            <div className="card p-6 sm:p-7 animate-fade-in">
              <div className="space-y-1 mb-5">
                <h2 className="font-display text-lg text-ink display-feature">Entrar no sistema</h2>
                <p className="text-xs text-muted">A autenticação é gerenciada via Auth0.</p>
              </div>

              <button
                type="button"
                onClick={() => loginWithRedirect()}
                disabled={isLoading}
                className="btn-primary w-full justify-center text-base py-2.5"
              >
                {isLoading ? (
                  'Carregando…'
                ) : (
                  <>
                    Entrar com Auth0
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </>
                )}
              </button>

              <div className="mt-5 pt-5 border-t border-line">
                <ul className="space-y-1.5 text-[12.5px] text-muted">
                  <li className="flex items-start gap-2">
                    <Dot /> <span><b className="text-ink/80">Estudantes</b> visualizam o catálogo completo.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Dot /> <span><b className="text-ink/80">Administradores</b> também cadastram e removem cursos.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </main>

        <footer className="px-6 py-5 text-center text-xs text-muted">
          © {currentYear} · Universitas · Sistema de Cursos
        </footer>
      </div>
    </div>
  );
}

function Dot() {
  return <span className="mt-1.5 inline-block h-1 w-1 flex-shrink-0 rounded-full bg-accent" />;
}

function BackgroundDecor() {
  return (
    <>
      <div
        aria-hidden
        className="absolute -top-32 -right-24 h-[420px] w-[420px] rounded-full opacity-[0.07] blur-3xl"
        style={{ background: 'radial-gradient(closest-side, #B8862A, transparent)' }}
      />
      <div
        aria-hidden
        className="absolute -bottom-40 -left-32 h-[480px] w-[480px] rounded-full opacity-[0.08] blur-3xl"
        style={{ background: 'radial-gradient(closest-side, #0B1B2B, transparent)' }}
      />
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
    </>
  );
}
