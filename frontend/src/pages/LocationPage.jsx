import { useState, useEffect, useRef, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { IoLocationSharp, IoCalendarOutline, IoTicketOutline, IoClose, IoChevronForward, IoShirtOutline, IoMusicalNotes } from 'react-icons/io5'
import { useAuth } from '../context/AuthContext'
import WeatherWidget from '../components/WeatherWidget'
import { formatRupiah } from '../utils/currency'

// Fix default marker icon issue in react-leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// Custom cluster icon for province markers (shows count)
function createClusterIcon(count, isActive) {
  const size = count >= 5 ? 52 : count >= 3 ? 44 : 38
  return L.divIcon({
    html: `<div style="
      width: ${size}px; height: ${size}px;
      display: flex; align-items: center; justify-content: center;
      border-radius: 50%;
      background: ${isActive
        ? 'linear-gradient(135deg, #f97316, #ea580c)'
        : 'linear-gradient(135deg, #ef4444, #dc2626)'};
      color: white;
      font-weight: 800;
      font-size: ${count >= 10 ? '14px' : '15px'};
      font-family: 'Inter', sans-serif;
      box-shadow: 0 4px 15px rgba(239,68,68,0.5), 0 0 0 4px rgba(239,68,68,0.2);
      cursor: pointer;
      transition: transform 0.2s;
    ">${count}</div>`,
    className: 'custom-cluster-icon',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  })
}

// Single event marker icon
function createEventIcon(category) {
  const colors = {
    Festivals: '#8b5cf6',
    Concerts: '#ef4444',
    Comedy: '#f59e0b',
    Sports: '#22c55e',
  }
  const color = colors[category] || '#ef4444'
  return L.divIcon({
    html: `<div style="
      width: 32px; height: 32px;
      display: flex; align-items: center; justify-content: center;
      border-radius: 50%;
      background: ${color};
      color: white;
      box-shadow: 0 3px 10px ${color}80, 0 0 0 3px ${color}33;
      cursor: pointer;
    ">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
      </svg>
    </div>`,
    className: 'custom-event-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  })
}

// Map controller component for flying to locations
function MapController({ center, zoom }) {
  const map = useMap()
  useEffect(() => {
    if (center && zoom) {
      map.flyTo(center, zoom, { duration: 1.2 })
    }
  }, [center, zoom, map])
  return null
}

// Province cluster markers (zoomed out view)
function ProvinceMarkers({ provinces, onProvinceClick, activeProvince }) {
  const map = useMap()
  const [currentZoom, setCurrentZoom] = useState(map.getZoom())

  useEffect(() => {
    const handleZoom = () => setCurrentZoom(map.getZoom())
    map.on('zoomend', handleZoom)
    return () => map.off('zoomend', handleZoom)
  }, [map])

  // Show province clusters only when zoomed out
  if (currentZoom > 8) return null

  // Calculate average position for each province
  const provincePositions = provinces.map(prov => {
    const avgLat = prov.events.reduce((s, e) => s + e.lat, 0) / prov.events.length
    const avgLng = prov.events.reduce((s, e) => s + e.lng, 0) / prov.events.length
    return { ...prov, lat: avgLat, lng: avgLng }
  })

  return provincePositions.map(prov => (
    <Marker
      key={prov.name}
      position={[prov.lat, prov.lng]}
      icon={createClusterIcon(prov.count, activeProvince === prov.name)}
      eventHandlers={{
        click: () => onProvinceClick(prov),
      }}
    >
      <Popup className="custom-popup">
        <div style={{ minWidth: '160px', padding: '4px' }}>
          <strong style={{ fontSize: '14px' }}>{prov.name}</strong>
          <br />
          <span style={{ color: '#666', fontSize: '12px' }}>{prov.count} event{prov.count > 1 ? 's' : ''}</span>
          <br />
          <span style={{ color: '#f97316', fontSize: '11px', cursor: 'pointer' }}>Click to zoom in →</span>
        </div>
      </Popup>
    </Marker>
  ))
}

// Individual event markers (zoomed in view)
function EventMarkers({ events, onEventClick }) {
  const map = useMap()
  const [currentZoom, setCurrentZoom] = useState(map.getZoom())

  useEffect(() => {
    const handleZoom = () => setCurrentZoom(map.getZoom())
    map.on('zoomend', handleZoom)
    return () => map.off('zoomend', handleZoom)
  }, [map])

  // Show individual markers only when zoomed in
  if (currentZoom <= 8) return null

  return events.map(event => (
    <Marker
      key={event.id}
      position={[event.lat, event.lng]}
      icon={createEventIcon(event.category)}
      eventHandlers={{
        click: () => onEventClick(event),
      }}
    >
      <Popup className="custom-popup">
        <div style={{ minWidth: '200px', padding: '4px' }}>
          <strong style={{ fontSize: '13px' }}>{event.title}</strong>
          <br />
          <span style={{ color: '#666', fontSize: '11px' }}>{event.venue}, {event.city}</span>
          <br />
          <span style={{ color: '#888', fontSize: '11px' }}>{event.date}</span>
          <br />
          <span style={{ color: '#f97316', fontSize: '12px', fontWeight: '600' }}>
            Mulai dari {formatRupiah(Math.min(...event.tickets.map(t => t.price)))}
          </span>
        </div>
      </Popup>
    </Marker>
  ))
}

function LocationPage() {
  const { publicEvents } = useAuth()
  const [activeProvince, setActiveProvince] = useState(null)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [mapCenter, setMapCenter] = useState([-2.5, 118])
  const [mapZoom, setMapZoom] = useState(5)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarEvents, setSidebarEvents] = useState([])
  const [weatherLocation, setWeatherLocation] = useState({ lat: -6.2, lng: 106.8, name: 'DKI Jakarta' })

  const provinces = useMemo(() => {
    const map = {}
    publicEvents.forEach(e => {
      if (!e.province || e.lat == null || e.lng == null) return
      if (!map[e.province]) map[e.province] = { name: e.province, events: [], lat: e.lat, lng: e.lng }
      map[e.province].events.push(e)
    })
    return Object.values(map).map((prov) => ({
      ...prov,
      count: prov.events.length,
    }))
  }, [publicEvents])

  const handleProvinceClick = (province) => {
    setActiveProvince(province.name)
    setSidebarEvents(province.events)
    setSidebarOpen(true)
    setSelectedEvent(null)

    // Calculate bounds and fly to the province
    const lats = province.events.map(e => e.lat)
    const lngs = province.events.map(e => e.lng)
    const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2
    const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2
    setMapCenter([centerLat, centerLng])
    setMapZoom(province.events.length === 1 ? 12 : 10)

    // Update weather location
    setWeatherLocation({ lat: centerLat, lng: centerLng, name: province.name })
  }

  const handleEventClick = (event) => {
    setSelectedEvent(event)
    setSidebarEvents([event])
    setSidebarOpen(true)
    setMapCenter([event.lat, event.lng])
    setMapZoom(14)
  }

  const handleReset = () => {
    setActiveProvince(null)
    setSelectedEvent(null)
    setSidebarOpen(false)
    setSidebarEvents([])
    setMapCenter([-2.5, 118])
    setMapZoom(5)
  }

  const categoryColor = {
    Festivals: 'bg-purple-500/20 text-purple-400',
    Concerts: 'bg-red-500/20 text-red-400',
    Comedy: 'bg-yellow-500/20 text-yellow-400',
    Sports: 'bg-green-500/20 text-green-400',
  }

  return (
    <div className="min-h-screen bg-[#0B0D1A] pt-20">
      {/* Hero Header */}
      <section className="relative px-6 md:px-10 py-10 md:py-14">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-1/4 w-125 h-125 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #f97316, transparent 70%)' }} />
          <div className="absolute bottom-0 left-1/3 w-100 h-100 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #6366f1, transparent 70%)' }} />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-500/30 bg-orange-500/10 mb-4">
              <IoLocationSharp className="text-orange-400" />
              <span className="text-orange-400 text-sm font-semibold">Event Map Indonesia</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              Discover Events <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">Near You</span>
            </h1>
            <p className="text-white/50 max-w-xl mx-auto">
              Explore events across Indonesia. Click on a province marker to zoom in and discover what's happening in your area.
            </p>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex flex-wrap justify-center gap-6 mb-8"
          >
            {[
              { label: 'Total Events', value: publicEvents.length, icon: IoMusicalNotes },
              { label: 'Provinces', value: provinces.length, icon: IoLocationSharp },
              { label: 'Cities', value: [...new Set(publicEvents.map(e => e.city))].length, icon: IoCalendarOutline },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-3 px-5 py-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <stat.icon className="text-orange-400 text-lg" />
                <div>
                  <div className="text-white font-bold text-lg leading-none">{stat.value}</div>
                  <div className="text-white/40 text-xs">{stat.label}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Map Section */}
      <section className="px-4 md:px-10 pb-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative rounded-2xl overflow-hidden"
            style={{ border: '1px solid rgba(255,255,255,0.1)' }}
          >
            {/* Map Controls Overlay */}
            <div className="absolute top-4 left-4 z-[1000] flex gap-2">
              {activeProvince && (
                <motion.button
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-none cursor-pointer text-white text-sm font-semibold"
                  style={{
                    background: 'rgba(15,15,35,0.9)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  <IoChevronForward className="rotate-180 text-orange-400" />
                  Back to Indonesia
                </motion.button>
              )}
              {activeProvince && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold"
                  style={{
                    background: 'linear-gradient(135deg, rgba(249,115,22,0.9), rgba(234,88,12,0.9))',
                    boxShadow: '0 4px 15px rgba(249,115,22,0.3)',
                  }}
                >
                  <IoLocationSharp />
                  {activeProvince}
                </motion.div>
              )}
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 z-[1000] hidden md:block">
              <div className="px-4 py-3 rounded-xl text-xs"
                style={{
                  background: 'rgba(15,15,35,0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <div className="text-white/60 font-semibold mb-2">Legend</div>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" /> <span className="text-white/50">Concerts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500" /> <span className="text-white/50">Festivals</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" /> <span className="text-white/50">Comedy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" /> <span className="text-white/50">Sports</span>
                  </div>
                </div>
              </div>
            </div>

            {/* The Map */}
            <div className="h-[500px] md:h-[650px]">
              <MapContainer
                center={[-2.5, 118]}
                zoom={5}
                zoomControl={false}
                className="h-full w-full"
                style={{ background: '#0B0D1A' }}
                minZoom={4}
                maxZoom={18}
              >
                <ZoomControl position="topright" />
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
                <MapController center={mapCenter} zoom={mapZoom} />
                <ProvinceMarkers
                  provinces={provinces}
                  onProvinceClick={handleProvinceClick}
                  activeProvince={activeProvince}
                />
                <EventMarkers
                  events={publicEvents}
                  onEventClick={handleEventClick}
                />
              </MapContainer>
            </div>

            {/* Sidebar Panel */}
            <AnimatePresence>
              {sidebarOpen && sidebarEvents.length > 0 && (
                <motion.div
                  initial={{ x: '100%', opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: '100%', opacity: 0 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  className="absolute top-0 right-0 h-full w-full md:w-[380px] z-[1000] overflow-y-auto"
                  style={{
                    background: 'linear-gradient(180deg, rgba(11,13,26,0.97) 0%, rgba(15,15,40,0.98) 100%)',
                    backdropFilter: 'blur(20px)',
                    borderLeft: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  {/* Sidebar Header */}
                  <div className="sticky top-0 z-10 px-5 py-4 flex items-center justify-between"
                    style={{
                      background: 'linear-gradient(180deg, rgba(11,13,26,1) 0%, rgba(11,13,26,0.95) 100%)',
                      borderBottom: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    <div>
                      <h3 className="text-white font-bold text-lg m-0">
                        {selectedEvent ? selectedEvent.city : activeProvince}
                      </h3>
                      <p className="text-white/40 text-xs m-0 mt-0.5">
                        {sidebarEvents.length} event{sidebarEvents.length > 1 ? 's' : ''} found
                      </p>
                    </div>
                    <button
                      onClick={() => setSidebarOpen(false)}
                      className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border-none transition-all"
                    >
                      <IoClose className="text-lg" />
                    </button>
                  </div>

                  {/* Event Cards */}
                  <div className="p-4 flex flex-col gap-3">
                    {sidebarEvents.map((event, idx) => (
                      <motion.div
                        key={event.id}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <Link
                          to={`/event/${event.id}`}
                          className="no-underline block rounded-xl overflow-hidden group transition-all duration-300 hover:ring-1 hover:ring-orange-500/30"
                          style={{
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.06)',
                          }}
                        >
                          <div className="relative h-36 overflow-hidden">
                            <img
                              src={event.thumbnail}
                              alt={event.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-[#0B0D1A] via-transparent to-transparent opacity-70" />
                            <div className="absolute top-2 left-2 flex gap-1.5">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${categoryColor[event.category] || 'bg-red-500/20 text-red-400'}`}>
                                {event.category}
                              </span>
                              {event.hasMerch && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center gap-0.5">
                                  <IoShirtOutline className="text-[8px]" /> Merch
                                </span>
                              )}
                            </div>
                            {event.tags.includes('Selling Fast') && (
                              <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full"
                                style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: 'white' }}>
                                Selling Fast
                              </span>
                            )}
                          </div>

                          <div className="p-3.5">
                            <h4 className="text-white font-bold text-sm m-0 mb-1.5 group-hover:text-orange-400 transition-colors">
                              {event.title}
                            </h4>
                            <div className="flex items-center gap-1.5 text-white/40 text-xs mb-1">
                              <IoCalendarOutline className="text-orange-400/70 shrink-0" />
                              {event.date}
                            </div>
                            <div className="flex items-center gap-1.5 text-white/40 text-xs mb-2.5">
                              <IoLocationSharp className="text-orange-400/70 shrink-0" />
                              {event.venue}, {event.city}
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <IoTicketOutline className="text-orange-400" />
                                <span className="text-white font-semibold text-sm">
                                  {formatRupiah(Math.min(...event.tickets.map(t => t.price)))}
                                </span>
                                <span className="text-white/30 text-xs">mulai</span>
                              </div>
                              <div className="flex items-center gap-1 text-orange-400 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                                Details <IoChevronForward className="text-[10px]" />
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Weather Forecast Section */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-12"
          >
            <WeatherWidget
              lat={weatherLocation.lat}
              lng={weatherLocation.lng}
              provinceName={weatherLocation.name}
            />
          </motion.div>

          {/* Province Quick Access Grid */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Browse by <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">Province</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {provinces.sort((a, b) => b.count - a.count).map((prov, idx) => (
                <motion.button
                  key={prov.name}
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.03 }}
                  whileHover={{ y: -3 }}
                  onClick={() => handleProvinceClick(prov)}
                  className="relative rounded-xl p-4 text-left cursor-pointer border-none transition-all group"
                  style={{
                    background: activeProvince === prov.name
                      ? 'linear-gradient(135deg, rgba(249,115,22,0.15), rgba(234,88,12,0.1))'
                      : 'rgba(255,255,255,0.03)',
                    border: activeProvince === prov.name
                      ? '1px solid rgba(249,115,22,0.3)'
                      : '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <IoLocationSharp className={`text-lg ${activeProvince === prov.name ? 'text-orange-400' : 'text-white/30 group-hover:text-orange-400'} transition-colors`} />
                    <span className="text-white font-bold text-lg">{prov.count}</span>
                  </div>
                  <h3 className="text-white font-semibold text-sm m-0 leading-tight">
                    {prov.name}
                  </h3>
                  <p className="text-white/30 text-[11px] m-0 mt-0.5">
                    {prov.count} event{prov.count > 1 ? 's' : ''}
                  </p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Custom CSS for leaflet popups */}
      <style>{`
        .leaflet-popup-content-wrapper {
          background: rgba(15, 15, 35, 0.95) !important;
          color: white !important;
          border-radius: 12px !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5) !important;
          backdrop-filter: blur(10px) !important;
        }
        .leaflet-popup-tip {
          background: rgba(15, 15, 35, 0.95) !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
        }
        .leaflet-popup-content {
          color: white !important;
          margin: 10px 14px !important;
        }
        .leaflet-popup-close-button {
          color: rgba(255,255,255,0.5) !important;
          font-size: 18px !important;
        }
        .leaflet-popup-close-button:hover {
          color: white !important;
        }
        .leaflet-control-zoom a {
          background: rgba(15, 15, 35, 0.9) !important;
          color: white !important;
          border-color: rgba(255,255,255,0.1) !important;
          backdrop-filter: blur(10px) !important;
        }
        .leaflet-control-zoom a:hover {
          background: rgba(30, 30, 60, 0.95) !important;
        }
        .custom-cluster-icon {
          background: transparent !important;
          border: none !important;
        }
        .custom-event-icon {
          background: transparent !important;
          border: none !important;
        }
        .leaflet-control-attribution {
          background: rgba(15, 15, 35, 0.8) !important;
          color: rgba(255,255,255,0.4) !important;
          font-size: 10px !important;
        }
        .leaflet-control-attribution a {
          color: rgba(249,115,22,0.7) !important;
        }
      `}</style>
    </div>
  )
}

export default LocationPage
