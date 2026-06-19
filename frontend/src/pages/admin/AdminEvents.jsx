import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { IoSearch, IoAddCircleOutline, IoEllipsisVertical, IoCreateOutline, IoTrashOutline, IoEyeOutline, IoCalendarOutline } from 'react-icons/io5'
import { useAuth } from '../../context/AuthContext'

function AdminEvents() {
  const { getMyEvents, deleteAdminEvent } = useAuth()
  const navigate = useNavigate()
  const myEvents = getMyEvents()

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [menuOpen, setMenuOpen] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const filteredEvents = useMemo(() => {
    return myEvents.filter(e => {
      const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.city?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'all' || e.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [myEvents, searchQuery, statusFilter])

  const handleDelete = (eventId) => {
    deleteAdminEvent(eventId)
    setConfirmDelete(null)
    setMenuOpen(null)
  }

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white m-0">My Events</h1>
          <p className="text-white/40 text-sm mt-1 m-0">{myEvents.length} event{myEvents.length !== 1 ? 's' : ''} total</p>
        </div>
        <Link
          to="/admin/events/create"
          className="flex items-center gap-2 text-white px-5 py-2.5 rounded-xl text-sm font-semibold no-underline transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
        >
          <IoAddCircleOutline className="text-lg" />
          Create Event
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex items-center gap-2 flex-1 px-4 py-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <IoSearch className="text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events..."
            className="bg-transparent border-none outline-none text-white text-sm placeholder-white/30 w-full"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'published', 'draft', 'cancelled'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold capitalize border-none cursor-pointer transition-all ${statusFilter === status
                  ? 'bg-orange-500/15 text-orange-400'
                  : 'bg-white/5 text-white/40 hover:text-white/60'
                }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Events Table */}
      {filteredEvents.length === 0 ? (
        <div className="rounded-2xl p-12 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <IoCalendarOutline className="text-5xl text-white/10 mx-auto mb-4" />
          <h3 className="text-white/60 font-semibold text-lg mb-2">No events found</h3>
          <p className="text-white/30 text-sm mb-6 m-0">
            {searchQuery || statusFilter !== 'all' ? 'Try adjusting your filters' : 'Start by creating your first event'}
          </p>
          {!searchQuery && statusFilter === 'all' && (
            <Link
              to="/admin/events/create"
              className="inline-flex items-center gap-2 text-white px-5 py-2.5 rounded-xl text-sm font-semibold no-underline"
              style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
            >
              <IoAddCircleOutline />
              Create Event
            </Link>
          )}
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 text-white/30 text-[11px] font-semibold uppercase tracking-wider" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="col-span-4">Event</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2">Location</div>
            <div className="col-span-1">Tickets</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-white/5">
            {filteredEvents.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors items-center"
              >
                {/* Event */}
                <div className="col-span-4 flex items-center gap-3">
                  <img
                    src={event.thumbnail || event.image || 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=100&h=100&fit=crop'}
                    alt=""
                    className="w-11 h-11 rounded-lg object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="text-white text-sm font-medium truncate">{event.title}</div>
                    <div className="text-white/30 text-[11px]">{event.category}</div>
                    <div className="text-orange-400/70 text-[11px] truncate">Organizer: {event.organizer || 'Not set'}</div>
                  </div>
                </div>

                {/* Date */}
                <div className="col-span-2 text-white/50 text-sm">{event.date || event.fullDate}</div>

                {/* Location */}
                <div className="col-span-2 text-white/50 text-sm truncate">{event.city}</div>

                {/* Tickets */}
                <div className="col-span-1 text-white/50 text-sm">{event.tickets?.length || 0} types</div>

                {/* Status */}
                <div className="col-span-1">
                  <span className={`text-[11px] font-semibold px-2 py-1 rounded-full ${event.status === 'published' ? 'bg-green-500/10 text-green-400' :
                      event.status === 'draft' ? 'bg-yellow-500/10 text-yellow-400' :
                        'bg-red-500/10 text-red-400'
                    }`}>
                    {event.status}
                  </span>
                </div>

                {/* Actions */}
                <div className="col-span-2 flex items-center justify-end gap-2 relative">
                  <button
                    onClick={() => navigate(`/admin/events/edit/${event.id}`)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:bg-white/5 transition-all border-none bg-transparent cursor-pointer"
                    title="Edit"
                  >
                    <IoCreateOutline className="text-base" />
                  </button>
                  <button
                    onClick={() => navigate(`/event/${event.id}`)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:bg-white/5 transition-all border-none bg-transparent cursor-pointer"
                    title="Preview"
                  >
                    <IoEyeOutline className="text-base" />
                  </button>
                  <button
                    onClick={() => setMenuOpen(menuOpen === event.id ? null : event.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:bg-white/5 transition-all border-none bg-transparent cursor-pointer"
                  >
                    <IoEllipsisVertical className="text-base" />
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {menuOpen === event.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute right-0 top-10 rounded-xl overflow-hidden py-1 w-44"
                        style={{ background: 'rgba(20,22,45,0.98)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 30px rgba(0,0,0,0.4)', zIndex: 9999 }}
                      >
                        <button
                          onClick={() => { navigate(`/admin/events/edit/${event.id}`); setMenuOpen(null) }}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-white/70 hover:text-white hover:bg-white/5 text-sm bg-transparent border-none cursor-pointer transition-colors text-left"
                        >
                          <IoCreateOutline /> Edit Event
                        </button>
                        <button
                          onClick={() => { setConfirmDelete(event.id); setMenuOpen(null) }}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-red-400/70 hover:text-red-400 hover:bg-red-500/5 text-sm bg-transparent border-none cursor-pointer transition-colors text-left"
                        >
                          <IoTrashOutline /> Delete Event
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
            onClick={() => setConfirmDelete(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="rounded-2xl p-6 w-full max-w-sm"
              style={{ background: 'rgba(20,22,45,0.98)', border: '1px solid rgba(255,255,255,0.1)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-white font-semibold text-lg mb-2">Delete Event?</h3>
              <p className="text-white/40 text-sm mb-6">This action cannot be undone. All event data will be permanently removed.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white/60 bg-white/5 border-none cursor-pointer hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(confirmDelete)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white bg-red-500 border-none cursor-pointer hover:bg-red-600 transition-all"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdminEvents
