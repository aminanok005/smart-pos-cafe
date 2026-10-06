interface KPICardProps {
  title: string;
  value: string;
  delta: number;
  icon: string;
  color?: string;
}

export default function KPICard({ title, value, delta, icon, color = '#16a34a' }: KPICardProps) {
  const isUp = delta >= 0;

  return (
    <div
      className="card"
      style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {title}
        </span>
        <span
          style={{
            width: '2.25rem', height: '2.25rem',
            borderRadius: '0.625rem',
            background: `${color}18`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1rem',
          }}
        >
          {icon}
        </span>
      </div>

      <div>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '1.75rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            lineHeight: 1.1,
          }}
        >
          {value}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
        <span
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.2rem',
            fontSize: '0.75rem', fontWeight: 600,
            color: isUp ? '#16a34a' : '#ef4444',
            background: isUp ? 'rgba(22,163,74,0.1)' : 'rgba(239,68,68,0.1)',
            padding: '0.15rem 0.5rem',
            borderRadius: '9999px',
          }}
        >
          {isUp ? '↑' : '↓'} {Math.abs(delta)}%
        </span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>vs last month</span>
      </div>
    </div>
  );
}
