import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoSearchOutline, IoArrowUndoOutline, IoCheckmarkCircleOutline, IoCloseCircleOutline, IoEyeOutline, IoCloseOutline } from 'react-icons/io5'
import { useAuth } from '../../context/AuthContext'
import { formatRupiah } from '../../utils/currency'

function AppAdminRefunds() {
  const { orders, getAllRefunds, updateRefundStatus, getAllUsers } = useAuth()
  const allRefunds = getAllRefunds()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [detailModal, setDetailModal] = useState(null)

  const users = useMemo(() => {
    try { return getAllUsers() } catch { return [] }
  }, [])

  const filtered = useMemo(() => {
    let result = [...allRefunds].sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt))
    if (statusFilter !== 'all') result = result.filter(r => r.status === statusFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(r =>
        r.id?.toLowerCase().includes(q) ||
        r.orderId?.toLowerCase().includes(q) ||
        r.reason?.toLowerCase().includes(q) ||
        getUserName(r.userId)?.toLowerCase().includes(q)
      )
    }
    return result
  }, [allRefunds, statusFilter, search])

  const stats = useMemo(() => ({
    total: allRefunds.length,
    pending: allRefunds.filter(r => r.status === 'pending').length,
    approved: allRefunds.filter(r => r.status === 'approved').length,
    rejected: allRefunds.filter(r => r.status === 'rejected').length,
    totalRefunded: allRefunds.filter(r => r.status === 'approved').reduce((s, r) => {
      const order = orders.find(o => o.id === r.orderId)
      return s + (order?.total || 0)
    }, 0),
  }), [allRefunds, orders])

  const getOrder = (orderId) => orders.find(o => o.id === orderId)
  const getUserName = (userId) => users.find(u => u.id === userId)?.name || 'Unknown'

  const statusColors = {
    pending: 'bg-yellow-500/10 text-yellow-400',
    approved: 'bg-green-500/10 text-green-400',
    rejected: 'bg-red-500/10 text-red-400',
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white m-0">Refund Requests</h1>
        <p className="text-white/40 text-sm mt-1 m-0">Platform-wide refund management</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        {[
          { label: 'Total Requests', value: stats.total, color: '#8b5cf6' },
          { label: 'Pending', value: stats.pending, color: '#eab308' },
          { label: 'Approved', value: stats.approved, color: '#22c55e' },
          { label: 'Rejected', value: stats.rejected, color: '#ef4444' },
          { label: 'Total Refunded', value: formatRupiah(stats.totalRefunded), color: '#3b82f6' },
        ].map(s => (
          <div key={s.label} className="rounded-xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="text-lg font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-white/30 text-[11px]">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search refund ID, order, customer..."
            className="w-full bg-transparent text-white text-sm py-2.5 pl-10 pr-4 rounded-xl outline-none placeholder-white/30"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} />
        </div>
        <div className="flex gap-1.5">
          {['all', 'pending', 'approved', 'rejected'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-lg text-xs font-medium capitalize border-none cursor-pointer transition-all ${
                statusFilter === s ? 'bg-purple-500/20 text-purple-400' : 'bg-white/5 text-white/40 hover:text-white/70'
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
          <div className="col-span-1">Reason</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>
        {filtered.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <IoArrowUndoOutline className="text-4xl text-white/10 mx-auto mb-3" />
            <p className="text-white/30 text-sm m-0">No refund requests found</p>
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
                    <div className="text-white/20 text-[10px]">{new Date(refund.requestedAt).toLocaleDateString()}</div>
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
                  <div className="col-span-1 text-white/30 text-xs truncate">{refund.reason || '-'}</div>
                  <div className="col-span-1">
                    <span className={`text-[11px] font-semibold px-2 py-1 rounded-full ${statusColors[refund.status]}`}>{refund.status}</span>
                  </div>
                  <div className="col-span-2 flex items-center justify-end gap-1.5">
                    <button onClick={() => setDetailModal(refund)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:bg-white/5 transition-all border-none bg-transparent cursor-pointer">
                      <IoEyeOutline className="text-base" />
                    </button>
                    {refund.status === 'pending' && (
                      <>
                        <button onClick={() => updateRefundStatus(refund.id, 'approved')}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border-none cursor-pointer transition-all bg-green-500/10 text-green-400 hover:bg-green-500/20">
                          <IoCheckmarkCircleOutline /> Approve
                        </button>
                        <button onClick={() => updateRefundStatus(refund.id, 'rejected')}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border-none cursor-pointer transition-all bg-red-500/10 text-red-400 hover:bg-red-500/20">
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
                <div className="flex justify-between"><span className="text-white/40 text-sm">Refund ID</span><span className="text-white font-mono text-sm">{detailModal.id}</span></div>
                <div className="flex justify-between"><span className="text-white/40 text-sm">Order ID</span><span className="text-white text-sm">{detailModal.orderId}</span></div>
                <div className="flex justify-between"><span className="text-white/40 text-sm">Customer</span><span className="text-white text-sm">{getUserName(detailModal.userId)}</span></div>
                <div className="flex justify-between"><span className="text-white/40 text-sm">Event</span><span className="text-white text-sm text-right">{detailModal.eventTitle || '-'}</span></div>
                <div className="flex justify-between"><span className="text-white/40 text-sm">Refund Item</span><span className="text-white text-sm text-right">{detailModal.item?.name || '-'}</span></div>
                <div className="flex justify-between"><span className="text-white/40 text-sm">Order Total</span><span className="text-white text-sm">{formatRupiah(getOrder(detailModal.orderId)?.total || 0)}</span></div>
                <div className="flex justify-between">
                  <span className="text-white/40 text-sm">Status</span>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColors[detailModal.status]}`}>{detailModal.status}</span>
                </div>
                <div className="flex justify-between"><span className="text-white/40 text-sm">Requested</span><span className="text-white text-sm">{new Date(detailModal.requestedAt).toLocaleString()}</span></div>
                {detailModal.processedAt && (
                  <div className="flex justify-between"><span className="text-white/40 text-sm">Processed</span><span className="text-white text-sm">{new Date(detailModal.processedAt).toLocaleString()}</span></div>
                )}
                <div className="pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <span className="text-white/40 text-xs block mb-1">Reason</span>
                  <p className="text-white/70 text-sm m-0 leading-relaxed">{detailModal.reason || 'No reason provided'}</p>
                </div>
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

export default AppAdminRefunds
