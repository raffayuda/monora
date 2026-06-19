import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  IoSearchOutline, IoCalendarOutline, IoTrashOutline,
  IoCloseOutline, IoEyeOutline, IoEllipsisVertical, IoCreateOutline
} from 'react-icons/io5'
import { useAuth } from '../../context/AuthContext'

function AppAdminEvents() {
  const { getAllAdminEvents, getAllUsers, deleteAdminEvent, updateAdminEvent } = useAuth()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [deleteModal, setDeleteModal] = useState(null)
  const [actionMenu, setActionMenu] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const allEvents = useMemo(() => getAllAdminEvents(), [refreshKey])
  const allUsers = useMemo(() => getAllUsers(), [])

  const getUserName = (userId) => {
    const u = allUsers.find(u => u.id === userId)
    return u?.name || 'Unknown'
  }

  const filtered = useMemo(() => {
    let result = [...allEvents]
    if (statusFilter !== 'all') result = result.filter(e => e.status === statusFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(e =>
        e.title?.toLowerCase().includes(q) ||
        e.city?.toLowerCase().includes(q) ||
        e.category?.toLowerCase().includes(q)
      )
    }
    return result
  }, [allEvents, statusFilter, search])

  const handleStatusChange = (eventId, newStatus) => {
    updateAdminEvent(eventId, { status: newStatus })
    setActionMenu(null)
    setRefreshKey(k => k + 1)
  }

  const handleDelete = () => {
    if (deleteModal) {
      deleteAdminEvent(deleteModal.id)
      setDeleteModal(null)
      setRefreshKey(k => k + 1)
    }
  }

  const statusBadge = (status) => {
    if (status === 'published') return 'bg-green-500/10 text-green-400'
    if (status === 'draft') return 'bg-yellow-500/10 text-yellow-400'
    if (status === 'cancelled') return 'bg-red-500/10 text-red-400'
    return 'bg-white/5 text-white/40'
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white m-0">All Events</h1>
        <p className="text-white/40 text-sm mt-1 m-0">Manage all events across the platform</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-transparent text-white text-sm py-2.5 pl-10 pr-4 rounded-xl outline-none placeholder-white/30"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
          />
        </div>
        <div className="flex gap-1.5">
          {['all', 'published', 'draft', 'cancelled'].map(s => (
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
        <div className="text-white/30 text-sm ml-auto">{filtered.length} events</div>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_100px_60px] gap-4 px-6 py-3 text-white/30 text-[11px] font-semibold uppercase tracking-wider"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <span>Event</span>
          <span>Organizer</span>
          <span>Category</span>
          <span>Date</span>
          <span>Status</span>
          <span></span>
        </div>

        {filtered.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <IoCalendarOutline className="text-3xl text-white/10 mx-auto mb-2" />
            <p className="text-white/30 text-sm m-0">No events found</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filtered.map(event => (
              <div key={event.id} className="grid grid-cols-[2fr_1fr_1fr_1fr_100px_60px] gap-4 px-6 py-3.5 items-center hover:bg-white/2 transition-colors">
                {/* Event */}
                <div className="flex items-center gap-3 min-w-0">
                  {event.thumbnail || event.image ? (
                    <img src={event.thumbnail || event.image} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg shrink-0" style={{ background: 'rgba(255,255,255,0.05)' }} />
                  )}
                  <div className="min-w-0">
                    <div className="text-white text-sm font-medium truncate">{event.title}</div>
                    <div className="text-white/20 text-[11px]">{event.city}{event.venue ? ` · ${event.venue}` : ''}</div>
                  </div>
                </div>

                {/* Organizer */}
                <div className="min-w-0">
                  <div className="text-white/70 text-sm truncate">{event.organizer || 'Not set'}</div>
                  <div className="text-white/30 text-[11px] truncate">Owner: {getUserName(event.createdBy)}</div>
                </div>

                {/* Category */}
                <div className="text-white/40 text-sm">{event.category}</div>

                {/* Date */}
                <div className="text-white/40 text-sm">{event.date || event.fullDate || '-'}</div>

                {/* Status */}
                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full w-fit ${statusBadge(event.status)}`}>
                  {event.status}
                </span>

                {/* Actions */}
                <div className="relative">
                  <button
                    onClick={() => setActionMenu(actionMenu === event.id ? null : event.id)}
                    className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/5 border-none bg-transparent cursor-pointer transition-all"
                  >
                    <IoEllipsisVertical />
                  </button>
                  <AnimatePresence>
                    {actionMenu === event.id && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="absolute right-0 top-full mt-1 z-50 rounded-lg overflow-hidden"
                        style={{ background: 'rgba(20,20,40,0.95)', border: '1px solid rgba(255,255,255,0.1)', minWidth: 150 }}
                      >
                        <button
                          onClick={() => { navigate(`/app-admin/events/edit/${event.id}`); setActionMenu(null) }}
                          className="w-full text-left px-3 py-2 text-xs text-purple-400 bg-transparent border-none cursor-pointer hover:bg-white/5"
                        >
                          Edit Event
                        </button>
                        {event.status !== 'published' && (
                          <button
                            onClick={() => handleStatusChange(event.id, 'published')}
                            className="w-full text-left px-3 py-2 text-xs text-green-400 bg-transparent border-none cursor-pointer hover:bg-white/5"
                          >
                            Publish
                          </button>
                        )}
                        {event.status !== 'draft' && (
                          <button
                            onClick={() => handleStatusChange(event.id, 'draft')}
                            className="w-full text-left px-3 py-2 text-xs text-yellow-400 bg-transparent border-none cursor-pointer hover:bg-white/5"
                          >
                            Mark as Draft
                          </button>
                        )}
                        {event.status !== 'cancelled' && (
                          <button
                            onClick={() => handleStatusChange(event.id, 'cancelled')}
                            className="w-full text-left px-3 py-2 text-xs text-orange-400 bg-transparent border-none cursor-pointer hover:bg-white/5"
                          >
                            Cancel Event
                          </button>
                        )}
                        <button
                          onClick={() => { setDeleteModal(event); setActionMenu(null) }}
                          className="w-full text-left px-3 py-2 text-xs text-red-400 bg-transparent border-none cursor-pointer hover:bg-white/5"
                        >
                          Delete
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <AnimatePresence>
        {deleteModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 flex items-center justify-center px-4"
            style={{ background: 'rgba(0,0,0,0.6)' }}
            onClick={() => setDeleteModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="rounded-2xl p-6 w-full max-w-sm"
              style={{ background: 'rgba(20,20,40,0.98)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold m-0">Delete Event</h3>
                <button onClick={() => setDeleteModal(null)} className="text-white/30 hover:text-white bg-transparent border-none cursor-pointer">
                  <IoCloseOutline className="text-xl" />
                </button>
              </div>
              <p className="text-white/50 text-sm m-0 mb-5">
                Delete <strong className="text-white">{deleteModal.title}</strong>? This cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModal(null)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white/60 border-none cursor-pointer transition-all hover:bg-white/10"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white bg-red-500 border-none cursor-pointer transition-all hover:bg-red-600"
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

export default AppAdminEvents
