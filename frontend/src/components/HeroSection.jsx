import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import SearchBar from './SearchBar'

const HERO_SLIDES = [
  'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=2000&q=80',
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=2000&q=80',
  'https://images.unsplash.com/photo-1720959975370-308a2a5a0a4a?q=80&w=1175&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
]

function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length)
    }, 4500)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <section className="relative min-h-[520px] md:min-h-[90vh] md:max-h-[800px] flex items-end overflow-hidden mb-2">
      {/* Background Image */}
      <div className="absolute inset-0">
        {HERO_SLIDES.map((slide, index) => (
          <img
            key={slide}
            src={slide}
            alt=""
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === activeSlide ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
        {/* Gradient Overlays */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(180deg, rgba(11,13,26,0.5) 0%, rgba(11,13,26,0.3) 40%, rgba(11,13,26,0.7) 70%, rgba(11,13,26,1) 100%)'
        }} />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(90deg, rgba(11,13,26,0.8) 0%, rgba(11,13,26,0.2) 60%, rgba(11,13,26,0.4) 100%)'
        }} />
      </div>

      {/* Decorative light effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[15%] right-[20%] w-[300px] h-[300px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #f97316, transparent)' }}
        />
        <div className="absolute top-[10%] left-[40%] w-[400px] h-[400px] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #ec4899, transparent)' }}
        />
        <div className="absolute top-[20%] right-[40%] w-[350px] h-[350px] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }}
        />
      </div>

      <div className="absolute bottom-8 right-6 md:right-10 xl:right-14 z-20 flex items-center gap-2">
        {HERO_SLIDES.map((_, index) => (
          <button
            key={`slide-indicator-${index}`}
            type="button"
            onClick={() => setActiveSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === activeSlide ? 'w-8 bg-white' : 'w-2 bg-white/45'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="w-full px-6 md:px-10 xl:px-14 relative z-10 pb-12 md:pb-14">
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-2xl md:text-5xl font-extrabold text-white leading-[1.1] mb-2"
          style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
        >
          Temukan Pengalaman<br />
          Tak Terlupakan Berikutnya
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-white/60 text-base md:text-lg mb-8 max-w-xl leading-relaxed"
        >
          Temukan tiket untuk konser, festival, dan acara live terpopuler di dekat Anda.
        </motion.p>

        {/* Search Bar */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <SearchBar />
        </motion.div>
      </div>
    </section>
  )
}

export default HeroSection
