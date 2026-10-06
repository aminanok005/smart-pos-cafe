import { useState } from 'react';
import OrderLineBar from '../components/shared/OrderLineBar';
import Sidebar from '../components/shared/Sidebar';
import StatusBadge from '../components/shared/StatusBadge';
import ThemeToggle from '../components/shared/ThemeToggle';
import { menuItems, dishCategories, staffMembers } from '../data/mockData';
import type { Order, OrderStatus } from '../data/mockData';

interface ManagerViewProps {
  dark: boolean;
  onToggleDark: () => void;
  orders: Order[];
  onOrderComplete: (orderId: string) => void;
}

const sidebarItems = [
  { key: 'home', label: 'Home', icon: '🏠' },
  { key: 'menu', label: 'Menu', icon: '🍽️' },
  { key: 'order', label: 'Order', icon: '📋' },
  { key: 'promo', label: 'Promo', icon: '🎟️' },
  { key: 'chart', label: 'Chart', icon: '📊' },
  { key: 'history', label: 'History', icon: '🕐' },
];
const sidebarBottom = [{ key: 'settings', label: 'Settings', icon: '⚙️' }];

type MainTab = 'orders' | 'menu' | 'inventory' | 'staff' | 'qc' | 'ai';
type StatusFilter = 'all' | OrderStatus;

const statusFilters: { key: StatusFilter; label: string; color: string }[] = [
  { key: 'all', label: 'All', color: '#16a34a' },
  { key: 'new', label: 'New', color: '#8b5cf6' },
  { key: 'cooking', label: 'Cooking', color: '#f97316' },
  { key: 'ready', label: 'Ready', color: '#3b82f6' },
  { key: 'completed', label: 'Completed', color: '#16a34a' },
  { key: 'cancelled', label: 'Cancelled', color: '#ef4444' },
];

const mainTabs: { key: MainTab; label: string; icon: string }[] = [
  { key: 'orders', label: 'Orders', icon: '📋' },
  { key: 'menu', label: 'Manage Menu', icon: '🍽️' },
  { key: 'inventory', label: 'Inventory', icon: '📦' },
  { key: 'staff', label: 'Staff', icon: '👥' },
  { key: 'qc', label: 'QC', icon: '✅' },
  { key: 'ai', label: 'AI Insights', icon: '🤖' },
];

export default function ManagerView({ dark, onToggleDark, orders }: ManagerViewProps) {
  const [activeNav, setActiveNav] = useState('order');
  const [activeTab, setActiveTab] = useState<MainTab>('orders');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeDishCategory, setActiveDishCategory] = useState('All Dishes');
  const [searchOrder, setSearchOrder] = useState('');

  const filteredOrders = orders.filter(o => {
    const statusMatch = statusFilter === 'all' || o.status === statusFilter;
    const searchMatch = !searchOrder || o.customer.toLowerCase().includes(searchOrder.toLowerCase()) || String(o.orderNum).includes(searchOrder);
    return statusMatch && searchMatch;
  });

  const counts: Record<StatusFilter, number> = {
    all: orders.length,
    new: orders.filter(o => o.status === 'new').length,
    cooking: orders.filter(o => o.status === 'cooking').length,
    ready: orders.filter(o => o.status === 'ready').length,
    completed: orders.filter(o => o.status === 'completed').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  const filteredMenu = menuItems.filter(m => activeDishCategory === 'All Dishes' || m.category === activeDishCategory.replace(' & Noodles', '').replace('Main Courses', 'Main Course').replace('Sandwiches', 'Sandwich').replace('Burger', 'Burger'));

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      <Sidebar items={sidebarItems} activeKey={activeNav} onSelect={setActiveNav} bottomItems={sidebarBottom} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <OrderLineBar orders={orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled')} role="manager" />

        {/* Main header */}
        <div style={{
          background: 'var(--card)',
          borderBottom: '1px solid var(--border)',
          padding: '0.875rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
              Hi, Stephany, here's today's orders!
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{dateStr}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '0.5rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.8rem' }}>🔍</span>
              <input className="input-base" style={{ paddingLeft: '1.75rem', width: '160px', fontSize: '0.8rem' }} placeholder="Search orders..." value={searchOrder} onChange={e => setSearchOrder(e.target.value)} />
            </div>
            <button style={{
              display: 'flex', alignItems: 'center', gap: '0.375rem',
              background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '0.625rem',
              padding: '0.4rem 0.75rem', fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer',
              color: 'var(--text-secondary)',
            }}>
              📅 Today
            </button>
            <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '9999px', background: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.75rem' }}>SL</div>
            <ThemeToggle dark={dark} onToggle={onToggleDark} />
          </div>
        </div>

        {/* Tab navigation */}
        <div style={{ background: 'var(--card)', borderBottom: '1px solid var(--border)', padding: '0 1.25rem', display: 'flex', gap: '0', flexShrink: 0 }}>
          {mainTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '0.75rem 1rem',
                border: 'none',
                background: 'transparent',
                borderBottom: `2px solid ${activeTab === tab.key ? '#16a34a' : 'transparent'}`,
                color: activeTab === tab.key ? '#16a34a' : 'var(--text-muted)',
                fontWeight: activeTab === tab.key ? 700 : 500,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '0.375rem',
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', position: 'relative' }}>

          {/* === ORDERS TAB === */}
          {activeTab === 'orders' && (
            <div style={{ flex: 1, overflow: 'auto', padding: '1rem 1.25rem' }}>
              {/* Status filter tabs */}
              <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                {statusFilters.map(sf => (
                  <button
                    key={sf.key}
                    onClick={() => setStatusFilter(sf.key)}
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: '9999px',
                      border: `1.5px solid ${statusFilter === sf.key ? sf.color : 'var(--border)'}`,
                      background: statusFilter === sf.key ? `${sf.color}15` : 'transparent',
                      color: statusFilter === sf.key ? sf.color : 'var(--text-muted)',
                      fontWeight: statusFilter === sf.key ? 700 : 500,
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '0.3rem',
                      transition: 'all 0.15s',
                    }}
                  >
                    {sf.label}
                    <span style={{
                      background: statusFilter === sf.key ? sf.color : 'var(--bg)',
                      color: statusFilter === sf.key ? 'white' : 'var(--text-secondary)',
                      borderRadius: '9999px', padding: '0 0.35rem',
                      fontSize: '0.65rem', fontWeight: 700,
                    }}>
                      {counts[sf.key]}
                    </span>
                  </button>
                ))}
              </div>

              {/* Order cards grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.75rem' }}>
                {filteredOrders.map(order => (
                  <div
                    key={order.id}
                    className="card"
                    style={{
                      padding: '0.875rem',
                      cursor: 'pointer',
                      border: selectedOrder?.id === order.id ? '2px solid #16a34a' : undefined,
                      transition: 'all 0.15s',
                    }}
                    onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                    onMouseOver={e => { if (selectedOrder?.id !== order.id) e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
                    onMouseOut={e => { if (selectedOrder?.id !== order.id) e.currentTarget.style.boxShadow = ''; }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.375rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{order.customer}</div>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>#{order.orderNum}</span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.375rem', display: 'flex', gap: '0.5rem' }}>
                      <span>🕐 {order.createdAt}</span>
                      <span>{order.type === 'dine-in' ? `🍽️ ${order.table}` : order.type === 'takeaway' ? '🥡 Takeaway' : '🚚 Delivery'}</span>
                    </div>
                    <div style={{ borderTop: '1px dashed var(--border)', paddingTop: '0.5rem', marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.125rem' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Order ({order.items.length})</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, color: '#16a34a' }}>${order.total.toFixed(2)}</span>
                      </div>
                      {order.items.slice(0, 2).map(item => (
                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{item.qty}x {item.name}</span>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>${(item.price * item.qty).toFixed(2)}</span>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 600, cursor: 'pointer' }}>See more ›</span>
                      )}
                    </div>
                    <StatusBadge status={order.status} size="sm" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* === MANAGE MENU TAB === */}
          {activeTab === 'menu' && (
            <div style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
              {/* Category sidebar */}
              <div style={{ width: '200px', flexShrink: 0, borderRight: '1px solid var(--border)', background: 'var(--sidebar-bg)', overflow: 'auto', padding: '0.75rem 0' }}>
                <div style={{ padding: '0 0.75rem 0.5rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>Dish Category</div>
                {dishCategories.map(cat => (
                  <button
                    key={cat.name}
                    onClick={() => setActiveDishCategory(cat.name)}
                    style={{
                      width: '100%', padding: '0.5rem 0.75rem',
                      background: activeDishCategory === cat.name ? 'rgba(22,163,74,0.08)' : 'transparent',
                      border: 'none',
                      borderLeft: `3px solid ${activeDishCategory === cat.name ? '#16a34a' : 'transparent'}`,
                      color: activeDishCategory === cat.name ? '#16a34a' : 'var(--text-secondary)',
                      fontWeight: activeDishCategory === cat.name ? 700 : 400,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      transition: 'all 0.1s',
                      textAlign: 'left',
                    }}
                  >
                    <span>{cat.name}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>{cat.count}</span>
                  </button>
                ))}
                <div style={{ padding: '0.75rem' }}>
                  <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', borderRadius: '0.625rem', fontSize: '0.75rem' }}>
                    + Add Category
                  </button>
                </div>
              </div>

              {/* Dish grid */}
              <div style={{ flex: 1, overflow: 'auto', padding: '1rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                    Effortlessly Manage Your Menu! 🍽️
                  </div>
                  <div style={{ position: 'relative', display: 'inline-block', width: '100%', maxWidth: '360px' }}>
                    <span style={{ position: 'absolute', left: '0.625rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.8rem' }}>🔍</span>
                    <input className="input-base" style={{ paddingLeft: '2rem' }} placeholder="Look up any dish you desire..." />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))', gap: '0.75rem' }}>
                  {/* Add new dish card */}
                  <div style={{
                    border: '2px dashed #16a34a',
                    borderRadius: '1rem',
                    padding: '1.5rem 1rem',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                    minHeight: '180px',
                    background: 'rgba(22,163,74,0.04)',
                    transition: 'background 0.15s',
                  }}
                    onMouseOver={e => e.currentTarget.style.background = 'rgba(22,163,74,0.1)'}
                    onMouseOut={e => e.currentTarget.style.background = 'rgba(22,163,74,0.04)'}
                  >
                    <div style={{
                      width: '2.5rem', height: '2.5rem', borderRadius: '9999px',
                      background: '#16a34a', color: 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.25rem', fontWeight: 700,
                    }}>+</div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#16a34a', textAlign: 'center' }}>Add New Dish</span>
                  </div>

                  {filteredMenu.map(item => (
                    <div key={item.id} className="card" style={{ padding: 0, overflow: 'hidden', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', zIndex: 1 }}>
                        <button style={{ background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '9999px', width: '1.5rem', height: '1.5rem', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>···</button>
                      </div>
                      {!item.available && (
                        <div style={{ position: 'absolute', top: '0.5rem', left: '0.5rem', zIndex: 1, background: '#ef4444', color: 'white', borderRadius: '9999px', padding: '0.1rem 0.375rem', fontSize: '0.6rem', fontWeight: 700 }}>Sold Out</div>
                      )}
                      <img src={item.photo} alt={item.name} style={{ width: '100%', height: '110px', objectFit: 'cover', display: 'block', background: '#e2e8f0' }} />
                      <div style={{ padding: '0.5rem' }}>
                        <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.125rem' }}>{item.name}</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#16a34a', fontSize: '0.85rem' }}>${item.price}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* === INVENTORY TAB === */}
          {activeTab === 'inventory' && (
            <div style={{ flex: 1, overflow: 'auto', padding: '1.25rem' }}>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>Inventory & Stock</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {[
                  { name: 'Chicken Breast', unit: 'kg', current: 2, threshold: 5, status: 'low' },
                  { name: 'Sesame Oil', unit: 'L', current: 0.5, threshold: 2, status: 'critical' },
                  { name: 'Coffee Beans (Arabica)', unit: 'kg', current: 8, threshold: 10, status: 'ok' },
                  { name: 'All-purpose Flour', unit: 'kg', current: 15, threshold: 20, status: 'ok' },
                  { name: 'Fresh Tomatoes', unit: 'kg', current: 3, threshold: 8, status: 'low' },
                  { name: 'Sparkling Water', unit: 'bottles', current: 24, threshold: 50, status: 'low' },
                ].map(item => (
                  <div key={item.name} className="card" style={{ padding: '0.875rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{item.name}</div>
                      <div className="progress-bar-bg" style={{ marginBottom: '0.25rem' }}>
                        <div className="progress-bar-fill" style={{ width: `${Math.min(100, (item.current / item.threshold) * 100)}%`, background: item.status === 'critical' ? '#ef4444' : item.status === 'low' ? '#f97316' : '#16a34a' }} />
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{item.current} {item.unit} remaining (min: {item.threshold} {item.unit})</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.375rem' }}>
                      <span style={{
                        padding: '0.2rem 0.5rem', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 700,
                        color: item.status === 'critical' ? '#ef4444' : item.status === 'low' ? '#f97316' : '#16a34a',
                        background: item.status === 'critical' ? 'rgba(239,68,68,0.1)' : item.status === 'low' ? 'rgba(249,115,22,0.1)' : 'rgba(22,163,74,0.1)',
                      }}>
                        {item.status === 'critical' ? '🚨 Critical' : item.status === 'low' ? '⚠️ Low' : '✓ OK'}
                      </span>
                      {item.status !== 'ok' && (
                        <button className="btn-primary" style={{ fontSize: '0.72rem', padding: '0.25rem 0.625rem' }}>Order Now</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* === STAFF TAB === */}
          {activeTab === 'staff' && (
            <div style={{ flex: 1, overflow: 'auto', padding: '1.25rem' }}>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>Staff Management</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {staffMembers.map(staff => (
                  <div key={staff.id} className="card" style={{ padding: '0.875rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '2.5rem', height: '2.5rem', borderRadius: '9999px',
                      background: 'linear-gradient(135deg, #16a34a, #4ade80)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontWeight: 700, fontSize: '0.8rem', flexShrink: 0,
                    }}>{staff.avatar}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.125rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{staff.name}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{staff.role} · Level {staff.level}</span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.375rem' }}>🕐 {staff.shift}</div>
                      <div className="progress-bar-bg" style={{ maxWidth: '200px' }}>
                        <div className="progress-bar-fill" style={{ width: `${staff.skillPoints}%` }} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.375rem' }}>
                      <span style={{
                        padding: '0.2rem 0.5rem', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 700,
                        color: staff.status === 'on-duty' ? '#16a34a' : staff.status === 'break' ? '#f97316' : '#64748b',
                        background: staff.status === 'on-duty' ? 'rgba(22,163,74,0.1)' : staff.status === 'break' ? 'rgba(249,115,22,0.1)' : 'rgba(100,116,139,0.1)',
                      }}>
                        {staff.status === 'on-duty' ? '● On Duty' : staff.status === 'break' ? '● Break' : '● Off'}
                      </span>
                      {staff.skillPoints >= 80 && (
                        <button className="btn-primary" style={{ fontSize: '0.72rem', padding: '0.25rem 0.625rem' }}>Approve Upskill</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* === AI INSIGHTS TAB === */}
          {activeTab === 'ai' && (
            <div style={{ flex: 1, overflow: 'auto', padding: '1.25rem' }}>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>🤖 AI Insights & Alerts</div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {[
                  { icon: '🚨', text: 'Order #1041 has been cooking for 18 min — exceeds 15 min threshold. Consider checking with kitchen staff.', color: '#ef4444', label: 'Alert' },
                  { icon: '📈', text: 'Pad Thai trending +23% this week. Consider adding a Pad Thai lunch special to boost lunchtime revenue.', color: '#16a34a', label: 'Insight' },
                  { icon: '⚠️', text: 'Chicken Breast stock critically low (2 kg). 3 active menu items affected. Recommend ordering 10 kg immediately.', color: '#f97316', label: 'Inventory' },
                  { icon: '💡', text: 'Delivery orders this week: +41%. Consider partnering with 1 more delivery platform to capture demand.', color: '#3b82f6', label: 'Opportunity' },
                  { icon: '📉', text: 'Tom Yum Soup sales dropped 18% this month. Consider refreshing recipe or running a 2-for-1 promo.', color: '#8b5cf6', label: 'Menu' },
                ].map((alert, i) => (
                  <div key={i} style={{ background: 'var(--card)', border: `1.5px solid ${alert.color}30`, borderLeft: `4px solid ${alert.color}`, borderRadius: '0.875rem', padding: '0.875rem', display: 'flex', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.25rem' }}>{alert.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: alert.color, marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{alert.label}</div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{alert.text}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Weekly Promo Suggestions</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.625rem' }}>
                {[
                  { title: 'Weekend Brunch Bundle', desc: 'Coffee + 2 items for ฿199. Expected +15% weekend morning revenue.' },
                  { title: 'Loyalty Wednesday', desc: 'Double points every Wednesday. Increase repeat visit rate.' },
                  { title: 'Delivery Free Sunday', desc: 'Free delivery on Sunday orders. Push delivery channel growth.' },
                ].map(promo => (
                  <div key={promo.title} style={{ background: 'rgba(22,163,74,0.06)', border: '1.5px solid rgba(22,163,74,0.2)', borderRadius: '0.875rem', padding: '0.875rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>🎟️ {promo.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.625rem' }}>{promo.desc}</div>
                    <button className="btn-primary" style={{ fontSize: '0.72rem', padding: '0.25rem 0.75rem' }}>Launch Promo</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* === QC TAB === */}
          {activeTab === 'qc' && (
            <div style={{ flex: 1, overflow: 'auto', padding: '1.25rem' }}>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>Quality Control Checklist</div>
              {[
                { order: '#1043', staff: 'Kai Chen', role: 'Barista', items: ['Cheese Burger', 'Salad with Sesame', 'Special Sandwich Grill'], checks: ['Presentation', 'Temperature', 'Portion size', 'Freshness'] },
                { order: '#1044', staff: 'Brian Cooper', role: 'Chef', items: ['Noodles with Chicken', 'Lemonade'], checks: ['Presentation', 'Temperature', 'Portion size'] },
              ].map(qc => (
                <div key={qc.order} className="card" style={{ padding: '1rem', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Order {qc.order}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Prepared by {qc.staff} ({qc.role})</div>
                    </div>
                    <button className="btn-primary" style={{ fontSize: '0.72rem', padding: '0.25rem 0.75rem' }}>Approve QC</button>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.625rem' }}>Items: {qc.items.join(', ')}</div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {qc.checks.map(check => (
                      <label key={check} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                        <input type="checkbox" style={{ accentColor: '#16a34a' }} />
                        {check}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Order detail panel */}
          {selectedOrder && activeTab === 'orders' && (
            <div style={{
              width: '340px', flexShrink: 0,
              background: 'var(--card)',
              borderLeft: '1px solid var(--border)',
              display: 'flex', flexDirection: 'column',
              overflow: 'hidden',
              animation: 'fadeIn 0.2s ease',
            }}>
              <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>Details</span>
                  <StatusBadge status={selectedOrder.status} size="sm" />
                </div>
                <button onClick={() => setSelectedOrder(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: 'var(--text-muted)', padding: '0.25rem' }}>✕</button>
              </div>

              <div style={{ flex: 1, overflow: 'auto', padding: '1rem' }}>
                {/* Order info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                  {[
                    { label: 'Name', value: selectedOrder.customer },
                    { label: 'Order ID', value: `#${selectedOrder.orderNum}` },
                    { label: 'Order Time', value: selectedOrder.createdAt },
                    { label: 'Order Type', value: selectedOrder.type === 'dine-in' ? `Dine In · ${selectedOrder.table}` : selectedOrder.type === 'takeaway' ? 'Take Away' : 'Delivery' },
                  ].map(row => (
                    <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>{row.label}</span>
                      <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{row.value}</span>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: '1px dashed var(--border)', paddingTop: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '0.625rem' }}>
                    List Item ({selectedOrder.items.length})
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                    {selectedOrder.items.map(item => (
                      <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                        <img src={item.photo} alt={item.name} style={{ width: '40px', height: '40px', borderRadius: '0.5rem', objectFit: 'cover', background: '#e2e8f0', flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>{item.qty}x {item.name}</div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 700, color: '#16a34a' }}>${item.price}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment summary */}
                <div style={{ background: 'var(--bg)', borderRadius: '0.75rem', padding: '0.875rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Payment Summary</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.8rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, color: 'var(--text-primary)' }}>${selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Tax (10%)</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, color: 'var(--text-primary)' }}>${selectedOrder.tax.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid var(--border)', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Total</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '1rem', color: '#16a34a' }}>${selectedOrder.total.toFixed(2)}</span>
                      {selectedOrder.status === 'completed' && (
                        <span style={{ background: '#16a34a', color: 'white', borderRadius: '9999px', padding: '0.15rem 0.5rem', fontSize: '0.65rem', fontWeight: 700 }}>PAID</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
