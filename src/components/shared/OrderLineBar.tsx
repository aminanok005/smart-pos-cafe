import { useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import type { Order } from '../../data/mockData';
import StatusBadge from './StatusBadge';

type FilterTab = 'all' | 'dine-in' | 'takeaway' | 'delivery';

interface OrderLineBarProps {
  orders: Order[];
  role: 'pos' | 'staff' | 'manager';
  onAction?: (order: Order) => void;
}

function timeAgo(min: number): string {
  if (min < 60) return `${min}m ago`;
  return `${Math.floor(min / 60)}h ago`;
}

export default function OrderLineBar({ orders, role, onAction }: OrderLineBarProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const scrollRef = useRef<HTMLDivElement>(null);

  const counts: Record<FilterTab, number> = {
    all: orders.length,
    'dine-in': orders.filter(o => o.type === 'dine-in').length,
    takeaway: orders.filter(o => o.type === 'takeaway').length,
    delivery: orders.filter(o => o.type === 'delivery').length,
  };

  const filtered = activeTab === 'all' ? orders : orders.filter(o => o.type === activeTab);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'right' ? 280 : -280, behavior: 'smooth' });
    }
  };

  const actionLabel = role === 'pos' ? 'View Detail' : role === 'staff' ? "It's Done ✓" : 'See All';
  const actionColor = role === 'staff' ? '#3b82f6' : '#16a34a';

  const tabs: { key: FilterTab; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'dine-in', label: 'Dine-in' },
    { key: 'takeaway', label: 'Take Away' },
    { key: 'delivery', label: 'Delivery' },
  ];

  return (
    <div
      style={{
        background: 'var(--card)',
        borderBottom: '1px solid var(--border)',
        padding: '0.875rem 1rem 0.75rem',
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.625rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Order Line</span>
          <span style={{
            background: '#a3e635', color: '#1a2e05', borderRadius: '9999px',
            padding: '0.1rem 0.5rem', fontSize: '0.7rem', fontWeight: 700,
          }}>
            {orders.length} live
          </span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => scroll('left')} style={arrowBtn}>‹</button>
          <button onClick={() => scroll('right')} style={arrowBtn}>›</button>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '0.125rem', marginBottom: '0.625rem' }}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '0.25rem 0.625rem',
              borderRadius: '9999px',
              cursor: 'pointer',
              fontSize: '0.78rem',
              fontWeight: activeTab === tab.key ? 700 : 500,
              color: activeTab === tab.key ? '#16a34a' : 'var(--text-muted)',
              borderBottom: activeTab === tab.key ? '2px solid #16a34a' : '2px solid transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              transition: 'all 0.15s',
            }}
          >
            {tab.label}
            {counts[tab.key] > 0 && (
              <span style={{
                background: activeTab === tab.key ? '#16a34a' : 'var(--bg-subtle)',
                color: activeTab === tab.key ? 'white' : 'var(--text-secondary)',
                borderRadius: '9999px', padding: '0 0.35rem',
                fontSize: '0.65rem', fontWeight: 700,
              }}>
                {counts[tab.key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Scrollable cards */}
      <div ref={scrollRef} className="order-line-scroll">
        {filtered.length === 0 && (
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', padding: '0.5rem 0' }}>
            No orders in this category
          </div>
        )}
        {filtered.map(order => (
          <div
            key={order.id}
            style={{
              minWidth: '230px',
              maxWidth: '230px',
              background: 'var(--card-2, var(--bg))',
              border: '1px solid var(--border)',
              borderRadius: '0.875rem',
              padding: '0.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                Order #{order.orderNum}
              </span>
              <StatusBadge status={order.status} size="sm" />
            </div>

            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {order.type === 'dine-in' ? `Dine-in · ${order.table}` : order.type === 'takeaway' ? 'Take Away' : 'Delivery'}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{
                background: '#a3e635', color: '#1a2e05',
                borderRadius: '9999px', padding: '0.2rem 0.625rem',
                fontSize: '0.72rem', fontWeight: 700,
                display: 'flex', alignItems: 'center', gap: '0.25rem',
              }}>
                {order.items.reduce((s, i) => s + i.qty, 0)} items
                <span style={{ opacity: 0.7, fontSize: '0.7rem' }}>↗</span>
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                🕐 {timeAgo(order.minutesAgo)}
              </span>
            </div>

            <button
              onClick={() => onAction?.(order)}
              style={{
                background: actionColor,
                color: 'white',
                border: 'none',
                borderRadius: '9999px',
                padding: '0.35rem 0.75rem',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.25rem',
                transition: 'opacity 0.15s',
              }}
              onMouseOver={e => (e.currentTarget.style.opacity = '0.85')}
              onMouseOut={e => (e.currentTarget.style.opacity = '1')}
            >
              {actionLabel}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const arrowBtn: CSSProperties = {
  background: 'var(--bg)',
  border: '1px solid var(--border)',
  borderRadius: '9999px',
  width: '1.75rem',
  height: '1.75rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  fontSize: '1rem',
  color: 'var(--text-secondary)',
  fontWeight: 700,
};
