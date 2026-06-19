import { motion } from 'framer-motion'
import {
  IoMusicalNotes, IoFootball, IoHappy, IoSparkles, IoColorPaletteOutline,
  IoFilmOutline, IoRestaurantOutline, IoBriefcaseOutline, IoGameControllerOutline,
  IoHeartOutline, IoBookOutline, IoAirplaneOutline, IoTrophyOutline
} from 'react-icons/io5'
import { useAuth } from '../context/AuthContext'

const ICON_MAP = {
  IoMusicalNotes, IoFootball, IoHappy, IoSparkles, IoColorPaletteOutline,
  IoFilmOutline, IoRestaurantOutline, IoBriefcaseOutline, IoGameControllerOutline,
  IoHeartOutline, IoBookOutline, IoAirplaneOutline, IoTrophyOutline,
}

function Categories() {
  const { categories } = useAuth()

  return (
    <section className="py-14 px-6 md:px-10 bg-[#0B0D1A]">
      <div className="mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-4"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Kategori</h2>
          <p className="text-white/50 text-sm md:text-base">
            Temukan semua jenis acara, elektronik, festival, live dan acara seru lainnya di dekat kota Anda.
          </p>
        </motion.div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-8">
          {categories.map((cat, index) => {
            const Icon = ICON_MAP[cat.icon] || IoSparkles
            return (
              <motion.div
                key={cat.id}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -6, scale: 1.03 }}
                className="flex flex-col items-center gap-4 p-6 md:p-8 rounded-2xl cursor-pointer transition-all duration-300"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ background: cat.gradient || 'linear-gradient(135deg, #6366f1, #4f46e5)' }}
                >
                  <Icon className="text-white text-3xl" />
                </div>
                <span className="text-white font-semibold text-sm">{cat.name}</span>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Categories
