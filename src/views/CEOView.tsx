import { useState } from 'react';
import KPICard from '../components/shared/KPICard';
import ThemeToggle from '../components/shared/ThemeToggle';
import { monthlyRevenue, branches, recentActivity, predictiveWeekly } from '../data/mockData';
import type { Order } from '../data/mockData';

interface CEOViewProps {
  dark: boolean;
  onToggleDark: () => void;
  orders: Order[];
}

type PredictTab = '1W' | '1M' | '1Y';

const activityIcons: Record<string, string> = {
  order: '📋',
  staff: '👤',
  status: '🔔',
  inventory: '📦',
  cancel: '❌',
  report: '📊',
};

function RevenueChart({ data, dark }: { data: typeof monthlyRevenue; dark: boolean }) {
  const maxVal = Math.max(...data.map(d => d.revenue));
  const w = 580;
  const h = 200;
  const pad = { top: 20, right: 16, bottom: 40, left: 56 };
  const innerW = w - pad.left - pad.right;
  const innerH = h - pad.top - pad.bottom;
  const barW = innerW / data.length;
  const barGap = barW * 0.2;

  const yTicks = [0, 100000, 200000, 300000];

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
      {/* Y grid + labels */}
      {yTicks.map(tick => {
        const y = pad.top + innerH - (tick / maxVal) * innerH;
        return (
          <g key={tick}>
            <line x1={pad.left} y1={y} x2={pad.left + innerW} y2={y} stroke={dark ? '#334155' : '#e2e8f0'} strokeWidth="1" />
            <text x={pad.left - 8} y={y + 4} textAnchor="end" fontSize="10" fill={dark ? '#64748b' : '#94a3b8'}>
              {tick === 0 ? '0' : `${tick / 1000}k`}
            </text>
          </g>
        );
      })}

      {/* Bars */}
      {data.map((d, i) => {
        const x = pad.left + i * barW + barGap / 2;
        const revH = (d.revenue / maxVal) * innerH;
        const expH = (d.expenses / maxVal) * innerH;
        const revY = pad.top + innerH - revH;
        const expY = pad.top + innerH - expH;
        const bw = (barW - barGap) / 2 - 2;

        return (
          <g key={d.month}>
            {/* Revenue bar */}
            <rect x={x} y={revY} width={bw} height={revH} rx="3" fill="#16a34a" opacity="0.85" />
            {/* Expense bar */}
            <rect x={x + bw + 2} y={expY} width={bw} height={expH} rx="3" fill={dark ? '#334155' : '#cbd5e1'} />
            {/* X label */}
            <text x={x + bw} y={h - 8} textAnchor="middle" fontSize="10" fill={dark ? '#64748b' : '#94a3b8'}>{d.month}</text>
          </g>
        );
      })}

      {/* Profit line */}
      {(() => {
        const points = data.map((d, i) => {
          const profit = d.revenue - d.expenses;
          const x = pad.left + i * barW + barW / 2;
          const y = pad.top + innerH - (profit / maxVal) * innerH;
          return `${x},${y}`;
        }).join(' ');
        return (
          <polyline
            points={points}
            fill="none"
            stroke="#a3e635"
            strokeWidth="2"
            strokeDasharray="4,2"
          />
        );
      })()}

      {/* Legend */}
      <rect x={pad.left} y={h - 16} width="10" height="10" rx="2" fill="#16a34a" />
      <text x={pad.left + 14} y={h - 7} fontSize="10" fill={dark ? '#94a3b8' : '#64748b'}>Revenue</text>
      <rect x={pad.left + 75} y={h - 16} width="10" height="10" rx="2" fill={dark ? '#334155' : '#cbd5e1'} />
      <text x={pad.left + 89} y={h - 7} fontSize="10" fill={dark ? '#94a3b8' : '#64748b'}>Expenses</text>
      <line x1={pad.left + 155} y1={h - 11} x2={pad.left + 170} y2={h - 11} stroke="#a3e635" strokeWidth="2" strokeDasharray="4,2" />
      <text x={pad.left + 174} y={h - 7} fontSize="10" fill={dark ? '#94a3b8' : '#64748b'}>Profit</text>
    </svg>
  );
}

function PredictiveChart({ tab, dark }: { tab: PredictTab; dark: boolean }) {
  const data = tab === '1W' ? predictiveWeekly : tab === '1M' ? [
    { day: 'Week 1', actual: 318000, forecast: null },
    { day: 'Week 2', actual: 305000, forecast: null },
    { day: 'Week 3', actual: 328000, forecast: null },
    { day: 'Week 4', actual: null, forecast: 342000 },
  ] : [
    { day: 'Q1', actual: 780000, forecast: null },
    { day: 'Q2', actual: 905000, forecast: null },
    { day: 'Q3', actual: null, forecast: 950000 },
    { day: 'Q4', actual: null, forecast: 1020000 },
  ];

  const maxVal = Math.max(...data.map(d => d.actual ?? d.forecast ?? 0));
  const w = 520;
  const h = 160;
  const pad = { top: 16, right: 16, bottom: 32, left: 50 };
  const innerW = w - pad.left - pad.right;
  const innerH = h - pad.top - pad.bottom;
  const step = innerW / (data.length - 1);

  const getY = (val: number | null) => val != null ? pad.top + innerH - (val / maxVal) * innerH : null;

  const actualPoints = data.map((d, i) => d.actual != null ? { x: pad.left + i * step, y: getY(d.actual)! } : null).filter(Boolean) as { x: number; y: number }[];
  const forecastPoints = data.map((d, i) => {
    const v = d.actual ?? d.forecast;
    if (d.forecast != null || (d.actual != null && i === actualPoints.length - 1)) {
      return { x: pad.left + i * step, y: getY(v)! };
    }
    return null;
  }).filter(Boolean) as { x: number; y: number }[];

  const toPath = (pts: { x: number; y: number }[]) => pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const toArea = (pts: { x: number; y: number }[]) => {
    if (pts.length < 2) return '';
    return `${toPath(pts)} L${pts[pts.length - 1].x},${pad.top + innerH} L${pts[0].x},${pad.top + innerH} Z`;
  };

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#16a34a" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#16a34a" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a3e635" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#a3e635" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Grid */}
      {[0, 0.5, 1].map(pct => {
        const y = pad.top + innerH * (1 - pct);
        return <line key={pct} x1={pad.left} y1={y} x2={pad.left + innerW} y2={y} stroke={dark ? '#334155' : '#e2e8f0'} strokeWidth="1" />;
      })}

      {/* Area fills */}
      {actualPoints.length > 1 && <path d={toArea(actualPoints)} fill="url(#areaGrad)" />}
      {forecastPoints.length > 1 && <path d={toArea(forecastPoints)} fill="url(#forecastGrad)" />}

      {/* Lines */}
      {actualPoints.length > 1 && <path d={toPath(actualPoints)} fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}
      {forecastPoints.length > 1 && <path d={toPath(forecastPoints)} fill="none" stroke="#a3e635" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5,3" />}

      {/* Dots */}
      {actualPoints.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="#16a34a" stroke="white" strokeWidth="1.5" />)}
      {data.map((d, i) => d.forecast != null ? <circle key={i} cx={pad.left + i * step} cy={getY(d.forecast)!} r="3.5" fill="#a3e635" stroke="white" strokeWidth="1.5" /> : null)}

      {/* X labels */}
      {data.map((d, i) => (
        <text key={i} x={pad.left + i * step} y={h - 6} textAnchor="middle" fontSize="10" fill={dark ? '#64748b' : '#94a3b8'}>{d.day}</text>
      ))}
    </svg>
  );
}

export default function CEOView({ dark, onToggleDark }: CEOViewProps) {
  const [predictTab, setPredictTab] = useState<PredictTab>('1W');

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  const totalRevenue = monthlyRevenue.reduce((s, m) => s + m.revenue, 0);
  const totalExpenses = monthlyRevenue.reduce((s, m) => s + m.expenses, 0);
  const netProfit = totalRevenue - totalExpenses;

  return (
    <div style={{ height: '100%', overflow: 'auto', background: 'var(--bg)' }}>
      {/* Top bar */}
      <div style={{
        background: 'var(--card)',
        borderBottom: '1px solid var(--border)',
        padding: '1rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 30,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div style={{
            width: '2.5rem', height: '2.5rem', borderRadius: '9999px',
            background: 'linear-gradient(135deg, #16a34a, #4ade80)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 700, fontSize: '0.8rem',
          }}>SS</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
              {greeting}, Sarun. 🌿
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{dateStr}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.375rem' }}>
            {(['1D', '1W', '1M', '1Y'] as const).map(p => (
              <button key={p} style={{
                padding: '0.3rem 0.625rem',
                borderRadius: '9999px',
                border: `1px solid var(--border)`,
                background: p === '1M' ? '#16a34a' : 'transparent',
                color: p === '1M' ? 'white' : 'var(--text-secondary)',
                fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
              }}>{p}</button>
            ))}
          </div>
          <ThemeToggle dark={dark} onToggle={onToggleDark} />
        </div>
      </div>

      <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
          <KPICard title="Total Revenue" value={`฿${(totalRevenue / 1000000).toFixed(2)}M`} delta={8.3} icon="💰" color="#16a34a" />
          <KPICard title="Net Profit" value={`฿${(netProfit / 1000).toFixed(0)}K`} delta={5.1} icon="📈" color="#3b82f6" />
          <KPICard title="Total Orders" value="4,821" delta={12.0} icon="📋" color="#f97316" />
          <KPICard title="New Customers" value="847" delta={3.2} icon="👥" color="#8b5cf6" />
          <KPICard title="Avg Order Value" value="฿342" delta={-1.8} icon="🧾" color="#ef4444" />
          <KPICard title="Customer Return Rate" value="68%" delta={4.5} icon="🔄" color="#16a34a" />
        </div>

        {/* Revenue Chart + AI Summary side by side */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '0.75rem', alignItems: 'start' }}>
          {/* Revenue chart */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>Revenue & Expenses</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>12-month overview</div>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '1.25rem', color: '#16a34a' }}>
                ฿{(totalRevenue / 1000000).toFixed(2)}M
              </div>
            </div>
            <RevenueChart data={monthlyRevenue} dark={dark} />
          </div>

          {/* AI Summary */}
          <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem' }}>🤖</span>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>AI Executive Summary</div>
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
              This week's revenue <strong style={{ color: '#16a34a' }}>increased 8.3%</strong> — primarily driven by Pad Thai (+23%) and Iced Coffee (+18%). Siam branch is the top performer at ฿1.24M.
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
              Ekkamai branch <strong style={{ color: '#ef4444' }}>underperformed by 12%</strong> vs target. Recommend reviewing staffing ratios and menu pricing there.
            </div>
            <div style={{ background: 'rgba(22,163,74,0.08)', borderRadius: '0.75rem', padding: '0.75rem', fontSize: '0.8rem', color: '#16a34a', fontWeight: 600 }}>
              📅 Next week forecast: ฿342K (+4.2% vs this week)
            </div>
            <button className="btn-primary" style={{ justifyContent: 'center' }}>
              View Full Report →
            </button>
          </div>
        </div>

        {/* Branch Ranking + Predictive side by side */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          {/* Branch ranking */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>
              Multi-Branch Ranking
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {branches.map((branch, i) => (
                <div key={branch.name} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.75rem', background: 'var(--bg)', borderRadius: '0.75rem' }}>
                  <div style={{
                    width: '2rem', height: '2rem', borderRadius: '9999px', flexShrink: 0,
                    background: i === 0 ? '#fbbf24' : i === 1 ? '#94a3b8' : '#b45309',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 800, fontSize: '0.85rem',
                  }}>{branch.rank}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: '0.125rem' }}>{branch.name}</div>
                    <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      <span>฿{(branch.revenue / 1000).toFixed(0)}K</span>
                      <span>{branch.orders} orders</span>
                    </div>
                    <div className="progress-bar-bg" style={{ marginTop: '0.375rem' }}>
                      <div className="progress-bar-fill" style={{ width: `${branch.efficiency}%` }} />
                    </div>
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.85rem', color: '#16a34a' }}>{branch.efficiency}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* Predictive Analytics */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>Predictive Analytics</div>
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                {(['1W', '1M', '1Y'] as PredictTab[]).map(t => (
                  <button
                    key={t}
                    onClick={() => setPredictTab(t)}
                    style={{
                      padding: '0.2rem 0.5rem', borderRadius: '9999px',
                      border: `1px solid ${predictTab === t ? '#16a34a' : 'var(--border)'}`,
                      background: predictTab === t ? '#16a34a' : 'transparent',
                      color: predictTab === t ? 'white' : 'var(--text-muted)',
                      fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer',
                    }}
                  >{t}</button>
                ))}
              </div>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.625rem', display: 'flex', gap: '1rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <span style={{ width: '12px', height: '2px', background: '#16a34a', display: 'inline-block' }} /> Actual
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <span style={{ width: '12px', height: '2px', background: '#a3e635', display: 'inline-block', borderTop: '2px dashed #a3e635' }} /> Forecast
              </span>
            </div>
            <PredictiveChart tab={predictTab} dark={dark} />
          </div>
        </div>

        {/* Risk Alerts + Recent Activity */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          {/* Risk & Alert Center */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '0.875rem' }}>⚠️ Risk & Alert Center</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { icon: '👥', risk: 'Staff turnover risk', detail: '2 baristas showing burnout signals — consider schedule adjustments', color: '#ef4444', level: 'High' },
                { icon: '📦', risk: 'Holiday stock gap', detail: 'Chicken Breast projected to run out by Songkran. Order 20 kg now.', color: '#f97316', level: 'Medium' },
                { icon: '📉', risk: 'Menu decline: Tom Yum', detail: 'Sales down 18% this month. Action needed before further decline.', color: '#eab308', level: 'Low' },
              ].map(alert => (
                <div key={alert.risk} style={{
                  background: `${alert.color}0c`,
                  border: `1px solid ${alert.color}30`,
                  borderLeft: `4px solid ${alert.color}`,
                  borderRadius: '0.625rem',
                  padding: '0.75rem',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span>{alert.icon}</span>
                    <span style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-primary)' }}>{alert.risk}</span>
                    <span style={{ marginLeft: 'auto', background: alert.color, color: 'white', borderRadius: '9999px', padding: '0.1rem 0.4rem', fontSize: '0.62rem', fontWeight: 700 }}>{alert.level}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{alert.detail}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '0.875rem' }}>Recent Activity</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {recentActivity.map((activity, i) => (
                <div key={activity.id} style={{ display: 'flex', gap: '0.75rem', position: 'relative', paddingBottom: '0.75rem' }}>
                  {/* Timeline line */}
                  {i < recentActivity.length - 1 && (
                    <div style={{ position: 'absolute', left: '1rem', top: '1.75rem', bottom: 0, width: '2px', background: 'var(--border)' }} />
                  )}
                  <div style={{
                    width: '2rem', height: '2rem', borderRadius: '9999px', flexShrink: 0,
                    background: 'var(--bg)',
                    border: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.8rem', zIndex: 1,
                  }}>
                    {activityIcons[activity.type] || '●'}
                  </div>
                  <div style={{ flex: 1, paddingTop: '0.25rem' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>{activity.text}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.125rem' }}>{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
