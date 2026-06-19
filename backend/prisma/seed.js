import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const seedUsers = [
  { name: 'Super Admin', email: 'admin@monora.com', password: 'admin123', phone: '081234567890', role: 'app_admin' },
  { name: 'Budi Santoso', email: 'budi@monora.com', password: 'budi123', phone: '081298765432', role: 'event_admin' },
  { name: 'Sari Dewi', email: 'sari@monora.com', password: 'sari123', phone: '087712345678', role: 'event_admin' },
  { name: 'Andi Pratama', email: 'andi@gmail.com', password: 'andi123', phone: '085611223344', role: 'customer' },
  { name: 'Maya Putri', email: 'maya@gmail.com', password: 'maya123', phone: '089922334455', role: 'customer' },
  { name: 'Rizky Hidayat', email: 'rizky@gmail.com', password: 'rizky123', phone: '081355667788', role: 'customer' },
]

const publicEvents = [
  {
    title: 'NEON JUNGLE FESTIVAL', slug: 'neon-jungle-festival',
    date: 'Sat, Oct 26 | 8 PM', fullDate: '2026-10-26', time: '8:00 PM - 2:00 AM',
    venue: 'Gelora Bung Karno Stadium', city: 'Jakarta', province: 'DKI Jakarta',
    address: 'Jl. Pintu Satu Senayan, Jakarta Pusat', lat: -6.2183, lng: 106.8023,
    category: 'Festivals', tags: ['Selling Fast', 'Popular'],
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=500&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=300&fit=crop',
    description: 'Experience the ultimate neon-lit jungle festival with world-class DJs, stunning visual projections, and an atmosphere that will transport you to another dimension.',
    artist: 'Various Artists', organizer: 'NEON Events Co.',
    tickets: [
      { type: 'General Admission', price: 89, description: 'Access to main festival grounds', available: 450 },
      { type: 'VIP', price: 199, description: 'VIP lounge access, free drinks, priority entry', available: 80 },
      { type: 'Premium VIP', price: 349, description: 'Backstage meet & greet, premium open bar, front row', available: 20 },
    ],
    merchandise: [
      { name: 'Neon Jungle T-Shirt', price: 35, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop', sizes: ['S','M','L','XL'], colors: ['Black','White'], stock: 200 },
      { name: 'Festival Hoodie', price: 65, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&h=300&fit=crop', sizes: ['S','M','L','XL'], colors: ['Black'], stock: 100 },
      { name: 'LED Wristband', price: 15, image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=300&h=300&fit=crop', sizes: [], colors: ['Multi'], stock: 500 },
      { name: 'Event Poster', price: 20, image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&h=300&fit=crop', sizes: [], colors: [], stock: 300 },
    ],
    hasMerch: true, discount: { percentage: 15, label: 'Early Bird Sale' },
  },
  {
    title: "LUNA'S WORLD TOUR", slug: 'lunas-world-tour',
    date: 'Sat, Nov 2 | 8 PM', fullDate: '2026-11-02', time: '8:00 PM - 11:00 PM',
    venue: 'Istora Senayan', city: 'Jakarta', province: 'DKI Jakarta',
    address: 'Jl. Pintu Satu Senayan, Jakarta Pusat', lat: -6.2244, lng: 106.8008,
    category: 'Concerts', tags: ['Selling Fast'],
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=500&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
    description: "Luna brings her electrifying World Tour! New tracks from platinum album 'Midnight Dreams' and fan favorites.",
    artist: 'Luna', organizer: 'Live Nation',
    tickets: [
      { type: 'Standard', price: 120, description: 'Upper bowl seating', available: 800 },
      { type: 'Floor', price: 220, description: 'Floor standing, close to stage', available: 300 },
      { type: 'VIP Package', price: 450, description: 'Meet & greet, signed poster, premium seating', available: 50 },
    ],
    merchandise: [
      { name: 'Luna World Tour T-Shirt', price: 40, image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=300&h=300&fit=crop', sizes: ['S','M','L','XL'], colors: ['Black','Purple'], stock: 500 },
      { name: 'Luna Album Vinyl', price: 30, image: 'https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?w=300&h=300&fit=crop', sizes: [], colors: [], stock: 200 },
      { name: 'Glow Stick Pack (5)', price: 12, image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=300&h=300&fit=crop', sizes: [], colors: ['Multi'], stock: 1000 },
    ],
    hasMerch: true,
  },
  {
    title: 'ELECTRIC DREAMS FESTIVAL', slug: 'electric-dreams-festival',
    date: 'Fri, Nov 8 | 6 PM', fullDate: '2026-11-08', time: '6:00 PM - 1:00 AM',
    venue: 'Trans Studio Bandung', city: 'Bandung', province: 'Jawa Barat',
    address: 'Jl. Gatot Subroto No.289, Bandung', lat: -6.9261, lng: 107.6345,
    category: 'Festivals', tags: ['Popular'],
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&h=500&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400&h=300&fit=crop',
    description: 'Electric Dreams takes over for one epic night of electronic music, art installations, and pure euphoria.',
    artist: 'Various Artists', organizer: 'Electric Dreams LLC',
    tickets: [
      { type: 'Early Bird', price: 65, description: 'Limited early bird pricing', available: 100 },
      { type: 'General Admission', price: 85, description: 'Full festival access', available: 600 },
      { type: 'VIP', price: 180, description: 'VIP area, complimentary bar', available: 120 },
    ],
    merchandise: [], hasMerch: false,
    discount: { percentage: 20, label: 'Flash Sale' },
  },
  {
    title: 'COMEDY NIGHT LIVE', slug: 'comedy-night-live',
    date: 'Sat, Nov 9 | 7 PM', fullDate: '2026-11-09', time: '7:00 PM - 10:00 PM',
    venue: 'Balai Sarbini', city: 'Jakarta', province: 'DKI Jakarta',
    address: 'Jl. Jend. Sudirman, Jakarta', lat: -6.2267, lng: 106.8071,
    category: 'Comedy', tags: [],
    image: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800&h=500&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=400&h=300&fit=crop',
    description: 'A hilarious evening of stand-up comedy featuring top comedians.',
    artist: 'Various Comedians', organizer: 'LOL Productions',
    tickets: [
      { type: 'Standard', price: 45, description: 'General seating', available: 300 },
      { type: 'Premium', price: 89, description: 'Front rows with drinks', available: 50 },
    ],
    merchandise: [], hasMerch: false,
  },
  {
    title: 'BALI SUNSET MUSIC FESTIVAL', slug: 'bali-sunset-music-festival',
    date: 'Sat, Nov 15 | 4 PM', fullDate: '2026-11-15', time: '4:00 PM - 12:00 AM',
    venue: 'Potato Head Beach Club', city: 'Denpasar', province: 'Bali',
    address: 'Jl. Petitenget, Seminyak, Bali', lat: -8.6837, lng: 115.1554,
    category: 'Festivals', tags: ['Popular'],
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=500&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=300&fit=crop',
    description: 'Experience magical sunset beats on the beautiful shores of Bali.',
    artist: 'Various Artists', organizer: 'Bali Events',
    tickets: [
      { type: 'General', price: 75, description: 'Beach access', available: 500 },
      { type: 'VIP', price: 150, description: 'VIP cabana area', available: 100 },
    ],
    merchandise: [
      { name: 'Bali Sunset Tee', price: 30, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop', sizes: ['S','M','L','XL'], colors: ['White','Blue'], stock: 200 },
    ],
    hasMerch: true, discount: { percentage: 10, label: 'Limited Offer' },
  },
  {
    title: 'SURABAYA ROCK REVOLUTION', slug: 'surabaya-rock-revolution',
    date: 'Sun, Nov 16 | 7 PM', fullDate: '2026-11-16', time: '7:00 PM - 11:00 PM',
    venue: 'Gelora Bung Tomo', city: 'Surabaya', province: 'Jawa Timur',
    address: 'Jl. Jajar Tunggal, Surabaya', lat: -7.3043, lng: 112.6736,
    category: 'Concerts', tags: [],
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=500&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop',
    description: 'Rock revolution featuring Indonesia best rock bands.',
    artist: 'Various Rock Bands', organizer: 'Surabaya Rock',
    tickets: [
      { type: 'General', price: 55, description: 'Standing area', available: 600 },
      { type: 'VIP', price: 120, description: 'VIP area with seating', available: 100 },
    ],
    merchandise: [], hasMerch: false,
  },
  {
    title: 'JOGJA ART & MUSIC FEST', slug: 'jogja-art-music-fest',
    date: 'Fri, Nov 17 | 5 PM', fullDate: '2026-11-17', time: '5:00 PM - 11:00 PM',
    venue: 'Candi Prambanan', city: 'Yogyakarta', province: 'DI Yogyakarta',
    address: 'Jl. Raya Solo - Yogyakarta', lat: -7.7520, lng: 110.4915,
    category: 'Festivals', tags: ['Popular'],
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=500&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop',
    description: 'Art and music festival at the iconic Prambanan Temple complex.',
    artist: 'Various Artists', organizer: 'Jogja Culture',
    tickets: [
      { type: 'General', price: 60, description: 'Festival grounds access', available: 400 },
      { type: 'VIP', price: 150, description: 'Premium area + art tour', available: 80 },
    ],
    merchandise: [
      { name: 'Jogja Fest T-Shirt', price: 28, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop', sizes: ['S','M','L','XL'], colors: ['Black','White'], stock: 200 },
    ],
    hasMerch: true,
  },
  {
    title: 'MAKASSAR SPORTS EXPO', slug: 'makassar-sports-expo',
    date: 'Sat, Nov 17 | 9 AM', fullDate: '2026-11-17', time: '9:00 AM - 6:00 PM',
    venue: 'Celebes Convention Center', city: 'Makassar', province: 'Sulawesi Selatan',
    address: 'Jl. Metro Tanjung Bunga, Makassar', lat: -5.1500, lng: 119.4200,
    category: 'Sports', tags: [],
    image: 'https://images.unsplash.com/photo-1461896836934-bd45ba8fcfdb?w=800&h=500&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1461896836934-bd45ba8fcfdb?w=400&h=300&fit=crop',
    description: 'Annual sports expo with exhibitions, talks, and athlete meet & greets.',
    artist: 'Various Athletes', organizer: 'Sports Indonesia',
    tickets: [
      { type: 'Day Pass', price: 25, description: 'Full day access', available: 1000 },
      { type: 'VIP', price: 75, description: 'Meet athletes + exclusive zone', available: 100 },
    ],
    merchandise: [
      { name: 'Sports Expo Cap', price: 18, image: 'https://images.unsplash.com/photo-1588850561407-ed78c334e67a?w=300&h=300&fit=crop', sizes: [], colors: ['Black','Red'], stock: 300 },
    ],
    hasMerch: true, discount: { percentage: 25, label: 'Weekend Deal' },
  },
  {
    title: 'NBA FINALS WATCH PARTY', slug: 'nba-finals-watch-party',
    date: 'Mon, Nov 18 | 6 PM', fullDate: '2026-11-18', time: '6:00 PM - 11:00 PM',
    venue: 'Stadion Manahan', city: 'Solo', province: 'Jawa Tengah',
    address: 'Jl. Adi Sucipto, Manahan, Solo', lat: -7.5558, lng: 110.8069,
    category: 'Sports', tags: ['Popular'],
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&h=500&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop',
    description: 'Watch the NBA Finals on a massive 40-foot screen with fellow fans!',
    artist: 'NBA Finals', organizer: 'Sports Bar Arena',
    tickets: [
      { type: 'General', price: 30, description: 'Standing area access', available: 500 },
      { type: 'Seated', price: 55, description: 'Reserved table seating', available: 100 },
    ],
    merchandise: [], hasMerch: false,
  },
  {
    title: 'MEDAN MUSIC MARATHON', slug: 'medan-music-marathon',
    date: 'Fri, Nov 22 | 5 PM', fullDate: '2026-11-22', time: '5:00 PM - 11:00 PM',
    venue: 'Lapangan Merdeka', city: 'Medan', province: 'Sumatera Utara',
    address: 'Jl. Balai Kota, Medan', lat: 3.5952, lng: 98.6722,
    category: 'Concerts', tags: ['Popular'],
    image: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&h=500&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=400&h=300&fit=crop',
    description: 'Full-day music marathon in Medan featuring local and national acts.',
    artist: 'Various Artists', organizer: 'Medan Musik Foundation',
    tickets: [
      { type: 'General', price: 50, description: 'General admission', available: 600 },
      { type: 'VIP', price: 120, description: 'VIP lounge and priority area', available: 100 },
    ],
    merchandise: [], hasMerch: false,
  },
  {
    title: 'PALEMBANG JAZZ FEST', slug: 'palembang-jazz-fest',
    date: 'Sat, Nov 23 | 7 PM', fullDate: '2026-11-23', time: '7:00 PM - 11:00 PM',
    venue: 'Benteng Kuto Besak', city: 'Palembang', province: 'Sumatera Selatan',
    address: 'Jl. Sultan Mahmud Badaruddin, Palembang', lat: -2.9916, lng: 104.7636,
    category: 'Concerts', tags: [],
    image: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800&h=500&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=400&h=300&fit=crop',
    description: 'Enchanting jazz evening at the historic Benteng Kuto Besak.',
    artist: 'Indonesian Jazz Stars', organizer: 'Palembang Arts Council',
    tickets: [
      { type: 'General', price: 40, description: 'Open area', available: 300 },
      { type: 'VIP', price: 90, description: 'Front row and drinks', available: 60 },
    ],
    merchandise: [], hasMerch: false,
  },
  {
    title: 'MANADO CULTURAL FEST', slug: 'manado-cultural-fest',
    date: 'Sun, Nov 24 | 3 PM', fullDate: '2026-11-24', time: '3:00 PM - 10:00 PM',
    venue: 'Mega Mall Manado', city: 'Manado', province: 'Sulawesi Utara',
    address: 'Jl. Piere Tendean, Manado', lat: 1.4874, lng: 124.8455,
    category: 'Festivals', tags: ['Popular'],
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=500&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=300&fit=crop',
    description: 'Celebrate the rich culture of North Sulawesi with traditional dance and music.',
    artist: 'Various Artists', organizer: 'Manado Cultural Board',
    tickets: [
      { type: 'General', price: 35, description: 'Festival access', available: 400 },
    ],
    merchandise: [], hasMerch: false,
    discount: { percentage: 30, label: 'Special Promo' },
  },
  {
    title: 'BALIKPAPAN BEATS', slug: 'balikpapan-beats',
    date: 'Sat, Nov 29 | 7 PM', fullDate: '2026-11-29', time: '7:00 PM - 12:00 AM',
    venue: 'Dome Balikpapan', city: 'Balikpapan', province: 'Kalimantan Timur',
    address: 'Jl. Jend. Sudirman, Balikpapan', lat: -1.2379, lng: 116.8529,
    category: 'Concerts', tags: ['Selling Fast'],
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=500&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop',
    description: 'Balikpapan biggest music night featuring EDM, hip-hop, and pop.',
    artist: 'Various Artists', organizer: 'Borneo Events',
    tickets: [
      { type: 'General', price: 55, description: 'General admission', available: 500 },
      { type: 'VIP', price: 130, description: 'VIP lounge with drinks', available: 80 },
    ],
    merchandise: [
      { name: 'Balikpapan Beats Tee', price: 30, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop', sizes: ['S','M','L','XL'], colors: ['Black','White'], stock: 200 },
    ],
    hasMerch: true,
  },
]

const adminEvents = [
  {
    title: 'Rock Fest Bandung 2026', slug: 'rock-fest-bandung-2026',
    date: 'Sat, Apr 18 | 7 PM', fullDate: '2026-04-18', time: '7:00 PM - 11:30 PM',
    venue: 'Lapangan Gasibu', city: 'Bandung', province: 'Jawa Barat',
    address: 'Jl. Diponegoro, Bandung', lat: -6.9025, lng: 107.6191,
    category: 'Concerts', tags: ['Rock', 'Popular'],
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=500&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop',
    description: 'Festival rock terbesar di Bandung! Band-band rock legendaris Indonesia dan internasional.',
    artist: 'Various Rock Bands', organizer: 'Budi Entertainment',
    createdByEmail: 'budi@monora.com',
    tickets: [
      { type: 'Regular', price: 150000, description: 'Akses area festival', available: 500 },
      { type: 'VIP', price: 350000, description: 'Area VIP + free drinks', available: 100 },
      { type: 'VVIP', price: 750000, description: 'Meet & greet + backstage', available: 30 },
    ],
    merchandise: [
      { name: 'Rock Fest T-Shirt', price: 120000, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop', sizes: ['S','M','L','XL'], colors: ['Black'], stock: 200 },
    ],
    hasMerch: true,
  },
  {
    title: 'Jazz Night Jakarta', slug: 'jazz-night-jakarta',
    date: 'Fri, May 9 | 8 PM', fullDate: '2026-05-09', time: '8:00 PM - 12:00 AM',
    venue: 'Jakarta Convention Center', city: 'Jakarta', province: 'DKI Jakarta',
    address: 'Jl. Gatot Subroto, Jakarta Selatan', lat: -6.2146, lng: 106.8073,
    category: 'Concerts', tags: ['Jazz', 'Premium'],
    image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&h=500&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400&h=300&fit=crop',
    description: 'Malam jazz eksklusif dengan musisi jazz terbaik Indonesia.',
    artist: 'Tompi, Indra Lesmana, Monita Tahalea', organizer: 'Budi Entertainment',
    createdByEmail: 'budi@monora.com',
    tickets: [
      { type: 'Standard', price: 250000, description: 'Seating area', available: 300 },
      { type: 'Premium', price: 500000, description: 'Front row + dinner', available: 80 },
    ],
    merchandise: [], hasMerch: false,
  },
  {
    title: 'Budi Comedy Show', slug: 'budi-comedy-show',
    date: 'Sun, Jun 15 | 7 PM', fullDate: '2026-06-15', time: '7:00 PM - 10:00 PM',
    venue: 'Balai Kartini', city: 'Jakarta', province: 'DKI Jakarta',
    address: 'Jl. Gatot Subroto Kav. 37, Jakarta', lat: -6.2297, lng: 106.8174,
    category: 'Comedy', tags: ['Comedy', 'New'],
    image: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800&h=500&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=400&h=300&fit=crop',
    description: 'Malam penuh tawa bersama komika-komika terbaik tanah air.',
    artist: 'Raditya Dika, Pandji, Cak Lontong', organizer: 'Budi Entertainment',
    createdByEmail: 'budi@monora.com', status: 'draft',
    tickets: [
      { type: 'Regular', price: 100000, description: 'General seating', available: 400 },
      { type: 'VIP', price: 250000, description: 'Front 3 rows + photo op', available: 50 },
    ],
    merchandise: [], hasMerch: false,
  },
  {
    title: 'EDM Beach Party Bali', slug: 'edm-beach-party-bali',
    date: 'Sat, Jul 25 | 4 PM', fullDate: '2026-07-25', time: '4:00 PM - 2:00 AM',
    venue: 'Potato Head Beach Club', city: 'Denpasar', province: 'Bali',
    address: 'Jl. Petitenget, Seminyak, Bali', lat: -8.6837, lng: 115.1554,
    category: 'Festivals', tags: ['EDM', 'Beach', 'Popular'],
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=500&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=300&fit=crop',
    description: 'Beach party EDM terbesar di Bali! DJ internasional dan sunset vibes.',
    artist: 'DJ Snake, Marshmello (Guest)', organizer: 'Sari Productions',
    createdByEmail: 'sari@monora.com',
    tickets: [
      { type: 'Early Bird', price: 200000, description: 'Limited early bird', available: 200 },
      { type: 'Regular', price: 350000, description: 'General access', available: 600 },
      { type: 'VIP Cabana', price: 1500000, description: 'Private cabana for 4', available: 20 },
    ],
    merchandise: [
      { name: 'Beach Party Tank Top', price: 100000, image: 'https://images.unsplash.com/photo-1503341504253-dff4855f4454?w=300&h=300&fit=crop', sizes: ['S','M','L'], colors: ['White','Neon Green'], stock: 300 },
      { name: 'LED Sunglasses', price: 50000, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=300&fit=crop', sizes: [], colors: ['Multi'], stock: 500 },
    ],
    hasMerch: true,
  },
  {
    title: 'Surabaya Art Exhibition', slug: 'surabaya-art-exhibition',
    date: 'Fri, Aug 8 | 10 AM', fullDate: '2026-08-08', time: '10:00 AM - 9:00 PM',
    venue: 'House of Sampoerna', city: 'Surabaya', province: 'Jawa Timur',
    address: 'Jl. Taman Sampoerna No.6, Surabaya', lat: -7.2347, lng: 112.7373,
    category: 'Festivals', tags: ['Art', 'Exhibition'],
    image: 'https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=800&h=500&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=400&h=300&fit=crop',
    description: 'Pameran seni kontemporer terbesar di Jawa Timur. 50+ seniman.',
    artist: 'Various Artists', organizer: 'Sari Productions',
    createdByEmail: 'sari@monora.com',
    tickets: [
      { type: 'Day Pass', price: 75000, description: 'Full day access', available: 1000 },
      { type: 'VIP Tour', price: 200000, description: 'Guided tour + artist meet', available: 50 },
    ],
    merchandise: [], hasMerch: false,
  },
  {
    title: 'Yogyakarta Food Festival', slug: 'yogyakarta-food-festival',
    date: 'Sat, Sep 20 | 11 AM', fullDate: '2026-09-20', time: '11:00 AM - 10:00 PM',
    venue: 'Alun-Alun Kidul', city: 'Yogyakarta', province: 'DI Yogyakarta',
    address: 'Alun-Alun Kidul, Yogyakarta', lat: -7.8107, lng: 110.3621,
    category: 'Festivals', tags: ['Food', 'Family'],
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=500&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop',
    description: 'Festival kuliner terbesar di Yogyakarta! 100+ booth makanan.',
    artist: 'Chef Juna, Chef Arnold', organizer: 'Sari Productions',
    createdByEmail: 'sari@monora.com', status: 'cancelled',
    tickets: [
      { type: 'General', price: 50000, description: 'Festival entry', available: 2000 },
    ],
    merchandise: [], hasMerch: false,
  },
]

async function createEvent(eventData, creatorId, catMap) {
  const catId = catMap.get(eventData.category) || null
  const event = await prisma.event.create({
    data: {
      title: eventData.title,
      slug: eventData.slug,
      display_date: eventData.date,
      full_date: new Date(eventData.fullDate),
      time_range: eventData.time,
      venue: eventData.venue,
      city: eventData.city,
      province: eventData.province || null,
      address: eventData.address || null,
      latitude: eventData.lat || null,
      longitude: eventData.lng || null,
      category_id: catId,
      image_url: eventData.image,
      thumbnail_url: eventData.thumbnail,
      description: eventData.description,
      artist: eventData.artist,
      organizer: eventData.organizer,
      status: eventData.status || 'published',
      has_merch: eventData.hasMerch || false,
      created_by: creatorId,
    },
  })

  // Tags
  if (eventData.tags?.length) {
    for (const tagName of eventData.tags) {
      const tag = await prisma.tag.upsert({
        where: { name: tagName }, update: {}, create: { name: tagName },
      })
      await prisma.eventTag.create({ data: { event_id: event.id, tag_id: tag.id } })
    }
  }

  // Tickets
  if (eventData.tickets?.length) {
    await prisma.ticketType.createMany({
      data: eventData.tickets.map(t => ({
        event_id: event.id,
        type_name: t.type,
        price: t.price,
        description: t.description || null,
        available: t.available || 0,
      })),
    })
  }

  // Merchandise
  if (eventData.merchandise?.length) {
    for (const m of eventData.merchandise) {
      const merch = await prisma.merchandise.create({
        data: {
          event_id: event.id,
          name: m.name,
          price: m.price,
          image_url: m.image || null,
          stock: m.stock || 0,
        },
      })
      if (m.sizes?.length) {
        await prisma.merchandiseSize.createMany({
          data: m.sizes.map(s => ({ merch_id: merch.id, size_name: s })),
        })
      }
      if (m.colors?.length) {
        await prisma.merchandiseColor.createMany({
          data: m.colors.map(c => ({ merch_id: merch.id, color_name: c })),
        })
      }
    }
  }

  // Discount
  if (eventData.discount) {
    await prisma.eventDiscount.create({
      data: {
        event_id: event.id,
        percentage: eventData.discount.percentage,
        label: eventData.discount.label || null,
        is_active: true,
      },
    })
  }

  return event
}

async function main() {
  console.log('🌱 Starting seed...')

  // Check if already seeded
  const userCount = await prisma.user.count()
  if (userCount > 0) {
    console.log('Database already has data. Skipping seed.')
    return
  }

  // 1. Create users
  const userMap = new Map()
  for (const u of seedUsers) {
    const hash = await bcrypt.hash(u.password, 10)
    const user = await prisma.user.create({
      data: {
        name: u.name,
        email: u.email,
        password_hash: hash,
        phone: u.phone,
        role: u.role,
      },
    })
    userMap.set(u.email, user.id)
    console.log(`  Created user: ${u.name} (${u.role})`)
  }

  // 2. Get category map
  const categories = await prisma.category.findMany()
  const catMap = new Map()
  for (const c of categories) catMap.set(c.name, c.id)

  // 3. Create public events (assigned to admin)
  const adminId = userMap.get('admin@monora.com')
  const publicEventMap = new Map()
  for (const e of publicEvents) {
    const event = await createEvent(e, adminId, catMap)
    publicEventMap.set(e.slug, event.id)
    console.log(`  Created public event: ${e.title}`)
  }

  // 4. Create admin events
  const adminEventMap = new Map()
  for (const e of adminEvents) {
    const creatorId = userMap.get(e.createdByEmail)
    const event = await createEvent(e, creatorId, catMap)
    adminEventMap.set(e.slug, event.id)
    console.log(`  Created admin event: ${e.title}`)
  }

  // 5. Create sample orders
  const andiId = userMap.get('andi@gmail.com')
  const mayaId = userMap.get('maya@gmail.com')
  const rizkyId = userMap.get('rizky@gmail.com')
  const rockFestId = adminEventMap.get('rock-fest-bandung-2026')
  const jazzNightId = adminEventMap.get('jazz-night-jakarta')
  const edmId = adminEventMap.get('edm-beach-party-bali')
  const artId = adminEventMap.get('surabaya-art-exhibition')

  // Get ticket type IDs
  const rockTickets = await prisma.ticketType.findMany({ where: { event_id: rockFestId } })
  const jazzTickets = await prisma.ticketType.findMany({ where: { event_id: jazzNightId } })
  const edmTickets = await prisma.ticketType.findMany({ where: { event_id: edmId } })
  const artTickets = await prisma.ticketType.findMany({ where: { event_id: artId } })

  const sampleOrders = [
    {
      code: 'ORD-SEED-001', userId: andiId, status: 'confirmed', total: 500000,
      subtotal: 500000, name: 'Andi Pratama', email: 'andi@gmail.com',
      items: [
        { eventId: rockFestId, ticketId: rockTickets.find(t => t.type_name === 'Regular')?.id, title: 'Regular', type: 'ticket', price: 150000, qty: 2 },
        { eventId: rockFestId, title: 'Rock Fest T-Shirt', type: 'merch', price: 120000, qty: 1, size: 'L', color: 'Black' },
      ],
    },
    {
      code: 'ORD-SEED-002', userId: mayaId, status: 'confirmed', total: 750000,
      subtotal: 750000, name: 'Maya Putri', email: 'maya@gmail.com',
      items: [
        { eventId: rockFestId, ticketId: rockTickets.find(t => t.type_name === 'VIP')?.id, title: 'VIP', type: 'ticket', price: 350000, qty: 1 },
        { eventId: jazzNightId, ticketId: jazzTickets.find(t => t.type_name === 'Standard')?.id, title: 'Standard', type: 'ticket', price: 250000, qty: 1 },
      ],
    },
    {
      code: 'ORD-SEED-003', userId: rizkyId, status: 'confirmed', total: 1000000,
      subtotal: 1000000, name: 'Rizky Hidayat', email: 'rizky@gmail.com',
      items: [
        { eventId: jazzNightId, ticketId: jazzTickets.find(t => t.type_name === 'Premium')?.id, title: 'Premium', type: 'ticket', price: 500000, qty: 2 },
      ],
    },
    {
      code: 'ORD-SEED-004', userId: mayaId, status: 'confirmed', total: 550000,
      subtotal: 550000, name: 'Maya Putri', email: 'maya@gmail.com',
      items: [
        { eventId: edmId, ticketId: edmTickets.find(t => t.type_name === 'Early Bird')?.id, title: 'Early Bird', type: 'ticket', price: 200000, qty: 2 },
        { eventId: edmId, title: 'Beach Party Tank Top', type: 'merch', price: 100000, qty: 1, size: 'M', color: 'White' },
      ],
    },
    {
      code: 'ORD-SEED-005', userId: rizkyId, status: 'confirmed', total: 1500000,
      subtotal: 1500000, name: 'Rizky Hidayat', email: 'rizky@gmail.com',
      items: [
        { eventId: edmId, ticketId: edmTickets.find(t => t.type_name === 'VIP Cabana')?.id, title: 'VIP Cabana', type: 'ticket', price: 1500000, qty: 1 },
      ],
    },
    {
      code: 'ORD-SEED-006', userId: andiId, status: 'confirmed', total: 275000,
      subtotal: 275000, name: 'Andi Pratama', email: 'andi@gmail.com',
      items: [
        { eventId: artId, ticketId: artTickets.find(t => t.type_name === 'Day Pass')?.id, title: 'Day Pass', type: 'ticket', price: 75000, qty: 1 },
        { eventId: artId, ticketId: artTickets.find(t => t.type_name === 'VIP Tour')?.id, title: 'VIP Tour', type: 'ticket', price: 200000, qty: 1 },
      ],
    },
  ]

  for (const o of sampleOrders) {
    const order = await prisma.order.create({
      data: {
        order_code: o.code,
        user_id: o.userId,
        status: o.status,
        subtotal: o.subtotal,
        total: o.total,
        customer_name: o.name,
        customer_email: o.email,
      },
    })
    for (const item of o.items) {
      await prisma.orderItem.create({
        data: {
          order_id: order.id,
          item_type: item.type,
          event_id: item.eventId || null,
          ticket_type_id: item.ticketId || null,
          title: item.title,
          quantity: item.qty,
          unit_price: item.price,
          size: item.size || null,
          color: item.color || null,
        },
      })
    }
    console.log(`  Created order: ${o.code}`)
  }

  console.log('✅ Seed completed!')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
