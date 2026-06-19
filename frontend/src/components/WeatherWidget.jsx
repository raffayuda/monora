import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    IoSunny, IoPartlySunny, IoCloud, IoRainy,
    IoThunderstorm, IoSnow, IoEye, IoWater,
    IoSpeedometer, IoArrowUp, IoArrowDown, IoLocationSharp,
} from 'react-icons/io5'

/* ── WMO Weather Code mapping ────────────────────────── */
const weatherInfo = {
    0: { label: 'Cerah', icon: IoSunny, color: '#facc15' },
    1: { label: 'Sebagian Cerah', icon: IoPartlySunny, color: '#fbbf24' },
    2: { label: 'Berawan Sebagian', icon: IoPartlySunny, color: '#94a3b8' },
    3: { label: 'Berawan', icon: IoCloud, color: '#94a3b8' },
    45: { label: 'Berkabut', icon: IoEye, color: '#cbd5e1' },
    48: { label: 'Kabut Tebal', icon: IoEye, color: '#94a3b8' },
    51: { label: 'Gerimis Ringan', icon: IoRainy, color: '#60a5fa' },
    53: { label: 'Gerimis', icon: IoRainy, color: '#3b82f6' },
    55: { label: 'Gerimis Lebat', icon: IoRainy, color: '#2563eb' },
    61: { label: 'Hujan Ringan', icon: IoRainy, color: '#60a5fa' },
    63: { label: 'Hujan Sedang', icon: IoRainy, color: '#3b82f6' },
    65: { label: 'Hujan Lebat', icon: IoRainy, color: '#1d4ed8' },
    71: { label: 'Salju Ringan', icon: IoSnow, color: '#e2e8f0' },
    73: { label: 'Salju Sedang', icon: IoSnow, color: '#cbd5e1' },
    75: { label: 'Salju Lebat', icon: IoSnow, color: '#94a3b8' },
    80: { label: 'Hujan Ringan', icon: IoRainy, color: '#60a5fa' },
    81: { label: 'Hujan Sedang', icon: IoRainy, color: '#3b82f6' },
    82: { label: 'Hujan Lebat', icon: IoRainy, color: '#1d4ed8' },
    85: { label: 'Hujan Salju', icon: IoSnow, color: '#cbd5e1' },
    86: { label: 'Hujan Salju Lebat', icon: IoSnow, color: '#94a3b8' },
    95: { label: 'Badai Petir', icon: IoThunderstorm, color: '#a78bfa' },
    96: { label: 'Badai + Hujan Es', icon: IoThunderstorm, color: '#8b5cf6' },
    99: { label: 'Badai Besar', icon: IoThunderstorm, color: '#7c3aed' },
}

function getWeatherInfo(code) {
    return weatherInfo[code] || { label: 'Tidak Diketahui', icon: IoCloud, color: '#94a3b8' }
}

function getDayName(dateStr, index) {
    if (index === 0) return 'Hari Ini'
    if (index === 1) return 'Besok'
    const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
    const d = new Date(dateStr)
    return days[d.getDay()]
}

function formatDate(dateStr) {
    const d = new Date(dateStr)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
    return `${d.getDate()} ${months[d.getMonth()]}`
}

/* ── Styles ──────────────────────────────────────────── */
const containerStyle = {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    overflow: 'hidden',
}

const headerGlass = {
    background: 'linear-gradient(135deg, rgba(249,115,22,0.12), rgba(234,88,12,0.06))',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    padding: '20px 24px',
}

const todayCardStyle = {
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: '20px',
}

const dayCardStyle = {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: 14,
    padding: '14px 12px',
    textAlign: 'center',
    minWidth: 0,
    flex: '1 1 0',
}

const dayCardActiveStyle = {
    background: 'linear-gradient(135deg, rgba(249,115,22,0.15), rgba(234,88,12,0.08))',
    border: '1px solid rgba(249,115,22,0.3)',
    borderRadius: 14,
    padding: '14px 12px',
    textAlign: 'center',
    minWidth: 0,
    flex: '1 1 0',
}

const statPillStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 12px',
    borderRadius: 12,
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.06)',
}

/* ── Component ───────────────────────────────────────── */
function WeatherWidget({ lat, lng, provinceName }) {
    const [weather, setWeather] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!lat || !lng) return

        const fetchWeather = async () => {
            setLoading(true)
            setError(null)
            try {
                const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_sum,windspeed_10m_max&current_weather=true&timezone=Asia/Jakarta&forecast_days=7`
                const res = await fetch(url)
                if (!res.ok) throw new Error('Gagal mengambil data cuaca')
                const data = await res.json()
                setWeather(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchWeather()
    }, [lat, lng])

    if (!lat || !lng) return null

    return (
        <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={containerStyle}
        >
            {/* Header */}
            <div style={headerGlass}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <IoLocationSharp style={{ color: '#f97316', fontSize: 18 }} />
                            <h3 style={{ margin: 0, color: '#fff', fontSize: 18, fontWeight: 700 }}>
                                Prakiraan Cuaca
                            </h3>
                        </div>
                        <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
                            {provinceName} — 7 hari ke depan
                        </p>
                    </div>
                    {weather?.current_weather && (
                        <div style={{ textAlign: 'right' }}>
                            <span style={{ color: '#fff', fontSize: 28, fontWeight: 700 }}>
                                {weather.current_weather.temperature}°C
                            </span>
                            <p style={{ margin: 0, color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>Saat ini</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Body */}
            <div style={{ padding: '20px 24px' }}>
                <AnimatePresence mode="wait">
                    {loading && (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 0' }}
                        >
                            <div style={{ display: 'flex', gap: 6 }}>
                                {[0, 1, 2].map(i => (
                                    <motion.span
                                        key={i}
                                        style={{ width: 8, height: 8, borderRadius: '50%', background: '#f97316' }}
                                        animate={{ opacity: [0.3, 1, 0.3], y: [0, -6, 0] }}
                                        transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {error && (
                        <motion.p
                            key="error"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{ color: '#f87171', textAlign: 'center', fontSize: 13, padding: '20px 0' }}
                        >
                            ⚠️ {error}
                        </motion.p>
                    )}

                    {!loading && !error && weather && (
                        <motion.div
                            key="data"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            {/* Today's detailed card */}
                            {(() => {
                                const todayCode = weather.daily.weathercode[0]
                                const info = getWeatherInfo(todayCode)
                                const Icon = info.icon
                                return (
                                    <div style={todayCardStyle}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
                                            <div style={{
                                                width: 56, height: 56, borderRadius: 16,
                                                background: `${info.color}18`,
                                                border: `1px solid ${info.color}30`,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            }}>
                                                <Icon style={{ fontSize: 28, color: info.color }} />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <p style={{ margin: 0, color: '#fff', fontSize: 15, fontWeight: 600 }}>
                                                    Hari Ini — {formatDate(weather.daily.time[0])}
                                                </p>
                                                <p style={{ margin: '2px 0 0', color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
                                                    {info.label}
                                                </p>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                    <IoArrowUp style={{ color: '#f97316', fontSize: 12 }} />
                                                    <span style={{ color: '#fff', fontWeight: 600, fontSize: 15 }}>
                                                        {weather.daily.temperature_2m_max[0]}°
                                                    </span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                    <IoArrowDown style={{ color: '#60a5fa', fontSize: 12 }} />
                                                    <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 500, fontSize: 13 }}>
                                                        {weather.daily.temperature_2m_min[0]}°
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Stats row */}
                                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                            <div style={statPillStyle}>
                                                <IoWater style={{ color: '#60a5fa', fontSize: 14 }} />
                                                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>
                                                    {weather.daily.precipitation_sum[0]} mm
                                                </span>
                                            </div>
                                            <div style={statPillStyle}>
                                                <IoSpeedometer style={{ color: '#a78bfa', fontSize: 14 }} />
                                                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>
                                                    {weather.daily.windspeed_10m_max[0]} km/h
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })()}

                            {/* 7-day forecast cards */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
                                gap: 8,
                                marginTop: 16,
                            }}>
                                {weather.daily.time.map((date, idx) => {
                                    const info = getWeatherInfo(weather.daily.weathercode[idx])
                                    const Icon = info.icon
                                    return (
                                        <motion.div
                                            key={date}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            style={idx === 0 ? dayCardActiveStyle : dayCardStyle}
                                        >
                                            <p style={{
                                                margin: '0 0 6px',
                                                color: idx === 0 ? '#f97316' : 'rgba(255,255,255,0.5)',
                                                fontSize: 11,
                                                fontWeight: 600,
                                            }}>
                                                {getDayName(date, idx)}
                                            </p>
                                            <p style={{
                                                margin: '0 0 8px',
                                                color: 'rgba(255,255,255,0.3)',
                                                fontSize: 10,
                                            }}>
                                                {formatDate(date)}
                                            </p>
                                            <Icon style={{ fontSize: 22, color: info.color, marginBottom: 8 }} />
                                            <p style={{ margin: '0 0 2px', color: '#fff', fontSize: 13, fontWeight: 600 }}>
                                                {weather.daily.temperature_2m_max[idx]}°
                                            </p>
                                            <p style={{ margin: 0, color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>
                                                {weather.daily.temperature_2m_min[idx]}°
                                            </p>
                                            <p style={{
                                                margin: '6px 0 0',
                                                color: 'rgba(255,255,255,0.35)',
                                                fontSize: 9,
                                                lineHeight: 1.2,
                                            }}>
                                                {info.label}
                                            </p>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    )
}

export default WeatherWidget
