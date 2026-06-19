// Seed data for testing admin features
// This populates localStorage with test users, admin events, and orders

const USERS_KEY = 'tixflow_users'
const ORDERS_KEY = 'tixflow_orders'
const ADMIN_EVENTS_KEY = 'tixflow_admin_events'
const SEED_KEY = 'tixflow_seeded'

// Fixed IDs for consistent references
const ADMIN_USER_ID = 1000001
const EVENT_ADMIN_1_ID = 1000002
const EVENT_ADMIN_2_ID = 1000003
const CUSTOMER_1_ID = 1000004
const CUSTOMER_2_ID = 1000005
const CUSTOMER_3_ID = 1000006

const seedUsers = [
  {
    id: ADMIN_USER_ID,
    name: 'Super Admin',
    email: 'admin@monora.com',
    password: 'admin123',
    phone: '081234567890',
    role: 'app_admin',
    createdAt: '2025-01-15T08:00:00.000Z',
  },
  {
    id: EVENT_ADMIN_1_ID,
    name: 'Budi Santoso',
    email: 'budi@monora.com',
    password: 'budi123',
    phone: '081298765432',
    role: 'event_admin',
    createdAt: '2025-02-10T10:30:00.000Z',
  },
  {
    id: EVENT_ADMIN_2_ID,
    name: 'Sari Dewi',
    email: 'sari@monora.com',
    password: 'sari123',
    phone: '087712345678',
    role: 'event_admin',
    createdAt: '2025-03-05T14:00:00.000Z',
  },
  {
    id: CUSTOMER_1_ID,
    name: 'Andi Pratama',
    email: 'andi@gmail.com',
    password: 'andi123',
    phone: '085611223344',
    role: 'customer',
    createdAt: '2025-06-20T09:15:00.000Z',
  },
  {
    id: CUSTOMER_2_ID,
    name: 'Maya Putri',
    email: 'maya@gmail.com',
    password: 'maya123',
    phone: '089922334455',
    role: 'customer',
    createdAt: '2025-08-12T11:45:00.000Z',
  },
  {
    id: CUSTOMER_3_ID,
    name: 'Rizky Hidayat',
    email: 'rizky@gmail.com',
    password: 'rizky123',
    phone: '081355667788',
    role: 'customer',
    createdAt: '2025-10-01T16:30:00.000Z',
  },
]

const seedAdminEvents = [
  // Budi's events
  {
    id: 2000001,
    title: 'Rock Fest Bandung 2026',
    slug: 'rock-fest-bandung-2026',
    date: 'Sat, Apr 18 | 7 PM',
    fullDate: '2026-04-18',
    time: '7:00 PM - 11:30 PM',
    venue: 'Lapangan Gasibu',
    city: 'Bandung',
    province: 'Jawa Barat',
    address: 'Jl. Diponegoro, Bandung',
    lat: -6.9025,
    lng: 107.6191,
    category: 'Concerts',
    tags: ['Rock', 'Popular'],
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=500&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop',
    description: 'Festival rock terbesar di Bandung! Menampilkan band-band rock legendaris Indonesia dan internasional. Dua panggung utama, food court, dan area camping.',
    artist: 'Various Rock Bands',
    organizer: 'Budi Entertainment',
    status: 'published',
    createdBy: EVENT_ADMIN_1_ID,
    createdAt: '2025-12-01T08:00:00.000Z',
    updatedAt: '2026-01-15T10:00:00.000Z',
    tickets: [
      { id: 'te1-1', type: 'Regular', price: 150000, description: 'Akses area festival', available: 500 },
      { id: 'te1-2', type: 'VIP', price: 350000, description: 'Area VIP + free drinks', available: 100 },
      { id: 'te1-3', type: 'VVIP', price: 750000, description: 'Meet & greet + backstage', available: 30 },
    ],
    merchandise: [
      { id: 'me1-1', name: 'Rock Fest T-Shirt', price: 120000, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop', sizes: ['S', 'M', 'L', 'XL'], colors: ['Black'], stock: 200 },
    ],
    hasMerch: true,
  },
  {
    id: 2000002,
    title: 'Jazz Night Jakarta',
    slug: 'jazz-night-jakarta',
    date: 'Fri, May 9 | 8 PM',
    fullDate: '2026-05-09',
    time: '8:00 PM - 12:00 AM',
    venue: 'Jakarta Convention Center',
    city: 'Jakarta',
    province: 'DKI Jakarta',
    address: 'Jl. Gatot Subroto, Jakarta Selatan',
    lat: -6.2146,
    lng: 106.8073,
    category: 'Concerts',
    tags: ['Jazz', 'Premium'],
    image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&h=500&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400&h=300&fit=crop',
    description: 'Malam jazz eksklusif dengan musisi jazz terbaik Indonesia. Dinner included, suasana intimate dan elegan.',
    artist: 'Tompi, Indra Lesmana, Monita Tahalea',
    organizer: 'Budi Entertainment',
    status: 'published',
    createdBy: EVENT_ADMIN_1_ID,
    createdAt: '2026-01-10T08:00:00.000Z',
    updatedAt: '2026-02-05T12:00:00.000Z',
    tickets: [
      { id: 'te2-1', type: 'Standard', price: 250000, description: 'Seating area', available: 300 },
      { id: 'te2-2', type: 'Premium', price: 500000, description: 'Front row + dinner', available: 80 },
    ],
    merchandise: [],
    hasMerch: false,
  },
  {
    id: 2000003,
    title: 'Budi Comedy Show',
    slug: 'budi-comedy-show',
    date: 'Sun, Jun 15 | 7 PM',
    fullDate: '2026-06-15',
    time: '7:00 PM - 10:00 PM',
    venue: 'Balai Kartini',
    city: 'Jakarta',
    province: 'DKI Jakarta',
    address: 'Jl. Gatot Subroto Kav. 37, Jakarta',
    lat: -6.2297,
    lng: 106.8174,
    category: 'Theater & Comedy',
    tags: ['Comedy', 'New'],
    image: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800&h=500&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=400&h=300&fit=crop',
    description: 'Malam penuh tawa bersama komika-komika terbaik tanah air. Stand-up comedy special with surprise guests!',
    artist: 'Raditya Dika, Pandji, Cak Lontong',
    organizer: 'Budi Entertainment',
    status: 'draft',
    createdBy: EVENT_ADMIN_1_ID,
    createdAt: '2026-02-20T09:00:00.000Z',
    updatedAt: '2026-02-20T09:00:00.000Z',
    tickets: [
      { id: 'te3-1', type: 'Regular', price: 100000, description: 'General seating', available: 400 },
      { id: 'te3-2', type: 'VIP', price: 250000, description: 'Front 3 rows + photo op', available: 50 },
    ],
    merchandise: [],
    hasMerch: false,
  },

  // Sari's events
  {
    id: 2000004,
    title: 'EDM Beach Party Bali',
    slug: 'edm-beach-party-bali',
    date: 'Sat, Jul 25 | 4 PM',
    fullDate: '2026-07-25',
    time: '4:00 PM - 2:00 AM',
    venue: 'Potato Head Beach Club',
    city: 'Denpasar',
    province: 'Bali',
    address: 'Jl. Petitenget, Seminyak, Bali',
    lat: -8.6837,
    lng: 115.1554,
    category: 'Festivals',
    tags: ['EDM', 'Beach', 'Popular'],
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=500&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=300&fit=crop',
    description: 'Beach party EDM terbesar di Bali! DJ internasional, sunset vibes, dan pengalaman party yang tak terlupakan di pantai.',
    artist: 'DJ Snake, Marshmello (Guest)',
    organizer: 'Sari Productions',
    status: 'published',
    createdBy: EVENT_ADMIN_2_ID,
    createdAt: '2026-01-20T11:00:00.000Z',
    updatedAt: '2026-03-01T14:00:00.000Z',
    tickets: [
      { id: 'te4-1', type: 'Early Bird', price: 200000, description: 'Limited early bird price', available: 200 },
      { id: 'te4-2', type: 'Regular', price: 350000, description: 'General access', available: 600 },
      { id: 'te4-3', type: 'VIP Cabana', price: 1500000, description: 'Private cabana for 4, unlimited drinks', available: 20 },
    ],
    merchandise: [
      { id: 'me4-1', name: 'Beach Party Tank Top', price: 100000, image: 'https://images.unsplash.com/photo-1503341504253-dff4855f4454?w=300&h=300&fit=crop', sizes: ['S', 'M', 'L'], colors: ['White', 'Neon Green'], stock: 300 },
      { id: 'me4-2', name: 'LED Sunglasses', price: 50000, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=300&fit=crop', sizes: [], colors: ['Multi'], stock: 500 },
    ],
    hasMerch: true,
  },
  {
    id: 2000005,
    title: 'Surabaya Art Exhibition',
    slug: 'surabaya-art-exhibition',
    date: 'Fri, Aug 8 | 10 AM',
    fullDate: '2026-08-08',
    time: '10:00 AM - 9:00 PM',
    venue: 'House of Sampoerna',
    city: 'Surabaya',
    province: 'Jawa Timur',
    address: 'Jl. Taman Sampoerna No.6, Surabaya',
    lat: -7.2347,
    lng: 112.7373,
    category: 'Art & Culture',
    tags: ['Art', 'Exhibition'],
    image: 'https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=800&h=500&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=400&h=300&fit=crop',
    description: 'Pameran seni kontemporer terbesar di Jawa Timur. Menampilkan 50+ seniman lokal dan internasional.',
    artist: 'Various Artists',
    organizer: 'Sari Productions',
    status: 'published',
    createdBy: EVENT_ADMIN_2_ID,
    createdAt: '2026-02-01T08:30:00.000Z',
    updatedAt: '2026-02-15T10:00:00.000Z',
    tickets: [
      { id: 'te5-1', type: 'Day Pass', price: 75000, description: 'Full day access', available: 1000 },
      { id: 'te5-2', type: 'VIP Tour', price: 200000, description: 'Guided tour + artist meet', available: 50 },
    ],
    merchandise: [],
    hasMerch: false,
  },
  {
    id: 2000006,
    title: 'Yogyakarta Food Festival',
    slug: 'yogyakarta-food-festival',
    date: 'Sat, Sep 20 | 11 AM',
    fullDate: '2026-09-20',
    time: '11:00 AM - 10:00 PM',
    venue: 'Alun-Alun Kidul',
    city: 'Yogyakarta',
    province: 'DI Yogyakarta',
    address: 'Alun-Alun Kidul, Yogyakarta',
    lat: -7.8107,
    lng: 110.3621,
    category: 'Festivals',
    tags: ['Food', 'Family'],
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=500&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop',
    description: 'Festival kuliner terbesar di Yogyakarta! 100+ booth makanan, cooking demo, dan live music sepanjang hari.',
    artist: 'Chef Juna, Chef Arnold',
    organizer: 'Sari Productions',
    status: 'cancelled',
    createdBy: EVENT_ADMIN_2_ID,
    createdAt: '2026-01-05T07:00:00.000Z',
    updatedAt: '2026-03-01T09:00:00.000Z',
    tickets: [
      { id: 'te6-1', type: 'General', price: 50000, description: 'Festival entry', available: 2000 },
    ],
    merchandise: [],
    hasMerch: false,
  },
]

const seedOrders = [
  // Orders for Budi's events
  {
    id: 'ORD-SEED-001',
    userId: CUSTOMER_1_ID,
    date: '2026-02-10T14:30:00.000Z',
    status: 'confirmed',
    total: 500000,
    items: [
      { eventId: 2000001, title: 'Rock Fest Bandung 2026', type: 'Regular', itemType: 'ticket', price: 150000, quantity: 2 },
      { eventId: 2000001, title: 'Rock Fest T-Shirt', name: 'Rock Fest T-Shirt', itemType: 'merch', price: 120000, quantity: 1, size: 'L', color: 'Black' },
    ],
    customer: { name: 'Andi Pratama', email: 'andi@gmail.com' },
  },
  {
    id: 'ORD-SEED-002',
    userId: CUSTOMER_2_ID,
    date: '2026-02-15T09:20:00.000Z',
    status: 'confirmed',
    total: 750000,
    items: [
      { eventId: 2000001, title: 'Rock Fest Bandung 2026', type: 'VIP', itemType: 'ticket', price: 350000, quantity: 1 },
      { eventId: 2000002, title: 'Jazz Night Jakarta', type: 'Standard', itemType: 'ticket', price: 250000, quantity: 1 },
    ],
    customer: { name: 'Maya Putri', email: 'maya@gmail.com' },
  },
  {
    id: 'ORD-SEED-003',
    userId: CUSTOMER_3_ID,
    date: '2026-02-20T17:45:00.000Z',
    status: 'confirmed',
    total: 1000000,
    items: [
      { eventId: 2000002, title: 'Jazz Night Jakarta', type: 'Premium', itemType: 'ticket', price: 500000, quantity: 2 },
    ],
    customer: { name: 'Rizky Hidayat', email: 'rizky@gmail.com' },
  },
  {
    id: 'ORD-SEED-004',
    userId: CUSTOMER_1_ID,
    date: '2026-03-01T11:00:00.000Z',
    status: 'confirmed',
    total: 350000,
    items: [
      { eventId: 2000001, title: 'Rock Fest Bandung 2026', type: 'VIP', itemType: 'ticket', price: 350000, quantity: 1 },
    ],
    customer: { name: 'Andi Pratama', email: 'andi@gmail.com' },
  },

  // Orders for Sari's events
  {
    id: 'ORD-SEED-005',
    userId: CUSTOMER_2_ID,
    date: '2026-02-25T13:10:00.000Z',
    status: 'confirmed',
    total: 550000,
    items: [
      { eventId: 2000004, title: 'EDM Beach Party Bali', type: 'Early Bird', itemType: 'ticket', price: 200000, quantity: 2 },
      { eventId: 2000004, title: 'Beach Party Tank Top', name: 'Beach Party Tank Top', itemType: 'merch', price: 100000, quantity: 1, size: 'M', color: 'White' },
      { eventId: 2000004, title: 'LED Sunglasses', name: 'LED Sunglasses', itemType: 'merch', price: 50000, quantity: 1 },
    ],
    customer: { name: 'Maya Putri', email: 'maya@gmail.com' },
  },
  {
    id: 'ORD-SEED-006',
    userId: CUSTOMER_3_ID,
    date: '2026-03-02T08:30:00.000Z',
    status: 'confirmed',
    total: 1500000,
    items: [
      { eventId: 2000004, title: 'EDM Beach Party Bali', type: 'VIP Cabana', itemType: 'ticket', price: 1500000, quantity: 1 },
    ],
    customer: { name: 'Rizky Hidayat', email: 'rizky@gmail.com' },
  },
  {
    id: 'ORD-SEED-007',
    userId: CUSTOMER_1_ID,
    date: '2026-03-03T15:20:00.000Z',
    status: 'confirmed',
    total: 275000,
    items: [
      { eventId: 2000005, title: 'Surabaya Art Exhibition', type: 'Day Pass', itemType: 'ticket', price: 75000, quantity: 1 },
      { eventId: 2000005, title: 'Surabaya Art Exhibition', type: 'VIP Tour', itemType: 'ticket', price: 200000, quantity: 1 },
    ],
    customer: { name: 'Andi Pratama', email: 'andi@gmail.com' },
  },
  {
    id: 'ORD-SEED-008',
    userId: CUSTOMER_2_ID,
    date: '2026-03-05T10:00:00.000Z',
    status: 'confirmed',
    total: 700000,
    items: [
      { eventId: 2000004, title: 'EDM Beach Party Bali', type: 'Regular', itemType: 'ticket', price: 350000, quantity: 2 },
    ],
    customer: { name: 'Maya Putri', email: 'maya@gmail.com' },
  },
]

export function initSeedData() {
  // Only seed if not already seeded
  if (localStorage.getItem(SEED_KEY)) return

  try {
    // Merge with existing users (don't overwrite)
    const existingUsers = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
    const existingEmails = new Set(existingUsers.map(u => u.email))
    const newUsers = seedUsers.filter(u => !existingEmails.has(u.email))
    localStorage.setItem(USERS_KEY, JSON.stringify([...existingUsers, ...newUsers]))

    // Merge admin events
    const existingEvents = JSON.parse(localStorage.getItem(ADMIN_EVENTS_KEY) || '[]')
    const existingEventIds = new Set(existingEvents.map(e => e.id))
    const newEvents = seedAdminEvents.filter(e => !existingEventIds.has(e.id))
    localStorage.setItem(ADMIN_EVENTS_KEY, JSON.stringify([...existingEvents, ...newEvents]))

    // Merge orders
    const existingOrders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]')
    const existingOrderIds = new Set(existingOrders.map(o => o.id))
    const newOrders = seedOrders.filter(o => !existingOrderIds.has(o.id))
    localStorage.setItem(ORDERS_KEY, JSON.stringify([...existingOrders, ...newOrders]))

    localStorage.setItem(SEED_KEY, 'true')
    console.log('✅ Seed data loaded successfully')
  } catch (err) {
    console.error('Seed data error:', err)
  }
}
