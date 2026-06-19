import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  IoAddCircleOutline, IoCreateOutline, IoTrashOutline, IoCloseOutline,
  IoMusicalNotes, IoFootball, IoHappy, IoSparkles, IoColorPaletteOutline,
  IoFilmOutline, IoRestaurantOutline, IoBriefcaseOutline, IoGameControllerOutline,
  IoHeartOutline, IoBookOutline, IoAirplaneOutline, IoTrophyOutline
} from 'react-icons/io5'
import { useAuth } from '../../context/AuthContext'

const ICON_OPTIONS = [
  { name: 'IoMusicalNotes', icon: IoMusicalNotes, label: 'Music' },
  { name: 'IoFootball', icon: IoFootball, label: 'Sports' },
  { name: 'IoHappy', icon: IoHappy, label: 'Comedy' },
  { name: 'IoSparkles', icon: IoSparkles, label: 'Festival' },
  { name: 'IoColorPaletteOutline', icon: IoColorPaletteOutline, label: 'Art' },
  { name: 'IoFilmOutline', icon: IoFilmOutline, label: 'Film' },
  { name: 'IoRestaurantOutline', icon: IoRestaurantOutline, label: 'Food' },
  { name: 'IoBriefcaseOutline', icon: IoBriefcaseOutline, label: 'Business' },
  { name: 'IoGameControllerOutline', icon: IoGameControllerOutline, label: 'Gaming' },
  { name: 'IoHeartOutline', icon: IoHeartOutline, label: 'Charity' },
  { name: 'IoBookOutline', icon: IoBookOutline, label: 'Education' },
  { name: 'IoAirplaneOutline', icon: IoAirplaneOutline, label: 'Travel' },
  { name: 'IoTrophyOutline', icon: IoTrophyOutline, label: 'Awards' },
]

const GRADIENT_OPTIONS = [
  { value: 'linear-gradient(135deg, #6366f1, #4f46e5)', label: 'Indigo' },
  { value: 'linear-gradient(135deg, #06b6d4, #0891b2)', label: 'Cyan' },
  { value: 'linear-gradient(135deg, #f97316, #ea580c)', label: 'Orange' },
  { value: 'linear-gradient(135deg, #ec4899, #db2777)', label: 'Pink' },
  { value: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', label: 'Purple' },
  { value: 'linear-gradient(135deg, #10b981, #059669)', label: 'Green' },
  { value: 'linear-gradient(135deg, #ef4444, #dc2626)', label: 'Red' },
  { value: 'linear-gradient(135deg, #eab308, #ca8a04)', label: 'Yellow' },
]

function getIconComponent(iconName) {
  const found = ICON_OPTIONS.find(i => i.name === iconName)
  return found ? found.icon : IoSparkles
}

function AppAdminCategories() {
  const { categories, addCategory, updateCategory, deleteCategory } = useAuth()
  const [modal, setModal] = useState(null) // null | 'create' | { editing: cat }
  const [deleteModal, setDeleteModal] = useState(null)
  const [form, setForm] = useState({ name: '', icon: 'IoSparkles', gradient: GRADIENT_OPTIONS[0].value })

  const openCreate = () => {
    setForm({ name: '', icon: 'IoSparkles', gradient: GRADIENT_OPTIONS[0].value })
    setModal('create')
  }

  const openEdit = (cat) => {
    setForm({ name: cat.name, icon: cat.icon || 'IoSparkles', gradient: cat.gradient || GRADIENT_OPTIONS[0].value })
    setModal({ editing: cat })
  }

  const handleSave = () => {
    if (!form.name.trim()) return
    if (modal === 'create') {
      addCategory(form)
    } else if (modal?.editing) {
      updateCategory(modal.editing.id, form)
    }
    setModal(null)
  }

  const handleDelete = () => {
    if (deleteModal) {
      deleteCategory(deleteModal.id)
      setDeleteModal(null)
    }
  }

  const SelectedIcon = getIconComponent(form.icon)

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white m-0">Categories</h1>
          <p className="text-white/40 text-sm mt-1 m-0">{categories.length} categories</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white border-none cursor-pointer transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}
        >
          <IoAddCircleOutline className="text-lg" />
          Add Category
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categories.map((cat, i) => {
          const Icon = getIconComponent(cat.icon)
          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl p-5 group relative"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: cat.gradient || 'linear-gradient(135deg, #6366f1, #4f46e5)' }}
                >
                  <Icon className="text-white text-2xl" />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEdit(cat)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-purple-400 hover:bg-purple-500/10 bg-transparent border-none cursor-pointer transition-all"
                  >
                    <IoCreateOutline />
                  </button>
                  <button
                    onClick={() => setDeleteModal(cat)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-red-400 hover:bg-red-500/10 bg-transparent border-none cursor-pointer transition-all"
                  >
                    <IoTrashOutline />
                  </button>
                </div>
              </div>
              <h3 className="text-white font-semibold text-base m-0">{cat.name}</h3>
              <p className="text-white/30 text-xs mt-1 m-0">ID: {cat.id}</p>
            </motion.div>
          )
        })}
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center px-4"
            style={{ background: 'rgba(0,0,0,0.6)' }}
            onClick={() => setModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="rounded-2xl p-6 w-full max-w-md"
              style={{ background: 'rgba(20,20,40,0.98)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-white font-semibold text-lg m-0">
                  {modal === 'create' ? 'Add Category' : 'Edit Category'}
                </h3>
                <button onClick={() => setModal(null)} className="text-white/30 hover:text-white bg-transparent border-none cursor-pointer">
                  <IoCloseOutline className="text-xl" />
                </button>
              </div>

              {/* Preview */}
              <div className="flex items-center gap-3 mb-6 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: form.gradient }}>
                  <SelectedIcon className="text-white text-2xl" />
                </div>
                <span className="text-white font-semibold">{form.name || 'Category Name'}</span>
              </div>

              {/* Name */}
              <div className="mb-4">
                <label className="block text-white/60 text-xs font-semibold mb-1.5 uppercase tracking-wide">Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Workshops"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 outline-none focus:border-purple-500/50 transition-colors"
                />
              </div>

              {/* Icon Picker */}
              <div className="mb-4">
                <label className="block text-white/60 text-xs font-semibold mb-1.5 uppercase tracking-wide">Icon</label>
                <div className="grid grid-cols-7 gap-1.5">
                  {ICON_OPTIONS.map(opt => {
                    const OptIcon = opt.icon
                    return (
                      <button
                        key={opt.name}
                        onClick={() => setForm(prev => ({ ...prev, icon: opt.name }))}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center border-none cursor-pointer transition-all ${
                          form.icon === opt.name ? 'bg-purple-500/20 text-purple-400 ring-1 ring-purple-500/30' : 'bg-white/5 text-white/40 hover:text-white/70'
                        }`}
                        title={opt.label}
                      >
                        <OptIcon className="text-lg" />
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Gradient Picker */}
              <div className="mb-6">
                <label className="block text-white/60 text-xs font-semibold mb-1.5 uppercase tracking-wide">Color</label>
                <div className="grid grid-cols-8 gap-1.5">
                  {GRADIENT_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setForm(prev => ({ ...prev, gradient: opt.value }))}
                      className={`w-10 h-10 rounded-lg border-none cursor-pointer transition-all ${
                        form.gradient === opt.value ? 'ring-2 ring-white/40 scale-110' : 'hover:scale-105'
                      }`}
                      style={{ background: opt.value }}
                      title={opt.label}
                    />
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setModal(null)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white/60 border-none cursor-pointer transition-all hover:bg-white/10"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!form.name.trim()}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white border-none cursor-pointer transition-all hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}
                >
                  {modal === 'create' ? 'Create' : 'Save Changes'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                <h3 className="text-white font-semibold m-0">Delete Category</h3>
                <button onClick={() => setDeleteModal(null)} className="text-white/30 hover:text-white bg-transparent border-none cursor-pointer">
                  <IoCloseOutline className="text-xl" />
                </button>
              </div>
              <p className="text-white/50 text-sm m-0 mb-5">
                Delete <strong className="text-white">{deleteModal.name}</strong>? Events using this category won't be affected.
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

export default AppAdminCategories
