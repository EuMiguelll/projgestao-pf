import { useState } from 'react';
import Modal from './Modal.jsx';

export default function ConfirmDialog({
  open,
  title = 'Confirmar ação',
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  destructive = false,
  onConfirm,
  onClose,
}) {
  const [busy, setBusy] = useState(false);

  const handleConfirm = async () => {
    setBusy(true);
    try {
      await onConfirm?.();
      onClose?.();
    } finally {
      setBusy(false);
    }
  };

  const footer = (
    <>
      <button type="button" className="btn-ghost" onClick={onClose} disabled={busy}>
        {cancelLabel}
      </button>
      <button
        type="button"
        className={destructive ? 'btn-danger' : 'btn-primary'}
        onClick={handleConfirm}
        disabled={busy}
        data-autofocus
      >
        {busy ? 'Processando…' : confirmLabel}
      </button>
    </>
  );

  return (
    <Modal open={open} onClose={busy ? () => {} : onClose} title={title} footer={footer} size="sm">
      <p className="text-sm text-ink/80 leading-relaxed">{message}</p>
    </Modal>
  );
}
