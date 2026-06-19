import { useState, useMemo } from 'react'
import { IoSearchOutline, IoReceiptOutline, IoFunnelOutline } from 'react-icons/io5'
import { useAuth } from '../../context/AuthContext'

function AppAdminOrders() {
  const { orders, getAllUsers, getAllAdminEvents, updateOrderStatus } = useAuth()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const allUsers = useMemo(() => getAllUsers(), [])
  const allEvents = useMemo(() => getAllAdminEvents(), [])

  const getUserName = (userId) => allUsers.find(u => u.id === userId)?.name || 'Guest'

  const filtered = useMemo(() => {
    let result = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date))
    if (statusFilter !== 'all') result = result.filter(o => o.status === statusFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(o =>
        o.id?.toLowerCase().includes(q) ||
        getUserName(o.userId)?.toLowerCase().includes(q)
      )
    }
    return result
  }, [orders, statusFilter, search])

  const stats = useMemo(() => ({
    total: orders.length,
    revenue: orders.reduce((s, o) => s + (o.total || 0), 0),
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    pending: orders.filter(o => o.status === 'pending').length,
  }), [orders])

  const statusBadge = (status) => {
    if (status === 'confirmed') return 'bg-green-500/10 text-green-400'
    if (status === 'pending') return 'bg-yellow-500/10 text-yellow-400'
    if (status === 'cancelled') return 'bg-red-500/10 text-red-400'
    return 'bg-white/5 text-white/40'
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white m-0">All Orders</h1>
        <p className="text-white/40 text-sm mt-1 m-0">Platform-wide order management</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Orders', value: stats.total, color: '#8b5cf6' },
          { label: 'Revenue', value: `Rp ${stats.revenue.toLocaleString('id-ID')}`, color: '#10b981' },
          { label: 'Confirmed', value: stats.confirmed, color: '#22c55e' },
          { label: 'Pending', value: stats.pending, color: '#eab308' },
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
          <input
            type="text"
            placeholder="Search order ID or customer..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-transparent text-white text-sm py-2.5 pl-10 pr-4 rounded-xl outline-none placeholder-white/30"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
          />
        </div>
        <div className="flex gap-1.5">
          {['all', 'confirmed', 'pending', 'cancelled'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-lg text-xs font-medium border-none cursor-pointer transition-all ${
                statusFilter === s ? 'bg-purple-500/20 text-purple-400' : 'bg-white/5 text-white/40 hover:text-white/70'
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="grid grid-cols-[120px_1fr_1fr_120px_100px_100px] gap-4 px-6 py-3 text-white/30 text-[11px] font-semibold uppercase tracking-wider"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <span>Order ID</span>
          <span>Items</span>
          <span>Customer</span>
          <span>Date</span>
          <span>Status</span>
          <span className="text-right">Total</span>
        </div>

        {filtered.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <IoReceiptOutline className="text-3xl text-white/10 mx-auto mb-2" />
            <p className="text-white/30 text-sm m-0">No orders found</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filtered.map(order => (
              <div key={order.id} className="grid grid-cols-[120px_1fr_1fr_120px_100px_100px] gap-4 px-6 py-3.5 items-center hover:bg-white/[0.02] transition-colors">
                {/* Order ID */}
                <div className="text-white/60 text-xs font-mono truncate">{order.id}</div>

                {/* Items */}
                <div className="min-w-0">
                  {order.items?.slice(0, 2).map((item, i) => (
                    <div key={i} className="text-white/50 text-xs truncate">
                      {item.quantity}x {item.title || item.name || 'Item'}
                    </div>
                  ))}
                  {order.items?.length > 2 && (
                    <div className="text-white/20 text-[11px]">+{order.items.length - 2} more</div>
                  )}
                </div>

                {/* Customer */}
                <div className="text-white/50 text-sm truncate">{getUserName(order.userId)}</div>

                {/* Date */}
                <div className="text-white/40 text-xs">
                  {order.date ? new Date(order.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                </div>

                {/* Status */}
                <div>
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border-none cursor-pointer outline-none w-fit ${statusBadge(order.status)}`}
                  >
                    <option value="confirmed" style={{ background: '#1a1a2e' }}>confirmed</option>
                    <option value="pending" style={{ background: '#1a1a2e' }}>pending</option>
                    <option value="cancelled" style={{ background: '#1a1a2e' }}>cancelled</option>
                  </select>
                </div>

                {/* Total */}
                <div className="text-right text-white font-semibold text-sm">
                  Rp {(order.total || 0).toLocaleString('id-ID')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AppAdminOrders
