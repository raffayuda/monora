import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoSearch, IoArrowUndoOutline, IoCheckmarkCircleOutline, IoCloseCircleOutline, IoEyeOutline, IoCloseOutline } from 'react-icons/io5'
import { useAuth } from '../../context/AuthContext'
import { formatRupiah } from '../../utils/currency'

function AdminRefunds() {
  const { getMyEvents, orders, getAllRefunds, updateRefundStatus, getAllUsers } = useAuth()
  const myEvents = getMyEvents()
  const allRefunds = getAllRefunds()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [detailModal, setDetailModal] = useState(null)

  const myEventIds = useMemo(() => new Set(myEvents.map(e => e.id)), [myEvents])

  // Filter refunds to only those related to the admin's events
  const myRefunds = useMemo(() => {
    return allRefunds.filter(refund => {
      const order = orders.find(o => o.id === refund.orderId)
      if (!order?.items) return false
      return order.items.some(item =>
        myEventIds.has(item.eventId) || myEventIds.has(Number(item.eventId))
      )
    })
  }, [allRefunds, orders, myEventIds])

  const users = useMemo(() => {
    try { return getAllUsers() } catch { return [] }
  }, [])

  const filtered = useMemo(() => {
    let result = [...myRefunds].sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt))
    if (statusFilter !== 'all') result = result.filter(r => r.status === statusFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(r =>
        r.id?.toLowerCase().includes(q) ||
        r.orderId?.toLowerCase().includes(q) ||
        r.reason?.toLowerCase().includes(q)
      )
    }
    return result
  }, [myRefunds, statusFilter, search])

  const stats = useMemo(() => ({
    total: myRefunds.length,
    pending: myRefunds.filter(r => r.status === 'pending').length,
    approved: myRefunds.filter(r => r.status === 'approved').length,
    rejected: myRefunds.filter(r => r.status === 'rejected').length,
  }), [myRefunds])

  const getOrder = (orderId) => orders.find(o => o.id === orderId)
  const getUserName = (userId) => users.find(u => u.id === userId)?.name || 'Unknown'

  const statusColors = {
    pending: 'bg-yellow-500/10 text-yellow-400',
    approved: 'bg-green-500/10 text-green-400',
    rejected: 'bg-red-500/10 text-red-400',
  }

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white m-0">Refund Requests</h1>
        <p className="text-white/40 text-sm mt-1 m-0">Manage refund requests for your events</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Requests', value: stats.total, color: '#f97316' },
          { label: 'Pending', value: stats.pending, color: '#eab308' },
          { label: 'Approved', value: stats.approved, color: '#22c55e' },
          { label: 'Rejected', value: stats.rejected, color: '#ef4444' },
        ].map(s => (
          <div key={s.label} className="rounded-xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="text-lg font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-white/30 text-[11px]">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex items-center gap-2 flex-1 px-4 py-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <IoSearch className="text-white/40" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search refund ID, order, or reason..."
            className="bg-transparent border-none outline-none text-white text-sm placeholder-white/30 w-full" />
        </div>
        <div className="flex gap-2">
          {['all', 'pending', 'approved', 'rejected'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold capitalize border-none cursor-pointer transition-all ${
                statusFilter === s ? 'bg-orange-500/15 text-orange-400' : 'bg-white/5 text-white/40 hover:text-white/60'
              }`}>{s}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 text-white/30 text-[11px] font-semibold uppercase tracking-wider" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="col-span-2">Refund ID</div>
          <div className="col-span-2">Order</div>
          <div className="col-span-2">Item</div>
          <div className="col-span-2">Customer</div>
          <div className="col-span-1">Date</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>
        {filtered.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <IoArrowUndoOutline className="text-4xl text-white/10 mx-auto mb-3" />
            <p className="text-white/30 text-sm m-0">No refund requests</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filtered.map((refund, i) => {
              const order = getOrder(refund.orderId)
              return (
                <motion.div key={refund.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors items-center">
                  <div className="col-span-2">
                    <span className="text-white/60 font-mono text-xs">{refund.id}</span>
                  </div>
                  <div className="col-span-2">
                    <div className="text-white text-sm">{refund.orderId}</div>
                    <div className="text-white/30 text-[11px]">{formatRupiah(order?.total || 0)}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-white/70 text-xs truncate">{refund.item?.name || '-'}</div>
                    <div className="text-white/30 text-[11px] truncate">{refund.eventTitle || '-'}</div>
                  </div>
                  <div className="col-span-2 text-white/50 text-sm">{getUserName(refund.userId)}</div>
                  <div className="col-span-1 text-white/40 text-xs">{new Date(refund.requestedAt).toLocaleDateString()}</div>
                  <div className="col-span-1">
                    <span className={`text-[11px] font-semibold px-2 py-1 rounded-full ${statusColors[refund.status]}`}>{refund.status}</span>
                  </div>
                  <div className="col-span-2 flex items-center justify-end gap-1.5">
                    <button onClick={() => setDetailModal(refund)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:bg-white/5 transition-all border-none bg-transparent cursor-pointer" title="View Details">
                      <IoEyeOutline className="text-base" />
                    </button>
                    {refund.status === 'pending' && (
                      <>
                        <button onClick={() => updateRefundStatus(refund.id, 'approved')}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border-none cursor-pointer transition-all bg-green-500/10 text-green-400 hover:bg-green-500/20" title="Approve">
                          <IoCheckmarkCircleOutline /> Approve
                        </button>
                        <button onClick={() => updateRefundStatus(refund.id, 'rejected')}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border-none cursor-pointer transition-all bg-red-500/10 text-red-400 hover:bg-red-500/20" title="Reject">
                          <IoCloseCircleOutline /> Reject
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {detailModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }} onClick={() => setDetailModal(null)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="rounded-2xl p-6 w-full max-w-md" style={{ background: 'rgba(20,22,45,0.98)', border: '1px solid rgba(255,255,255,0.1)' }}
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-white font-semibold text-lg m-0">Refund Details</h3>
                <button onClick={() => setDetailModal(null)} className="text-white/30 hover:text-white bg-transparent border-none cursor-pointer"><IoCloseOutline className="text-xl" /></button>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/40 text-sm">Refund ID</span>
                  <span className="text-white font-mono text-sm">{detailModal.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40 text-sm">Order ID</span>
                  <span className="text-white text-sm">{detailModal.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40 text-sm">Customer</span>
                  <span className="text-white text-sm">{getUserName(detailModal.userId)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40 text-sm">Event</span>
                  <span className="text-white text-sm text-right">{detailModal.eventTitle || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40 text-sm">Refund Item</span>
                  <span className="text-white text-sm text-right">{detailModal.item?.name || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40 text-sm">Order Total</span>
                  <span className="text-white text-sm">{formatRupiah(getOrder(detailModal.orderId)?.total || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40 text-sm">Status</span>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColors[detailModal.status]}`}>{detailModal.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40 text-sm">Requested</span>
                  <span className="text-white text-sm">{new Date(detailModal.requestedAt).toLocaleString()}</span>
                </div>
                {detailModal.processedAt && (
                  <div className="flex justify-between">
                    <span className="text-white/40 text-sm">Processed</span>
                    <span className="text-white text-sm">{new Date(detailModal.processedAt).toLocaleString()}</span>
                  </div>
                )}
                <div className="pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <span className="text-white/40 text-xs block mb-1">Reason</span>
                  <p className="text-white/70 text-sm m-0 leading-relaxed">{detailModal.reason || 'No reason provided'}</p>
                </div>

                {/* Order Items */}
                {getOrder(detailModal.orderId)?.items && (
                  <div className="pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <span className="text-white/40 text-xs block mb-2">Order Items</span>
                    {getOrder(detailModal.orderId).items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm py-1">
                        <span className="text-white/60">{item.quantity}x {item.name || item.title}</span>
                        <span className="text-white/40">{formatRupiah((item.price || 0) * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {detailModal.status === 'pending' && (
                <div className="flex gap-3 mt-6">
                  <button onClick={() => { updateRefundStatus(detailModal.id, 'rejected'); setDetailModal(null) }}
                    className="flex-1 py-2.5 rounded-xl text-sm font-medium text-red-400 bg-red-500/10 border-none cursor-pointer hover:bg-red-500/20 transition-all">Reject</button>
                  <button onClick={() => { updateRefundStatus(detailModal.id, 'approved'); setDetailModal(null) }}
                    className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white border-none cursor-pointer hover:opacity-90 transition-all"
                    style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>Approve Refund</button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdminRefunds
