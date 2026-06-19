import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { IoTicketOutline, IoShirtOutline, IoCalendarOutline, IoTimeOutline, IoReceiptOutline, IoArrowUndoOutline } from 'react-icons/io5'
import { useAuth } from '../context/AuthContext'
import { formatRupiah } from '../utils/currency'

function MyOrdersPage() {
  const { getUserOrders, isAuthenticated, requestRefund, getRefundByOrderId } = useAuth()
  const [refundModal, setRefundModal] = useState(null)
  const [refundItemId, setRefundItemId] = useState('')
  const [refundReason, setRefundReason] = useState('')
  const [refundMessage, setRefundMessage] = useState(null)

  const handleRequestRefund = async (orderId) => {
    if (!refundReason.trim() || !refundItemId) return
    const result = await requestRefund(orderId, refundReason, Number(refundItemId))
    setRefundMessage(result)
    if (result.success) {
      setTimeout(() => {
        setRefundModal(null)
        setRefundReason('')
        setRefundItemId('')
        setRefundMessage(null)
      }, 1500)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-[#0B0D1A] min-h-screen pt-24 flex flex-col items-center justify-center text-center px-6">
        <IoReceiptOutline className="text-6xl text-white/20 mb-4" />
        <h1 className="text-3xl font-bold text-white mb-3">Harus Masuk Terlebih Dahulu</h1>
        <p className="text-white/50 mb-8">Silakan masuk untuk melihat pesanan Anda.</p>
        <Link to="/login" className="text-white px-6 py-3 rounded-full text-sm font-semibold no-underline"
          style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
        >
          Masuk
        </Link>
      </div>
    )
  }

  const orders = getUserOrders()

  if (orders.length === 0) {
    return (
      <div className="bg-[#0B0D1A] min-h-screen pt-24 flex flex-col items-center justify-center text-center px-6">
        <IoReceiptOutline className="text-6xl text-white/20 mb-4" />
        <h1 className="text-3xl font-bold text-white mb-3">Belum Ada Pesanan</h1>
        <p className="text-white/50 mb-8">Anda belum memiliki pesanan. Mulai jelajahi acara!</p>
        <Link to="/events" className="text-white px-6 py-3 rounded-full text-sm font-semibold no-underline"
          style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
        >
          Jelajahi Acara
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-[#0B0D1A] min-h-screen pt-24">
      <section className="py-10 px-6 md:px-10">
        <div className="max-w-4xl mx-auto">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-3xl md:text-4xl font-extrabold text-white mb-2"
            style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
          >
            Pesanan Saya
          </motion.h1>
          <p className="text-white/50 mb-8">{orders.length} pesanan</p>

          <div className="space-y-6">
            {orders.map((order, index) => {
              const tickets = order.items.filter(i => i.itemType === 'ticket')
              const merch = order.items.filter(i => i.itemType === 'merch')
              const orderRefunds = getRefundByOrderId(order.id)
              const pendingRefundExists = orderRefunds.some(r => r.status === 'pending')
              const refundedItemIds = new Set(
                orderRefunds
                  .filter(r => r.status === 'approved')
                  .map(r => Number(r.itemId))
              )

              return (
                <motion.div
                  key={order.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-2xl overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  {/* Order Header */}
                  <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-white/40 text-xs m-0">ID Pesanan</p>
                        <p className="text-orange-400 font-mono font-bold text-sm m-0">{order.id}</p>
                      </div>
                      <div className="w-px h-8 bg-white/10" />
                      <div className="flex items-center gap-2">
                        <IoCalendarOutline className="text-white/40 text-sm" />
                        <span className="text-white/60 text-sm">
                          {new Date(order.date).toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${order.status === 'confirmed' ? 'text-emerald-300' :
                          order.status === 'refunded' ? 'text-blue-300' :
                            order.status === 'cancelled' ? 'text-red-300' : 'text-yellow-300'
                        }`}
                        style={{
                          background: order.status === 'confirmed' ? 'rgba(16,185,129,0.15)' :
                            order.status === 'refunded' ? 'rgba(59,130,246,0.15)' :
                              order.status === 'cancelled' ? 'rgba(239,68,68,0.15)' : 'rgba(234,179,8,0.15)'
                        }}
                      >
                        {order.status === 'confirmed' ? 'Dikonfirmasi' :
                          order.status === 'refunded' ? 'Dikembalikan' :
                            order.status === 'cancelled' ? 'Dibatalkan' : order.status}
                      </span>
                      {(() => {
                        if (pendingRefundExists) {
                          return (
                            <span className="text-xs font-semibold px-3 py-1 rounded-full text-yellow-300"
                              style={{ background: 'rgba(234,179,8,0.15)' }}
                            >
                              Pengembalian Tertunda
                            </span>
                          )
                        }
                        return null
                      })()}
                      <span className="text-white font-bold">{formatRupiah(order.grandTotal || order.total || 0)}</span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-5">
                    {tickets.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <IoTicketOutline className="text-orange-400 text-sm" />
                          <span className="text-white/50 text-xs font-semibold">TIKET</span>
                        </div>
                        {tickets.map((item, i) => (
                          <div key={i} className="flex items-center justify-between py-1.5">
                            <div>
                              <p className="text-white text-sm m-0">{item.eventTitle}</p>
                              <p className="text-white/40 text-xs m-0">{item.name} x{item.quantity}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              {refundedItemIds.has(Number(item.id)) && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full text-blue-300" style={{ background: 'rgba(59,130,246,0.15)' }}>Dikembalikan</span>
                              )}
                              <span className="text-white/70 text-sm">{formatRupiah(item.price * item.quantity)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {merch.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <IoShirtOutline className="text-indigo-400 text-sm" />
                          <span className="text-white/50 text-xs font-semibold">MERCHANDISE</span>
                        </div>
                        {merch.map((item, i) => (
                          <div key={i} className="flex items-center justify-between py-1.5">
                            <div>
                              <p className="text-white text-sm m-0">{item.name}</p>
                              <p className="text-white/40 text-xs m-0">
                                {[item.size, item.color].filter(Boolean).join(' / ')} x{item.quantity}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {refundedItemIds.has(Number(item.id)) && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full text-blue-300" style={{ background: 'rgba(59,130,246,0.15)' }}>Dikembalikan</span>
                              )}
                              <span className="text-white/70 text-sm">{formatRupiah(item.price * item.quantity)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="px-5 pb-4 flex items-center justify-between">
                    <Link
                      to={`/order-confirmation/${order.id}`}
                      className="text-orange-400 hover:text-orange-300 text-sm font-medium no-underline transition-colors"
                    >
                      Lihat Detail Pesanan →
                    </Link>
                    {order.status === 'confirmed' && (
                      <button
                        onClick={() => {
                          setRefundModal(order.id)
                          setRefundItemId('')
                          setRefundReason('')
                          setRefundMessage(null)
                        }}
                        className="flex items-center gap-1.5 text-red-400 hover:text-red-300 text-sm font-medium cursor-pointer bg-transparent border-none transition-colors"
                      >
                        <IoArrowUndoOutline />
                        Minta Pengembalian Dana
                      </button>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Refund Modal */}
      {refundModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={(e) => e.target === e.currentTarget && setRefundModal(null)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md rounded-2xl p-6"
            style={{
              background: 'rgba(15,15,35,0.95)',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(24px)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            }}
          >
            <h3 className="text-white font-bold text-lg mb-1">Minta Pengembalian Dana</h3>
            <p className="text-white/40 text-sm mb-4">Pesanan: <span className="text-orange-400 font-mono">{refundModal}</span></p>

            <label className="text-white/50 text-xs mb-1.5 block">Pilih item untuk dikembalikan</label>
            <select
              value={refundItemId}
              onChange={(e) => setRefundItemId(e.target.value)}
              className="w-full bg-transparent text-white text-sm py-3 px-4 rounded-xl outline-none mb-4"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <option value="" style={{ background: '#0f1224' }}>Pilih item</option>
              {(orders.find(o => o.id === refundModal)?.items || [])
                .filter(item => {
                  const refunds = getRefundByOrderId(refundModal)
                  const approvedOrPending = refunds.some(r => Number(r.itemId) === Number(item.id) && (r.status === 'pending' || r.status === 'approved'))
                  return !approvedOrPending
                })
                .map(item => (
                  <option key={item.id} value={item.id} style={{ background: '#0f1224' }}>
                    {item.eventTitle ? `${item.eventTitle} - ` : ''}{item.name} x{item.quantity}
                  </option>
                ))}
            </select>

            <div className="mb-4 p-3 rounded-xl" style={{ background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.2)' }}>
              <p className="text-yellow-300 text-xs m-0">
                Pengembalian dana diproses dalam 3-5 hari kerja. Harap dicatat bahwa biaya layanan tidak dapat dikembalikan.
              </p>
            </div>

            <label className="text-white/50 text-xs mb-1.5 block">Alasan pengembalian dana</label>
            <textarea
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              placeholder="Jelaskan mengapa Anda ingin pengembalian dana..."
              rows={3}
              className="w-full bg-transparent text-white text-sm py-3 px-4 rounded-xl outline-none placeholder-white/30 resize-none"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
            />

            {refundMessage && (
              <p className={`text-xs mt-2 ${refundMessage.success ? 'text-emerald-400' : 'text-red-400'}`}>
                {refundMessage.success ? 'Permintaan pengembalian dana berhasil diajukan!' : refundMessage.message}
              </p>
            )}

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => { setRefundModal(null); setRefundReason(''); setRefundMessage(null) }}
                className="flex-1 py-3 rounded-xl text-sm font-medium text-white/60 cursor-pointer bg-transparent transition-colors hover:text-white"
                style={{ border: '1px solid rgba(255,255,255,0.1)' }}
              >
                Batal
              </button>
              <button
                onClick={() => handleRequestRefund(refundModal)}
                disabled={!refundReason.trim() || !refundItemId}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-white cursor-pointer border-none transition-all"
                style={{
                  background: refundReason.trim() && refundItemId ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'rgba(255,255,255,0.06)',
                  opacity: refundReason.trim() && refundItemId ? 1 : 0.5,
                }}
              >
                Ajukan Pengembalian Dana
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default MyOrdersPage
