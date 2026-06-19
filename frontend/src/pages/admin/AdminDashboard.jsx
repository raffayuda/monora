import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { IoCalendarOutline, IoTicketOutline, IoCashOutline, IoTrendingUpOutline, IoAddCircleOutline, IoEyeOutline } from 'react-icons/io5'
import { useAuth } from '../../context/AuthContext'
import { formatRupiah } from '../../utils/currency'

function AdminDashboard() {
  const { getMyEvents, orders, user } = useAuth()
  const myEvents = getMyEvents()

  const stats = useMemo(() => {
    const myEventIds = new Set(myEvents.map(e => e.id))
    const relevantOrders = orders.filter(o =>
      o.items?.some(item => myEventIds.has(item.eventId) || myEventIds.has(Number(item.eventId)))
    )
    const totalRevenue = relevantOrders.reduce((sum, o) => sum + (o.total || 0), 0)
    const totalTickets = relevantOrders.reduce((sum, o) =>
      sum + (o.items?.filter(i => i.itemType === 'ticket').reduce((s, i) => s + (i.quantity || 0), 0) || 0), 0
    )
    return {
      events: myEvents.length,
      orders: relevantOrders.length,
      revenue: totalRevenue,
      ticketsSold: totalTickets,
    }
  }, [myEvents, orders])

  const statCards = [
    { label: 'Total Events', value: stats.events, icon: IoCalendarOutline, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
    { label: 'Tickets Sold', value: stats.ticketsSold, icon: IoTicketOutline, color: '#f97316', bg: 'rgba(249,115,22,0.1)' },
    { label: 'Total Revenue', value: formatRupiah(stats.revenue), icon: IoCashOutline, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
    { label: 'Total Orders', value: stats.orders, icon: IoTrendingUpOutline, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
  ]

  const recentEvents = myEvents.slice(0, 5)

  return (
    <div className="p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white m-0">Dashboard</h1>
          <p className="text-white/40 text-sm mt-1 m-0">Welcome back, {user?.name}</p>
        </div>
        <Link
          to="/admin/events/create"
          className="flex items-center justify-center gap-2 text-white px-5 py-2.5 rounded-xl text-sm font-semibold no-underline transition-all hover:opacity-90 w-full sm:w-auto"
          style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
        >
          <IoAddCircleOutline className="text-lg" />
          Create Event
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl p-5"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: stat.bg }}>
                <stat.icon className="text-xl" style={{ color: stat.color }} />
              </div>
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-white/40 text-xs mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Recent Events */}
      <div className="rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <h2 className="text-white font-semibold text-base m-0">Recent Events</h2>
          <Link to="/admin/events" className="text-orange-400 text-sm no-underline hover:text-orange-300 transition-colors">View All</Link>
        </div>

        {recentEvents.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <IoCalendarOutline className="text-4xl text-white/15 mx-auto mb-3" />
            <p className="text-white/40 text-sm m-0">No events yet</p>
            <Link to="/admin/events/create" className="text-orange-400 text-sm no-underline hover:text-orange-300 mt-2 inline-block">Create your first event</Link>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {recentEvents.map(event => (
              <div key={event.id} className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors">
                <img src={event.thumbnail || event.image} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-medium truncate">{event.title}</div>
                  <div className="text-white/30 text-[11px]">{event.city} · {event.date}</div>
                </div>
                <span className={`text-[11px] font-semibold px-2 py-1 rounded-full ${event.status === 'published' ? 'bg-green-500/10 text-green-400' :
                    event.status === 'draft' ? 'bg-yellow-500/10 text-yellow-400' :
                      'bg-red-500/10 text-red-400'
                  }`}>
                  {event.status}
                </span>
                <Link to={`/admin/events`} className="text-white/30 hover:text-white transition-colors no-underline">
                  <IoEyeOutline className="text-lg" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
