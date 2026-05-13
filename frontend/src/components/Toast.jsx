import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const show = useCallback(
    (toast) => {
      const id = ++idCounter;
      const next = { id, duration: 3500, variant: 'success', ...toast };
      setToasts((current) => [...current, next]);
      if (next.duration > 0) {
        const t = setTimeout(() => dismiss(id), next.duration);
        timers.current.set(id, t);
      }
      return id;
    },
    [dismiss],
  );

  const api = useMemo(
    () => ({
      show,
      success: (message, opts) => show({ message, variant: 'success', ...opts }),
      error: (message, opts) => show({ message, variant: 'error', duration: 5000, ...opts }),
      info: (message, opts) => show({ message, variant: 'info', ...opts }),
      dismiss,
    }),
    [show, dismiss],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-[calc(100vw-2rem)]">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDismiss }) {
  const variantStyles = {
    success: 'border-success/30 bg-white text-ink',
    error: 'border-danger/30 bg-white text-ink',
    info: 'border-line bg-white text-ink',
  };
  const dotStyles = {
    success: 'bg-success',
    error: 'bg-danger',
    info: 'bg-accent',
  };
  return (
    <div
      role="status"
      className={`pointer-events-auto animate-slide-up flex items-start gap-3 px-4 py-3 border rounded-lg shadow-lift min-w-[260px] max-w-sm ${variantStyles[toast.variant]}`}
    >
      <span className={`mt-1.5 h-2 w-2 rounded-full flex-shrink-0 ${dotStyles[toast.variant]}`} />
      <div className="flex-1 text-sm leading-relaxed">{toast.message}</div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Fechar notificação"
        className="text-muted hover:text-ink transition -mr-1 -mt-1 p-1 rounded"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
