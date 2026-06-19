import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoSearchOutline, IoFlashOutline, IoCloseOutline, IoAddCircleOutline, IoTrashOutline } from 'react-icons/io5'
import { useAuth } from '../../context/AuthContext'
import { formatRupiah } from '../../utils/currency'

function AppAdminPromos() {
  const { getAllAdminEvents, getAllUsers, setEventDiscount, removeEventDiscount } = useAuth()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [discountModal, setDiscountModal] = useState(null)
  const [form, setForm] = useState({ percentage: '', label: '' })
  const [confirmRemove, setConfirmRemove] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const allEvents = useMemo(() => getAllAdminEvents(), [refreshKey])
  const allUsers = useMemo(() => getAllUsers(), [])
  const getUserName = (userId) => allUsers.find(u => u.id === userId)?.name || 'Unknown'

  const filtered = useMemo(() => {
    let result = [...allEvents]
    if (filter === 'active') result = result.filter(e => e.discount)
    if (filter === 'none') result = result.filter(e => !e.discount)
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(e => e.title?.toLowerCase().includes(q) || e.category?.toLowerCase().includes(q))
    }
    return result
  }, [allEvents, filter, search])

  const activePromos = allEvents.filter(e => e.discount).length

  const openDiscountModal = (event) => {
    setForm({ percentage: event.discount?.percentage || '', label: event.discount?.label || '' })
    setDiscountModal(event)
  }

  const handleSaveDiscount = (e) => {
    e.preventDefault()
    if (!form.percentage || Number(form.percentage) <= 0 || Number(form.percentage) > 100) return
    setEventDiscount(discountModal.id, { percentage: Number(form.percentage), label: form.label || `${form.percentage}% OFF` })
    setDiscountModal(null)
    setRefreshKey(k => k + 1)
  }

  const handleRemoveDiscount = () => {
    if (confirmRemove) { removeEventDiscount(confirmRemove.id); setConfirmRemove(null); setRefreshKey(k => k + 1) }
  }

  const inputStyle = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white m-0">Promos & Discounts</h1>
        <p className="text-white/40 text-sm mt-1 m-0">Manage discounts across all platform events</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Total Events', value: allEvents.length, color: '#8b5cf6' },
          { label: 'Active Promos', value: activePromos, color: '#10b981' },
          { label: 'No Discount', value: allEvents.length - activePromos, color: '#6b7280' },
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
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search events..."
            className="w-full bg-transparent text-white text-sm py-2.5 pl-10 pr-4 rounded-xl outline-none placeholder-white/30"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} />
        </div>
        <div className="flex gap-1.5">
          {[{ key: 'all', label: 'All' }, { key: 'active', label: 'Has Promo' }, { key: 'none', label: 'No Promo' }].map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`px-3 py-2 rounded-lg text-xs font-medium border-none cursor-pointer transition-all ${
                filter === f.key ? 'bg-purple-500/20 text-purple-400' : 'bg-white/5 text-white/40 hover:text-white/70'
              }`}>{f.label}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 text-white/30 text-[11px] font-semibold uppercase tracking-wider" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="col-span-3">Event</div>
          <div className="col-span-2">Creator</div>
          <div className="col-span-1">Category</div>
          <div className="col-span-2">Base Price</div>
          <div className="col-span-2">Discount</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>
        {filtered.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <IoFlashOutline className="text-4xl text-white/10 mx-auto mb-3" />
            <p className="text-white/30 text-sm m-0">{allEvents.length === 0 ? 'No events on the platform' : 'No matching events'}</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filtered.map((event, i) => {
              const lowestPrice = event.tickets?.length > 0 ? Math.min(...event.tickets.map(t => t.price)) : 0
              return (
                <motion.div key={event.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors items-center">
                  <div className="col-span-3 flex items-center gap-3">
                    <img src={event.thumbnail || event.image || 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=100&h=100&fit=crop'} alt=""
                      className="w-10 h-10 rounded-lg object-cover shrink-0" />
                    <div className="min-w-0">
                      <div className="text-white text-sm font-medium truncate">{event.title}</div>
                      <div className="text-white/30 text-[11px]">{event.date}</div>
                    </div>
                  </div>
                  <div className="col-span-2 text-white/40 text-xs truncate">{getUserName(event.createdBy)}</div>
                  <div className="col-span-1 text-white/50 text-xs">{event.category}</div>
                  <div className="col-span-2 text-white/50 text-sm">{formatRupiah(lowestPrice)}+</div>
                  <div className="col-span-2">
                    {event.discount ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-500/10 text-green-400">-{event.discount.percentage}%</span>
                        <span className="text-white/30 text-[11px] truncate">{event.discount.label}</span>
                      </div>
                    ) : <span className="text-white/20 text-xs">None</span>}
                  </div>
                  <div className="col-span-2 flex items-center justify-end gap-1.5">
                    <button onClick={() => openDiscountModal(event)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border-none cursor-pointer transition-all bg-purple-500/10 text-purple-400 hover:bg-purple-500/20">
                      {event.discount ? 'Edit' : <><IoAddCircleOutline /> Add</>}
                    </button>
                    {event.discount && (
                      <button onClick={() => setConfirmRemove(event)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all border-none bg-transparent cursor-pointer">
                        <IoTrashOutline className="text-base" />
                      </button>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* Set/Edit Discount Modal */}
      <AnimatePresence>
        {discountModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }} onClick={() => setDiscountModal(null)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="rounded-2xl p-6 w-full max-w-sm" style={{ background: 'rgba(20,22,45,0.98)', border: '1px solid rgba(255,255,255,0.1)' }}
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-white font-semibold text-lg m-0">{discountModal.discount ? 'Edit Discount' : 'Add Discount'}</h3>
                <button onClick={() => setDiscountModal(null)} className="text-white/30 hover:text-white bg-transparent border-none cursor-pointer"><IoCloseOutline className="text-xl" /></button>
              </div>
              <p className="text-white/40 text-sm mb-4 m-0">{discountModal.title}</p>
              <form onSubmit={handleSaveDiscount} className="space-y-4">
                <div>
                  <label className="text-white/50 text-xs font-medium block mb-1.5">Discount Percentage</label>
                  <input type="number" min="1" max="100" value={form.percentage} onChange={e => setForm({ ...form, percentage: e.target.value })}
                    placeholder="e.g. 15" className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none placeholder-white/30" style={inputStyle} />
                </div>
                <div>
                  <label className="text-white/50 text-xs font-medium block mb-1.5">Promo Label</label>
                  <input type="text" value={form.label} onChange={e => setForm({ ...form, label: e.target.value })}
                    placeholder="e.g. Early Bird Sale" className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none placeholder-white/30" style={inputStyle} />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setDiscountModal(null)}
                    className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white/60 bg-white/5 border-none cursor-pointer hover:bg-white/10 transition-all">Cancel</button>
                  <button type="submit"
                    className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white border-none cursor-pointer hover:opacity-90 transition-all"
                    style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }}>Save</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Remove Confirmation */}
      <AnimatePresence>
        {confirmRemove && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }} onClick={() => setConfirmRemove(null)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="rounded-2xl p-6 w-full max-w-sm" style={{ background: 'rgba(20,22,45,0.98)', border: '1px solid rgba(255,255,255,0.1)' }}
              onClick={e => e.stopPropagation()}>
              <h3 className="text-white font-semibold text-lg mb-2">Remove Discount?</h3>
              <p className="text-white/40 text-sm mb-6">Remove the <span className="text-green-400">{confirmRemove.discount?.percentage}%</span> discount from <span className="text-white/70">{confirmRemove.title}</span>?</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmRemove(null)} className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white/60 bg-white/5 border-none cursor-pointer hover:bg-white/10 transition-all">Cancel</button>
                <button onClick={handleRemoveDiscount} className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white bg-red-500 border-none cursor-pointer hover:bg-red-600 transition-all">Remove</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AppAdminPromos
