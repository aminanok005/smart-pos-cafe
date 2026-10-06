import type { OrderStatus } from '../../data/mockData';

interface StatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md';
}

const config: Record<OrderStatus, { label: string; color: string; bg: string; icon: string }> = {
  new: { label: 'New Order', color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)', icon: '✦' },
  cooking: { label: 'Cooking', color: '#f97316', bg: 'rgba(249,115,22,0.12)', icon: '🍳' },
  ready: { label: 'Ready to Serve', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', icon: '🔔' },
  completed: { label: 'Completed', color: '#16a34a', bg: 'rgba(22,163,74,0.12)', icon: '✓' },
  cancelled: { label: 'Cancelled', color: '#ef4444', bg: 'rgba(239,68,68,0.12)', icon: '✕' },
};

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const c = config[status];
  const fontSize = size === 'sm' ? '0.7rem' : '0.75rem';
  const padding = size === 'sm' ? '0.2rem 0.5rem' : '0.25rem 0.625rem';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.25rem',
        color: c.color,
        background: c.bg,
        borderRadius: '9999px',
        padding,
        fontSize,
        fontWeight: 600,
        whiteSpace: 'nowrap',
      }}
    >
      <span>{c.icon}</span>
      {c.label}
    </span>
  );
}
