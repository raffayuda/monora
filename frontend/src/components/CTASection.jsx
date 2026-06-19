import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

function CTASection() {
  return (
    <section className="py-14 px-6 md:px-10 bg-[#0B0D1A] relative overflow-hidden">
      {/* BG Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }}
        />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-white mb-4"
        >
          Siap Merasakan Sesuatu yang Luar Biasa?
        </motion.h2>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-white/50 text-base md:text-lg mb-8 max-w-2xl mx-auto"
        >
          Bergabunglah dengan ribuan pengunjung acara dan jangan lewatkan pengalaman terbaik di kota Anda.
        </motion.p>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/events"
              className="inline-block text-white font-semibold text-sm px-8 py-3.5 rounded-full cursor-pointer border-none no-underline"
              style={{
                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                boxShadow: '0 6px 20px rgba(249,115,22,0.35)',
              }}
            >
              Jelajahi Acara
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/contact"
              className="inline-block text-white font-semibold text-sm px-8 py-3.5 rounded-full cursor-pointer bg-transparent no-underline"
              style={{
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              Buat Akun
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default CTASection
