import { useState, useEffect, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { IoGridOutline, IoListOutline, IoShirtOutline, IoClose } from 'react-icons/io5'
import { getDiscountedPrice } from '../data/events'
import SearchBar from '../components/SearchBar'
import { useAuth } from '../context/AuthContext'
import { formatRupiah } from '../utils/currency'

function EventsPage() {
  const { categories, publicEvents } = useAuth()
  const categoryFilters = ['Semua', ...categories.map(c => c.name)]
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeCategory, setActiveCategory] = useState('Semua')
  const [viewMode, setViewMode] = useState('grid')

  // Read search params
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [cityFilter, setCityFilter] = useState(searchParams.get('city') || '')
  const [dateFilter, setDateFilter] = useState(searchParams.get('date') || '')

  // Sync URL params on mount and when params change
  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '')
    setCityFilter(searchParams.get('city') || '')
    setDateFilter(searchParams.get('date') || '')
  }, [searchParams])

  // Filter events
  const filteredEvents = useMemo(() => {
    let events = publicEvents

    // Category filter
    if (activeCategory !== 'Semua') {
      events = events.filter(e => e.category === activeCategory)
    }

    // Text search (title, artist, venue)
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      events = events.filter(e =>
        e.title.toLowerCase().includes(q) ||
        e.artist.toLowerCase().includes(q) ||
        e.venue.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q)
      )
    }

    // City filter
    if (cityFilter) {
      const c = cityFilter.toLowerCase()
      events = events.filter(e =>
        e.city.toLowerCase().includes(c) ||
        e.province.toLowerCase().includes(c)
      )
    }

    // Date filter
    if (dateFilter) {
      events = events.filter(e => e.fullDate === dateFilter)
    }

    return events
  }, [activeCategory, searchQuery, cityFilter, dateFilter])

  const handleSearch = ({ query, city, date }) => {
    setSearchQuery(query)
    setCityFilter(city)
    setDateFilter(date)

    // Update URL
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (city) params.set('city', city)
    if (date) params.set('date', date)
    setSearchParams(params)
  }

  const clearFilter = (type) => {
    const params = new URLSearchParams(searchParams)
    if (type === 'q') { setSearchQuery(''); params.delete('q') }
    if (type === 'city') { setCityFilter(''); params.delete('city') }
    if (type === 'date') { setDateFilter(''); params.delete('date') }
    setSearchParams(params)
  }

  const hasActiveFilters = searchQuery || cityFilter || dateFilter

  const clearAllFilters = () => {
    setSearchQuery('')
    setCityFilter('')
    setDateFilter('')
    setActiveCategory('Semua')
    setSearchParams({})
  }

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return ''
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="bg-[#0B0D1A] min-h-screen pt-24">
      {/* Hero Banner */}
      <section className="relative py-16 px-6 md:px-10 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #f97316, transparent)' }}
          />
          <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }}
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-orange-400 text-sm font-semibold tracking-widest uppercase mb-4 block"
          >
            Jelajahi
          </motion.span>
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="text-4xl md:text-6xl font-extrabold text-white mb-6"
            style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
          >
            Semua Acara
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-white/50 text-lg max-w-xl leading-relaxed mb-8"
          >
            Jelajahi pilihan acara, konser, dan festival terpopuler yang terkurasi di dekat Anda.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <SearchBar compact onSearch={handleSearch} />
          </motion.div>
        </div>
      </section>

      {/* Filters & Events Grid */}
      <section className="py-8 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex flex-wrap gap-2">
              {categoryFilters.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-medium cursor-pointer transition-all border-none ${activeCategory === cat
                      ? 'text-white'
                      : 'text-white/50 hover:text-white'
                    }`}
                  style={{
                    background: activeCategory === cat
                      ? 'linear-gradient(135deg, #f97316, #ea580c)'
                      : 'rgba(255,255,255,0.06)',
                    border: activeCategory === cat ? 'none' : '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer border-none transition-all ${viewMode === 'grid' ? 'bg-white/15 text-white' : 'bg-transparent text-white/40'
                  }`}
              >
                <IoGridOutline />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer border-none transition-all ${viewMode === 'list' ? 'bg-white/15 text-white' : 'bg-transparent text-white/40'
                  }`}
              >
                <IoListOutline />
              </button>
            </div>
          </div>

          {/* Results count + active filters */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <p className="text-white/40 text-sm m-0">{filteredEvents.length} acara ditemukan</p>
            {hasActiveFilters && (
              <>
                {searchQuery && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full text-orange-300 bg-orange-500/10 border border-orange-500/20">
                    "{searchQuery}"
                    <button onClick={() => clearFilter('q')} className="bg-transparent border-none cursor-pointer p-0 text-orange-300/60 hover:text-orange-300 transition-colors"><IoClose className="text-xs" /></button>
                  </span>
                )}
                {cityFilter && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full text-blue-300 bg-blue-500/10 border border-blue-500/20">
                    📍 {cityFilter}
                    <button onClick={() => clearFilter('city')} className="bg-transparent border-none cursor-pointer p-0 text-blue-300/60 hover:text-blue-300 transition-colors"><IoClose className="text-xs" /></button>
                  </span>
                )}
                {dateFilter && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full text-purple-300 bg-purple-500/10 border border-purple-500/20">
                    📅 {formatDisplayDate(dateFilter)}
                    <button onClick={() => clearFilter('date')} className="bg-transparent border-none cursor-pointer p-0 text-purple-300/60 hover:text-purple-300 transition-colors"><IoClose className="text-xs" /></button>
                  </span>
                )}
                <button
                  onClick={clearAllFilters}
                  className="text-white/30 text-xs font-medium cursor-pointer bg-transparent border-none hover:text-white/60 transition-colors"
                >
                  Hapus semua
                </button>
              </>
            )}
          </div>

          {/* Events Grid */}
          {filteredEvents.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-white font-bold text-xl mb-2">Tidak ada acara ditemukan</h3>
              <p className="text-white/40 text-sm max-w-sm mx-auto mb-6">
                Coba sesuaikan filter pencarian Anda atau jelajahi semua acara.
              </p>
              <button
                onClick={clearAllFilters}
                className="text-white px-6 py-2.5 rounded-full text-sm font-semibold border-none cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
              >
                Tampilkan Semua Acara
              </button>
            </motion.div>
          ) : (
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'flex flex-col gap-4'
            }>
              {filteredEvents.map((event, index) => (
                <Link to={`/event/${event.id}`} key={event.id} className="no-underline">
                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    whileHover={{ y: -4 }}
                    className={`rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300 ${viewMode === 'list' ? 'flex flex-row' : ''
                      }`}
                    style={{
                      background: 'linear-gradient(180deg, rgba(30,30,60,0.8) 0%, rgba(15,15,35,0.95) 100%)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    {/* Image */}
                    <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-48 h-auto shrink-0' : 'h-[200px]'
                      }`}>
                      <img
                        src={event.thumbnail}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D1A] via-transparent to-transparent opacity-50" />
                      {event.hasMerch && (
                        <div className="absolute top-3 right-3 bg-indigo-500/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                          <IoShirtOutline className="text-xs" />
                          Merch
                        </div>
                      )}
                      {event.discount && (
                        <div className="absolute top-3 left-3 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full"
                          style={{ background: 'rgba(16,185,129,0.85)' }}
                        >
                          -{event.discount.percentage}% {event.discount.label}
                        </div>
                      )}
                    </div>

                    {/* Body */}
                    <div className="p-5 flex-1">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-white font-bold text-base tracking-wide">{event.title}</h3>
                        <span className="text-xs text-white/30 px-2.5 py-1 rounded-full shrink-0"
                          style={{ background: 'rgba(255,255,255,0.06)' }}
                        >
                          {event.category}
                        </span>
                      </div>
                      <p className="text-white/50 text-sm mb-1">{event.date}</p>
                      <p className="text-white/40 text-sm mb-3">{event.venue}, {event.city}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-white text-sm font-semibold">
                          {event.discount ? (
                            <>
                              <span className="text-white/40 line-through mr-1">{formatRupiah(Math.min(...event.tickets.map(tk => tk.price)))}</span>
                              Dari <span className="text-orange-400">{formatRupiah(getDiscountedPrice(Math.min(...event.tickets.map(tk => tk.price)), event.discount))}</span>
                            </>
                          ) : (
                            <>Mulai dari <span className="text-orange-400">{formatRupiah(Math.min(...event.tickets.map(tk => tk.price)))}</span></>
                          )}
                        </p>
                        <div className="flex gap-1.5">
                          {event.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] font-semibold px-2.5 py-1 rounded-full text-white"
                              style={{
                                background: tag === 'Selling Fast'
                                  ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                                  : 'linear-gradient(135deg, #6366f1, #4f46e5)',
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          )}

          {/* Load More */}
          {filteredEvents.length > 0 && (
            <div className="text-center mt-12">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-white font-semibold text-sm px-8 py-3.5 rounded-full cursor-pointer bg-transparent"
                style={{ border: '1px solid rgba(255,255,255,0.2)' }}
              >
                Muat Lebih Banyak Acara
              </motion.button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default EventsPage
