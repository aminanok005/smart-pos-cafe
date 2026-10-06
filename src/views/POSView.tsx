import { useState } from 'react';
import type { CSSProperties } from 'react';
import OrderLineBar from '../components/shared/OrderLineBar';
import Sidebar from '../components/shared/Sidebar';
import ThemeToggle from '../components/shared/ThemeToggle';
import { comboMeals, menuItems, menuCategories } from '../data/mockData';
import type { ComboMeal, Order, MenuItem } from '../data/mockData';

interface CartItem {
  item: MenuItem;
  qty: number;
}

interface POSViewProps {
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

type OrderType = 'dine-in' | 'takeaway' | 'delivery';
type PaymentMethod = 'cash' | 'card' | 'qr';

let orderCounter = 1045;

export default function POSView({ dark, onToggleDark, orders, onOrderComplete }: POSViewProps) {
  const [activeNav, setActiveNav] = useState('menu');
  const [activeCategory, setActiveCategory] = useState('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderType, setOrderType] = useState<OrderType>('dine-in');
  const [payment, setPayment] = useState<PaymentMethod>('card');
  const [tableNum, setTableNum] = useState('4');
  const [customerName, setCustomerName] = useState('William Defoe');
  const [showModal, setShowModal] = useState(false);
  const [confirmedOrderNum, setConfirmedOrderNum] = useState(0);
  const [search, setSearch] = useState('');

  const liveOrders = orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled');

  const filtered = menuItems.filter(item => {
    const catMatch = activeCategory === 'All' || item.category === activeCategory;
    const searchMatch = !search || item.name.toLowerCase().includes(search.toLowerCase());
    return catMatch && searchMatch;
  });

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(c => c.item.id === item.id);
      if (existing) return prev.map(c => c.item.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { item, qty: 1 }];
    });
  };

  const addComboToCart = (combo: ComboMeal) => {
    addToCart({
      id: combo.id,
      name: combo.name,
      price: combo.price,
      category: 'Combo',
      isVeg: false,
      photo: combo.photo,
      available: true,
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const existing = prev.find(c => c.item.id === itemId);
      if (existing && existing.qty > 1) return prev.map(c => c.item.id === itemId ? { ...c, qty: c.qty - 1 } : c);
      return prev.filter(c => c.item.id !== itemId);
    });
  };

  const cartQty = (itemId: string) => cart.find(c => c.item.id === itemId)?.qty ?? 0;

  const subtotal = cart.reduce((s, c) => s + c.item.price * c.qty, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;
    const num = orderCounter++;
    setConfirmedOrderNum(num);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setCart([]);
  };

  const payBtnStyle = (method: PaymentMethod): CSSProperties => ({
    flex: 1,
    padding: '0.625rem',
    border: `2px solid ${payment === method ? '#16a34a' : 'var(--border)'}`,
    borderRadius: '0.75rem',
    background: payment === method ? 'rgba(22,163,74,0.08)' : 'var(--card)',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.25rem',
    transition: 'all 0.15s',
  });

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* Sidebar */}
      <Sidebar items={sidebarItems} activeKey={activeNav} onSelect={setActiveNav} bottomItems={sidebarBottom} />

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minWidth: 0 }}>
        {/* Order line and menu */}
        <div style={{ flex: 1, minWidth: 0, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <OrderLineBar orders={liveOrders} role="pos" />

          {/* Content area */}
          <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', alignItems: 'stretch' }}>
            {/* Menu zone */}
            <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.875rem', minWidth: 0 }}>
            {/* Greeting + Search */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                  Let's make it a great day! 🌿
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{dateStr}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '0.625rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>🔍</span>
                  <input
                    className="input-base"
                    style={{ paddingLeft: '2rem', width: '200px' }}
                    placeholder="Search menu..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{
                    width: '2rem', height: '2rem', borderRadius: '9999px',
                    background: '#16a34a', color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', fontWeight: 700, flexShrink: 0,
                  }}>SL</div>
                  <div style={{ lineHeight: 1.3 }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>Stephany</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Cashier</div>
                  </div>
                </div>
                <ThemeToggle dark={dark} onToggle={onToggleDark} />
              </div>
            </div>

            {/* Category tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '2px' }}>
              {menuCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    flexShrink: 0,
                    padding: '0.5rem 1rem',
                    borderRadius: '9999px',
                    border: 'none',
                    background: activeCategory === cat ? '#16a34a' : 'var(--card)',
                    color: activeCategory === cat ? 'white' : 'var(--text-secondary)',
                    fontWeight: activeCategory === cat ? 700 : 500,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    boxShadow: activeCategory === cat ? '0 2px 8px rgba(22,163,74,0.3)' : 'var(--shadow-card)',
                    transition: 'all 0.15s',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Combo deals */}
            {activeCategory === 'All' && !search && (
              <section>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.625rem' }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>Combo deals</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Popular bundles, ready in one tap</div>
                  </div>
                  <span style={{ color: '#f97316', fontSize: '0.7rem', fontWeight: 700 }}>Limited-time offers</span>
                </div>
                <div style={{ display: 'grid', gridAutoFlow: 'column', gridAutoColumns: 'minmax(270px, 1fr)', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
                  {comboMeals.map(combo => (
                    <div
                      key={combo.id}
                      style={{
                        position: 'relative',
                        minHeight: '138px',
                        borderRadius: '1rem',
                        overflow: 'hidden',
                        isolation: 'isolate',
                        boxShadow: 'var(--shadow-card)',
                        border: '1px solid rgba(255,255,255,0.14)',
                      }}
                    >
                      <img src={combo.photo} alt={`${combo.name} combo`} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: -2 }} />
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        zIndex: -1,
                        background: combo.tone === 'green'
                          ? 'linear-gradient(90deg, rgba(6,78,59,0.98) 0%, rgba(6,78,59,0.78) 52%, rgba(6,78,59,0.2) 100%)'
                          : combo.tone === 'red'
                            ? 'linear-gradient(90deg, rgba(127,29,29,0.98) 0%, rgba(194,65,12,0.74) 55%, rgba(127,29,29,0.18) 100%)'
                            : 'linear-gradient(90deg, rgba(194,65,12,0.98) 0%, rgba(234,88,12,0.72) 55%, rgba(194,65,12,0.16) 100%)',
                      }} />
                      <div style={{ padding: '0.875rem 4.5rem 0.875rem 1rem', color: 'white' }}>
                        <span style={{ display: 'inline-flex', background: 'white', color: '#0f172a', borderRadius: '0.35rem', padding: '0.18rem 0.45rem', fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase' }}>
                          {combo.eyebrow}
                        </span>
                        <div style={{ fontSize: '1rem', fontWeight: 800, marginTop: '0.45rem' }}>{combo.name}</div>
                        <div style={{ fontSize: '0.68rem', opacity: 0.82, marginTop: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{combo.description}</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', fontWeight: 800, marginTop: '0.55rem' }}>${combo.price.toFixed(2)}</div>
                      </div>
                      <button
                        onClick={() => addComboToCart(combo)}
                        aria-label={`Add ${combo.name} to order`}
                        style={{
                          position: 'absolute', right: '0.875rem', bottom: '0.875rem',
                          width: '2.5rem', height: '2.5rem', borderRadius: '9999px',
                          border: '1px solid rgba(255,255,255,0.35)',
                          background: '#16a34a', color: 'white', fontSize: '1.35rem',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.24)',
                        }}
                      >
                        +
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Product grid */}
            <section>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.625rem' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>
                    {activeCategory === 'All' ? 'Recommended menu' : activeCategory}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {search ? `Results for “${search}”` : 'Customer favorites, picked for this shift'}
                  </div>
                </div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>{filtered.length} items</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '0.75rem' }}>
              {filtered.map(item => {
                const qty = cartQty(item.id);
                const inCart = qty > 0;
                return (
                  <div
                    key={item.id}
                    className="card"
                    style={{
                      padding: '0',
                      overflow: 'hidden',
                      minHeight: '218px',
                      border: inCart ? '2px solid #16a34a' : '1px solid var(--border)',
                      position: 'relative',
                      background: '#111827',
                      transition: 'border 0.15s, transform 0.15s',
                    }}
                  >
                    {(item.bestseller || item.discount) && (
                      <div style={{
                        position: 'absolute', top: '0.5rem', left: '0.5rem',
                        background: item.bestseller ? '#a3e635' : '#f97316',
                        color: item.bestseller ? '#1a2e05' : 'white',
                        borderRadius: '0.35rem', padding: '0.18rem 0.5rem',
                        fontSize: '0.65rem', fontWeight: 700, zIndex: 1,
                        textTransform: 'uppercase',
                      }}>
                        {item.bestseller ? 'Bestseller' : `${item.discount}% Off`}
                      </div>
                    )}
                    {!item.available && (
                      <div style={{
                        position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)',
                        zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        borderRadius: 'inherit',
                      }}>
                        <span style={{ color: 'white', fontWeight: 700, fontSize: '0.8rem', background: 'rgba(0,0,0,0.6)', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>Sold Out</span>
                      </div>
                    )}
                    <img
                      src={item.photo}
                      alt={item.name}
                      style={{ width: '100%', height: '145px', objectFit: 'cover', display: 'block', background: 'var(--bg-subtle)' }}
                    />
                    <div style={{ padding: '0.7rem 0.75rem 0.75rem', marginTop: '-0.7rem', position: 'relative', borderRadius: '0.75rem 0.75rem 0 0', background: 'rgba(8,12,18,0.97)', color: 'white' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.8rem', color: 'white', marginBottom: '0.25rem', lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginBottom: '0.55rem' }}>
                        {item.calories ? `${item.calories} kcal` : item.isVeg ? 'Freshly prepared' : 'Made to order'} · {item.prepMinutes ?? 10} min
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#4ade80', fontSize: '0.875rem' }}>
                          ${item.price.toFixed(2)}
                        </span>
                      {inCart ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            style={{ ...stepperBtn, background: '#252b35', borderColor: '#374151', color: 'white' }}
                          >−</button>
                          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.9rem', color: 'white' }}>{qty}</span>
                          <button
                            onClick={() => addToCart(item)}
                            style={{ ...stepperBtn, background: '#16a34a', color: 'white' }}
                          >+</button>
                        </div>
                      ) : (
                        <button
                          onClick={() => item.available && addToCart(item)}
                          disabled={!item.available}
                          aria-label={`Add ${item.name} to order`}
                          style={{
                            width: '2rem',
                            height: '2rem',
                            background: item.available ? '#16a34a' : '#334155',
                            color: item.available ? 'white' : '#94a3b8',
                            border: 'none',
                            borderRadius: '9999px',
                            fontSize: '1.1rem',
                            fontWeight: 500,
                            cursor: item.available ? 'pointer' : 'not-allowed',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          +
                        </button>
                      )}
                      </div>
                    </div>
                  </div>
                );
              })}
              </div>
            </section>
            </div>
            </div>
          </div>

        {/* Right order panel */}
        <div style={{
          width: '360px',
          flexShrink: 0,
          background: 'var(--card)',
          borderLeft: '2px solid #16a34a',
          borderRadius: '1rem 0 0 1rem',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          minHeight: 0,
          alignSelf: 'stretch',
          position: 'relative',
          zIndex: 45,
        }}>
            {/* Table header */}
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--text-primary)' }}>Table {tableNum}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{customerName}</div>
                </div>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}>✏️</button>
              </div>
              {/* Order type tabs */}
              <div style={{ display: 'flex', gap: '0.375rem', marginTop: '0.75rem' }}>
                {(['dine-in', 'takeaway', 'delivery'] as OrderType[]).map(t => (
                  <button
                    key={t}
                    onClick={() => setOrderType(t)}
                    style={{
                      flex: 1, padding: '0.375rem', borderRadius: '9999px',
                      border: `1.5px solid ${orderType === t ? '#16a34a' : 'var(--border)'}`,
                      background: orderType === t ? '#16a34a' : 'transparent',
                      color: orderType === t ? 'white' : 'var(--text-secondary)',
                      fontWeight: 600, fontSize: '0.72rem', cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {t === 'dine-in' ? 'Dine In' : t === 'takeaway' ? 'Take Away' : 'Delivery'}
                  </button>
                ))}
              </div>
            </div>

            {/* Customer inputs */}
            <div style={{ padding: '0.875rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem', display: 'block' }}>Customer Name</label>
                <input className="input-base" value={customerName} onChange={e => setCustomerName(e.target.value)} style={{ fontSize: '0.8rem' }} />
              </div>
              {orderType === 'dine-in' && (
                <div style={{ width: '70px' }}>
                  <label style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem', display: 'block' }}>Table #</label>
                  <input className="input-base" value={tableNum} onChange={e => setTableNum(e.target.value)} style={{ fontSize: '0.8rem' }} />
                </div>
              )}
            </div>

            {/* Cart items */}
            <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: '0.875rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {cart.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: '0.5rem', color: 'var(--text-muted)' }}>
                  <span style={{ fontSize: '2rem' }}>🛒</span>
                  <span style={{ fontSize: '0.85rem' }}>Cart is empty</span>
                  <span style={{ fontSize: '0.75rem' }}>Add items from the menu</span>
                </div>
              ) : (
                cart.map(({ item, qty }) => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <img src={item.photo} alt={item.name} style={{ width: '40px', height: '40px', borderRadius: '0.5rem', objectFit: 'cover', background: '#e2e8f0', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>${item.price.toFixed(2)} × {qty}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <button onClick={() => removeFromCart(item.id)} style={miniBtn}>−</button>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.85rem', minWidth: '1.25rem', textAlign: 'center' }}>{qty}</span>
                      <button onClick={() => addToCart(item)} style={{ ...miniBtn, background: '#16a34a', color: 'white', borderColor: '#16a34a' }}>+</button>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.85rem', color: '#16a34a', minWidth: '3rem', textAlign: 'right' }}>
                      ${(item.price * qty).toFixed(2)}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Totals */}
            {cart.length > 0 && (
              <div style={{ padding: '0.875rem 1.25rem', borderTop: '1px dashed var(--border)', flexShrink: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sub Total</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>${subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.625rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tax 10%</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>${tax.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid var(--border)' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>Total Amount</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '1.1rem', color: '#16a34a' }}>${total.toFixed(2)}</span>
                </div>
              </div>
            )}

            {/* Payment */}
            <div style={{ padding: '0.75rem 1.25rem', borderTop: '1px solid var(--border)', flexShrink: 0, background: 'var(--card)' }}>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <button onClick={() => setPayment('cash')} style={payBtnStyle('cash')}>
                  <span style={{ fontSize: '1.1rem' }}>💵</span>
                  <span style={{ fontSize: '0.7rem', fontWeight: 600, color: payment === 'cash' ? '#16a34a' : 'var(--text-secondary)' }}>Cash</span>
                </button>
                <button onClick={() => setPayment('card')} style={payBtnStyle('card')}>
                  <span style={{ fontSize: '1.1rem' }}>💳</span>
                  <span style={{ fontSize: '0.7rem', fontWeight: 600, color: payment === 'card' ? '#16a34a' : 'var(--text-secondary)' }}>Card</span>
                </button>
                <button onClick={() => setPayment('qr')} style={payBtnStyle('qr')}>
                  <span style={{ fontSize: '1.1rem' }}>📱</span>
                  <span style={{ fontSize: '0.7rem', fontWeight: 600, color: payment === 'qr' ? '#16a34a' : 'var(--text-secondary)' }}>QR Code</span>
                </button>
              </div>
              <button
                onClick={handlePlaceOrder}
                disabled={cart.length === 0}
                style={{
                  width: '100%',
                  background: cart.length > 0 ? '#16a34a' : 'var(--bg)',
                  color: cart.length > 0 ? 'white' : 'var(--text-muted)',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '0.875rem',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: cart.length > 0 ? 'pointer' : 'not-allowed',
                  transition: 'all 0.15s',
                  boxShadow: cart.length > 0 ? '0 4px 12px rgba(22,163,74,0.35)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                Place Order
              </button>
              <div style={{ marginTop: '0.5rem', color: 'var(--text-muted)', fontSize: '0.68rem', lineHeight: 1.45, textAlign: 'center' }}>
                <span style={{ display: 'block' }}>Order details are sent to the kitchen instantly.</span>
                <span style={{ display: 'block' }}>Payment uses the method selected above.</span>
              </div>
            </div>
        </div>
      </div>

      {/* Order confirmation modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div className="card" style={{ padding: '2rem', textAlign: 'center', maxWidth: '320px', width: '90%', animation: 'fadeIn 0.25s ease' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🎉</div>
            <div style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Order Confirmed!</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '4rem', fontWeight: 800, color: '#16a34a', lineHeight: 1, marginBottom: '0.5rem' }}>
              #{confirmedOrderNum}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Queue number sent to display. Customer will be notified when ready.
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(22,163,74,0.08)', borderRadius: '0.75rem', padding: '0.75rem', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '1.25rem' }}>🔔</span>
              <div style={{ textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Auto-assigned to kitchen</div>
                AI Engine routed to Chef Brian (available, +skill match)
              </div>
            </div>
            <button className="btn-primary" onClick={handleModalClose} style={{ width: '100%', justifyContent: 'center', borderRadius: '0.75rem', padding: '0.75rem' }}>
              Done — New Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const stepperBtn: CSSProperties = {
  width: '1.75rem',
  height: '1.75rem',
  borderRadius: '9999px',
  border: '1.5px solid var(--border)',
  background: 'var(--card)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 700,
  fontSize: '1rem',
  color: 'var(--text-primary)',
};

const miniBtn: CSSProperties = {
  width: '1.5rem',
  height: '1.5rem',
  borderRadius: '9999px',
  border: '1.5px solid var(--border)',
  background: 'var(--card)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 700,
  fontSize: '0.875rem',
  color: 'var(--text-primary)',
};
