import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { IoCheckmarkCircle, IoTicketOutline, IoShirtOutline, IoDownloadOutline, IoHomeOutline, IoCalendarOutline } from 'react-icons/io5'
import { useAuth } from '../context/AuthContext'
import { formatRupiah } from '../utils/currency'

function OrderConfirmationPage() {
  const { orderId } = useParams()
  const { orders } = useAuth()

  const order = orders.find(o => o.id === orderId)
  const orderItems = Array.isArray(order?.items) ? order.items : []
  const customer = order?.customerInfo || order?.customer || { name: '-', email: '-' }

  if (!order) {
    return (
      <div className="bg-[#0B0D1A] min-h-screen pt-24 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-3xl font-bold text-white mb-3">Pesanan Tidak Ditemukan</h1>
        <p className="text-white/50 mb-8">Kami tidak dapat menemukan pesanan ini. Silakan periksa ID pesanan Anda.</p>
        <Link to="/" className="text-white px-6 py-3 rounded-full text-sm font-semibold no-underline"
          style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
        >
          Ke Beranda
        </Link>
      </div>
    )
  }

  const tickets = orderItems.filter(item => item.itemType === 'ticket')
  const merch = orderItems.filter(item => item.itemType === 'merch')

  return (
    <div className="bg-[#0B0D1A] min-h-screen pt-24">
      <section className="py-10 px-6 md:px-10">
        <div className="max-w-3xl mx-auto">
          {/* Success Header */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
            >
              <IoCheckmarkCircle className="text-4xl text-white" />
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2"
              style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
            >
              Pembayaran Berhasil!
            </h1>
            <p className="text-white/50 text-lg">Pesanan Anda telah dikonfirmasi</p>
          </motion.div>

          {/* Order Details Card */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl p-6 md:p-8 mb-6"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            {/* Order ID Banner */}
            <div className="rounded-xl p-4 mb-6 text-center"
              style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)' }}
            >
              <p className="text-white/50 text-xs mb-1 m-0">ID Pesanan</p>
              <p className="text-orange-400 font-bold text-lg m-0 font-mono">{order.id}</p>
            </div>

            {/* Customer Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <p className="text-white/40 text-xs mb-1 m-0">Pelanggan</p>
                <p className="text-white text-sm font-medium m-0">{customer.name}</p>
              </div>
              <div>
                <p className="text-white/40 text-xs mb-1 m-0">Email</p>
                <p className="text-white text-sm font-medium m-0">{customer.email}</p>
              </div>
              <div>
                <p className="text-white/40 text-xs mb-1 m-0">Tanggal</p>
                <p className="text-white text-sm font-medium m-0">
                  {new Date(order.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>

            {/* Tickets */}
            {tickets.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <IoTicketOutline className="text-orange-400" />
                  <h3 className="text-white font-bold text-sm m-0">Tiket</h3>
                </div>
                <div className="space-y-2">
                  {tickets.map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-none">
                      <div>
                        <p className="text-white text-sm m-0">{item.eventTitle}</p>
                        <p className="text-white/40 text-xs m-0">{item.name} x{item.quantity}</p>
                      </div>
                      <span className="text-white font-semibold text-sm">{formatRupiah(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Merchandise */}
            {merch.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <IoShirtOutline className="text-indigo-400" />
                  <h3 className="text-white font-bold text-sm m-0">Merchandise</h3>
                </div>
                <div className="space-y-2">
                  {merch.map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-none">
                      <div>
                        <p className="text-white text-sm m-0">{item.name}</p>
                        <div className="flex gap-2 mt-0.5">
                          {item.size && <span className="text-white/30 text-xs">Ukuran: {item.size}</span>}
                          {item.color && <span className="text-white/30 text-xs">{item.color}</span>}
                          <span className="text-white/30 text-xs">x{item.quantity}</span>
                        </div>
                      </div>
                      <span className="text-white font-semibold text-sm">{formatRupiah(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                {order.deliveryMethod && (
                  <div className="mt-3 rounded-lg p-3"
                    style={{ background: 'rgba(255,255,255,0.04)' }}
                  >
                    <p className="text-white/50 text-xs m-0">
                      Pengiriman: {order.deliveryMethod === 'pickup' ? 'Ambil di Venue Acara' : 'Dikirim ke Alamat'}
                    </p>
                    {order.deliveryAddress && (
                      <p className="text-white/40 text-xs mt-1 m-0">
                        {order.deliveryAddress.address}, {order.deliveryAddress.city} {order.deliveryAddress.zipCode}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Totals */}
            <div className="border-t border-white/10 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Subtotal</span>
                <span className="text-white">{formatRupiah(order.subtotal || 0)}</span>
              </div>
              {Number(order.voucherDiscount || 0) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-emerald-400">Voucher ({order.voucherCode})</span>
                  <span className="text-emerald-400">-{formatRupiah(order.voucherDiscount || 0)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Biaya Layanan</span>
                <span className="text-white">{formatRupiah(order.serviceFee || 0)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/10">
                <span className="text-white font-bold text-lg">Total Dibayar</span>
                <span className="text-orange-400 font-bold text-xl">{formatRupiah(order.grandTotal || order.total || 0)}</span>
              </div>
            </div>
          </motion.div>

          {/* E-Ticket Notice */}
          {tickets.length > 0 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="rounded-2xl p-6 mb-6 text-center"
              style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}
            >
              <IoDownloadOutline className="text-3xl text-indigo-400 mx-auto mb-3" />
              <h3 className="text-white font-bold mb-2">E-Tiket Terkirim!</h3>
              <p className="text-indigo-300 text-sm m-0">
                E-tiket Anda telah dikirim ke <strong>{customer.email}</strong>.
                Silakan tunjukkan di pintu masuk venue.
              </p>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/my-orders"
              className="flex items-center gap-2 text-white px-6 py-3 rounded-full text-sm font-semibold no-underline"
              style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
            >
              <IoCalendarOutline />
              Lihat Pesanan Saya
            </Link>
            <Link
              to="/"
              className="flex items-center gap-2 text-white/70 hover:text-white px-6 py-3 rounded-full text-sm font-semibold no-underline transition-colors"
              style={{ border: '1px solid rgba(255,255,255,0.2)' }}
            >
              <IoHomeOutline />
              Kembali ke Beranda
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default OrderConfirmationPage
