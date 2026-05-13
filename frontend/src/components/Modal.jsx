import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function Modal({ open, onClose, title, children, footer, size = 'md', initialFocusRef }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // Focus management
    const t = setTimeout(() => {
      const el = initialFocusRef?.current ?? dialogRef.current?.querySelector('[data-autofocus]') ?? dialogRef.current;
      el?.focus?.();
    }, 0);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      clearTimeout(t);
    };
  }, [open, onClose, initialFocusRef]);

  if (!open) return null;

  const sizeClass = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' }[size] ?? 'max-w-lg';

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6 animate-fade-in-fast"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <button
        type="button"
        aria-label="Fechar"
        className="absolute inset-0 bg-ink/40 backdrop-blur-[2px] cursor-default"
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        tabIndex={-1}
        className={`relative w-full ${sizeClass} bg-white border border-line rounded-lg shadow-lift animate-slide-up`}
      >
        {title ? (
          <header className="px-6 pt-5 pb-4 border-b border-line flex items-start justify-between gap-4">
            <h2 className="font-display text-xl text-ink display-feature">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              className="text-muted hover:text-ink transition -mr-2 -mt-1 p-1 rounded"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </header>
        ) : null}
        <div className="px-6 py-5">{children}</div>
        {footer ? <footer className="px-6 pb-5 pt-2 flex justify-end gap-2">{footer}</footer> : null}
      </div>
    </div>,
    document.body,
  );
}
