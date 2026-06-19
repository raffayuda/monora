import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  IoCashOutline, IoTrendingUpOutline, IoPeopleOutline,
  IoTicketOutline, IoCalendarOutline, IoBarChartOutline
} from 'react-icons/io5'
import { useAuth } from '../../context/AuthContext'

function AppAdminAnalytics() {
  const { getAllUsers, getAllAdminEvents, orders } = useAuth()
  const allUsers = getAllUsers()
  const allEvents = getAllAdminEvents()

  const analytics = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0)
    const totalTickets = orders.reduce((sum, o) =>
      sum + (o.items?.filter(i => i.itemType === 'ticket').reduce((s, i) => s + (i.quantity || 0), 0) || 0), 0
    )
    const totalMerch = orders.reduce((sum, o) =>
      sum + (o.items?.filter(i => i.itemType === 'merch').reduce((s, i) => s + (i.quantity || 0), 0) || 0), 0
    )

    // Revenue by category
    const byCategory = {}
    allEvents.forEach(e => {
      if (!byCategory[e.category]) byCategory[e.category] = { events: 0, revenue: 0, tickets: 0 }
      byCategory[e.category].events++
    })
    orders.forEach(o => {
      o.items?.forEach(item => {
        const event = allEvents.find(e => e.id === item.eventId || e.id === Number(item.eventId))
        if (event && byCategory[event.category]) {
          byCategory[event.category].revenue += item.price * (item.quantity || 1)
          if (item.itemType === 'ticket') byCategory[event.category].tickets += (item.quantity || 1)
        }
      })
    })

    // Revenue by city
    const byCity = {}
    allEvents.forEach(e => {
      if (!byCity[e.city]) byCity[e.city] = { events: 0, revenue: 0 }
      byCity[e.city].events++
    })
    orders.forEach(o => {
      o.items?.forEach(item => {
        const event = allEvents.find(e => e.id === item.eventId || e.id === Number(item.eventId))
        if (event && byCity[event.city]) {
          byCity[event.city].revenue += item.price * (item.quantity || 1)
        }
      })
    })

    // User growth by month
    const usersByMonth = {}
    allUsers.forEach(u => {
      if (u.createdAt) {
        const d = new Date(u.createdAt)
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        usersByMonth[key] = (usersByMonth[key] || 0) + 1
      }
    })

    // Orders by month
    const ordersByMonth = {}
    orders.forEach(o => {
      if (o.date) {
        const d = new Date(o.date)
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        if (!ordersByMonth[key]) ordersByMonth[key] = { orders: 0, revenue: 0 }
        ordersByMonth[key].orders++
        ordersByMonth[key].revenue += o.total || 0
      }
    })

    // Top organizers
    const byOrganizer = {}
    allEvents.forEach(e => {
      if (!byOrganizer[e.createdBy]) byOrganizer[e.createdBy] = { events: 0, revenue: 0 }
      byOrganizer[e.createdBy].events++
    })
    orders.forEach(o => {
      o.items?.forEach(item => {
        const event = allEvents.find(e => e.id === item.eventId || e.id === Number(item.eventId))
        if (event && byOrganizer[event.createdBy]) {
          byOrganizer[event.createdBy].revenue += item.price * (item.quantity || 1)
        }
      })
    })

    return {
      totalRevenue,
      totalTickets,
      totalMerch,
      avgOrderValue: orders.length ? totalRevenue / orders.length : 0,
      byCategory: Object.entries(byCategory).map(([name, d]) => ({ name, ...d })).sort((a, b) => b.revenue - a.revenue),
      byCity: Object.entries(byCity).map(([name, d]) => ({ name, ...d })).sort((a, b) => b.revenue - a.revenue),
      ordersByMonth: Object.entries(ordersByMonth).map(([month, d]) => ({ month, ...d })).sort((a, b) => a.month.localeCompare(b.month)),
      usersByMonth: Object.entries(usersByMonth).map(([month, count]) => ({ month, count })).sort((a, b) => a.month.localeCompare(b.month)),
      topOrganizers: Object.entries(byOrganizer).map(([id, d]) => {
        const user = allUsers.find(u => u.id === Number(id))
        return { name: user?.name || 'Unknown', ...d }
      }).sort((a, b) => b.revenue - a.revenue).slice(0, 6),
    }
  }, [allUsers, allEvents, orders])

  const summaryCards = [
    { label: 'Total Revenue', value: `Rp ${analytics.totalRevenue.toLocaleString('id-ID')}`, icon: IoCashOutline, color: '#10b981' },
    { label: 'Tickets Sold', value: analytics.totalTickets, icon: IoTicketOutline, color: '#f97316' },
    { label: 'Merch Sold', value: analytics.totalMerch, icon: IoTrendingUpOutline, color: '#8b5cf6' },
    { label: 'Avg Order Value', value: `Rp ${analytics.avgOrderValue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`, icon: IoBarChartOutline, color: '#ec4899' },
  ]

  const maxCategoryRevenue = Math.max(...analytics.byCategory.map(c => c.revenue), 1)
  const maxCityRevenue = Math.max(...analytics.byCity.map(c => c.revenue), 1)

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white m-0">Platform Analytics</h1>
        <p className="text-white/40 text-sm mt-1 m-0">Comprehensive platform performance overview</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {summaryCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl p-4"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <stat.icon className="text-xl mb-2" style={{ color: stat.color }} />
            <div className="text-xl font-bold text-white">{stat.value}</div>
            <div className="text-white/30 text-[11px] mt-0.5">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Category */}
        <div className="rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <h3 className="text-white font-semibold text-sm m-0">Revenue by Category</h3>
          </div>
          <div className="p-6">
            {analytics.byCategory.length === 0 ? (
              <div className="text-center py-8">
                <IoBarChartOutline className="text-3xl text-white/10 mx-auto mb-2" />
                <p className="text-white/30 text-sm m-0">No data yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {analytics.byCategory.map((cat, i) => (
                  <div key={cat.name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-white text-sm font-medium">{cat.name}</span>
                      <span className="text-white/60 text-sm font-semibold">Rp {cat.revenue.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(cat.revenue / maxCategoryRevenue) * 100}%` }}
                        transition={{ delay: i * 0.1, duration: 0.6 }}
                        className="h-full rounded-full"
                        style={{ background: 'linear-gradient(90deg, #8b5cf6, #6d28d9)' }}
                      />
                    </div>
                    <div className="text-white/20 text-[11px] mt-1">{cat.events} events · {cat.tickets} tickets</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Revenue by City */}
        <div className="rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <h3 className="text-white font-semibold text-sm m-0">Revenue by City</h3>
          </div>
          <div className="p-6">
            {analytics.byCity.length === 0 ? (
              <div className="text-center py-8">
                <IoCalendarOutline className="text-3xl text-white/10 mx-auto mb-2" />
                <p className="text-white/30 text-sm m-0">No data yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {analytics.byCity.slice(0, 8).map((city, i) => (
                  <div key={city.name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-white text-sm font-medium">{city.name}</span>
                      <span className="text-white/60 text-sm font-semibold">Rp {city.revenue.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(city.revenue / maxCityRevenue) * 100}%` }}
                        transition={{ delay: i * 0.1, duration: 0.6 }}
                        className="h-full rounded-full"
                        style={{ background: 'linear-gradient(90deg, #f97316, #ea580c)' }}
                      />
                    </div>
                    <div className="text-white/20 text-[11px] mt-1">{city.events} events</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Top Organizers */}
        <div className="rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <h3 className="text-white font-semibold text-sm m-0">Top Organizers</h3>
          </div>
          <div className="p-6">
            {analytics.topOrganizers.length === 0 ? (
              <div className="text-center py-8">
                <IoPeopleOutline className="text-3xl text-white/10 mx-auto mb-2" />
                <p className="text-white/30 text-sm m-0">No data yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {analytics.topOrganizers.map((org, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-500/30 to-indigo-600/30 shrink-0">
                      <span className="text-white text-xs font-bold">{org.name?.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-medium truncate">{org.name}</div>
                      <div className="text-white/20 text-[11px]">{org.events} events</div>
                    </div>
                    <div className="text-white/60 text-sm font-semibold">Rp {org.revenue.toLocaleString('id-ID')}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Monthly Revenue Chart */}
        {analytics.ordersByMonth.length > 0 && (
          <div className="rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <h3 className="text-white font-semibold text-sm m-0">Monthly Revenue</h3>
            </div>
            <div className="p-6">
              <div className="flex items-end gap-3 h-40">
                {analytics.ordersByMonth.map((month, i) => {
                  const maxRev = Math.max(...analytics.ordersByMonth.map(m => m.revenue), 1)
                  const height = (month.revenue / maxRev) * 100
                  return (
                    <div key={month.month} className="flex-1 flex flex-col items-center gap-2">
                      <div className="text-white/40 text-[10px] font-semibold">Rp {(month.revenue / 1000).toFixed(0)}k</div>
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                        className="w-full rounded-t-lg min-h-[4px]"
                        style={{ background: 'linear-gradient(180deg, #8b5cf6, #6d28d9)' }}
                      />
                      <div className="text-white/30 text-[10px]">{month.month}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AppAdminAnalytics
