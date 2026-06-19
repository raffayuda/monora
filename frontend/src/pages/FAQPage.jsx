import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoChevronDown, IoSearch } from 'react-icons/io5'

const faqCategories = [
  { id: 'general', label: 'Umum' },
  { id: 'tickets', label: 'Tiket & Pemesanan' },
  { id: 'payment', label: 'Pembayaran' },
  { id: 'account', label: 'Akun' },
]

const faqs = [
  {
    id: 1,
    category: 'general',
    question: 'Apa itu Monora?',
    answer: 'Monora adalah platform tiket acara komprehensif yang membantu Anda menemukan, memesan, dan mengelola tiket untuk konser, festival, acara olahraga, pertunjukan komedi, dan lainnya. Kami menghubungkan pengunjung acara dengan pengalaman live terbaik di kota mereka dan sekitarnya.',
  },
  {
    id: 2,
    category: 'general',
    question: 'Bagaimana cara menemukan acara di dekat saya?',
    answer: 'Anda dapat menggunakan bilah pencarian di beranda untuk mencari berdasarkan lokasi, tanggal, atau nama acara. Anda juga dapat menjelajahi berdasarkan kategori — Konser, Festival, Olahraga, atau Komedi — untuk menemukan acara yang sesuai minat Anda.',
  },
  {
    id: 3,
    category: 'general',
    question: 'Apakah Monora tersedia di kota saya?',
    answer: 'Monora saat ini tersedia di lebih dari 120 kota di seluruh dunia. Kami terus memperluas jangkauan kami. Cek halaman Acara dan masukkan lokasi Anda untuk melihat apa yang sedang berlangsung di dekat Anda.',
  },
  {
    id: 4,
    category: 'tickets',
    question: 'Bagaimana cara membeli tiket?',
    answer: 'Cukup temukan acara yang Anda minati, pilih jumlah tiket, pilih preferensi tempat duduk (jika berlaku), dan lanjutkan ke checkout. Anda dapat membayar menggunakan kartu kredit/debit, PayPal, atau metode pembayaran lain yang didukung.',
  },
  {
    id: 5,
    category: 'tickets',
    question: 'Bisakah saya mendapatkan pengembalian dana untuk tiket saya?',
    answer: 'Kebijakan pengembalian dana bervariasi tergantung acara. Sebagian besar acara menawarkan pengembalian dana penuh hingga 48 jam sebelum tanggal acara. Beberapa acara mungkin memiliki kebijakan tanpa pengembalian dana. Anda dapat memeriksa kebijakan pengembalian dana spesifik di halaman detail acara sebelum membeli.',
  },
  {
    id: 6,
    category: 'tickets',
    question: 'Bagaimana saya akan menerima tiket saya?',
    answer: 'Setelah membeli, e-tiket Anda akan dikirim ke email terdaftar dan juga tersedia di akun Monora Anda di bagian "Tiket Saya". Anda dapat menunjukkan kode QR di ponsel Anda di pintu masuk venue.',
  },
  {
    id: 7,
    category: 'tickets',
    question: 'Bisakah saya mentransfer tiket saya ke orang lain?',
    answer: 'Ya! Anda dapat mentransfer tiket ke orang lain melalui akun Anda. Buka "Tiket Saya", pilih tiket, dan gunakan opsi "Transfer". Penerima akan menerima tiket melalui email.',
  },
  {
    id: 8,
    category: 'payment',
    question: 'Metode pembayaran apa yang diterima?',
    answer: 'Kami menerima Visa, Mastercard, American Express, PayPal, Apple Pay, dan Google Pay. Semua transaksi diamankan dengan enkripsi standar industri.',
  },
  {
    id: 9,
    category: 'payment',
    question: 'Apakah ada biaya tambahan?',
    answer: 'Biaya layanan kecil ditambahkan pada setiap pembelian tiket untuk menutupi biaya platform dan pemrosesan. Jumlah total termasuk biaya selalu ditampilkan sebelum Anda mengonfirmasi pembelian — tanpa biaya tersembunyi.',
  },
  {
    id: 10,
    category: 'payment',
    question: 'Apakah informasi pembayaran saya aman?',
    answer: 'Tentu saja. Kami menggunakan enkripsi SSL 256-bit dan sesuai standar PCI DSS. Kami tidak pernah menyimpan informasi kartu kredit lengkap Anda di server kami.',
  },
  {
    id: 11,
    category: 'account',
    question: 'Bagaimana cara membuat akun?',
    answer: 'Klik tombol "Masuk / Daftar" di bagian atas halaman. Anda dapat membuat akun menggunakan alamat email, atau mendaftar cepat dengan Google atau Apple.',
  },
  {
    id: 12,
    category: 'account',
    question: 'Saya lupa kata sandi. Bagaimana cara meresetnya?',
    answer: 'Klik "Masuk / Daftar", lalu pilih "Lupa Kata Sandi". Masukkan alamat email Anda, dan kami akan mengirimkan link untuk mereset kata sandi Anda. Link tersebut kedaluwarsa setelah 24 jam.',
  },
]

function FAQItem({ faq }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-2xl overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left cursor-pointer bg-transparent border-none"
      >
        <span className="text-white font-medium text-sm md:text-base pr-4">{faq.question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="shrink-0"
        >
          <IoChevronDown className="text-white/50 text-lg" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-0">
              <p className="text-white/40 text-sm leading-relaxed">{faq.answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('general')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = faq.category === activeCategory
    const matchesSearch = searchQuery === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="bg-[#0B0D1A] min-h-screen pt-24">
      {/* Hero Banner */}
      <section className="relative py-16 px-6 md:px-10 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-[500px] h-[500px] rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #ec4899, transparent)' }}
          />
          <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #06b6d4, transparent)' }}
          />
        </div>

        <div className="max-w-3xl mx-auto relative z-10 text-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-orange-400 text-sm font-semibold tracking-widest uppercase mb-4 block"
          >
            Pusat Bantuan
          </motion.span>
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="text-4xl md:text-6xl font-extrabold text-white mb-6"
            style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
          >
            Pertanyaan yang Sering Diajukan
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-white/50 text-lg max-w-xl mx-auto leading-relaxed mb-8"
          >
            Temukan jawaban untuk pertanyaan umum tentang Monora, tiket, pembayaran, dan akun Anda.
          </motion.p>

          {/* Search */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex items-center gap-3 max-w-lg mx-auto rounded-full px-5 py-3"
            style={{
              background: 'rgba(255,255,255,0.07)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <IoSearch className="text-white/50 text-lg shrink-0" />
            <input
              type="text"
              placeholder="Cari pertanyaan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-white text-sm placeholder-white/40 w-full"
            />
          </motion.div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-8 px-6 md:px-10 pb-20">
        <div className="max-w-3xl mx-auto">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {faqCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2 rounded-full text-sm font-medium cursor-pointer transition-all border-none ${activeCategory === cat.id ? 'text-white' : 'text-white/50 hover:text-white'
                  }`}
                style={{
                  background: activeCategory === cat.id
                    ? 'linear-gradient(135deg, #f97316, #ea580c)'
                    : 'rgba(255,255,255,0.06)',
                  border: activeCategory === cat.id ? 'none' : '1px solid rgba(255,255,255,0.08)',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* FAQ Items */}
          <div className="flex flex-col gap-3">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => <FAQItem key={faq.id} faq={faq} />)
            ) : (
              <div className="text-center py-12">
                <p className="text-white/30 text-lg">Tidak ada pertanyaan yang sesuai dengan pencarian Anda.</p>
              </div>
            )}
          </div>

          {/* Still have questions */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="mt-16 text-center p-8 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <h3 className="text-xl font-bold text-white mb-3">Masih punya pertanyaan?</h3>
            <p className="text-white/40 text-sm mb-5">
              Tidak menemukan yang Anda cari? Hubungi tim dukungan kami.
            </p>
            <motion.a
              href="/contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block text-white font-semibold text-sm px-7 py-3 rounded-full cursor-pointer no-underline"
              style={{
                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                boxShadow: '0 4px 15px rgba(249,115,22,0.3)',
              }}
            >
              Hubungi Dukungan
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default FAQPage
