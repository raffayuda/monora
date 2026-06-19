import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  IoPeopleOutline, IoCalendarOutline, IoCashOutline, IoReceiptOutline,
  IoTrendingUpOutline, IoPersonOutline, IoEllipseOutline
} from 'react-icons/io5'
import { useAuth } from '../../context/AuthContext'

function AppAdminDashboard() {
  const { user, getAllUsers, getAllAdminEvents, orders } = useAuth()
  const allUsers = getAllUsers()
  const allEvents = getAllAdminEvents()

  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0)
    const totalTickets = orders.reduce((sum, o) =>
      sum + (o.items?.filter(i => i.itemType === 'ticket').reduce((s, i) => s + (i.quantity || 0), 0) || 0), 0
    )
    const eventAdmins = allUsers.filter(u => u.role === 'event_admin').length
    const customers = allUsers.filter(u => u.role === 'customer').length

    return {
      totalUsers: allUsers.length,
      customers,
      eventAdmins,
      totalEvents: allEvents.length,
      totalOrders: orders.length,
      totalRevenue,
      totalTickets,
    }
  }, [allUsers, allEvents, orders])

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: IoPeopleOutline, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
    { label: 'Total Events', value: stats.totalEvents, icon: IoCalendarOutline, color: '#f97316', bg: 'rgba(249,115,22,0.1)' },
    { label: 'Total Revenue', value: `Rp ${stats.totalRevenue.toLocaleString('id-ID')}`, icon: IoCashOutline, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
    { label: 'Total Orders', value: stats.totalOrders, icon: IoReceiptOutline, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
    { label: 'Tickets Sold', value: stats.totalTickets, icon: IoTrendingUpOutline, color: '#ec4899', bg: 'rgba(236,72,153,0.1)' },
    { label: 'Event Organizers', value: stats.eventAdmins, icon: IoPersonOutline, color: '#eab308', bg: 'rgba(234,179,8,0.1)' },
  ]

  const recentUsers = [...allUsers].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6)
  const recentEvents = allEvents.slice(0, 5)

  const roleColor = (role) => {
    if (role === 'app_admin') return 'text-purple-400 bg-purple-500/10'
    if (role === 'event_admin') return 'text-orange-400 bg-orange-500/10'
    return 'text-blue-400 bg-blue-500/10'
  }

  const roleLabel = (role) => {
    if (role === 'app_admin') return 'App Admin'
    if (role === 'event_admin') return 'Organizer'
    return 'Customer'
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-white m-0">Platform Overview</h1>
        <p className="text-white/40 text-sm mt-1 m-0">Welcome back, {user?.name}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 mb-8">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.06 }}
            className="rounded-2xl p-4"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: stat.bg }}>
              <stat.icon className="text-lg" style={{ color: stat.color }} />
            </div>
            <div className="text-xl font-bold text-white">{stat.value}</div>
            <div className="text-white/30 text-[11px] mt-0.5">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <h2 className="text-white font-semibold text-sm m-0">Recent Users</h2>
            <Link to="/app-admin/users" className="text-purple-400 text-xs no-underline hover:text-purple-300">View All</Link>
          </div>
          {recentUsers.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <IoPeopleOutline className="text-3xl text-white/10 mx-auto mb-2" />
              <p className="text-white/30 text-sm m-0">No users yet</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {recentUsers.map(u => (
                <div key={u.id} className="flex items-center gap-3 px-6 py-3 hover:bg-white/[0.02] transition-colors">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-indigo-500/30 to-purple-600/30 shrink-0">
                    <span className="text-white text-xs font-bold">{u.name?.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-medium truncate">{u.name}</div>
                    <div className="text-white/30 text-[11px] truncate">{u.email}</div>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${roleColor(u.role)}`}>
                    {roleLabel(u.role)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Events */}
        <div className="rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <h2 className="text-white font-semibold text-sm m-0">Recent Events</h2>
            <Link to="/app-admin/events" className="text-purple-400 text-xs no-underline hover:text-purple-300">View All</Link>
          </div>
          {recentEvents.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <IoCalendarOutline className="text-3xl text-white/10 mx-auto mb-2" />
              <p className="text-white/30 text-sm m-0">No events yet</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {recentEvents.map(event => (
                <div key={event.id} className="flex items-center gap-3 px-6 py-3 hover:bg-white/[0.02] transition-colors">
                  {event.thumbnail || event.image ? (
                    <img src={event.thumbnail || event.image} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <IoEllipseOutline className="text-white/20" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-medium truncate">{event.title}</div>
                    <div className="text-white/30 text-[11px]">{event.city} · {event.category}</div>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    event.status === 'published' ? 'bg-green-500/10 text-green-400' :
                    event.status === 'draft' ? 'bg-yellow-500/10 text-yellow-400' :
                    'bg-red-500/10 text-red-400'
                  }`}>{event.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AppAdminDashboard
