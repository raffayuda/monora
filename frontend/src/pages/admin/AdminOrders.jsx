import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { IoSearch, IoReceiptOutline, IoFilterOutline, IoChevronDownOutline } from 'react-icons/io5'
import { useAuth } from '../../context/AuthContext'
import { formatRupiah } from '../../utils/currency'

function AdminOrders() {
  const { getMyEvents, orders, updateOrderStatus } = useAuth()
  const myEvents = getMyEvents()
  const [searchQuery, setSearchQuery] = useState('')
  const [eventFilter, setEventFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const myEventIds = useMemo(() => new Set(myEvents.map(e => e.id)), [myEvents])

  const eventOrders = useMemo(() => {
    return orders.filter(o => {
      if (!o.items) return false
      return o.items.some(item =>
        myEventIds.has(item.eventId) || myEventIds.has(Number(item.eventId))
      )
    })
  }, [orders, myEventIds])

  const filteredOrders = useMemo(() => {
    return eventOrders.filter(o => {
      const matchesSearch = o.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.items?.some(item => item.eventTitle?.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesEvent = eventFilter === 'all' ||
        o.items?.some(item => String(item.eventId) === String(eventFilter))
      const matchesStatus = statusFilter === 'all' || o.status === statusFilter
      return matchesSearch && matchesEvent && matchesStatus
    })
  }, [eventOrders, searchQuery, eventFilter, statusFilter])

  const totalRevenue = filteredOrders.reduce((sum, o) => sum + (o.total || 0), 0)

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white m-0">Orders</h1>
        <p className="text-white/40 text-sm mt-1 m-0">{eventOrders.length} order{eventOrders.length !== 1 ? 's' : ''} · {formatRupiah(totalRevenue)} total revenue</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex items-center gap-2 flex-1 px-4 py-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <IoSearch className="text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search orders..."
            className="bg-transparent border-none outline-none text-white text-sm placeholder-white/30 w-full"
          />
        </div>
        <select
          value={eventFilter}
          onChange={(e) => setEventFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl text-sm text-white border-none cursor-pointer"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <option value="all">All Events</option>
          {myEvents.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl text-sm text-white border-none cursor-pointer"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <option value="all">All Statuses</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="rounded-2xl p-12 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <IoReceiptOutline className="text-5xl text-white/10 mx-auto mb-4" />
          <h3 className="text-white/60 font-semibold text-lg mb-2">No orders found</h3>
          <p className="text-white/30 text-sm m-0">
            {searchQuery || eventFilter !== 'all' || statusFilter !== 'all' ? 'Try adjusting your filters' : 'Orders will appear here when customers purchase tickets'}
          </p>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 text-white/30 text-[11px] font-semibold uppercase tracking-wider" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="col-span-2">Order ID</div>
            <div className="col-span-3">Items</div>
            <div className="col-span-2">Customer</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-2 text-right">Total</div>
          </div>

          <div className="divide-y divide-white/5">
            {filteredOrders.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors items-center"
              >
                <div className="col-span-2">
                  <div className="text-white text-sm font-mono">{order.id}</div>
                </div>
                <div className="col-span-3">
                  <div className="text-white text-sm truncate">
                    {order.items?.map(item => item.name || item.eventTitle).join(', ')}
                  </div>
                  <div className="text-white/30 text-[11px]">{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</div>
                </div>
                <div className="col-span-2 text-white/50 text-sm truncate">{order.customer?.name || order.customerName || 'N/A'}</div>
                <div className="col-span-2 text-white/50 text-sm">{new Date(order.date).toLocaleDateString()}</div>
                <div className="col-span-1">
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    className={`text-[11px] font-semibold px-2 py-1 rounded-full border-none cursor-pointer outline-none ${order.status === 'confirmed' ? 'bg-green-500/10 text-green-400' :
                        order.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' :
                          'bg-red-500/10 text-red-400'
                      }`}
                    style={{ background: order.status === 'confirmed' ? 'rgba(34,197,94,0.1)' : order.status === 'pending' ? 'rgba(234,179,8,0.1)' : 'rgba(239,68,68,0.1)' }}
                  >
                    <option value="confirmed" style={{ background: '#1a1a2e' }}>confirmed</option>
                    <option value="pending" style={{ background: '#1a1a2e' }}>pending</option>
                    <option value="cancelled" style={{ background: '#1a1a2e' }}>cancelled</option>
                  </select>
                </div>
                <div className="col-span-2 text-right">
                  <div className="text-white font-semibold text-sm">{formatRupiah(order.total || 0)}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminOrders
