import { useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { IoCalendarOutline, IoLocationSharp, IoTimeOutline, IoPersonOutline, IoBusinessOutline, IoArrowBack, IoTicketOutline, IoCartOutline, IoCheckmarkCircle, IoShirtOutline, IoChatbubbleEllipsesOutline } from 'react-icons/io5'
import { getDiscountedPrice } from '../data/events'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import TicketSelection from '../components/TicketSelection'
import MerchandiseSection from '../components/MerchandiseSection'
import OrganizerChat from '../components/OrganizerChat'
import { formatRupiah } from '../utils/currency'

function EventDetailPage() {
  const { id } = useParams()
  const { publicEvents, adminEvents, isAuthenticated, user, loading } = useAuth()
  const eventsForLookup = useMemo(() => {
    if (user?.role === 'event_admin' || user?.role === 'app_admin') {
      const map = new Map()
        ;[...publicEvents, ...adminEvents].forEach((e) => map.set(String(e.id), e))
      return Array.from(map.values())
    }
    return publicEvents
  }, [publicEvents, adminEvents, user])
  const event = eventsForLookup.find(e => String(e.id) === id || e.slug === id)
  const { itemCount } = useCart()
  const [activeTab, setActiveTab] = useState('tickets')
  const [chatOpen, setChatOpen] = useState(false)

  if (loading) {
    return (
      <div className="bg-[#0B0D1A] min-h-screen pt-24 flex items-center justify-center">
        <div className="text-white/50 text-lg">Memuat...</div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="bg-[#0B0D1A] min-h-screen pt-24 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-4xl font-bold text-white mb-4">Acara Tidak Ditemukan</h1>
        <p className="text-white/50 mb-8">Acara yang Anda cari tidak ada atau telah dihapus.</p>
        <Link
          to="/events"
          className="text-white px-6 py-3 rounded-full text-sm font-semibold no-underline"
          style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
        >
          Kembali ke Acara
        </Link>
      </div>
    )
  }

  const lowestPrice = Math.min(...event.tickets.map(t => t.price))
  const discountedLowestPrice = event.discount ? getDiscountedPrice(lowestPrice, event.discount) : lowestPrice

  return (
    <div className="bg-[#0B0D1A] min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-[400px] md:h-[500px] overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to top, #0B0D1A 0%, rgba(11,13,26,0.7) 50%, rgba(11,13,26,0.3) 100%)'
        }} />

        {/* Back Button */}
        <div className="absolute top-24 left-6 md:left-10 z-10">
          <Link
            to="/events"
            className="flex items-center gap-2 text-white/80 hover:text-white text-sm no-underline transition-colors"
          >
            <IoArrowBack className="text-lg" />
            Kembali ke Acara
          </Link>
        </div>

        {/* Event Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-10 pb-8 z-10">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-xs font-semibold px-3 py-1 rounded-full text-white"
                  style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
                >
                  {event.category}
                </span>
                {event.tags.map(tag => (
                  <span key={tag} className="text-xs font-semibold px-3 py-1 rounded-full text-white"
                    style={{
                      background: tag === 'Selling Fast'
                        ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                        : 'linear-gradient(135deg, #6366f1, #4f46e5)'
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2"
                style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
              >
                {event.title}
              </h1>
              <p className="text-white/60 text-lg">
                Tiket dari {event.discount && (
                  <span className="text-white/40 line-through mr-2">{formatRupiah(lowestPrice)}</span>
                )}
                <span className="text-orange-400 font-bold">{formatRupiah(discountedLowestPrice)}</span>
                {event.discount && (
                  <span className="ml-2 text-xs font-semibold px-2 py-1 rounded-full text-emerald-300 inline-block"
                    style={{ background: 'rgba(16,185,129,0.15)' }}
                  >
                    {event.discount.label} -{event.discount.percentage}%
                  </span>
                )}
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left: Event Info */}
          <div className="lg:col-span-2">
            {/* Event Details Grid */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            >
              {[
                { icon: <IoCalendarOutline />, label: 'Tanggal', value: event.date.split('|')[0].trim() },
                { icon: <IoTimeOutline />, label: 'Waktu', value: event.time },
                { icon: <IoLocationSharp />, label: 'Venue', value: event.venue },
                { icon: <IoPersonOutline />, label: 'Artis', value: event.artist },
              ].map((info, i) => (
                <div key={i} className="rounded-xl p-4"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <div className="text-orange-400 text-xl mb-2">{info.icon}</div>
                  <p className="text-white/40 text-xs mb-1">{info.label}</p>
                  <p className="text-white text-sm font-semibold">{info.value}</p>
                </div>
              ))}
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8"
            >
              <h2 className="text-xl font-bold text-white mb-4">Tentang Acara Ini</h2>
              <p className="text-white/60 leading-relaxed">{event.description}</p>
              <div className="mt-4 flex items-center gap-2 text-white/40 text-sm">
                <IoBusinessOutline className="text-lg" />
                <span>Diselenggarakan oleh <span className="text-white/70">{event.organizer}</span></span>
              </div>
              {isAuthenticated && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setChatOpen(true)}
                  className="mt-3 flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm font-medium cursor-pointer bg-transparent border-none transition-colors"
                >
                  <IoChatbubbleEllipsesOutline className="text-lg" />
                  Chat dengan Penyelenggara
                </motion.button>
              )}
            </motion.div>

            {/* Venue Info */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="rounded-xl p-6 mb-8"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <h3 className="text-lg font-bold text-white mb-3">Venue</h3>
              <p className="text-white/80 font-medium mb-1">{event.venue}</p>
              <p className="text-white/50 text-sm mb-4">{event.address}</p>
              <div className="rounded-xl overflow-hidden h-[200px]">
                <iframe
                  title="venue-map"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(event.address)}&output=embed`}
                  className="w-full h-full border-none"
                  loading="lazy"
                />
              </div>
            </motion.div>

            {/* Tabs: Tickets / Merchandise */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex gap-1 mb-6 rounded-xl p-1"
                style={{ background: 'rgba(255,255,255,0.04)' }}
              >
                <button
                  onClick={() => setActiveTab('tickets')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold cursor-pointer transition-all border-none ${activeTab === 'tickets' ? 'text-white' : 'text-white/40 hover:text-white/70 bg-transparent'
                    }`}
                  style={activeTab === 'tickets' ? { background: 'linear-gradient(135deg, #f97316, #ea580c)' } : {}}
                >
                  <IoTicketOutline className="text-lg" />
                  Tiket
                </button>
                {event.hasMerch && (
                  <button
                    onClick={() => setActiveTab('merch')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold cursor-pointer transition-all border-none ${activeTab === 'merch' ? 'text-white' : 'text-white/40 hover:text-white/70 bg-transparent'
                      }`}
                    style={activeTab === 'merch' ? { background: 'linear-gradient(135deg, #f97316, #ea580c)' } : {}}
                  >
                    <IoShirtOutline className="text-lg" />
                    Merchandise
                  </button>
                )}
              </div>

              <AnimatePresence mode="wait">
                {activeTab === 'tickets' ? (
                  <motion.div
                    key="tickets"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TicketSelection event={event} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="merch"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <MerchandiseSection event={event} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Right: Sidebar Sticky Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="rounded-2xl p-6"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <h3 className="text-lg font-bold text-white mb-4">Ringkasan Acara</h3>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm">
                    <IoCalendarOutline className="text-orange-400" />
                    <span className="text-white/70">{event.date}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <IoTimeOutline className="text-orange-400" />
                    <span className="text-white/70">{event.time}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <IoLocationSharp className="text-orange-400" />
                    <span className="text-white/70">{event.venue}, {event.city}</span>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4 mb-4">
                  <p className="text-white/40 text-xs mb-1">Mulai dari</p>
                  {event.discount ? (
                    <div>
                      <span className="text-white/40 line-through text-lg mr-2">{formatRupiah(lowestPrice)}</span>
                      <span className="text-3xl font-bold text-white">{formatRupiah(discountedLowestPrice)}</span>
                      <span className="text-sm text-white/40 font-normal ml-1">/ tiket</span>
                      <div className="mt-2">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full text-emerald-300"
                          style={{ background: 'rgba(16,185,129,0.15)' }}
                        >
                          {event.discount.label} — Hemat {event.discount.percentage}%
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-3xl font-bold text-white">
                      {formatRupiah(lowestPrice)}
                      <span className="text-sm text-white/40 font-normal ml-1">/ tiket</span>
                    </p>
                  )}
                </div>

                <Link
                  to="/cart"
                  className="flex items-center justify-center gap-2 w-full text-white py-3.5 rounded-xl text-sm font-semibold no-underline transition-all hover:opacity-90"
                  style={{
                    background: 'linear-gradient(135deg, #f97316, #ea580c)',
                    boxShadow: '0 4px 15px rgba(249,115,22,0.3)',
                  }}
                >
                  <IoCartOutline className="text-lg" />
                  Lihat Keranjang {itemCount > 0 && `(${itemCount})`}
                </Link>

                {event.hasMerch && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-emerald-400">
                    <IoCheckmarkCircle />
                    <span>Merchandise tersedia</span>
                  </div>
                )}

                {!event.hasMerch && (
                  <p className="mt-4 text-xs text-white/30 text-center">
                    Tidak ada merchandise tersedia untuk acara ini
                  </p>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Organizer Chat Modal */}
      {isAuthenticated && (
        <OrganizerChat
          isOpen={chatOpen}
          onClose={() => setChatOpen(false)}
          event={event}
        />
      )}
    </div>
  )
}

export default EventDetailPage
