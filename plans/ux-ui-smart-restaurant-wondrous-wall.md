# Plan: Smart Restaurant POS Ecosystem — 4 Apps, 1 Design System

## Context

Build a complete Smart Restaurant POS Ecosystem as a single React + Vite app with four role-based views (Cashier POS, Kitchen/Barista Staff, Manager, CEO Dashboard) connected by a persona switcher. All views share one design system: green-white palette with dark mode, card-based layouts, shared components (OrderLineBar, StatusBadge, Sidebar, KPICard). Reference images 1–9 establish the visual language precisely. The scaffold is empty (App.tsx renders a blank div).

---

## Design System Decisions

**Palette (CSS tokens in `src/index.css`)**
- Primary: `#16a34a` (green-600)
- Primary Light: `#dcfce7` (green-100) — selected card highlight
- Accent Lime: `#a3e635` — item count badges (per img 2)
- Semantic status: green=#16a34a, orange=#f97316, blue=#3b82f6, purple=#8b5cf6, red=#ef4444
- Light ground: bg `#f1f5f9`, card `#ffffff`, border `#e2e8f0`
- Dark ground: bg `#0f172a`, card `#1e293b`, border `#334155`

**Fonts (Google Fonts via `@import` at top of `src/index.css`)**
- Plus Jakarta Sans — headings + UI labels (less overused than Inter alone)
- Inter — body text, order lists, descriptions
- JetBrains Mono — KPI numbers, prices, order IDs

**Radius**: `1rem` (rounded-2xl) for cards; `9999px` for badges/pills.

---

## Architecture

Single-page app with a top-level persona switcher. No router needed — view state managed in `App.tsx`.

```
src/
  index.css               — font imports (top), Tailwind import, CSS custom properties
  App.tsx                 — dark mode + activeView state, top persona bar, renders active view
  data/
    mockData.ts           — shared orders, menu items, staff, KPI data
  components/shared/
    OrderLineBar.tsx       — sticky horizontal scrollable order cards (POS / Staff / Manager)
    StatusBadge.tsx        — semantic color badges (New Order / Cooking / Ready / Completed / Cancelled)
    Sidebar.tsx            — icon+label vertical nav, active state in green
    ThemeToggle.tsx        — ☀️/🌙 toggle button (all 4 apps, top-right)
    KPICard.tsx            — KPI card with title, value, % delta, trend icon
  views/
    POSView.tsx            — Cashier POS counter (images 1, 2, 6, 9)
    StaffView.tsx          — Kitchen/barista mobile app (images 2, 3, 4)
    ManagerView.tsx        — Manager back-office (images 7, 8, 9)
    CEOView.tsx            — CEO analytics dashboard (images 4/5 financial-style)
```

---

## Implementation Plan

### 1. `src/index.css`
- `@import` Plus Jakarta Sans (weights 400,500,600,700), Inter, JetBrains Mono from Google Fonts — placed **before** `@import 'tailwindcss'`
- `@theme` block with Tailwind v4 token mappings: `--color-primary`, `--color-primary-light`, `--color-card`, `--color-border`, etc.
- `:root` and `.dark` CSS custom properties for all tokens
- Global: `font-family: 'Plus Jakarta Sans', 'Inter', sans-serif`, `scrollbar-width: none`
- Custom CSS classes: `.order-line-scroll` (horizontal scroll, hide scrollbar), `.status-badge`, font utilities

### 2. `src/data/mockData.ts`
Realistic mock data:
- `orders[]` — 12 orders across statuses (New/Cooking/Ready/Completed/Cancelled), types (Dine-in/Take Away/Delivery), tables, customer names, items, totals, timestamps
- `menuItems[]` — 18 items across categories (Burgers, Sandwiches, Soups, Salad, Main Course, Beverages) with name, price, category, veg/non-veg, Unsplash photo URL
- `staffMembers[]` — 6 staff with name, role (Cashier/Chef/Barista), level, skill points, shift
- `kpiData` — monthly revenue/profit arrays (12 months), branch rankings, recent activity events

### 3. Shared Components

**`ThemeToggle.tsx`**
- Button with ☀️/🌙 icon, calls `onToggle` prop, sits top-right in all views

**`StatusBadge.tsx`**
- Props: `status: 'new' | 'cooking' | 'ready' | 'completed' | 'cancelled'`
- Colors: purple/orange/blue/green/red with matching bg-opacity-15 + text

**`OrderLineBar.tsx`** (used in POS, Staff, Manager)
- Props: `orders`, `role: 'pos' | 'staff' | 'manager'`, `onAction`
- Filter tabs: All | Dine-in (with count badge) | Take Away | Delivery
- Horizontal scroll container with `‹` `›` arrow buttons on edges
- Each card: order #, type+table, item count (lime badge), time ago, StatusBadge, action button (label changes by role: "View" | "It's Done ✓" | "See All")
- Touch swipe via CSS `scroll-snap`
- Clicking "It's Done" marks order complete in local state, triggers a fake push notification toast

**`Sidebar.tsx`**
- Props: `items[]` (icon + label + key), `activeKey`, `onSelect`
- Active item: green filled pill background, white icon
- Icons: use inline SVG or unicode emoji stand-ins for Home/Menu/Order/Promo/Chart/History/Settings

**`KPICard.tsx`**
- Props: `title`, `value`, `delta` (%), `deltaDir: 'up'|'down'`, `icon`
- Large mono number, small label, green/red delta badge

### 4. `src/views/POSView.tsx` (Cashier, Images 1, 6)

Layout: `grid-cols-[60px_1fr_360px]` (sidebar | menu zone | order panel)

- **Top sticky**: `OrderLineBar` (role="pos")
- **Sidebar**: Sidebar component (Home/Menu/Order/Promo/Chart/History/Settings)
- **Menu zone**:
  - Search bar + date/greeting header (per img 6: "Let's make it a great day!")
  - Category tabs: All / Burger / Sandwich / Salad / Soups / Main Course — pill buttons, active=green filled
  - Product grid (3 cols): each card = Unsplash food photo, name, price, Veg/Non-veg tag, "Add to Dish" button. When in cart: stepper (–/count/+) replaces button, card gets green border
  - Filter by active category (local state)
- **Right order panel**:
  - Table # + customer name header + edit icon
  - Dine In / Take Away / Delivery tab switcher
  - Customer Name + Table Number inputs
  - Cart line items: thumbnail, name, qty, price, remove
  - Subtotal / Tax 10% / Total (JetBrains Mono)
  - Payment method: Cash / Credit Card / QR (icon buttons, selected=green)
  - "Place Order" green button → triggers order number modal
- **Order Number Modal**: overlay with "Order #27 confirmed!", queue display, "Done" button dismisses

State: `cartItems[]`, `selectedCategory`, `paymentMethod`, `showModal`

### 5. `src/views/StaffView.tsx` (Kitchen/Barista, Images 2, 3, 4)

Mobile-first layout: max-width 430px centered, phone-frame feel.

- **Clock-In Screen** (shows first, state `clockedIn: false`):
  - Card overlay: avatar circle (green gradient), "Welcome, Kai Chen!", current time (large mono), date, Status dot (Clock Out=red / Clock In=green), "Later" + "Clock In Now" buttons
  - "Clock In Now" → sets clockedIn=true, transitions to main view

- **Main View** (after clock-in):
  - Top bar: greeting + date + ThemeToggle
  - `OrderLineBar` mobile version (role="staff") — my assigned orders
  - **Current Task Card**: highlighted green border, order # + items, big "It's Done ✓" button. Tapping fires toast: "Order #25 done! AI assigned #27 to you."
  - **Timeline View**: hourly slots (8 AM–8 PM) as scrollable list. Each slot shows a colored activity block (Cooking/Break/Training). Style: left time label, vertical line, colored pill per image 4's Activity screen
  - **AI Suggest Box**: card with sparkle icon, green border, "AI Coach" title, suggestion text ("Practice Latte Art pour to advance to Level 4")
  - **Skill Profile**: progress bars (Barista Level 3→4: 72%), Speed/Accuracy stats, "Level up = ฿500/mo raise" callout

State: `clockedIn`, `currentOrder`, `completedCount`

### 6. `src/views/ManagerView.tsx` (Manager, Images 7, 8, 9)

Layout: `grid-cols-[60px_1fr]` with optional split-view panel.

- **Top sticky**: `OrderLineBar` (role="manager")
- **Sidebar**: expanded nav (Home/Menu/Order active/Promo/Chart/History/Settings)
- **Main content tabs** (top of content): Orders | Manage Menu | Inventory | Staff | QC | Marketing | AI Insights

**Orders tab** (default, per img 7):
- Status tabs: All(44) / New(1) / Cooking(2) / Ready(3) / Completed(38) / Cancelled(0) — pill tabs with count badges
- Search + "Today" date filter
- 4-column card grid (2 rows visible): each card = customer name, order #, timestamp, table/type, item list with prices, "See more" link, StatusBadge
- Clicking a card opens **Split-view detail panel** (right 40%): order details (Name, ID, time, type), List Item (with food photos), Payment Summary (Subtotal/Tax/Total + PAID stamp), close button

**Manage Menu tab** (per img 9):
- Left category list: All Dishes / Beverages / Desserts / Kids Menu / Main Courses / Pasta / Pizza / etc. + "Add Dish Category" button
- Right: search bar + grid of dish cards (food photo, name, price, 3-dot menu) + dashed "Add New Dish" first card

**AI Insights tab**:
- Alert cards: "Order #042 delayed 18min" (red), "Pad Thai trending +23% this week" (green), "Inventory: Chicken breast 2kg left" (orange)
- Weekly promo suggestion card

**Staff tab**:
- Table of staff with avatar, name, role, level, shift, skill progress bar, "Approve Upskill" button

State: `activeTab`, `statusFilter`, `selectedOrder`, `splitViewOpen`

### 7. `src/views/CEOView.tsx` (CEO, financial dashboard style)

Layout: `grid` with sidebar (optional icon-only) + main content.

- **Top bar**: "Good morning, Sarun." + date + ThemeToggle (right)
- **KPI Row** (4 cards): Total Revenue ฿2.84M (+8.3%), Net Profit ฿680K (+5.1%), Total Orders 4,821 (+12%), New Customers 847 (+3.2%)
- **Revenue & Expense Chart** (recharts — BarChart with two series: Revenue/Expenses, 12 months, green/gray bars, line overlay for profit margin)
- **Multi-Branch Ranking**: table/cards showing branches (Siam / On Nut / Ekkamai) with revenue, orders, efficiency score, rank badge
- **AI Executive Summary**: card with 🤖 icon, paragraph: "This week's revenue increased 8% driven by Pad Thai and Iced Coffee. Ekkamai branch underperformed by 12%..."
- **Predictive Analytics** (recharts — AreaChart, 3-tab: 1W / 1M / 1Y, green fill, forecast line dashed)
- **Risk & Alert Center**: 3 alert cards — staff turnover risk (red), holiday stock gap (orange), menu decline (yellow)
- **Recent Activity Feed**: timestamped list (New order #1234 placed, Staff Kai clocked in, Inventory restocked...)

Uses `recharts` — install first: `pnpm add recharts`

---

## Key Implementation Notes

1. **Dark mode**: `dark` class on `<html>`, toggled via state in `App.tsx`, passed as prop to all views. Tailwind v4 `dark:` variants used throughout.
2. **Persona switcher**: Top bar in App.tsx with 4 tab buttons (🖥️ POS / 📱 Staff / 📊 Manager / 📈 CEO). Active tab = green underline.
3. **No router**: `activeView: 'pos' | 'staff' | 'manager' | 'ceo'` in App state — renders one view at a time.
4. **Unsplash images**: Food photos from `https://images.unsplash.com/photo-{id}?w=400&h=300&fit=crop&auto=format`. Pick 18 relevant food IDs.
5. **recharts**: needed for CEO revenue charts. Install before implementing CEOView.
6. **Order state**: `mockData.ts` exports initial orders; App.tsx holds `orders` in useState and passes down as props, so "It's Done" in StaffView and "Place Order" in POSView update the shared order list.

---

## File Modification Summary

| File | Action |
|------|--------|
| `src/index.css` | Rewrite — font imports + Tailwind + CSS tokens |
| `src/App.tsx` | Rewrite — persona switcher + dark mode + shared state |
| `src/data/mockData.ts` | Create — all mock data |
| `src/components/shared/OrderLineBar.tsx` | Create |
| `src/components/shared/StatusBadge.tsx` | Create |
| `src/components/shared/Sidebar.tsx` | Create |
| `src/components/shared/ThemeToggle.tsx` | Create |
| `src/components/shared/KPICard.tsx` | Create |
| `src/views/POSView.tsx` | Create |
| `src/views/StaffView.tsx` | Create |
| `src/views/ManagerView.tsx` | Create |
| `src/views/CEOView.tsx` | Create |

---

## Verification

1. App loads with persona switcher bar at top and POS view by default
2. Toggle dark mode → all 4 views flip correctly
3. Switch between all 4 persona tabs — each renders its full view
4. POS: add items to cart, adjust qty, place order → modal shows queue number
5. Staff: Clock In → main view; "It's Done" → toast notification; tab through timeline
6. Manager: status tab filter works; click order card → split panel opens with details; Manage Menu tab shows category list + grid
7. CEO: revenue chart renders; predictive analytics tabs switch; KPI cards show formatted numbers
8. No TypeScript errors from `pnpm build`
