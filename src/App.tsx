import { useState, useEffect } from 'react';
import POSView from './views/POSView';
import StaffView from './views/StaffView';
import ManagerView from './views/ManagerView';
import CEOView from './views/CEOView';
import { orders as initialOrders } from './data/mockData';
import type { Order } from './data/mockData';

type Persona = 'pos' | 'staff' | 'manager' | 'ceo';

const personas: { key: Persona; label: string; icon: string; desc: string }[] = [
  { key: 'pos', label: 'POS Counter', icon: '🖥️', desc: 'Cashier' },
  { key: 'staff', label: 'Kitchen Staff', icon: '📱', desc: 'Chef / Barista' },
  { key: 'manager', label: 'Manager', icon: '📊', desc: 'Back Office' },
  { key: 'ceo', label: 'CEO Dashboard', icon: '📈', desc: 'Executive' },
];

export default function App() {
  const [activePersona, setActivePersona] = useState<Persona>('pos');
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [dark]);

  const handleOrderComplete = (orderId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'completed' as const } : o));
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)', overflow: 'hidden' }}>
      {/* App Switcher Bar */}
      <div style={{
        background: 'var(--card)',
        borderBottom: '2px solid var(--border)',
        padding: '0 1rem',
        display: 'flex',
        alignItems: 'stretch',
        gap: '0',
        flexShrink: 0,
        zIndex: 50,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', paddingRight: '1.25rem', marginRight: '0.5rem', borderRight: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '2rem', height: '2rem', borderRadius: '0.5rem',
              background: 'linear-gradient(135deg, #16a34a, #4ade80)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1rem',
            }}>🍃</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1 }}>GreenTable</div>
              <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', lineHeight: 1 }}>POS Ecosystem</div>
            </div>
          </div>
        </div>

        {/* Persona tabs */}
        {personas.map(p => (
          <button
            key={p.key}
            onClick={() => setActivePersona(p.key)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.625rem 1rem',
              border: 'none',
              borderBottom: `3px solid ${activePersona === p.key ? '#16a34a' : 'transparent'}`,
              background: 'transparent',
              color: activePersona === p.key ? '#16a34a' : 'var(--text-muted)',
              fontWeight: activePersona === p.key ? 700 : 500,
              fontSize: '0.82rem',
              cursor: 'pointer',
              transition: 'all 0.15s',
              whiteSpace: 'nowrap',
              marginBottom: '-2px',
            }}
          >
            <span style={{ fontSize: '1rem' }}>{p.icon}</span>
            <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0' }}>
              <span>{p.label}</span>
              <span style={{ fontSize: '0.62rem', opacity: 0.7, fontWeight: 400, color: 'var(--text-muted)' }}>{p.desc}</span>
            </span>
          </button>
        ))}

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Status badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0 0.75rem' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.375rem',
            background: 'rgba(22,163,74,0.1)', borderRadius: '9999px',
            padding: '0.25rem 0.625rem',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '9999px', background: '#16a34a', display: 'inline-block', boxShadow: '0 0 0 2px rgba(22,163,74,0.3)' }} />
            <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#16a34a' }}>AI Engine Active</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            {orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length} live orders
          </div>
        </div>
      </div>

      {/* Main view area */}
      <div key={activePersona} className="view-fade" style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {activePersona === 'pos' && (
          <POSView dark={dark} onToggleDark={() => setDark(d => !d)} orders={orders} onOrderComplete={handleOrderComplete} />
        )}
        {activePersona === 'staff' && (
          <StaffView dark={dark} onToggleDark={() => setDark(d => !d)} orders={orders} onOrderComplete={handleOrderComplete} />
        )}
        {activePersona === 'manager' && (
          <ManagerView dark={dark} onToggleDark={() => setDark(d => !d)} orders={orders} onOrderComplete={handleOrderComplete} />
        )}
        {activePersona === 'ceo' && (
          <CEOView dark={dark} onToggleDark={() => setDark(d => !d)} orders={orders} />
        )}
      </div>
    </div>
  );
}
