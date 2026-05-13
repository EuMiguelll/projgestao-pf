import { useCallback, useEffect, useMemo, useState } from 'react';

import Header from '../components/Header.jsx';
import CourseCard from '../components/CourseCard.jsx';
import NewCourseModal from '../components/NewCourseModal.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { CourseCardSkeleton } from '../components/Skeleton.jsx';
import { useApi } from '../api.js';
import { useRole } from '../hooks/useRole.js';
import { useToast } from '../components/Toast.jsx';

const FILTERS = [
  { id: 'ALL', label: 'Todos' },
  { id: 'DISPONIVEL', label: 'Disponíveis' },
  { id: 'CANCELADO', label: 'Cancelados' },
];

export default function Courses() {
  const api = useApi();
  const toast = useToast();
  const { isAdmin } = useRole();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);

  const refresh = useCallback(async () => {
    setError(null);
    try {
      const data = await api.listCourses();
      setCourses(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const filtered = useMemo(() => {
    if (filter === 'ALL') return courses;
    return courses.filter((c) => c.status === filter);
  }, [courses, filter]);

  const counts = useMemo(
    () => ({
      ALL: courses.length,
      DISPONIVEL: courses.filter((c) => c.status === 'DISPONIVEL').length,
      CANCELADO: courses.filter((c) => c.status === 'CANCELADO').length,
    }),
    [courses],
  );

  const handleCreate = async (payload) => {
    const created = await api.createCourse(payload);
    setCourses((prev) => [created, ...prev]);
    toast.success(`Curso ${created.code} cadastrado.`);
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await api.deleteCourse(pendingDelete.id);
      setCourses((prev) => prev.filter((c) => c.id !== pendingDelete.id));
      toast.success(`Curso ${pendingDelete.code} removido.`);
    } catch (err) {
      toast.error(err?.message || 'Não foi possível deletar o curso.');
    }
  };

  const totalLabel = courses.length === 1 ? '1 curso' : `${courses.length} cursos`;

  return (
    <div className="min-h-screen bg-paper paper-grain">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <section className="mb-10 sm:mb-12">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <span className="text-[11px] tracking-[0.22em] uppercase text-accent font-semibold">
                Catálogo
              </span>
              <h1 className="mt-1 font-display text-4xl sm:text-5xl text-ink display-feature leading-[1.05]">
                Catálogo de cursos
              </h1>
              <p className="mt-2 text-muted text-sm">
                {loading ? 'Carregando catálogo…' : `${totalLabel} no sistema`}
                {courses.length > 0 && filter !== 'ALL' ? (
                  <> · exibindo {filtered.length} {FILTERS.find((f) => f.id === filter)?.label.toLowerCase()}</>
                ) : null}
              </p>
            </div>

            {isAdmin && !loading ? (
              <button type="button" onClick={() => setModalOpen(true)} className="btn-primary">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Novo curso
              </button>
            ) : null}
          </div>
        </section>

        {!loading && courses.length > 0 ? (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            {FILTERS.map((f) => {
              const active = filter === f.id;
              const count = counts[f.id];
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilter(f.id)}
                  className={`chip ${active ? 'chip-active' : ''} transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40`}
                  aria-pressed={active}
                >
                  {f.label}
                  <span className={`ml-0.5 text-[10px] tabular-nums ${active ? 'text-paper/70' : 'text-muted'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
            <button
              type="button"
              onClick={refresh}
              className="ml-auto inline-flex items-center gap-1.5 text-xs text-muted hover:text-ink transition px-2 py-1"
              aria-label="Atualizar lista"
              title="Atualizar"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10" />
                <polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
              Atualizar
            </button>
          </div>
        ) : null}

        {error ? (
          <div className="card p-6 border-danger/30 mb-6 animate-fade-in">
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-full bg-danger/10 text-danger inline-flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-display text-lg text-ink">Não foi possível carregar os cursos</h3>
                <p className="text-sm text-muted mt-1">{error.message}</p>
                <button type="button" className="btn-secondary mt-4" onClick={refresh}>
                  Tentar novamente
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <CourseCardSkeleton />
            <CourseCardSkeleton />
            <CourseCardSkeleton />
          </div>
        ) : courses.length === 0 ? (
          <EmptyState
            title="Nenhum curso cadastrado"
            description={
              isAdmin
                ? 'Comece cadastrando o primeiro curso do catálogo.'
                : 'Assim que um administrador cadastrar cursos, eles aparecerão aqui.'
            }
            action={
              isAdmin ? (
                <button type="button" className="btn-primary" onClick={() => setModalOpen(true)}>
                  Cadastrar primeiro curso
                </button>
              ) : null
            }
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="Nenhum curso neste filtro"
            description="Ajuste o filtro acima para ver outros cursos."
            variant="compact"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-in">
            {filtered.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                canDelete={isAdmin}
                onDelete={(c) => setPendingDelete(c)}
              />
            ))}
          </div>
        )}
      </main>

      {isAdmin ? (
        <NewCourseModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleCreate}
        />
      ) : null}

      <ConfirmDialog
        open={!!pendingDelete}
        title="Deletar curso?"
        message={
          pendingDelete
            ? `Tem certeza que deseja deletar o curso ${pendingDelete.code} — ${pendingDelete.name}? Esta ação não pode ser desfeita.`
            : ''
        }
        confirmLabel="Deletar curso"
        destructive
        onConfirm={handleConfirmDelete}
        onClose={() => setPendingDelete(null)}
      />
    </div>
  );
}
