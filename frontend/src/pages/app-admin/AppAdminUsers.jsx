import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  IoSearchOutline, IoPeopleOutline, IoChevronDownOutline,
  IoTrashOutline, IoCloseOutline, IoShieldCheckmarkOutline
} from 'react-icons/io5'
import { useAuth } from '../../context/AuthContext'

const ROLES = [
  { value: 'customer', label: 'Customer', color: 'text-blue-400 bg-blue-500/10' },
  { value: 'event_admin', label: 'Event Organizer', color: 'text-orange-400 bg-orange-500/10' },
  { value: 'app_admin', label: 'App Admin', color: 'text-purple-400 bg-purple-500/10' },
]

function AppAdminUsers() {
  const { getAllUsers, updateUserRole, toggleUserStatus, deleteUser, user: currentUser } = useAuth()
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [deleteModal, setDeleteModal] = useState(null)
  const [roleDropdown, setRoleDropdown] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const allUsers = useMemo(() => getAllUsers(), [refreshKey])

  const filtered = useMemo(() => {
    let result = allUsers
    if (roleFilter !== 'all') result = result.filter(u => u.role === roleFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(u =>
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q)
      )
    }
    return result
  }, [allUsers, roleFilter, search])

  const handleRoleChange = (userId, newRole) => {
    updateUserRole(userId, newRole)
    setRoleDropdown(null)
    setRefreshKey(k => k + 1)
  }

  const handleToggleStatus = (userId) => {
    toggleUserStatus(userId)
    setRefreshKey(k => k + 1)
  }

  const handleDelete = () => {
    if (deleteModal) {
      deleteUser(deleteModal.id)
      setDeleteModal(null)
      setRefreshKey(k => k + 1)
    }
  }

  const roleInfo = (role) => ROLES.find(r => r.value === role) || ROLES[0]

  const stats = useMemo(() => ({
    total: allUsers.length,
    customers: allUsers.filter(u => u.role === 'customer').length,
    organizers: allUsers.filter(u => u.role === 'event_admin').length,
    admins: allUsers.filter(u => u.role === 'app_admin').length,
  }), [allUsers])

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white m-0">User Management</h1>
        <p className="text-white/40 text-sm mt-1 m-0">Manage all platform users and roles</p>
      </div>

      {/* Mini Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total', value: stats.total, color: '#8b5cf6' },
          { label: 'Customers', value: stats.customers, color: '#3b82f6' },
          { label: 'Organizers', value: stats.organizers, color: '#f97316' },
          { label: 'Admins', value: stats.admins, color: '#a855f7' },
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
            placeholder="Search users..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-transparent text-white text-sm py-2.5 pl-10 pr-4 rounded-xl outline-none placeholder-white/30"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
          />
        </div>
        <div className="flex gap-1.5">
          {['all', 'customer', 'event_admin', 'app_admin'].map(r => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-2 rounded-lg text-xs font-medium border-none cursor-pointer transition-all ${
                roleFilter === r ? 'bg-purple-500/20 text-purple-400' : 'bg-white/5 text-white/40 hover:text-white/70'
              }`}
            >
              {r === 'all' ? 'All' : r === 'customer' ? 'Customer' : r === 'event_admin' ? 'Organizer' : 'Admin'}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        {/* Header */}
        <div className="grid grid-cols-[1fr_1fr_140px_100px_80px] gap-4 px-6 py-3 text-white/30 text-[11px] font-semibold uppercase tracking-wider"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <span>User</span>
          <span>Contact</span>
          <span>Role</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        {filtered.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <IoPeopleOutline className="text-3xl text-white/10 mx-auto mb-2" />
            <p className="text-white/30 text-sm m-0">No users found</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filtered.map(u => {
              const ri = roleInfo(u.role)
              const isSelf = u.id === currentUser?.id
              return (
                <div key={u.id} className="grid grid-cols-[1fr_1fr_140px_100px_80px] gap-4 px-6 py-3.5 items-center hover:bg-white/[0.02] transition-colors">
                  {/* User */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-indigo-500/30 to-purple-600/30 shrink-0">
                      <span className="text-white text-xs font-bold">{u.name?.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="min-w-0">
                      <div className="text-white text-sm font-medium truncate">
                        {u.name}
                        {isSelf && <span className="text-purple-400 text-[10px] ml-1.5">(You)</span>}
                      </div>
                      <div className="text-white/20 text-[11px]">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                      </div>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="min-w-0">
                    <div className="text-white/60 text-sm truncate">{u.email}</div>
                    <div className="text-white/20 text-[11px]">{u.phone || '-'}</div>
                  </div>

                  {/* Role Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => !isSelf && setRoleDropdown(roleDropdown === u.id ? null : u.id)}
                      disabled={isSelf}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border-none cursor-pointer transition-all ${ri.color} ${isSelf ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'}`}
                    >
                      {ri.label}
                      {!isSelf && <IoChevronDownOutline className="text-[10px]" />}
                    </button>
                    <AnimatePresence>
                      {roleDropdown === u.id && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          className="absolute top-full left-0 mt-1 z-50 rounded-lg overflow-hidden"
                          style={{ background: 'rgba(20,20,40,0.95)', border: '1px solid rgba(255,255,255,0.1)', minWidth: 140 }}
                        >
                          {ROLES.map(r => (
                            <button
                              key={r.value}
                              onClick={() => handleRoleChange(u.id, r.value)}
                              className={`w-full text-left px-3 py-2 text-xs border-none cursor-pointer transition-all ${
                                u.role === r.value ? 'bg-purple-500/10 text-purple-400' : 'bg-transparent text-white/60 hover:bg-white/5 hover:text-white'
                              }`}
                            >
                              {r.label}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Status */}
                  <div>
                    <button
                      onClick={() => !isSelf && handleToggleStatus(u.id)}
                      disabled={isSelf}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border-none cursor-pointer transition-all ${
                        u.isActive === false
                          ? 'bg-red-500/10 text-red-400'
                          : 'bg-green-500/10 text-green-400'
                      } ${isSelf ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'}`}
                    >
                      {u.isActive === false ? 'Inactive' : 'Active'}
                    </button>
                  </div>

                  {/* Actions */}
                  <div>
                    {!isSelf && (
                      <button
                        onClick={() => setDeleteModal(u)}
                        className="p-1.5 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 border-none bg-transparent cursor-pointer transition-all"
                      >
                        <IoTrashOutline className="text-sm" />
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <AnimatePresence>
        {deleteModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center px-4"
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
                <h3 className="text-white font-semibold m-0">Delete User</h3>
                <button onClick={() => setDeleteModal(null)} className="text-white/30 hover:text-white bg-transparent border-none cursor-pointer">
                  <IoCloseOutline className="text-xl" />
                </button>
              </div>
              <p className="text-white/50 text-sm m-0 mb-5">
                Are you sure you want to delete <strong className="text-white">{deleteModal.name}</strong>? This action cannot be undone.
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

export default AppAdminUsers
