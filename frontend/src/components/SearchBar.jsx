import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { IoSearch, IoLocationSharp, IoCalendarOutline, IoCloseCircle, IoChevronBack, IoChevronForward, IoMusicalNotes } from 'react-icons/io5'
import { useAuth } from '../context/AuthContext'
import { formatRupiah } from '../utils/currency'

// ─── Portal Dropdown (renders at body level to avoid overflow clipping) ───
function PortalDropdown({ anchorRef, children, visible, align = 'left', dropdownRef }) {
  const [pos, setPos] = useState({ top: 0, left: 0, right: 0 })

  useEffect(() => {
    if (!visible || !anchorRef.current) return
    const update = () => {
      const rect = anchorRef.current.getBoundingClientRect()
      setPos({
        top: rect.bottom + 8,
        left: rect.left,
        right: window.innerWidth - rect.right,
      })
    }
    update()
    window.addEventListener('scroll', update, true)
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update, true)
      window.removeEventListener('resize', update)
    }
  }, [visible, anchorRef, align])

  if (!visible) return null

  return createPortal(
    <div
      ref={dropdownRef}
      className="fixed z-[9999]"
      style={{
        top: pos.top,
        ...(align === 'right' ? { right: pos.right } : { left: pos.left }),
      }}
    >
      {children}
    </div>,
    document.body
  )
}

// ─── Calendar Component ───
function Calendar({ selectedDate, onSelectDate, onClose, events: allEvents }) {
  const [viewDate, setViewDate] = useState(() => {
    const d = selectedDate ? new Date(selectedDate) : new Date()
    return { year: d.getFullYear(), month: d.getMonth() }
  })

  const daysInMonth = new Date(viewDate.year, viewDate.month + 1, 0).getDate()
  const firstDay = new Date(viewDate.year, viewDate.month, 1).getDay()
  const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
  const dayNames = ['Mi', 'Se', 'Sl', 'Ra', 'Ka', 'Ju', 'Sa']

  const eventDates = new Set(
    allEvents
      .map(e => e.fullDate)
      .filter(d => {
        const date = new Date(d)
        return date.getFullYear() === viewDate.year && date.getMonth() === viewDate.month
      })
      .map(d => new Date(d).getDate())
  )

  const eventsOnDate = selectedDate
    ? allEvents.filter(e => e.fullDate === selectedDate)
    : []

  const prevMonth = () => {
    setViewDate(prev => prev.month === 0 ? { year: prev.year - 1, month: 11 } : { ...prev, month: prev.month - 1 })
  }
  const nextMonth = () => {
    setViewDate(prev => prev.month === 11 ? { year: prev.year + 1, month: 0 } : { ...prev, month: prev.month + 1 })
  }

  const handleDayClick = (day) => {
    const m = String(viewDate.month + 1).padStart(2, '0')
    const d = String(day).padStart(2, '0')
    onSelectDate(`${viewDate.year}-${m}-${d}`)
  }

  const isSelected = (day) => {
    if (!selectedDate) return false
    const m = String(viewDate.month + 1).padStart(2, '0')
    const d = String(day).padStart(2, '0')
    return selectedDate === `${viewDate.year}-${m}-${d}`
  }

  const isToday = (day) => {
    const now = new Date()
    return now.getDate() === day && now.getMonth() === viewDate.month && now.getFullYear() === viewDate.year
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.97 }}
      transition={{ duration: 0.2 }}
      className="rounded-xl p-4 w-[300px]"
      style={{
        background: 'rgba(20, 20, 50, 0.98)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
      }}
    >
      {/* Month/Year Header */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={prevMonth} className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border-none transition-all">
          <IoChevronBack className="text-sm" />
        </button>
        <span className="text-white font-semibold text-sm">
          {monthNames[viewDate.month]} {viewDate.year}
        </span>
        <button onClick={nextMonth} className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border-none transition-all">
          <IoChevronForward className="text-sm" />
        </button>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {dayNames.map(d => (
          <div key={d} className="text-center text-white/30 text-[10px] font-semibold py-1">{d}</div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
          const hasEvent = eventDates.has(day)
          const selected = isSelected(day)
          const today = isToday(day)
          return (
            <button
              key={day}
              onClick={() => handleDayClick(day)}
              className={`relative w-full aspect-square rounded-lg flex items-center justify-center text-xs font-medium cursor-pointer border-none transition-all
                ${selected
                  ? 'text-white'
                  : today
                    ? 'text-orange-400 bg-orange-500/10'
                    : hasEvent
                      ? 'text-white hover:bg-white/10'
                      : 'text-white/40 hover:bg-white/5'
                }
              `}
              style={selected ? { background: 'linear-gradient(135deg, #f97316, #ea580c)' } : {}}
            >
              {day}
              {hasEvent && !selected && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-orange-400" />
              )}
            </button>
          )
        })}
      </div>

      {/* Events on selected date */}
      {eventsOnDate.length > 0 && (
        <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="text-white/30 text-[10px] font-semibold uppercase tracking-wider mb-2">Acara pada tanggal ini</div>
          {eventsOnDate.map(event => (
            <div key={event.id} className="flex items-center gap-2.5 py-1.5">
              <img src={event.thumbnail} alt="" className="w-7 h-7 rounded object-cover shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="text-white text-[11px] font-medium truncate">{event.title}</div>
                <div className="text-white/30 text-[10px]">{event.city}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <button
          onClick={() => { onSelectDate(''); onClose() }}
          className="text-white/40 text-xs font-medium cursor-pointer bg-transparent border-none hover:text-white transition-colors"
        >
          Hapus
        </button>
        <button
          onClick={onClose}
          className="text-orange-400 text-xs font-semibold cursor-pointer bg-transparent border-none hover:text-orange-300 transition-colors"
        >
          Selesai
        </button>
      </div>
    </motion.div>
  )
}

// ─── Search Suggestions Dropdown ───
function SearchSuggestions({ query, onSelect, onNavigate, events: allEvents }) {
  const q = query.toLowerCase().trim()
  if (!q || q.length < 2) return null

  const eventMatches = allEvents.filter(e =>
    e.title.toLowerCase().includes(q) ||
    e.artist.toLowerCase().includes(q) ||
    e.venue.toLowerCase().includes(q)
  ).slice(0, 5)

  const categoryMatches = ['Concerts', 'Festivals', 'Comedy', 'Sports'].filter(c =>
    c.toLowerCase().includes(q)
  )

  if (eventMatches.length === 0 && categoryMatches.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.15 }}
      className="rounded-xl overflow-hidden w-[380px] max-w-[calc(100vw-2rem)]"
      style={{
        background: 'rgba(20, 20, 50, 0.98)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        maxHeight: '400px',
        overflowY: 'auto',
      }}
    >
      {/* Event Results */}
      {eventMatches.length > 0 && (
        <div className="p-2">
          <div className="text-white/30 text-[10px] font-semibold uppercase tracking-wider px-2 py-1.5">Acara</div>
          {eventMatches.map(event => (
            <button
              key={event.id}
              onClick={() => onNavigate(`/event/${event.id}`)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer border-none bg-transparent hover:bg-white/5 transition-all text-left group"
            >
              <img src={event.thumbnail} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-white text-sm font-medium group-hover:text-orange-400 transition-colors truncate">{event.title}</div>
                <div className="text-white/30 text-[11px]">{event.venue}, {event.city} · {event.date}</div>
              </div>
              <span className="text-white/15 text-[11px] shrink-0">
                {formatRupiah(Math.min(...event.tickets.map(t => t.price)))}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Category suggestions */}
      {categoryMatches.length > 0 && (
        <div className="p-2" style={eventMatches.length > 0 ? { borderTop: '1px solid rgba(255,255,255,0.06)' } : {}}>
          <div className="text-white/30 text-[10px] font-semibold uppercase tracking-wider px-2 py-1.5">Kategori</div>
          {categoryMatches.map(cat => (
            <button
              key={cat}
              onClick={() => onSelect(cat)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer border-none bg-transparent hover:bg-white/5 transition-all text-left group"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-indigo-500/10 shrink-0">
                <IoMusicalNotes className="text-indigo-400 text-sm" />
              </div>
              <div className="text-white text-sm font-medium group-hover:text-orange-400 transition-colors">{cat}</div>
              <span className="text-white/20 text-[11px] ml-auto shrink-0">
                {allEvents.filter(e => e.category === cat).length} acara
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Search hint */}
      <div className="px-4 py-2.5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <button
          onClick={() => onSelect(query)}
          className="flex items-center gap-2 text-white/30 text-xs cursor-pointer bg-transparent border-none hover:text-white/50 transition-colors w-full text-left"
        >
          <IoSearch className="text-sm" />
          <span>Cari "<span className="text-orange-400/70">{query}</span>"</span>
        </button>
      </div>
    </motion.div>
  )
}

// ─── Location Dropdown ───
function LocationDropdown({ query, onSelect, events: allEvents }) {
  const cities = [...new Set(allEvents.map(e => e.city))]
  const q = query.toLowerCase().trim()

  const matches = q
    ? cities.filter(c => c.toLowerCase().includes(q)).map(city => {
      const events = allEvents.filter(e => e.city === city)
      return { city, province: events[0].province, count: events.length }
    })
    : cities.slice(0, 8).map(city => {
      const events = allEvents.filter(e => e.city === city)
      return { city, province: events[0].province, count: events.length }
    })

  const eventMatches = q
    ? allEvents.filter(e =>
      e.title.toLowerCase().includes(q) ||
      e.venue.toLowerCase().includes(q) ||
      e.province.toLowerCase().includes(q)
    ).slice(0, 4)
    : []

  if (matches.length === 0 && eventMatches.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        className="rounded-xl p-4 w-[320px]"
        style={{
          background: 'rgba(20, 20, 50, 0.98)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        }}
      >
        <p className="text-white/40 text-xs text-center py-2 m-0">Tidak ada lokasi ditemukan untuk "{query}"</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="rounded-xl overflow-hidden w-[320px]"
      style={{
        background: 'rgba(20, 20, 50, 0.98)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        maxHeight: '380px',
        overflowY: 'auto',
      }}
    >
      {matches.length > 0 && (
        <div className="p-2">
          <div className="text-white/30 text-[10px] font-semibold uppercase tracking-wider px-2 py-1.5">Kota</div>
          {matches.map(m => (
            <button
              key={m.city}
              onClick={() => onSelect(m.city)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer border-none bg-transparent hover:bg-white/5 transition-all text-left group"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-orange-500/10 shrink-0">
                <IoLocationSharp className="text-orange-400 text-sm" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white text-sm font-medium group-hover:text-orange-400 transition-colors">{m.city}</div>
                <div className="text-white/30 text-[11px]">{m.province}</div>
              </div>
              <span className="text-white/20 text-[11px] shrink-0">{m.count} acara</span>
            </button>
          ))}
        </div>
      )}

      {eventMatches.length > 0 && (
        <div className="p-2" style={matches.length > 0 ? { borderTop: '1px solid rgba(255,255,255,0.06)' } : {}}>
          <div className="text-white/30 text-[10px] font-semibold uppercase tracking-wider px-2 py-1.5">Acara</div>
          {eventMatches.map(event => (
            <button
              key={event.id}
              onClick={() => onSelect(event.city)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer border-none bg-transparent hover:bg-white/5 transition-all text-left group"
            >
              <img src={event.thumbnail} alt="" className="w-8 h-8 rounded-lg object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-white text-xs font-medium group-hover:text-orange-400 transition-colors truncate">{event.title}</div>
                <div className="text-white/30 text-[11px]">{event.city} · {event.date}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </motion.div>
  )
}

// ─── Main SearchBar Component ───
function SearchBar({ compact = false, onSearch }) {
  const { publicEvents } = useAuth()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [locationQuery, setLocationQuery] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [showCalendar, setShowCalendar] = useState(false)
  const [showLocationDropdown, setShowLocationDropdown] = useState(false)
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false)

  // Refs for anchor elements (where to anchor the portaled dropdown)
  const searchAnchorRef = useRef(null)
  const locationAnchorRef = useRef(null)
  const calendarAnchorRef = useRef(null)

  // Refs for dropdown containers (to detect outside clicks on the portal)
  const searchDropdownRef = useRef(null)
  const locationDropdownRef = useRef(null)
  const calendarDropdownRef = useRef(null)

  // Close dropdowns on outside click (checks both anchor + portal dropdown)
  useEffect(() => {
    const handleClick = (e) => {
      const inSearch = searchAnchorRef.current?.contains(e.target) || searchDropdownRef.current?.contains(e.target)
      const inLocation = locationAnchorRef.current?.contains(e.target) || locationDropdownRef.current?.contains(e.target)
      const inCalendar = calendarAnchorRef.current?.contains(e.target) || calendarDropdownRef.current?.contains(e.target)

      if (!inSearch) setShowSearchSuggestions(false)
      if (!inLocation) setShowLocationDropdown(false)
      if (!inCalendar) setShowCalendar(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return ''
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const handleSearch = useCallback(() => {
    setShowSearchSuggestions(false)
    setShowLocationDropdown(false)
    setShowCalendar(false)

    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    if (locationQuery) params.set('city', locationQuery)
    if (selectedDate) params.set('date', selectedDate)

    if (onSearch) {
      onSearch({ query: searchQuery, city: locationQuery, date: selectedDate })
    } else {
      navigate(`/events?${params.toString()}`)
    }
  }, [searchQuery, locationQuery, selectedDate, onSearch, navigate])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch()
    if (e.key === 'Escape') {
      setShowSearchSuggestions(false)
      setShowLocationDropdown(false)
      setShowCalendar(false)
    }
  }

  return (
    <div
      className={`relative flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-0 ${compact ? 'max-w-3xl' : 'w-full'} rounded-2xl md:rounded-full p-2`}
      style={{
        background: 'rgba(255,255,255,0.07)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      {/* Search Input */}
      <div className="flex items-center gap-3 flex-1 px-4 py-2 md:py-0" ref={searchAnchorRef}>
        <IoSearch className="text-white/50 text-lg shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setShowSearchSuggestions(true)
          }}
          onFocus={() => searchQuery.length >= 2 && setShowSearchSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder="Cari acara, artis, atau venue"
          className="bg-transparent border-none outline-none text-white text-sm placeholder-white/40 w-full"
        />
        {searchQuery && (
          <button onClick={() => { setSearchQuery(''); setShowSearchSuggestions(false) }} className="bg-transparent border-none cursor-pointer p-0 text-white/30 hover:text-white/60 transition-colors">
            <IoCloseCircle className="text-lg" />
          </button>
        )}
      </div>

      {/* Search Suggestions Portal */}
      <PortalDropdown anchorRef={searchAnchorRef} visible={showSearchSuggestions} align="left" dropdownRef={searchDropdownRef}>
        <AnimatePresence>
          {showSearchSuggestions && (
            <SearchSuggestions
              query={searchQuery}
              events={publicEvents}
              onSelect={(val) => {
                setSearchQuery(val)
                setShowSearchSuggestions(false)
              }}
              onNavigate={(path) => {
                setShowSearchSuggestions(false)
                navigate(path)
              }}
            />
          )}
        </AnimatePresence>
      </PortalDropdown>

      <div className="hidden md:block w-px h-8 bg-white/15 shrink-0" />

      {/* Location Input */}
      <div className="flex items-center gap-3 px-4 py-2 md:py-0" ref={locationAnchorRef}>
        <IoLocationSharp className="text-white/50 text-lg shrink-0" />
        <input
          type="text"
          value={locationQuery}
          onChange={(e) => {
            setLocationQuery(e.target.value)
            setShowLocationDropdown(true)
          }}
          onFocus={() => setShowLocationDropdown(true)}
          onKeyDown={handleKeyDown}
          placeholder="Lokasi"
          className="bg-transparent border-none outline-none text-white text-sm placeholder-white/40 w-full md:w-28"
        />
        {locationQuery && (
          <button onClick={() => { setLocationQuery(''); setShowLocationDropdown(false) }} className="bg-transparent border-none cursor-pointer p-0 text-white/30 hover:text-white/60 transition-colors">
            <IoCloseCircle className="text-base" />
          </button>
        )}
      </div>

      {/* Location Dropdown Portal */}
      <PortalDropdown anchorRef={locationAnchorRef} visible={showLocationDropdown} align="left" dropdownRef={locationDropdownRef}>
        <AnimatePresence>
          {showLocationDropdown && (
            <LocationDropdown
              query={locationQuery}
              events={publicEvents}
              onSelect={(city) => {
                setLocationQuery(city)
                setShowLocationDropdown(false)
              }}
            />
          )}
        </AnimatePresence>
      </PortalDropdown>

      <div className="hidden md:block w-px h-8 bg-white/15 shrink-0" />

      {/* Date Input */}
      <div className="flex items-center gap-3 px-4 py-2 md:py-0" ref={calendarAnchorRef}>
        <IoCalendarOutline className="text-white/50 text-lg shrink-0" />
        <input
          type="text"
          value={formatDisplayDate(selectedDate)}
          readOnly
          onClick={() => setShowCalendar(!showCalendar)}
          placeholder="Tanggal"
          className="bg-transparent border-none outline-none text-white text-sm placeholder-white/40 w-full md:w-24 cursor-pointer"
        />
        {selectedDate && (
          <button onClick={() => setSelectedDate('')} className="bg-transparent border-none cursor-pointer p-0 text-white/30 hover:text-white/60 transition-colors">
            <IoCloseCircle className="text-base" />
          </button>
        )}
      </div>

      {/* Calendar Portal */}
      <PortalDropdown anchorRef={calendarAnchorRef} visible={showCalendar} align="right" dropdownRef={calendarDropdownRef}>
        <AnimatePresence>
          {showCalendar && (
            <Calendar
              selectedDate={selectedDate}
              events={publicEvents}
              onSelectDate={setSelectedDate}
              onClose={() => setShowCalendar(false)}
            />
          )}
        </AnimatePresence>
      </PortalDropdown>

      {/* Search Button */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleSearch}
        className="text-white px-7 py-3.5 rounded-full text-sm font-semibold border-none cursor-pointer whitespace-nowrap shrink-0"
        style={{
          background: 'linear-gradient(135deg, #f97316, #ea580c)',
          boxShadow: '0 4px 15px rgba(249,115,22,0.35)',
        }}
      >
        {compact ? 'Cari' : 'Cari Tiket'}
      </motion.button>
    </div>
  )
}

export default SearchBar
