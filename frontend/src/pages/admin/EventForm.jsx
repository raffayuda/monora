import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  IoArrowBack, IoArrowForward, IoAddCircleOutline, IoTrashOutline,
  IoImageOutline, IoSaveOutline, IoCheckmarkCircle, IoLinkOutline,
  IoCloudUploadOutline, IoLocationOutline,
} from 'react-icons/io5'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useAuth } from '../../context/AuthContext'

// Fix leaflet marker icon
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const PROVINCES = [
  'DKI Jakarta', 'Jawa Barat', 'Jawa Tengah', 'Jawa Timur', 'DI Yogyakarta',
  'Bali', 'Sulawesi Selatan', 'Sumatera Utara', 'Sumatera Barat', 'Sumatera Selatan',
  'Riau', 'Sulawesi Utara', 'Kalimantan Timur', 'Kalimantan Barat', 'Lampung',
  'Maluku', 'Papua', 'NTB', 'NTT', 'Aceh',
]

const STEPS = [
  { id: 0, label: 'Basic Info', icon: '01' },
  { id: 1, label: 'Date & Time', icon: '02' },
  { id: 2, label: 'Location', icon: '03' },
  { id: 3, label: 'Images', icon: '04' },
  { id: 4, label: 'Tickets', icon: '05' },
  { id: 5, label: 'Merchandise', icon: '06' },
]

const emptyTicket = { type: '', price: '', description: '', available: '' }
const emptyMerch = { name: '', price: '', image: '', sizes: '', colors: '', stock: '' }

/* ── Map click handler ─────────────────────── */
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

/* ── Main Component ────────────────────────── */
function EventForm() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()
  const location = useLocation()
  const isAppAdmin = location.pathname.startsWith('/app-admin')
  const backUrl = isAppAdmin ? '/app-admin/events' : '/admin/events'
  const { addAdminEvent, updateAdminEvent, adminEvents, categories } = useAuth()

  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    title: '', slug: '', date: '', fullDate: '', time: '',
    venue: '', city: '', province: '', address: '', lat: '-6.2', lng: '106.8',
    category: 'Concerts', tags: '', image: '', thumbnail: '',
    description: '', artist: '', organizer: '', status: 'published',
  })
  const [tickets, setTickets] = useState([{ ...emptyTicket }])
  const [merchandise, setMerchandise] = useState([])
  const [errors, setErrors] = useState({})
  const [imageMode, setImageMode] = useState({ cover: 'url', thumb: 'url' })
  const coverInputRef = useRef(null)
  const thumbInputRef = useRef(null)

  useEffect(() => {
    if (isEdit) {
      const event = adminEvents.find(e => e.id === Number(id))
      if (event) {
        setForm({
          title: event.title || '', slug: event.slug || '', date: event.date || '',
          fullDate: event.fullDate || '', time: event.time || '', venue: event.venue || '',
          city: event.city || '', province: event.province || '', address: event.address || '',
          lat: event.lat ? String(event.lat) : '-6.2', lng: event.lng ? String(event.lng) : '106.8',
          category: event.category || 'Concerts', tags: (event.tags || []).join(', '),
          image: event.image || '', thumbnail: event.thumbnail || '',
          description: event.description || '', artist: event.artist || '',
          organizer: event.organizer || '', status: event.status || 'published',
        })
        setTickets(event.tickets?.length > 0 ? event.tickets.map(t => ({
          type: t.type, price: String(t.price), description: t.description, available: String(t.available),
        })) : [{ ...emptyTicket }])
        setMerchandise(event.merchandise?.length > 0 ? event.merchandise.map(m => ({
          name: m.name, price: String(m.price), image: m.image,
          sizes: (m.sizes || []).join(', '), colors: (m.colors || []).join(', '), stock: String(m.stock),
        })) : [])
      } else { navigate(backUrl) }
    }
  }, [id, isEdit, adminEvents, navigate])

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (field === 'title') {
      setForm(prev => ({ ...prev, slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') }))
    }
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const handleFullDateChange = (value) => {
    setForm(prev => ({ ...prev, fullDate: value }))
    if (value) {
      const d = new Date(value + 'T00:00:00')
      const dateStr = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
      const timeStr = form.time ? ` | ${form.time.split(' - ')[0]}` : ''
      setForm(prev => ({ ...prev, date: `${dateStr}${timeStr}` }))
    }
  }

  const handleMapClick = useCallback((lat, lng) => {
    setForm(prev => ({ ...prev, lat: lat.toFixed(6), lng: lng.toFixed(6) }))
  }, [])

  const handleFileSelect = (field) => (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => updateField(field, reader.result)
    reader.readAsDataURL(file)
  }

  const validateStep = () => {
    const errs = {}
    if (step === 0) {
      if (!form.title.trim()) errs.title = 'Required'
      if (!form.category) errs.category = 'Required'
      if (!form.description.trim()) errs.description = 'Required'
    } else if (step === 1) {
      if (!form.fullDate) errs.fullDate = 'Required'
    } else if (step === 2) {
      if (!form.venue.trim()) errs.venue = 'Required'
      if (!form.city.trim()) errs.city = 'Required'
    } else if (step === 4) {
      if (tickets.length === 0 || !tickets[0].type) errs.tickets = 'At least one ticket type required'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const goNext = () => {
    if (!validateStep()) return
    setStep(s => Math.min(s + 1, STEPS.length - 1))
  }
  const goBack = () => setStep(s => Math.max(s - 1, 0))

  const handleSubmit = async () => {
    if (!validateStep()) return
    const eventData = {
      ...form,
      lat: form.lat ? parseFloat(form.lat) : 0,
      lng: form.lng ? parseFloat(form.lng) : 0,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      tickets: tickets.filter(t => t.type).map((t, i) => ({
        id: `t-${Date.now()}-${i}`, type: t.type,
        price: parseFloat(t.price) || 0, description: t.description, available: parseInt(t.available) || 0,
      })),
      merchandise: merchandise.filter(m => m.name).map((m, i) => ({
        id: `m-${Date.now()}-${i}`, name: m.name, price: parseFloat(m.price) || 0, image: m.image,
        sizes: m.sizes ? m.sizes.split(',').map(s => s.trim()).filter(Boolean) : [],
        colors: m.colors ? m.colors.split(',').map(c => c.trim()).filter(Boolean) : [],
        stock: parseInt(m.stock) || 0,
      })),
      hasMerch: merchandise.filter(m => m.name).length > 0,
    }
    if (isEdit) { await updateAdminEvent(Number(id), eventData) }
    else { await addAdminEvent(eventData) }
    navigate(backUrl)
  }

  const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 outline-none focus:border-orange-500/50 transition-colors"
  const labelCls = "block text-white/60 text-xs font-semibold mb-1.5 tracking-wide uppercase"
  const errorCls = "text-red-400 text-[11px] mt-1"

  const mapCenter = [parseFloat(form.lat) || -6.2, parseFloat(form.lng) || 106.8]

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(backUrl)}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-white/40 hover:text-white bg-white/5 hover:bg-white/10 border-none cursor-pointer transition-all"
        >
          <IoArrowBack />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white m-0">{isEdit ? 'Edit Event' : 'Create Event'}</h1>
          <p className="text-white/40 text-sm mt-0.5 m-0">Step {step + 1} of {STEPS.length} — {STEPS[step].label}</p>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-2">
        {STEPS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => { if (i < step || validateStep()) setStep(i) }}
            className="flex items-center gap-2 shrink-0 border-none cursor-pointer px-3 py-2 rounded-lg transition-all"
            style={{
              background: i === step ? 'rgba(249,115,22,0.15)' : i < step ? 'rgba(34,197,94,0.08)' : 'rgba(255,255,255,0.03)',
              color: i === step ? '#f97316' : i < step ? '#22c55e' : 'rgba(255,255,255,0.3)',
            }}
          >
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
              style={{
                background: i === step ? '#f97316' : i < step ? '#22c55e' : 'rgba(255,255,255,0.08)',
                color: i <= step ? '#fff' : 'rgba(255,255,255,0.3)',
              }}
            >
              {i < step ? '✓' : s.icon}
            </span>
            <span className="text-xs font-medium hidden md:inline">{s.label}</span>
          </button>
        ))}
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="rounded-2xl p-6 md:p-8"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          {/* Step 0: Basic Info */}
          {step === 0 && (
            <div>
              <h3 className="text-white font-semibold text-lg mb-6 m-0">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className={labelCls}>Event Title *</label>
                  <input className={inputCls} value={form.title} onChange={(e) => updateField('title', e.target.value)} placeholder="e.g. NEON JUNGLE FESTIVAL" />
                  {errors.title && <div className={errorCls}>{errors.title}</div>}
                </div>
                <div>
                  <label className={labelCls}>Category *</label>
                  <select className={inputCls} value={form.category} onChange={(e) => updateField('category', e.target.value)} style={{ appearance: 'none' }}>
                    {categories.map(c => <option key={c.id} value={c.name} style={{ background: '#1a1a2e' }}>{c.name}</option>)}
                  </select>
                  {errors.category && <div className={errorCls}>{errors.category}</div>}
                </div>
                <div>
                  <label className={labelCls}>Status</label>
                  <select className={inputCls} value={form.status} onChange={(e) => updateField('status', e.target.value)} style={{ appearance: 'none' }}>
                    <option value="published" style={{ background: '#1a1a2e' }}>Published</option>
                    <option value="draft" style={{ background: '#1a1a2e' }}>Draft</option>
                    <option value="cancelled" style={{ background: '#1a1a2e' }}>Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Artist / Performer</label>
                  <input className={inputCls} value={form.artist} onChange={(e) => updateField('artist', e.target.value)} placeholder="e.g. Various Artists" />
                </div>
                <div>
                  <label className={labelCls}>Organizer</label>
                  <input className={inputCls} value={form.organizer} onChange={(e) => updateField('organizer', e.target.value)} placeholder="e.g. Live Nation" />
                </div>
                <div>
                  <label className={labelCls}>Tags (comma separated)</label>
                  <input className={inputCls} value={form.tags} onChange={(e) => updateField('tags', e.target.value)} placeholder="e.g. Popular, Selling Fast" />
                </div>
                <div>
                  <label className={labelCls}>Slug</label>
                  <input className={inputCls} value={form.slug} onChange={(e) => updateField('slug', e.target.value)} placeholder="auto-generated" />
                </div>
                <div className="md:col-span-2">
                  <label className={labelCls}>Description *</label>
                  <textarea className={`${inputCls} min-h-[120px] resize-y`} value={form.description} onChange={(e) => updateField('description', e.target.value)} placeholder="Describe your event..." />
                  {errors.description && <div className={errorCls}>{errors.description}</div>}
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Date & Time */}
          {step === 1 && (
            <div>
              <h3 className="text-white font-semibold text-lg mb-6 m-0">Date & Time</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className={labelCls}>Event Date *</label>
                  <input type="date" className={inputCls} value={form.fullDate} onChange={(e) => handleFullDateChange(e.target.value)}
                    style={{ colorScheme: 'dark' }} />
                  {errors.fullDate && <div className={errorCls}>{errors.fullDate}</div>}
                </div>
                <div>
                  <label className={labelCls}>Time Range</label>
                  <input className={inputCls} value={form.time} onChange={(e) => updateField('time', e.target.value)} placeholder="e.g. 8:00 PM - 2:00 AM" />
                </div>
                <div>
                  <label className={labelCls}>Display Date</label>
                  <input className={inputCls} value={form.date} onChange={(e) => updateField('date', e.target.value)} placeholder="Auto-generated from date" />
                </div>
              </div>
              {form.fullDate && (
                <div className="mt-6 p-4 rounded-xl bg-green-500/5 border border-green-500/10">
                  <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
                    <IoCheckmarkCircle />
                    <span>Preview: {form.date || 'Set date'}{form.time ? ` · ${form.time}` : ''}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Location with Map */}
          {step === 2 && (
            <div>
              <h3 className="text-white font-semibold text-lg mb-6 m-0">Location</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <div>
                  <label className={labelCls}>Venue *</label>
                  <input className={inputCls} value={form.venue} onChange={(e) => updateField('venue', e.target.value)} placeholder="e.g. Gelora Bung Karno Stadium" />
                  {errors.venue && <div className={errorCls}>{errors.venue}</div>}
                </div>
                <div>
                  <label className={labelCls}>City *</label>
                  <input className={inputCls} value={form.city} onChange={(e) => updateField('city', e.target.value)} placeholder="e.g. Jakarta" />
                  {errors.city && <div className={errorCls}>{errors.city}</div>}
                </div>
                <div>
                  <label className={labelCls}>Province</label>
                  <select className={inputCls} value={form.province} onChange={(e) => updateField('province', e.target.value)} style={{ appearance: 'none' }}>
                    <option value="" style={{ background: '#1a1a2e' }}>Select province</option>
                    {PROVINCES.map(p => <option key={p} value={p} style={{ background: '#1a1a2e' }}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Address</label>
                  <input className={inputCls} value={form.address} onChange={(e) => updateField('address', e.target.value)} placeholder="Full address" />
                </div>
              </div>

              {/* Interactive Map */}
              <div className="mb-5">
                <label className={labelCls}>
                  <IoLocationOutline className="inline mr-1" />
                  Pick Location on Map (click to set coordinates)
                </label>
                <div className="rounded-xl overflow-hidden border border-white/10 mt-2" style={{ height: 320 }}>
                  <MapContainer
                    center={mapCenter}
                    zoom={5}
                    style={{ height: '100%', width: '100%' }}
                    key={`map-${isEdit ? id : 'new'}`}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://carto.com">CARTO</a>'
                      url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    />
                    <MapClickHandler onMapClick={handleMapClick} />
                    {form.lat && form.lng && (
                      <Marker position={[parseFloat(form.lat), parseFloat(form.lng)]} />
                    )}
                  </MapContainer>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className={labelCls}>Latitude</label>
                  <input type="number" step="any" className={inputCls} value={form.lat} onChange={(e) => updateField('lat', e.target.value)} placeholder="-6.2183" />
                </div>
                <div>
                  <label className={labelCls}>Longitude</label>
                  <input type="number" step="any" className={inputCls} value={form.lng} onChange={(e) => updateField('lng', e.target.value)} placeholder="106.8023" />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Images */}
          {step === 3 && (
            <div>
              <h3 className="text-white font-semibold text-lg mb-6 m-0">Images</h3>
              <div className="space-y-6">
                {/* Cover Image */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className={`${labelCls} mb-0`}>Cover Image</label>
                    <div className="flex items-center gap-1 rounded-lg p-0.5" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <button type="button" onClick={() => setImageMode(m => ({ ...m, cover: 'url' }))}
                        className="px-3 py-1.5 rounded-md text-xs font-medium border-none cursor-pointer transition-all flex items-center gap-1.5"
                        style={{ background: imageMode.cover === 'url' ? 'rgba(249,115,22,0.2)' : 'transparent', color: imageMode.cover === 'url' ? '#f97316' : 'rgba(255,255,255,0.4)' }}
                      ><IoLinkOutline /> URL</button>
                      <button type="button" onClick={() => setImageMode(m => ({ ...m, cover: 'file' }))}
                        className="px-3 py-1.5 rounded-md text-xs font-medium border-none cursor-pointer transition-all flex items-center gap-1.5"
                        style={{ background: imageMode.cover === 'file' ? 'rgba(249,115,22,0.2)' : 'transparent', color: imageMode.cover === 'file' ? '#f97316' : 'rgba(255,255,255,0.4)' }}
                      ><IoCloudUploadOutline /> Upload</button>
                    </div>
                  </div>
                  {imageMode.cover === 'url' ? (
                    <input className={inputCls} value={form.image} onChange={(e) => updateField('image', e.target.value)} placeholder="https://example.com/cover.jpg" />
                  ) : (
                    <div>
                      <input ref={coverInputRef} type="file" accept="image/*" onChange={handleFileSelect('image')} className="hidden" />
                      <button type="button" onClick={() => coverInputRef.current?.click()}
                        className="w-full py-8 rounded-xl border-2 border-dashed border-white/10 bg-white/3 hover:border-orange-500/30 hover:bg-orange-500/5 transition-all cursor-pointer flex flex-col items-center gap-2"
                      >
                        <IoCloudUploadOutline className="text-2xl text-white/30" />
                        <span className="text-white/40 text-sm">Click to choose file</span>
                        <span className="text-white/20 text-xs">JPG, PNG or WebP</span>
                      </button>
                    </div>
                  )}
                  {form.image && (
                    <div className="mt-3 relative group">
                      <img src={form.image} alt="Cover preview" className="w-full h-40 object-cover rounded-xl" />
                      <button type="button" onClick={() => updateField('image', '')}
                        className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-black/60 text-white/60 hover:text-red-400 border-none cursor-pointer flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      ><IoTrashOutline className="text-sm" /></button>
                    </div>
                  )}
                </div>

                {/* Thumbnail */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className={`${labelCls} mb-0`}>Thumbnail</label>
                    <div className="flex items-center gap-1 rounded-lg p-0.5" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <button type="button" onClick={() => setImageMode(m => ({ ...m, thumb: 'url' }))}
                        className="px-3 py-1.5 rounded-md text-xs font-medium border-none cursor-pointer transition-all flex items-center gap-1.5"
                        style={{ background: imageMode.thumb === 'url' ? 'rgba(249,115,22,0.2)' : 'transparent', color: imageMode.thumb === 'url' ? '#f97316' : 'rgba(255,255,255,0.4)' }}
                      ><IoLinkOutline /> URL</button>
                      <button type="button" onClick={() => setImageMode(m => ({ ...m, thumb: 'file' }))}
                        className="px-3 py-1.5 rounded-md text-xs font-medium border-none cursor-pointer transition-all flex items-center gap-1.5"
                        style={{ background: imageMode.thumb === 'file' ? 'rgba(249,115,22,0.2)' : 'transparent', color: imageMode.thumb === 'file' ? '#f97316' : 'rgba(255,255,255,0.4)' }}
                      ><IoCloudUploadOutline /> Upload</button>
                    </div>
                  </div>
                  {imageMode.thumb === 'url' ? (
                    <input className={inputCls} value={form.thumbnail} onChange={(e) => updateField('thumbnail', e.target.value)} placeholder="https://example.com/thumb.jpg" />
                  ) : (
                    <div>
                      <input ref={thumbInputRef} type="file" accept="image/*" onChange={handleFileSelect('thumbnail')} className="hidden" />
                      <button type="button" onClick={() => thumbInputRef.current?.click()}
                        className="w-full py-8 rounded-xl border-2 border-dashed border-white/10 bg-white/3 hover:border-orange-500/30 hover:bg-orange-500/5 transition-all cursor-pointer flex flex-col items-center gap-2"
                      >
                        <IoCloudUploadOutline className="text-2xl text-white/30" />
                        <span className="text-white/40 text-sm">Click to choose file</span>
                        <span className="text-white/20 text-xs">JPG, PNG or WebP</span>
                      </button>
                    </div>
                  )}
                  {form.thumbnail && (
                    <div className="mt-3 relative group inline-block">
                      <img src={form.thumbnail} alt="Thumb preview" className="w-24 h-24 object-cover rounded-xl" />
                      <button type="button" onClick={() => updateField('thumbnail', '')}
                        className="absolute top-1 right-1 w-6 h-6 rounded-md bg-black/60 text-white/60 hover:text-red-400 border-none cursor-pointer flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      ><IoTrashOutline className="text-xs" /></button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Tickets */}
          {step === 4 && (
            <div>
              <h3 className="text-white font-semibold text-lg mb-6 m-0">Tickets</h3>
              {errors.tickets && <div className="text-red-400 text-xs mb-4 p-3 rounded-xl bg-red-500/5 border border-red-500/10">{errors.tickets}</div>}
              <div className="space-y-3">
                {tickets.map((ticket, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="md:col-span-3">
                      <label className={labelCls}>Type</label>
                      <input className={inputCls} value={ticket.type} onChange={(e) => {
                        const updated = [...tickets]; updated[index].type = e.target.value; setTickets(updated)
                      }} placeholder="e.g. VIP" />
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelCls}>Price ($)</label>
                      <input type="number" className={inputCls} value={ticket.price} onChange={(e) => {
                        const updated = [...tickets]; updated[index].price = e.target.value; setTickets(updated)
                      }} placeholder="89" />
                    </div>
                    <div className="md:col-span-4">
                      <label className={labelCls}>Description</label>
                      <input className={inputCls} value={ticket.description} onChange={(e) => {
                        const updated = [...tickets]; updated[index].description = e.target.value; setTickets(updated)
                      }} placeholder="What's included" />
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelCls}>Available</label>
                      <input type="number" className={inputCls} value={ticket.available} onChange={(e) => {
                        const updated = [...tickets]; updated[index].available = e.target.value; setTickets(updated)
                      }} placeholder="100" />
                    </div>
                    <div className="md:col-span-1 flex items-end justify-center pb-1">
                      {tickets.length > 1 && (
                        <button type="button" onClick={() => setTickets(tickets.filter((_, i) => i !== index))}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400/50 hover:text-red-400 hover:bg-red-500/10 border-none bg-transparent cursor-pointer transition-all">
                          <IoTrashOutline />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => setTickets([...tickets, { ...emptyTicket }])}
                className="flex items-center gap-2 text-orange-400 text-sm font-medium bg-transparent border-none cursor-pointer hover:text-orange-300 transition-colors mt-4">
                <IoAddCircleOutline /> Add Ticket Type
              </button>
            </div>
          )}

          {/* Step 5: Merchandise */}
          {step === 5 && (
            <div>
              <h3 className="text-white font-semibold text-lg mb-2 m-0">Merchandise</h3>
              <p className="text-white/30 text-sm mb-6 m-0">Optional — add merchandise for your event</p>
              <div className="space-y-3">
                {merchandise.map((item, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="md:col-span-3">
                      <label className={labelCls}>Name</label>
                      <input className={inputCls} value={item.name} onChange={(e) => {
                        const updated = [...merchandise]; updated[index].name = e.target.value; setMerchandise(updated)
                      }} placeholder="T-Shirt" />
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelCls}>Price ($)</label>
                      <input type="number" className={inputCls} value={item.price} onChange={(e) => {
                        const updated = [...merchandise]; updated[index].price = e.target.value; setMerchandise(updated)
                      }} placeholder="35" />
                    </div>
                    <div className="md:col-span-3">
                      <label className={labelCls}>Image URL</label>
                      <input className={inputCls} value={item.image} onChange={(e) => {
                        const updated = [...merchandise]; updated[index].image = e.target.value; setMerchandise(updated)
                      }} placeholder="https://..." />
                    </div>
                    <div className="md:col-span-1">
                      <label className={labelCls}>Sizes</label>
                      <input className={inputCls} value={item.sizes} onChange={(e) => {
                        const updated = [...merchandise]; updated[index].sizes = e.target.value; setMerchandise(updated)
                      }} placeholder="S,M,L" />
                    </div>
                    <div className="md:col-span-1">
                      <label className={labelCls}>Colors</label>
                      <input className={inputCls} value={item.colors} onChange={(e) => {
                        const updated = [...merchandise]; updated[index].colors = e.target.value; setMerchandise(updated)
                      }} placeholder="Black" />
                    </div>
                    <div className="md:col-span-1">
                      <label className={labelCls}>Stock</label>
                      <input type="number" className={inputCls} value={item.stock} onChange={(e) => {
                        const updated = [...merchandise]; updated[index].stock = e.target.value; setMerchandise(updated)
                      }} placeholder="100" />
                    </div>
                    <div className="md:col-span-1 flex items-end justify-center pb-1">
                      <button type="button" onClick={() => setMerchandise(merchandise.filter((_, i) => i !== index))}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400/50 hover:text-red-400 hover:bg-red-500/10 border-none bg-transparent cursor-pointer transition-all">
                        <IoTrashOutline />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => setMerchandise([...merchandise, { ...emptyMerch }])}
                className="flex items-center gap-2 text-orange-400 text-sm font-medium bg-transparent border-none cursor-pointer hover:text-orange-300 transition-colors mt-4">
                <IoAddCircleOutline /> Add Merchandise
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-6 pb-8">
        <button
          type="button"
          onClick={step === 0 ? () => navigate(backUrl) : goBack}
          className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium text-white/50 bg-white/5 border-none cursor-pointer hover:bg-white/10 transition-all"
        >
          <IoArrowBack className="text-sm" />
          {step === 0 ? 'Cancel' : 'Back'}
        </button>

        <div className="flex items-center gap-3">
          {step === STEPS.length - 1 ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleSubmit}
              className="flex items-center gap-2 text-white px-8 py-3 rounded-xl text-sm font-semibold border-none cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
            >
              <IoSaveOutline className="text-lg" />
              {isEdit ? 'Save Changes' : 'Create Event'}
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={goNext}
              className="flex items-center gap-2 text-white px-6 py-3 rounded-xl text-sm font-semibold border-none cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
            >
              Next
              <IoArrowForward className="text-sm" />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  )
}

export default EventForm
