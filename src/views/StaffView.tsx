import { useState, useEffect } from 'react';
import OrderLineBar from '../components/shared/OrderLineBar';
import ThemeToggle from '../components/shared/ThemeToggle';
import { staffTimeline, staffMembers } from '../data/mockData';
import type { Order } from '../data/mockData';

interface StaffViewProps {
  dark: boolean;
  onToggleDark: () => void;
  orders: Order[];
  onOrderComplete: (orderId: string) => void;
}

const timelineColors: Record<string, { bg: string; color: string; icon: string }> = {
  order: { bg: 'rgba(22,163,74,0.12)', color: '#16a34a', icon: '🍽️' },
  cooking: { bg: 'rgba(249,115,22,0.12)', color: '#f97316', icon: '👨‍🍳' },
  break: { bg: 'rgba(59,130,246,0.12)', color: '#3b82f6', icon: '☕' },
  training: { bg: 'rgba(139,92,246,0.12)', color: '#8b5cf6', icon: '📚' },
  setup: { bg: 'rgba(100,116,139,0.12)', color: '#64748b', icon: '🔧' },
};

let nextOrderNum = 1045;

export default function StaffView({ dark, onToggleDark, orders, onOrderComplete }: StaffViewProps) {
  const [clockedIn, setClockedIn] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeline, setTimeline] = useState(staffTimeline);
  const [completedCount, setCompletedCount] = useState(4);
  const [toastMsg, setToastMsg] = useState('');
  const [currentTaskIdx, setCurrentTaskIdx] = useState(5);

  const staff = staffMembers[0]; // Kai Chen

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const handleItsDone = () => {
    setTimeline(prev => prev.map((t, i) => i === currentTaskIdx ? { ...t, done: true } : t));
    setCompletedCount(c => c + 1);
    const assignedNum = nextOrderNum++;
    showToast(`✓ Task done! AI assigned Order #${assignedNum} to you → Push notification sent 📲`);
    setCurrentTaskIdx(c => Math.min(c + 1, timeline.length - 1));
    // Mark the first cooking order complete
    const cookingOrder = orders.find(o => o.status === 'cooking');
    if (cookingOrder) onOrderComplete(cookingOrder.id);
  };

  const myOrders = orders.filter(o => o.assignedTo === 'Kai Chen' || o.status === 'cooking' || o.status === 'new').slice(0, 5);
  const currentTask = timeline[currentTaskIdx];

  const timeStr = currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  const dateStr = currentTime.toLocaleDateString('en-US', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' });

  if (!clockedIn) {
    return (
      <div style={{
        minHeight: '100%',
        background: dark ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' : 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 60%, #bbf7d0 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        position: 'relative',
      }}>
        {/* Theme toggle */}
        <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
          <ThemeToggle dark={dark} onToggle={onToggleDark} />
        </div>

        {/* Blurred food bg cards */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', opacity: 0.15, pointerEvents: 'none' }}>
          {[
            { src: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop', pos: { top: '5%', left: '2%' } },
            { src: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=200&fit=crop', pos: { bottom: '10%', right: '5%' } },
            { src: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=200&h=200&fit=crop', pos: { top: '40%', right: '10%' } },
          ].map((item, i) => (
            <img key={i} src={item.src} alt="" style={{ position: 'absolute', width: '140px', height: '140px', borderRadius: '1rem', objectFit: 'cover', filter: 'blur(4px)', ...item.pos }} />
          ))}
        </div>

        <div className="card" style={{ maxWidth: '360px', width: '100%', padding: '2rem', textAlign: 'center', position: 'relative' }}>
          {/* Avatar */}
          <div style={{
            width: '80px', height: '80px', borderRadius: '9999px',
            background: 'linear-gradient(135deg, #16a34a, #4ade80)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem',
            fontSize: '1.75rem', color: 'white', fontWeight: 700,
            boxShadow: '0 4px 16px rgba(22,163,74,0.35)',
          }}>
            KC
          </div>

          <div style={{ fontWeight: 800, fontSize: '1.35rem', color: 'var(--text-primary)', marginBottom: '0.375rem' }}>
            Welcome, Kai Chen! 👋
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            Ready to clock in and start your shift? Let's make today great!
          </div>

          {/* Clock display */}
          <div style={{
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            borderRadius: '1rem',
            padding: '1.25rem',
            marginBottom: '1.5rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', justifyContent: 'center', marginBottom: '0.5rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '9999px', background: '#ef4444', display: 'inline-block' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#ef4444' }}>Status: Clock Out</span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2.75rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>
              {timeStr}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.375rem' }}>{dateStr}</div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn-ghost" style={{ flex: 1 }} onClick={() => setClockedIn(true)}>Later</button>
            <button className="btn-primary" style={{ flex: 2, justifyContent: 'center', borderRadius: '0.75rem', padding: '0.75rem' }} onClick={() => setClockedIn(true)}>
              Clock In Now ✓
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg)', position: 'relative' }}>
      {/* Top bar */}
      <div style={{ background: 'var(--card)', borderBottom: '1px solid var(--border)', padding: '0.875rem 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{
              width: '2.25rem', height: '2.25rem', borderRadius: '9999px',
              background: 'linear-gradient(135deg, #16a34a, #4ade80)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 700, fontSize: '0.75rem',
            }}>KC</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Good morning, Kai 🌿</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{dateStr}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              background: 'rgba(22,163,74,0.1)', color: '#16a34a',
              borderRadius: '9999px', padding: '0.25rem 0.625rem',
              fontSize: '0.7rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem',
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '9999px', background: '#16a34a', display: 'inline-block' }} />
              On Duty
            </div>
            <ThemeToggle dark={dark} onToggle={onToggleDark} />
          </div>
        </div>
      </div>

      {/* Order Line */}
      <OrderLineBar orders={myOrders} role="staff" onAction={() => handleItsDone()} />

      {/* Scrollable content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Current task card */}
        {currentTask && (
          <div style={{
            background: 'var(--card)',
            border: '2px solid #16a34a',
            borderRadius: '1rem',
            padding: '1rem',
            boxShadow: '0 4px 12px rgba(22,163,74,0.15)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)' }}>Current Task</span>
              <span style={{
                background: '#a3e635', color: '#1a2e05',
                borderRadius: '9999px', padding: '0.15rem 0.625rem',
                fontSize: '0.7rem', fontWeight: 700,
              }}>
                {timelineColors[currentTask.type]?.icon} {currentTask.type}
              </span>
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{currentTask.task}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.875rem' }}>
              🕐 Started at {currentTask.time} · {completedCount} tasks completed today
            </div>
            <button
              onClick={handleItsDone}
              style={{
                width: '100%',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '9999px',
                padding: '0.75rem',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(59,130,246,0.3)',
                transition: 'transform 0.1s',
              }}
              onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
              onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              It's Done ✓
            </button>
          </div>
        )}

        {/* Timeline */}
        <div className="card" style={{ padding: '1rem' }}>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Today's Schedule</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>{dateStr.split(',')[0]}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {timeline.map((slot, i) => {
              const c = timelineColors[slot.type] || timelineColors.setup;
              const isCurrent = i === currentTaskIdx;
              return (
                <div key={i} style={{ display: 'flex', gap: '0.75rem', position: 'relative' }}>
                  {/* Time */}
                  <div style={{ width: '48px', flexShrink: 0, textAlign: 'right' }}>
                    <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', lineHeight: '2.25rem' }}>{slot.time}</span>
                  </div>
                  {/* Timeline line + dot */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '16px', flexShrink: 0 }}>
                    <div style={{
                      width: '12px', height: '12px', borderRadius: '9999px',
                      background: slot.done ? '#16a34a' : isCurrent ? '#f97316' : 'var(--border)',
                      border: isCurrent ? '2px solid #f97316' : 'none',
                      flexShrink: 0, zIndex: 1,
                      marginTop: '0.7rem',
                    }} />
                    {i < timeline.length - 1 && (
                      <div style={{ width: '2px', flex: 1, background: slot.done ? '#16a34a' : 'var(--border)', minHeight: '20px' }} />
                    )}
                  </div>
                  {/* Task block */}
                  <div style={{ flex: 1, paddingBottom: '0.375rem', paddingTop: '0.375rem' }}>
                    <div style={{
                      background: isCurrent ? c.bg : slot.done ? 'transparent' : 'var(--bg)',
                      border: `1px solid ${isCurrent ? c.color : 'var(--border)'}`,
                      borderRadius: '0.625rem',
                      padding: '0.4rem 0.625rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      opacity: slot.done ? 0.6 : 1,
                    }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: isCurrent ? 700 : 500, color: isCurrent ? c.color : 'var(--text-primary)' }}>
                        {c.icon} {slot.task}
                      </span>
                      {slot.done && <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700 }}>✓</span>}
                      {isCurrent && <span style={{ fontSize: '0.65rem', color: c.color, fontWeight: 700, background: c.bg, padding: '0.1rem 0.35rem', borderRadius: '9999px' }}>Now</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Suggest */}
        <div style={{
          background: 'var(--card)',
          border: '1.5px solid #16a34a',
          borderRadius: '1rem',
          padding: '1rem',
          display: 'flex',
          gap: '0.75rem',
        }}>
          <div style={{
            width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem',
            background: 'rgba(22,163,74,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.2rem', flexShrink: 0,
          }}>✨</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#16a34a', marginBottom: '0.25rem' }}>AI Coach</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              You're 28% away from Barista Level 4! Practice <strong>Latte Art pour technique</strong> during your next training slot to unlock it — Level 4 comes with a ฿500/month raise.
            </div>
          </div>
        </div>

        {/* Skill profile */}
        <div className="card" style={{ padding: '1rem' }}>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>Skill Profile</div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{
              width: '3rem', height: '3rem', borderRadius: '9999px',
              background: 'linear-gradient(135deg, #16a34a, #4ade80)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 800, fontSize: '1rem',
            }}>3</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '0.125rem' }}>Barista Level 3</div>
              <div className="progress-bar-bg" style={{ marginBottom: '0.25rem' }}>
                <div className="progress-bar-fill" style={{ width: `${staff.skillPoints}%` }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{staff.skillPoints} / {staff.skillMax} XP</span>
                <span style={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: 600 }}>→ Level 4 unlocks ฿500 raise</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem' }}>
            {[
              { label: 'Speed', value: staff.speed, icon: '⚡' },
              { label: 'Accuracy', value: staff.accuracy, icon: '🎯' },
              { label: 'Orders Done Today', value: completedCount, icon: '✅', isCount: true },
              { label: 'Shift Hours', value: 4, icon: '🕐', isCount: true, suffix: 'h' },
            ].map(stat => (
              <div key={stat.label} style={{ background: 'var(--bg)', borderRadius: '0.75rem', padding: '0.625rem' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{stat.icon} {stat.label}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                  {stat.value}{stat.isCount ? (stat.suffix || '') : '%'}
                </div>
                {!stat.isCount && (
                  <div className="progress-bar-bg" style={{ marginTop: '0.375rem', height: '4px' }}>
                    <div className="progress-bar-fill" style={{ width: `${stat.value}%`, height: '100%' }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toastMsg && <div className="toast">{toastMsg}</div>}
    </div>
  );
}
