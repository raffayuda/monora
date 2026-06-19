import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { IoChevronBack, IoChevronForward, IoShirtOutline } from 'react-icons/io5'
import { getDiscountedPrice } from '../data/events'
import { useAuth } from '../context/AuthContext'
import { formatRupiah } from '../utils/currency'

const CARD_WIDTH = 250
const GAP = 20

function FeaturedEvents() {
  const { publicEvents } = useAuth()
  const events = useMemo(() => publicEvents.slice(0, 8), [publicEvents])
  const scrollRef = useRef(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  // Calculate total pages based on container & content width
  const calcPages = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const maxScroll = el.scrollWidth - el.clientWidth
    if (maxScroll <= 0) {
      setTotalPages(1)
      return
    }
    const pageWidth = el.clientWidth
    setTotalPages(Math.ceil(el.scrollWidth / pageWidth))
  }, [])

  useEffect(() => {
    calcPages()
    window.addEventListener('resize', calcPages)
    return () => window.removeEventListener('resize', calcPages)
  }, [calcPages])

  // Sync active dot with actual scroll position
  const handleScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const maxScroll = el.scrollWidth - el.clientWidth
    if (maxScroll <= 0) {
      setCurrentPage(0)
      return
    }
    const ratio = el.scrollLeft / maxScroll
    const page = Math.round(ratio * (totalPages - 1))
    setCurrentPage(page)
  }, [totalPages])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  // Scroll by one "page" via arrows
  const scroll = (direction) => {
    const el = scrollRef.current
    if (!el) return
    const pageWidth = el.clientWidth
    const newScroll = direction === 'left'
      ? el.scrollLeft - pageWidth
      : el.scrollLeft + pageWidth
    el.scrollTo({ left: newScroll, behavior: 'smooth' })
  }

  // Click a dot → scroll to that page
  const goToPage = (page) => {
    const el = scrollRef.current
    if (!el) return
    const maxScroll = el.scrollWidth - el.clientWidth
    const target = totalPages <= 1 ? 0 : (page / (totalPages - 1)) * maxScroll
    el.scrollTo({ left: target, behavior: 'smooth' })
  }

  return (
    <section className="py-14 px-6 md:px-10 bg-[#0B0D1A] relative">
      <div className=" mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white m-0">Acara Unggulan</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all text-white border border-white/20 bg-white/5 hover:bg-white/15"
            >
              <IoChevronBack className="text-lg" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all text-white border border-white/20 bg-white/5 hover:bg-white/15"
            >
              <IoChevronForward className="text-lg" />
            </button>
          </div>
        </motion.div>

        {/* Scrollable Cards */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-6 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {events.map((event, index) => (
            <Link to={`/event/${event.id}`} key={event.id} className="no-underline">
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ y: -6 }}
                className="flex-shrink-0 w-[350px] rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300"
                style={{
                  background: 'linear-gradient(180deg, rgba(30,30,60,0.8) 0%, rgba(15,15,35,0.95) 100%)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                {/* Card Image */}
                <div className="relative h-[180px] overflow-hidden">
                  <img
                    src={event.thumbnail}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D1A] via-transparent to-transparent opacity-60" />
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
                      -{event.discount.percentage}%
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-4">
                  <h3 className="text-white font-bold text-sm mb-1.5 tracking-wide">{event.title}</h3>
                  <p className="text-white/50 text-xs mb-0.5">{event.date}</p>
                  <p className="text-white/50 text-xs mb-2">{event.venue}</p>
                  <p className="text-white text-sm font-semibold mb-3">
                    {event.discount ? (
                      <>
                        <span className="text-white/40 line-through mr-1">{formatRupiah(Math.min(...event.tickets.map(tk => tk.price)))}</span>
                        Tiket dari <span className="text-orange-400">{formatRupiah(getDiscountedPrice(Math.min(...event.tickets.map(tk => tk.price)), event.discount))}</span>
                      </>
                    ) : (
                      <>Tiket dari <span className="text-orange-400">{formatRupiah(Math.min(...event.tickets.map(tk => tk.price)))}</span></>
                    )}
                  </p>
                  {/* Tags */}
                  <div className="flex gap-2">
                    {event.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
                        style={{
                          background: tag === 'Selling Fast'
                            ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                            : 'linear-gradient(135deg, #6366f1, #4f46e5)',
                          color: 'white',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Pagination Dots */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => goToPage(i)}
              className="border-none cursor-pointer rounded-full transition-all"
              style={{
                width: currentPage === i ? 24 : 8,
                height: 8,
                background: currentPage === i
                  ? 'linear-gradient(135deg, #f97316, #ea580c)'
                  : 'rgba(255,255,255,0.2)',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedEvents
