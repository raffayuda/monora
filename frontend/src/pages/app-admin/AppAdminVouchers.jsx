import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoAddCircleOutline, IoSearchOutline, IoPricetagOutline, IoCreateOutline, IoTrashOutline, IoCloseOutline } from 'react-icons/io5'
import { useAuth } from '../../context/AuthContext'
import { formatRupiah } from '../../utils/currency'

const EMPTY_FORM = { code: '', eventId: '', type: 'percentage', value: '', minPurchase: '', maxUses: '', description: '' }

function AppAdminVouchers() {
  const { vouchers, addVoucher, updateVoucher, deleteVoucher, getAllAdminEvents } = useAuth()
  const allEvents = getAllAdminEvents()
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingCode, setEditingCode] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(null)

  const filtered = vouchers.filter(v =>
    v.code.toLowerCase().includes(search.toLowerCase()) ||
    v.description?.toLowerCase().includes(search.toLowerCase())
  )

  const openCreate = () => { setForm(EMPTY_FORM); setEditingCode(null); setError(''); setShowModal(true) }

  const openEdit = (v) => {
    setForm({
      code: v.code,
      eventId: v.eventId ? String(v.eventId) : '',
      type: v.type,
      value: v.value,
      minPurchase: v.minPurchase,
      maxUses: v.maxUses,
      description: v.description || '',
    })
    setEditingCode(v.code); setError(''); setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.code.trim() || !form.value) { setError('Code and value are required'); return }
    if (!form.eventId) { setError('Event is required'); return }
    if (editingCode) {
      updateVoucher(editingCode, { eventId: Number(form.eventId), type: form.type, value: Number(form.value), minPurchase: Number(form.minPurchase) || 0, maxUses: Number(form.maxUses) || 100, description: form.description })
    } else {
      const result = await addVoucher(form)
      if (!result.success) { setError(result.message); return }
    }
    setShowModal(false)
  }

  const handleDeleteConfirm = () => { if (confirmDelete) { deleteVoucher(confirmDelete); setConfirmDelete(null) } }
  const inputStyle = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white m-0">Voucher Codes</h1>
          <p className="text-white/40 text-sm mt-1 m-0">Platform-wide voucher management</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 text-white px-5 py-2.5 rounded-xl text-sm font-semibold border-none cursor-pointer transition-all hover:opacity-90" style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }}>
          <IoAddCircleOutline className="text-lg" /> Add Voucher
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl mb-6" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <IoSearchOutline className="text-white/40" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search vouchers..." className="bg-transparent border-none outline-none text-white text-sm placeholder-white/30 w-full" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Vouchers', value: vouchers.length, color: '#8b5cf6' },
          { label: 'Total Redeemed', value: vouchers.reduce((s, v) => s + v.usedCount, 0), color: '#10b981' },
          { label: 'Active', value: vouchers.filter(v => v.usedCount < v.maxUses).length, color: '#3b82f6' },
          { label: 'Fully Used', value: vouchers.filter(v => v.usedCount >= v.maxUses).length, color: '#ef4444' },
        ].map(s => (
          <div key={s.label} className="rounded-xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="text-lg font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-white/30 text-[11px]">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 text-white/30 text-[11px] font-semibold uppercase tracking-wider" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="col-span-2">Code</div>
          <div className="col-span-2">Event</div>
          <div className="col-span-1">Type</div>
          <div className="col-span-1">Value</div>
          <div className="col-span-1">Min Purchase</div>
          <div className="col-span-1">Usage</div>
          <div className="col-span-2">Description</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>
        {filtered.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <IoPricetagOutline className="text-4xl text-white/10 mx-auto mb-3" />
            <p className="text-white/30 text-sm m-0">No vouchers found</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filtered.map((v, i) => (
              <motion.div key={v.code} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors items-center">
                <div className="col-span-2">
                  <span className="text-purple-400 font-mono text-sm font-semibold">{v.code}</span>
                  {v.usedCount >= v.maxUses && <span className="ml-2 text-[9px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400">DEPLETED</span>}
                </div>
                <div className="col-span-2 text-white/60 text-xs truncate">{v.eventTitle || '-'}</div>
                <div className="col-span-1 text-white/50 text-sm capitalize">{v.type}</div>
                <div className="col-span-1 text-white text-sm font-medium">{v.type === 'percentage' ? `${v.value}%` : formatRupiah(v.value)}</div>
                <div className="col-span-1 text-white/50 text-sm">{formatRupiah(v.minPurchase)}</div>
                <div className="col-span-1">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full rounded-full bg-purple-500/60" style={{ width: `${Math.min((v.usedCount / v.maxUses) * 100, 100)}%` }} />
                    </div>
                    <span className="text-white/40 text-xs whitespace-nowrap">{v.usedCount}/{v.maxUses}</span>
                  </div>
                </div>
                <div className="col-span-2 text-white/30 text-xs truncate">{v.description}</div>
                <div className="col-span-1 flex items-center justify-end gap-1.5">
                  <button onClick={() => openEdit(v)} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-purple-400 hover:bg-purple-500/10 transition-all border-none bg-transparent cursor-pointer"><IoCreateOutline className="text-base" /></button>
                  <button onClick={() => setConfirmDelete(v.code)} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all border-none bg-transparent cursor-pointer"><IoTrashOutline className="text-base" /></button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }} onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="rounded-2xl p-6 w-full max-w-md" style={{ background: 'rgba(20,22,45,0.98)', border: '1px solid rgba(255,255,255,0.1)' }}
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-white font-semibold text-lg m-0">{editingCode ? 'Edit Voucher' : 'Add Voucher'}</h3>
                <button onClick={() => setShowModal(false)} className="text-white/30 hover:text-white bg-transparent border-none cursor-pointer"><IoCloseOutline className="text-xl" /></button>
              </div>
              {error && <div className="text-red-400 text-sm mb-3 px-3 py-2 rounded-lg bg-red-500/10">{error}</div>}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-white/50 text-xs font-medium block mb-1.5">Voucher Code</label>
                  <input type="text" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} disabled={!!editingCode}
                    placeholder="e.g. SUMMER50" className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none placeholder-white/30 disabled:opacity-50" style={inputStyle} />
                </div>
                <div>
                  <label className="text-white/50 text-xs font-medium block mb-1.5">Event</label>
                  <select value={form.eventId} onChange={e => setForm({ ...form, eventId: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none cursor-pointer" style={inputStyle}>
                    <option value="" style={{ background: '#1a1a2e' }}>Select event</option>
                    {allEvents.map(event => (
                      <option key={event.id} value={event.id} style={{ background: '#1a1a2e' }}>{event.title}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-white/50 text-xs font-medium block mb-1.5">Type</label>
                    <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none cursor-pointer" style={inputStyle}>
                      <option value="percentage" style={{ background: '#1a1a2e' }}>Percentage (%)</option>
                      <option value="flat" style={{ background: '#1a1a2e' }}>Flat (Rp)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-white/50 text-xs font-medium block mb-1.5">Value</label>
                    <input type="number" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })}
                      placeholder={form.type === 'percentage' ? '0-100' : 'Amount'} className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none placeholder-white/30" style={inputStyle} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-white/50 text-xs font-medium block mb-1.5">Min Purchase (Rp)</label>
                    <input type="number" value={form.minPurchase} onChange={e => setForm({ ...form, minPurchase: e.target.value })}
                      placeholder="0" className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none placeholder-white/30" style={inputStyle} />
                  </div>
                  <div>
                    <label className="text-white/50 text-xs font-medium block mb-1.5">Max Uses</label>
                    <input type="number" value={form.maxUses} onChange={e => setForm({ ...form, maxUses: e.target.value })}
                      placeholder="100" className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none placeholder-white/30" style={inputStyle} />
                  </div>
                </div>
                <div>
                  <label className="text-white/50 text-xs font-medium block mb-1.5">Description</label>
                  <input type="text" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                    placeholder="Short description..." className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none placeholder-white/30" style={inputStyle} />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)}
                    className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white/60 bg-white/5 border-none cursor-pointer hover:bg-white/10 transition-all">Cancel</button>
                  <button type="submit"
                    className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white border-none cursor-pointer hover:opacity-90 transition-all"
                    style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }}>{editingCode ? 'Update' : 'Create'}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }} onClick={() => setConfirmDelete(null)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="rounded-2xl p-6 w-full max-w-sm" style={{ background: 'rgba(20,22,45,0.98)', border: '1px solid rgba(255,255,255,0.1)' }}
              onClick={e => e.stopPropagation()}>
              <h3 className="text-white font-semibold text-lg mb-2">Delete Voucher?</h3>
              <p className="text-white/40 text-sm mb-6">Delete <span className="text-purple-400 font-mono">{confirmDelete}</span>? This cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white/60 bg-white/5 border-none cursor-pointer hover:bg-white/10 transition-all">Cancel</button>
                <button onClick={handleDeleteConfirm} className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white bg-red-500 border-none cursor-pointer hover:bg-red-600 transition-all">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AppAdminVouchers
