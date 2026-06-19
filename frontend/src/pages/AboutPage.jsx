import { motion } from 'framer-motion'
import { IoMusicalNotes, IoPeople, IoGlobe, IoShield } from 'react-icons/io5'

const stats = [
  { label: 'Acara Diselenggarakan', value: '5.000+' },
  { label: 'Pelanggan Puas', value: '1,2Jt+' },
  { label: 'Kota Terjangkau', value: '120+' },
  { label: 'Venue Partner', value: '800+' },
]

const values = [
  {
    icon: IoMusicalNotes,
    title: 'Pengalaman Terkurasi',
    description: 'Kami memilih acara terbaik untuk memastikan Anda selalu mendapatkan pengalaman tak terlupakan.',
    gradient: 'linear-gradient(135deg, #6366f1, #4f46e5)',
  },
  {
    icon: IoPeople,
    title: 'Komunitas Utama',
    description: 'Membangun koneksi melalui pengalaman bersama adalah inti dari semua yang kami lakukan.',
    gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)',
  },
  {
    icon: IoGlobe,
    title: 'Jangkauan Global',
    description: 'Dari pertunjukan lokal hingga festival internasional, kami menghadirkan acara dari seluruh dunia.',
    gradient: 'linear-gradient(135deg, #f97316, #ea580c)',
  },
  {
    icon: IoShield,
    title: 'Aman & Terpercaya',
    description: 'Transaksi dan data Anda dilindungi dengan langkah keamanan terdepan.',
    gradient: 'linear-gradient(135deg, #ec4899, #db2777)',
  },
]

const team = [
  {
    name: 'Sarah Johnson',
    role: 'CEO & Pendiri',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face',
  },
  {
    name: 'Michael Chen',
    role: 'Direktur Teknologi',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
  },
  {
    name: 'Emily Davis',
    role: 'Kepala Acara',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
  },
  {
    name: 'David Kim',
    role: 'Desainer Utama',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
  },
]

function AboutPage() {
  return (
    <div className="bg-[#0B0D1A] min-h-screen pt-24">
      {/* Hero Banner */}
      <section className="relative py-20 px-6 md:px-10 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }}
          />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #f97316, transparent)' }}
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-orange-400 text-sm font-semibold tracking-widest uppercase mb-4 block"
          >
            Tentang Kami
          </motion.span>
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="text-4xl md:text-6xl font-extrabold text-white mb-6"
            style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
          >
            Menghubungkan Orang Melalui Momen Tak Terlupakan
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-white/50 text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Monora lahir dari ide sederhana: semua orang berhak mendapatkan akses mudah ke pengalaman live terbaik. Kami membuat penemuan, pemesanan, dan menikmati acara menjadi mudah.
          </motion.p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-6 md:px-10">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center p-6 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div className="text-3xl md:text-4xl font-extrabold text-white mb-1">{stat.value}</div>
              <div className="text-white/40 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 px-6 md:px-10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ x: -40, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop"
                alt="Concert crowd"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0" style={{
                background: 'linear-gradient(135deg, rgba(99,102,241,0.3) 0%, rgba(249,115,22,0.2) 100%)'
              }} />
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 40, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-orange-400 text-sm font-semibold tracking-widest uppercase mb-3 block">Kisah Kami</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-5">
              Dari Ide Kecil Menjadi Platform yang Dipercaya Jutaan Orang
            </h2>
            <p className="text-white/50 leading-relaxed mb-4">
              Didirikan pada tahun 2020, Monora dimulai sebagai proyek passion oleh sekelompok penggemar acara yang lelah dengan pengalaman tiket yang terpecah-pecah. Kami percaya pasti ada cara yang lebih baik.
            </p>
            <p className="text-white/50 leading-relaxed mb-6">
              Saat ini, kami melayani jutaan pelanggan di 120+ kota, bermitra dengan venue dan artis terbaik untuk menghadirkan pengalaman terkurasi yang berarti.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-white font-semibold text-sm px-7 py-3 rounded-full cursor-pointer border-none"
              style={{
                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                boxShadow: '0 4px 15px rgba(249,115,22,0.3)',
              }}
            >
              Pelajari Lebih Lanjut
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-orange-400 text-sm font-semibold tracking-widest uppercase mb-3 block">Nilai-Nilai Kami</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Apa yang Mendorong Kami Maju</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((val, i) => {
              const Icon = val.icon
              return (
                <motion.div
                  key={val.title}
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="p-6 rounded-2xl text-center"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4"
                    style={{ background: val.gradient }}
                  >
                    <Icon className="text-white text-2xl" />
                  </div>
                  <h3 className="text-white font-bold text-base mb-2">{val.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{val.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-orange-400 text-sm font-semibold tracking-widest uppercase mb-3 block">Tim Kami</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Kenali Orang-Orang di Balik Monora</h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="text-center p-5 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <h4 className="text-white font-bold text-sm mb-1">{member.name}</h4>
                <p className="text-white/40 text-xs">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
