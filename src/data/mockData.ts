export type OrderStatus = 'new' | 'cooking' | 'ready' | 'completed' | 'cancelled';
export type OrderType = 'dine-in' | 'takeaway' | 'delivery';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  photo: string;
}

export interface Order {
  id: string;
  orderNum: number;
  customer: string;
  type: OrderType;
  table?: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  createdAt: string;
  minutesAgo: number;
  assignedTo?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  isVeg: boolean;
  photo: string;
  available: boolean;
  discount?: number;
  calories?: number;
  prepMinutes?: number;
  bestseller?: boolean;
}

export interface ComboMeal {
  id: string;
  name: string;
  eyebrow: string;
  description: string;
  price: number;
  photo: string;
  itemIds: string[];
  tone: 'orange' | 'green' | 'red';
}

export interface StaffMember {
  id: string;
  name: string;
  role: 'Cashier' | 'Chef' | 'Barista' | 'Waiter';
  level: number;
  skillPoints: number;
  skillMax: number;
  shift: string;
  speed: number;
  accuracy: number;
  avatar: string;
  status: 'on-duty' | 'break' | 'off';
}

export const orders: Order[] = [
  {
    id: 'o1', orderNum: 1044, customer: 'Robert Fox', type: 'dine-in', table: 'Table 03',
    status: 'new', minutesAgo: 2,
    items: [
      { id: 'i1', name: 'Cheese Burger', price: 12, qty: 1, photo: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=80&h=80&fit=crop&auto=format' },
      { id: 'i2', name: 'Lemonade', price: 4, qty: 1, photo: 'https://images.unsplash.com/photo-1523371054106-bbf80586c38c?w=80&h=80&fit=crop&auto=format' },
    ],
    subtotal: 16, tax: 1.6, total: 17.6, createdAt: '7 Apr, 11:30 AM', assignedTo: 'Kai Chen',
  },
  {
    id: 'o2', orderNum: 1043, customer: 'Jenny Wilson', type: 'dine-in', table: 'Table 05',
    status: 'cooking', minutesAgo: 6,
    items: [
      { id: 'i3', name: 'Cheese Burger', price: 12, qty: 1, photo: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=80&h=80&fit=crop&auto=format' },
      { id: 'i4', name: 'Salad with Sesame', price: 16, qty: 1, photo: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=80&h=80&fit=crop&auto=format' },
      { id: 'i5', name: 'Special Sandwich Grill', price: 14, qty: 1, photo: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=80&h=80&fit=crop&auto=format' },
    ],
    subtotal: 42, tax: 4.2, total: 46.2, createdAt: '7 Apr, 11:25 AM', assignedTo: 'Kai Chen',
  },
  {
    id: 'o3', orderNum: 1042, customer: 'Cameron William', type: 'takeaway',
    status: 'ready', minutesAgo: 12,
    items: [
      { id: 'i6', name: 'Special Sandwich Grill', price: 14, qty: 1, photo: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=80&h=80&fit=crop&auto=format' },
      { id: 'i7', name: 'Sparkling Water', price: 4, qty: 1, photo: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=80&h=80&fit=crop&auto=format' },
    ],
    subtotal: 14, tax: 1.4, total: 15.4, createdAt: '7 Apr, 11:10 AM',
  },
  {
    id: 'o4', orderNum: 1041, customer: 'Olivia Hart', type: 'dine-in', table: 'Table 06',
    status: 'cooking', minutesAgo: 9,
    items: [
      { id: 'i8', name: 'Salad with Sesame', price: 16, qty: 2, photo: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=80&h=80&fit=crop&auto=format' },
      { id: 'i9', name: 'Noodles with Chicken', price: 12, qty: 1, photo: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=80&h=80&fit=crop&auto=format' },
    ],
    subtotal: 32, tax: 3.2, total: 35.2, createdAt: '7 Apr, 11:09 AM',
  },
  {
    id: 'o5', orderNum: 1040, customer: 'Ethan Reyes', type: 'dine-in', table: 'Table 01',
    status: 'completed', minutesAgo: 24,
    items: [
      { id: 'i10', name: 'Fried Rice', price: 10, qty: 1, photo: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=80&h=80&fit=crop&auto=format' },
      { id: 'i11', name: 'French Fries', price: 6, qty: 1, photo: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=80&h=80&fit=crop&auto=format' },
    ],
    subtotal: 21, tax: 2.1, total: 23.1, createdAt: '7 Apr, 11:04 AM',
  },
  {
    id: 'o6', orderNum: 1039, customer: 'Mia Sullivan', type: 'takeaway',
    status: 'completed', minutesAgo: 30,
    items: [
      { id: 'i12', name: 'Seafood Fried Rice', price: 12, qty: 1, photo: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=80&h=80&fit=crop&auto=format' },
      { id: 'i13', name: 'Mineral Water', price: 2, qty: 1, photo: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=80&h=80&fit=crop&auto=format' },
    ],
    subtotal: 14, tax: 1.4, total: 15.4, createdAt: '7 Apr, 10:52 AM',
  },
  {
    id: 'o7', orderNum: 1038, customer: 'Liam Parker', type: 'dine-in', table: 'Table 07',
    status: 'ready', minutesAgo: 18,
    items: [
      { id: 'i14', name: 'Chicken Fried Rice', price: 10, qty: 1, photo: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=80&h=80&fit=crop&auto=format' },
      { id: 'i15', name: 'Lemonade', price: 4, qty: 1, photo: 'https://images.unsplash.com/photo-1523371054106-bbf80586c38c?w=80&h=80&fit=crop&auto=format' },
    ],
    subtotal: 45, tax: 4.5, total: 49.5, createdAt: '7 Apr, 10:50 AM',
  },
  {
    id: 'o8', orderNum: 1037, customer: 'Emily Johnson', type: 'dine-in', table: 'Table 04',
    status: 'completed', minutesAgo: 42,
    items: [
      { id: 'i16', name: 'Noodles with Chicken', price: 13, qty: 1, photo: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=80&h=80&fit=crop&auto=format' },
      { id: 'i17', name: 'Sparkling Water', price: 4, qty: 1, photo: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=80&h=80&fit=crop&auto=format' },
    ],
    subtotal: 17, tax: 1.7, total: 18.7, createdAt: '7 Apr, 10:45 AM',
  },
  {
    id: 'o9', orderNum: 1036, customer: 'Noah Kim', type: 'delivery',
    status: 'cancelled', minutesAgo: 55,
    items: [
      { id: 'i18', name: 'Spicy Ramen', price: 15, qty: 2, photo: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=80&h=80&fit=crop&auto=format' },
    ],
    subtotal: 30, tax: 3, total: 33, createdAt: '7 Apr, 10:30 AM',
  },
];

export const menuItems: MenuItem[] = [
  { id: 'm1', name: 'Cheese Burger', price: 12, category: 'Burger', isVeg: false, available: true, calories: 520, prepMinutes: 10, bestseller: true,
    photo: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=280&fit=crop&auto=format' },
  { id: 'm2', name: 'Classic Cheeseburger', price: 10.59, category: 'Burger', isVeg: false, available: true, discount: 20, calories: 590, prepMinutes: 12, bestseller: true,
    photo: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=280&fit=crop&auto=format' },
  { id: 'm3', name: 'Veggie Burger', price: 9, category: 'Burger', isVeg: true, available: true, calories: 380, prepMinutes: 10, bestseller: true,
    photo: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400&h=280&fit=crop&auto=format' },
  { id: 'm4', name: 'Salad with Sesame', price: 16, category: 'Salad', isVeg: true, available: true, calories: 210, prepMinutes: 5,
    photo: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=280&fit=crop&auto=format' },
  { id: 'm5', name: 'Tasty Vegetable Salad', price: 17.99, category: 'Salad', isVeg: true, available: true,
    photo: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=280&fit=crop&auto=format' },
  { id: 'm6', name: 'Special Sandwich Grill', price: 14, category: 'Sandwich', isVeg: false, available: true, calories: 450, prepMinutes: 8,
    photo: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=280&fit=crop&auto=format' },
  { id: 'm7', name: 'Club Sandwich', price: 11, category: 'Sandwich', isVeg: false, available: true,
    photo: 'https://images.unsplash.com/photo-1554080353-a576cf803bda?w=400&h=280&fit=crop&auto=format' },
  { id: 'm8', name: 'Spicy Ramen Delight', price: 15, category: 'Soup', isVeg: false, available: true, calories: 520, prepMinutes: 12, bestseller: true,
    photo: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=280&fit=crop&auto=format' },
  { id: 'm9', name: 'Tom Yum Soup', price: 13, category: 'Soup', isVeg: false, available: true,
    photo: 'https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=400&h=280&fit=crop&auto=format' },
  { id: 'm10', name: 'Noodles with Chicken', price: 13, category: 'Main Course', isVeg: false, available: true,
    photo: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=280&fit=crop&auto=format' },
  { id: 'm11', name: 'Seafood Fried Rice', price: 18, category: 'Main Course', isVeg: false, available: true,
    photo: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=280&fit=crop&auto=format' },
  { id: 'm12', name: 'Vegetable Fried Rice', price: 14, category: 'Main Course', isVeg: true, available: true,
    photo: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=280&fit=crop&auto=format' },
  { id: 'm13', name: 'Tacos Salsa Grilled', price: 14.99, category: 'Main Course', isVeg: false, available: false,
    photo: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&h=280&fit=crop&auto=format' },
  { id: 'm14', name: 'Lemonade', price: 4, category: 'Beverage', isVeg: true, available: true, calories: 90, prepMinutes: 2,
    photo: 'https://images.unsplash.com/photo-1523371054106-bbf80586c38c?w=400&h=280&fit=crop&auto=format' },
  { id: 'm15', name: 'Fresh Orange Juice', price: 5, category: 'Beverage', isVeg: true, available: true,
    photo: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&h=280&fit=crop&auto=format' },
  { id: 'm16', name: 'Iced Cappuccino', price: 6, category: 'Beverage', isVeg: true, available: true,
    photo: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=280&fit=crop&auto=format' },
  { id: 'm17', name: 'Sparkling Water', price: 4, category: 'Beverage', isVeg: true, available: true,
    photo: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&h=280&fit=crop&auto=format' },
  { id: 'm18', name: 'Meat Sushi Maki', price: 9.99, category: 'Main Course', isVeg: false, available: true,
    photo: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&h=280&fit=crop&auto=format' },
];

export const menuCategories = ['All', 'Burger', 'Sandwich', 'Salad', 'Soup', 'Main Course', 'Beverage'];

export const comboMeals: ComboMeal[] = [
  {
    id: 'c1',
    name: 'Burger Duo Set',
    eyebrow: 'Family feast',
    description: '2 signature burgers + 2 chilled drinks',
    price: 24,
    photo: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=900&h=420&fit=crop&auto=format',
    itemIds: ['m1', 'm2', 'm14'],
    tone: 'orange',
  },
  {
    id: 'c2',
    name: 'Healthy Lunch',
    eyebrow: 'Fresh pick',
    description: 'Sesame salad + grilled sandwich',
    price: 30,
    photo: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=900&h=420&fit=crop&auto=format',
    itemIds: ['m4', 'm6'],
    tone: 'green',
  },
  {
    id: 'c3',
    name: 'Ramen Party',
    eyebrow: 'Mega bundle',
    description: '2 spicy ramen bowls + classic burger',
    price: 42,
    photo: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=900&h=420&fit=crop&auto=format',
    itemIds: ['m8', 'm1'],
    tone: 'red',
  },
];

export const staffMembers: StaffMember[] = [
  { id: 's1', name: 'Kai Chen', role: 'Barista', level: 3, skillPoints: 72, skillMax: 100, shift: '08:00 – 16:00', speed: 88, accuracy: 94, avatar: 'KC', status: 'on-duty' },
  { id: 's2', name: 'Stephany Lorean', role: 'Cashier', level: 4, skillPoints: 85, skillMax: 100, shift: '09:00 – 17:00', speed: 92, accuracy: 97, avatar: 'SL', status: 'on-duty' },
  { id: 's3', name: 'Brian Cooper', role: 'Chef', level: 5, skillPoints: 60, skillMax: 100, shift: '07:00 – 15:00', speed: 78, accuracy: 91, avatar: 'BC', status: 'break' },
  { id: 's4', name: 'Aisha Patel', role: 'Chef', level: 3, skillPoints: 45, skillMax: 100, shift: '10:00 – 18:00', speed: 82, accuracy: 88, avatar: 'AP', status: 'on-duty' },
  { id: 's5', name: 'Marcus Lee', role: 'Waiter', level: 2, skillPoints: 30, skillMax: 100, shift: '11:00 – 19:00', speed: 75, accuracy: 85, avatar: 'ML', status: 'on-duty' },
  { id: 's6', name: 'Priya Nair', role: 'Barista', level: 4, skillPoints: 90, skillMax: 100, shift: '06:00 – 14:00', speed: 95, accuracy: 98, avatar: 'PN', status: 'off' },
];

export const monthlyRevenue = [
  { month: 'Oct', revenue: 210000, expenses: 145000 },
  { month: 'Nov', revenue: 245000, expenses: 160000 },
  { month: 'Dec', revenue: 310000, expenses: 195000 },
  { month: 'Jan', revenue: 280000, expenses: 178000 },
  { month: 'Feb', revenue: 265000, expenses: 168000 },
  { month: 'Mar', revenue: 295000, expenses: 182000 },
  { month: 'Apr', revenue: 320000, expenses: 195000 },
  { month: 'May', revenue: 305000, expenses: 188000 },
  { month: 'Jun', revenue: 285000, expenses: 175000 },
  { month: 'Jul', revenue: 298000, expenses: 181000 },
  { month: 'Aug', revenue: 315000, expenses: 192000 },
  { month: 'Sep', revenue: 342000, expenses: 205000 },
];

export const branches = [
  { name: 'Siam', revenue: 1240000, orders: 1820, efficiency: 94, rank: 1 },
  { name: 'On Nut', revenue: 980000, orders: 1430, efficiency: 88, rank: 2 },
  { name: 'Ekkamai', revenue: 620000, orders: 1571, efficiency: 76, rank: 3 },
];

export const recentActivity = [
  { id: 'a1', time: '2 min ago', text: 'New order #1044 placed — Dine In, Table 03', type: 'order' },
  { id: 'a2', time: '5 min ago', text: 'Staff Kai Chen clocked in for morning shift', type: 'staff' },
  { id: 'a3', time: '12 min ago', text: 'Order #1042 marked Ready to Serve', type: 'status' },
  { id: 'a4', time: '18 min ago', text: 'Inventory restocked: Chicken Breast +5 kg', type: 'inventory' },
  { id: 'a5', time: '25 min ago', text: 'Order #1039 cancelled by customer (Delivery)', type: 'cancel' },
  { id: 'a6', time: '35 min ago', text: 'Priya Nair approved for Barista Level 5 upskill', type: 'staff' },
  { id: 'a7', time: '1 hr ago', text: 'Daily sales report sent to CEO dashboard', type: 'report' },
];

export const staffTimeline = [
  { time: '08:00', task: 'Opening Setup', type: 'setup', done: true },
  { time: '08:30', task: 'Brewing Batch Coffee', type: 'cooking', done: true },
  { time: '09:00', task: 'Order #1028 — 2x Latte', type: 'order', done: true },
  { time: '09:30', task: 'Order #1031 — Cappuccino x3', type: 'order', done: true },
  { time: '10:00', task: 'Break', type: 'break', done: true },
  { time: '10:30', task: 'Order #1035 — Iced Coffee x2', type: 'order', done: false },
  { time: '11:00', task: 'Order #1038 — Smoothie', type: 'order', done: false },
  { time: '11:30', task: 'Training: Latte Art Practice', type: 'training', done: false },
  { time: '12:00', task: 'Lunch Break', type: 'break', done: false },
  { time: '13:00', task: 'Order #1043 — Espresso x4', type: 'order', done: false },
  { time: '14:00', task: 'Order #1044 — Cold Brew x2', type: 'order', done: false },
  { time: '15:00', task: 'Equipment Cleaning', type: 'setup', done: false },
];

export const predictiveWeekly = [
  { day: 'Mon', actual: 48200, forecast: null },
  { day: 'Tue', actual: 52100, forecast: null },
  { day: 'Wed', actual: 49800, forecast: null },
  { day: 'Thu', actual: 55300, forecast: null },
  { day: 'Fri', actual: 61200, forecast: null },
  { day: 'Sat', actual: 58400, forecast: null },
  { day: 'Sun', actual: null, forecast: 54000 },
  { day: 'Next Mon', actual: null, forecast: 50000 },
  { day: 'Next Tue', actual: null, forecast: 53500 },
];

export const dishCategories = [
  { name: 'All Dishes', count: 120 },
  { name: 'Beverages', count: 18 },
  { name: 'Desserts', count: 15 },
  { name: 'Kids Menu', count: 12 },
  { name: 'Main Courses', count: 20 },
  { name: 'Pasta & Noodles', count: 5 },
  { name: 'Pizza', count: 6 },
  { name: 'Sushi', count: 3 },
  { name: 'Seafood', count: 9 },
  { name: 'Sandwiches', count: 4 },
  { name: 'Vegetarian', count: 8 },
  { name: 'Burger', count: 5 },
];
