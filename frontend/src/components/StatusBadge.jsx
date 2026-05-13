export default function StatusBadge({ status }) {
  const map = {
    DISPONIVEL: {
      label: 'Disponível',
      dot: 'bg-success',
      ring: 'border-success/30 bg-success/5 text-success',
    },
    CANCELADO: {
      label: 'Cancelado',
      dot: 'bg-cancelled',
      ring: 'border-cancelled/30 bg-cancelled/5 text-cancelled',
    },
  };
  const cfg = map[status] || map.DISPONIVEL;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-semibold tracking-[0.12em] uppercase border rounded-full ${cfg.ring}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}
