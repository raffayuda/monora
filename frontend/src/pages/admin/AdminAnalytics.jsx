import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { IoBarChartOutline, IoTrendingUpOutline, IoCalendarOutline, IoTicketOutline, IoCashOutline, IoPeopleOutline } from 'react-icons/io5'
import { useAuth } from '../../context/AuthContext'
import { formatRupiah } from '../../utils/currency'

function AdminAnalytics() {
  const { getMyEvents, orders } = useAuth()
  const myEvents = getMyEvents()

  const analytics = useMemo(() => {
    const myEventIds = new Set(myEvents.map(e => e.id))

    const eventOrders = orders.filter(o =>
      o.items?.some(item => myEventIds.has(item.eventId) || myEventIds.has(Number(item.eventId)))
    )

    const totalRevenue = eventOrders.reduce((sum, o) => sum + (o.total || 0), 0)
    const totalTickets = eventOrders.reduce((sum, o) =>
      sum + (o.items?.filter(i => i.itemType === 'ticket').reduce((s, i) => s + (i.quantity || 0), 0) || 0), 0
    )
    const totalMerch = eventOrders.reduce((sum, o) =>
      sum + (o.items?.filter(i => i.itemType === 'merch').reduce((s, i) => s + (i.quantity || 0), 0) || 0), 0
    )

    // Revenue by event
    const revenueByEvent = myEvents.map(event => {
      const eventRevenue = eventOrders
        .filter(o => o.items?.some(i => i.eventId === event.id || Number(i.eventId) === event.id))
        .reduce((sum, o) => sum + (o.total || 0), 0)
      const eventTickets = eventOrders
        .filter(o => o.items?.some(i => i.eventId === event.id || Number(i.eventId) === event.id))
        .reduce((sum, o) =>
          sum + (o.items?.filter(i => i.itemType === 'ticket').reduce((s, i) => s + (i.quantity || 0), 0) || 0), 0
        )
      return { ...event, revenue: eventRevenue, ticketsSold: eventTickets }
    }).sort((a, b) => b.revenue - a.revenue)

    // Revenue by category
    const byCategory = {}
    myEvents.forEach(e => {
      if (!byCategory[e.category]) byCategory[e.category] = { events: 0, revenue: 0 }
      byCategory[e.category].events++
    })
    revenueByEvent.forEach(e => {
      if (byCategory[e.category]) byCategory[e.category].revenue += e.revenue
    })

    // Orders by month
    const byMonth = {}
    eventOrders.forEach(o => {
      const d = new Date(o.date)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      if (!byMonth[key]) byMonth[key] = { orders: 0, revenue: 0 }
      byMonth[key].orders++
      byMonth[key].revenue += o.total || 0
    })

    return {
      totalRevenue,
      totalTickets,
      totalMerch,
      totalOrders: eventOrders.length,
      avgOrderValue: eventOrders.length ? (totalRevenue / eventOrders.length) : 0,
      revenueByEvent,
      byCategory: Object.entries(byCategory).map(([name, data]) => ({ name, ...data })),
      byMonth: Object.entries(byMonth).map(([month, data]) => ({ month, ...data })).sort((a, b) => a.month.localeCompare(b.month)),
    }
  }, [myEvents, orders])

  const maxRevenue = Math.max(...analytics.revenueByEvent.map(e => e.revenue), 1)

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white m-0">Analytics</h1>
        <p className="text-white/40 text-sm mt-1 m-0">Overview of your event performance</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {[
          { label: 'Revenue', value: formatRupiah(analytics.totalRevenue), icon: IoCashOutline, color: '#10b981' },
          { label: 'Tickets Sold', value: analytics.totalTickets, icon: IoTicketOutline, color: '#f97316' },
          { label: 'Merch Sold', value: analytics.totalMerch, icon: IoTrendingUpOutline, color: '#8b5cf6' },
          { label: 'Orders', value: analytics.totalOrders, icon: IoPeopleOutline, color: '#3b82f6' },
          { label: 'Avg Order', value: formatRupiah(analytics.avgOrderValue), icon: IoBarChartOutline, color: '#ec4899' },
        ].map((stat, i) => (
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
        {/* Revenue by Event */}
        <div className="rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <h3 className="text-white font-semibold text-sm m-0">Revenue by Event</h3>
          </div>
          <div className="p-6">
            {analytics.revenueByEvent.length === 0 ? (
              <div className="text-center py-8">
                <IoBarChartOutline className="text-3xl text-white/10 mx-auto mb-2" />
                <p className="text-white/30 text-sm m-0">No data yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {analytics.revenueByEvent.slice(0, 8).map((event, i) => (
                  <div key={event.id}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-white text-sm font-medium truncate flex-1 mr-3">{event.title}</span>
                      <span className="text-white/60 text-sm font-semibold shrink-0">{formatRupiah(event.revenue)}</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(event.revenue / maxRevenue) * 100}%` }}
                        transition={{ delay: i * 0.1, duration: 0.6 }}
                        className="h-full rounded-full"
                        style={{ background: 'linear-gradient(90deg, #f97316, #ea580c)' }}
                      />
                    </div>
                    <div className="text-white/20 text-[11px] mt-1">{event.ticketsSold} tickets · {event.city}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Revenue by Category */}
        <div className="rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <h3 className="text-white font-semibold text-sm m-0">By Category</h3>
          </div>
          <div className="p-6">
            {analytics.byCategory.length === 0 ? (
              <div className="text-center py-8">
                <IoCalendarOutline className="text-3xl text-white/10 mx-auto mb-2" />
                <p className="text-white/30 text-sm m-0">No data yet</p>
              </div>
            ) : (
              <div className="space-y-5">
                {analytics.byCategory.map((cat, i) => {
                  const colors = ['#f97316', '#8b5cf6', '#3b82f6', '#10b981', '#ec4899']
                  const color = colors[i % colors.length]
                  return (
                    <div key={cat.name} className="flex items-center gap-4">
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ background: color }} />
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-medium">{cat.name}</div>
                        <div className="text-white/30 text-[11px]">{cat.events} event{cat.events !== 1 ? 's' : ''}</div>
                      </div>
                        <div className="text-white font-semibold text-sm">{formatRupiah(cat.revenue)}</div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Monthly Trend */}
        {analytics.byMonth.length > 0 && (
          <div className="rounded-2xl lg:col-span-2" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <h3 className="text-white font-semibold text-sm m-0">Monthly Revenue</h3>
            </div>
            <div className="p-6">
              <div className="flex items-end gap-3 h-40">
                {analytics.byMonth.map((month, i) => {
                  const maxMonthRevenue = Math.max(...analytics.byMonth.map(m => m.revenue), 1)
                  const height = (month.revenue / maxMonthRevenue) * 100
                  return (
                    <div key={month.month} className="flex-1 flex flex-col items-center gap-2">
                      <div className="text-white/50 text-[11px] font-semibold">{formatRupiah(month.revenue)}</div>
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                        className="w-full rounded-t-lg min-h-[4px]"
                        style={{ background: 'linear-gradient(180deg, #f97316, #ea580c)' }}
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

export default AdminAnalytics
