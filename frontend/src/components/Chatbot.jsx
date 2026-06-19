import { useState, useRef, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoChatbubbleEllipses, IoClose, IoSend, IoSparkles } from 'react-icons/io5'
import { useAuth } from '../context/AuthContext'
import { formatRupiah } from '../utils/currency'

/* ── Useful aliases ── */
const aliases = {
    'jogja': 'yogyakarta', 'yogya': 'yogyakarta', 'jogjakarta': 'yogyakarta',
    'jkt': 'jakarta', 'bdg': 'bandung', 'sby': 'surabaya', 'mlg': 'malang',
    'smg': 'semarang', 'bali': 'denpasar', 'papua': 'jayapura',
}

function buildLocationCoords(events) {
    const coords = {}
    events.forEach(e => {
        coords[e.city.toLowerCase()] = { lat: e.lat, lng: e.lng, name: e.city, province: e.province }
        if (!coords[e.province.toLowerCase()]) {
            coords[e.province.toLowerCase()] = { lat: e.lat, lng: e.lng, name: e.province, province: e.province }
        }
    })
    Object.entries(aliases).forEach(([alias, target]) => {
        if (coords[target]) coords[alias] = coords[target]
    })
    return coords
}

function buildSystemPrompt(events) {
    const eventLines = events.map(e => {
        const minPrice = e.tickets?.length ? Math.min(...e.tickets.map(t => t.price)) : 0
        return `- "${e.title}" | ${e.date} | ${e.venue}, ${e.city}, ${e.province} | Harga mulai ${formatRupiah(minPrice)} | Kategori: ${e.category}${e.tags?.length ? ' | Tags: ' + e.tags.join(', ') : ''}`
    }).join('\n')
    return `Kamu adalah MonoBot, asisten AI dari Monora — platform pembelian tiket event & konser.
Kamu bertugas membantu pengguna mencari event, memberikan informasi tiket, menjawab pertanyaan cuaca di lokasi event, dan menjawab pertanyaan tentang Monora.

Berikut data event yang tersedia:
${eventLines}

Panduan:
- Jawab dengan ramah, ringkas, dan informatif dalam Bahasa Indonesia
- Jika user menanyakan event, rekomendasikan event yang relevan beserta harganya
- Jika ditanya tentang cara beli tiket, jelaskan: pilih event → pilih tiket → tambah ke cart → checkout
- Jika user bertanya tentang cuaca, kamu akan diberikan DATA CUACA REAL-TIME. Gunakan data tersebut untuk menjawab. Sajikan info cuaca dengan format yang rapi, sertakan emoji cuaca (☀️🌤️⛅🌧️⛈️), dan hubungkan dengan rekomendasi event di lokasi tersebut jika relevan
- Gunakan emoji sesekali untuk kesan ramah 🎶
- Jangan pernah membuat data event atau cuaca fiktif — gunakan HANYA data yang diberikan
- Jika ditanya hal di luar konteks Monora dan cuaca lokasi event, jawab sopan bahwa kamu hanya bisa membantu soal Monora`
}

/* ── WMO weather code labels (Indonesian) ────────────── */
const wmoLabels = {
    0: 'Cerah', 1: 'Sebagian Cerah', 2: 'Berawan Sebagian', 3: 'Berawan',
    45: 'Berkabut', 48: 'Kabut Tebal',
    51: 'Gerimis Ringan', 53: 'Gerimis', 55: 'Gerimis Lebat',
    61: 'Hujan Ringan', 63: 'Hujan Sedang', 65: 'Hujan Lebat',
    71: 'Salju Ringan', 73: 'Salju Sedang', 75: 'Salju Lebat',
    80: 'Hujan Ringan', 81: 'Hujan Sedang', 82: 'Hujan Lebat',
    95: 'Badai Petir', 96: 'Badai + Hujan Es', 99: 'Badai Besar',
}

/* ── Weather detection & fetching helpers ─────────────── */
const WEATHER_KEYWORDS = ['cuaca', 'weather', 'hujan', 'panas', 'suhu', 'temperatur', 'prakiraan', 'ramalan cuaca', 'forecast', 'cerah', 'mendung', 'badai', 'gerimis']

function detectWeatherQuery(text, locationCoords) {
    const lower = text.toLowerCase()
    const isWeather = WEATHER_KEYWORDS.some(kw => lower.includes(kw))
    if (!isWeather) return null

    // Try to find a matching location in the text
    let match = null
    // Check longest location names first to avoid partial matches
    const sortedKeys = Object.keys(locationCoords).sort((a, b) => b.length - a.length)
    for (const key of sortedKeys) {
        if (lower.includes(key)) {
            match = locationCoords[key]
            break
        }
    }
    // Default to Jakarta if no specific location mentioned
    return match || locationCoords['jakarta'] || null
}

async function fetchWeatherData(lat, lng) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_sum,windspeed_10m_max&current_weather=true&timezone=Asia/Jakarta&forecast_days=7`
    const res = await fetch(url)
    if (!res.ok) throw new Error('Gagal mengambil data cuaca')
    return res.json()
}

function formatWeatherContext(data, locationName) {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
    let ctx = `\n\n[DATA CUACA REAL-TIME untuk ${locationName}]\n`
    ctx += `Suhu saat ini: ${data.current_weather.temperature}°C\n`
    ctx += `Kondisi saat ini: ${wmoLabels[data.current_weather.weathercode] || 'Tidak diketahui'}\n\n`
    ctx += `Prakiraan 7 hari:\n`
    data.daily.time.forEach((date, i) => {
        const d = new Date(date)
        const dayName = i === 0 ? 'Hari Ini' : i === 1 ? 'Besok' : days[d.getDay()]
        const label = wmoLabels[data.daily.weathercode[i]] || '?'
        ctx += `- ${dayName} (${date}): ${label}, Suhu ${data.daily.temperature_2m_min[i]}°–${data.daily.temperature_2m_max[i]}°C, Hujan ${data.daily.precipitation_sum[i]}mm, Angin ${data.daily.windspeed_10m_max[i]}km/h\n`
    })
    return ctx
}

/* ── Styles ──────────────────────────────────────────── */
const fabStyle = {
    position: 'fixed',
    bottom: 24,
    right: 24,
    zIndex: 9999,
    width: 58,
    height: 58,
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #f97316, #ea580c)',
    boxShadow: '0 6px 24px rgba(249, 115, 22, 0.45), 0 0 0 4px rgba(249,115,22,0.12)',
    color: '#fff',
    fontSize: 26,
}

const chatWindowStyle = {
    position: 'fixed',
    bottom: 96,
    right: 24,
    zIndex: 9999,
    width: 380,
    maxWidth: 'calc(100vw - 32px)',
    height: 520,
    maxHeight: 'calc(100vh - 140px)',
    borderRadius: 20,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    background: 'rgba(12, 14, 30, 0.82)',
    backdropFilter: 'blur(28px) saturate(180%)',
    WebkitBackdropFilter: 'blur(28px) saturate(180%)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 24px 80px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255,255,255,0.04) inset',
}

const headerStyle = {
    padding: '16px 18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.03)',
}

const msgAreaStyle = {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    scrollbarWidth: 'thin',
    scrollbarColor: 'rgba(255,255,255,0.1) transparent',
}

const inputBarStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '12px 14px',
    borderTop: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.03)',
}

const inputStyle = {
    flex: 1,
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: '10px 14px',
    color: '#fff',
    fontSize: 13,
    outline: 'none',
    resize: 'none',
    fontFamily: 'inherit',
    lineHeight: 1.4,
    maxHeight: 80,
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
}

/* Hide scrollbar for webkit browsers */
const scrollbarHideStyle = `
    textarea::-webkit-scrollbar {
        display: none;
    }
`

const sendBtnStyle = {
    width: 38,
    height: 38,
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #f97316, #ea580c)',
    color: '#fff',
    fontSize: 16,
    flexShrink: 0,
}

/* ── Bubble styles ───────────────────────────────────── */
const userBubble = {
    alignSelf: 'flex-end',
    maxWidth: '80%',
    padding: '10px 14px',
    borderRadius: '16px 16px 4px 16px',
    background: 'linear-gradient(135deg, #f97316, #ea580c)',
    color: '#fff',
    fontSize: 13,
    lineHeight: 1.5,
    wordBreak: 'break-word',
}

const botBubble = {
    alignSelf: 'flex-start',
    maxWidth: '80%',
    padding: '10px 14px',
    borderRadius: '16px 16px 16px 4px',
    background: 'rgba(255, 255, 255, 0.07)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
    lineHeight: 1.5,
    wordBreak: 'break-word',
}

/* ── Typing animation dots ───────────────────────────── */
function TypingIndicator() {
    return (
        <div style={{ ...botBubble, display: 'flex', gap: 5, padding: '12px 18px' }}>
            {[0, 1, 2].map(i => (
                <motion.span
                    key={i}
                    style={{ width: 7, height: 7, borderRadius: '50%', background: 'rgba(255,255,255,0.4)' }}
                    animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                />
            ))}
        </div>
    )
}

/* ── Main Component ──────────────────────────────────── */
function Chatbot() {
    const { publicEvents } = useAuth()
    const locationCoords = useMemo(() => buildLocationCoords(publicEvents), [publicEvents])
    const SYSTEM_PROMPT = useMemo(() => buildSystemPrompt(publicEvents), [publicEvents])
    const [open, setOpen] = useState(false)
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Halo! 👋 Saya **MonoBot**, asisten Monora. Ada yang bisa saya bantu? Tanya soal event, tiket, atau **cuaca di lokasi event** — saya bisa bantu! 🌤️🎶' }
    ])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const msgEndRef = useRef(null)
    const textareaRef = useRef(null)

    // auto-scroll when new messages
    useEffect(() => {
        msgEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, loading])

    // auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'
            textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 80) + 'px'
        }
    }, [input])

    const sendMessage = async () => {
        const trimmed = input.trim()
        if (!trimmed || loading) return

        const userMsg = { role: 'user', content: trimmed }
        const newMessages = [...messages, userMsg]
        setMessages(newMessages)
        setInput('')
        setLoading(true)

        try {
            // Check if question is about weather → fetch real-time data
            let weatherContext = ''
            const weatherLoc = detectWeatherQuery(trimmed, locationCoords)
            if (weatherLoc) {
                try {
                    const weatherData = await fetchWeatherData(weatherLoc.lat, weatherLoc.lng)
                    weatherContext = formatWeatherContext(weatherData, weatherLoc.name)
                } catch {
                    weatherContext = '\n\n[Gagal mengambil data cuaca. Beritahu user bahwa data cuaca tidak tersedia saat ini.]'
                }
            }

            // Build messages with optional weather context injected
            const systemContent = SYSTEM_PROMPT + weatherContext

            const res = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'llama-3.3-70b-versatile',
                    messages: [
                        { role: 'system', content: systemContent },
                        ...newMessages.map(m => ({ role: m.role, content: m.content })),
                    ],
                    temperature: 0.7,
                    max_tokens: 512,
                }),
            })

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}))
                throw new Error(errData.error?.message || `API Error ${res.status}`)
            }

            const data = await res.json()
            const reply = data.choices?.[0]?.message?.content || 'Maaf, saya tidak bisa menjawab saat ini.'
            setMessages(prev => [...prev, { role: 'assistant', content: reply }])
        } catch (err) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: `⚠️ Terjadi error: ${err.message}. Coba lagi beberapa saat.`
            }])
        } finally {
            setLoading(false)
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }

    /* Improved markdown: bold **text**, line breaks, and list items */
    const renderText = (text) => {
        const lines = text.split('\n').map((line, lineIdx) => {
            // Handle bold **text**
            const parts = line.split(/(\*\*[^*]+\*\*)/g)
            const renderedParts = parts.map((part, partIdx) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={partIdx} style={{ fontWeight: 600 }}>{part.slice(2, -2)}</strong>
                }
                return <span key={partIdx}>{part}</span>
            })
            
            // Detect list items (- or •)
            const trimmed = line.trim()
            if (trimmed.startsWith('-') || trimmed.startsWith('•')) {
                const content = trimmed.replace(/^[-•]\s*/, '')
                return (
                    <div key={lineIdx} style={{ marginLeft: 14, marginTop: 4 }}>
                        • {content}
                    </div>
                )
            }
            
            // Regular line with paragraph spacing
            return (
                <div key={lineIdx} style={{ marginTop: lineIdx > 0 && line ? 6 : 0 }}>
                    {renderedParts}
                </div>
            )
        })
        return lines
    }

    return (
        <>
            <style>{scrollbarHideStyle}</style>
            {/* ── Floating Action Button ── */}
            <AnimatePresence>
                {!open && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        style={fabStyle}
                        onClick={() => setOpen(true)}
                        aria-label="Open chatbot"
                    >
                        <IoChatbubbleEllipses />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* ── Chat Window ── */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.92 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 30, scale: 0.92 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        style={chatWindowStyle}
                    >
                        {/* Header */}
                        <div style={headerStyle}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{
                                    width: 36, height: 36, borderRadius: 12,
                                    background: 'linear-gradient(135deg, #f97316, #ea580c)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    boxShadow: '0 0 12px rgba(249,115,22,0.3)',
                                }}>
                                    <IoSparkles style={{ color: '#fff', fontSize: 18 }} />
                                </div>
                                <div>
                                    <p style={{ margin: 0, color: '#fff', fontSize: 14, fontWeight: 600 }}>MonoBot</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                                        <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>Powered by Llama AI</span>
                                    </div>
                                </div>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setOpen(false)}
                                style={{
                                    background: 'rgba(255,255,255,0.06)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    borderRadius: 10, width: 32, height: 32,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 16,
                                }}
                            >
                                <IoClose />
                            </motion.button>
                        </div>

                        {/* Messages Area */}
                        <div style={msgAreaStyle}>
                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.25 }}
                                    style={msg.role === 'user' ? userBubble : botBubble}
                                >
                                    {msg.role === 'assistant' ? renderText(msg.content) : msg.content}
                                </motion.div>
                            ))}
                            {loading && <TypingIndicator />}
                            <div ref={msgEndRef} />
                        </div>

                        {/* Input Bar */}
                        <div style={inputBarStyle}>
                            <textarea
                                ref={textareaRef}
                                style={inputStyle}
                                rows={1}
                                placeholder="Ketik pesan..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                onFocus={(e) => {
                                    e.target.style.borderColor = 'rgba(249,115,22,0.4)'
                                    e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.1)'
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = 'rgba(255,255,255,0.1)'
                                    e.target.style.boxShadow = 'none'
                                }}
                            />
                            <motion.button
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={sendMessage}
                                disabled={loading || !input.trim()}
                                style={{
                                    ...sendBtnStyle,
                                    opacity: (loading || !input.trim()) ? 0.5 : 1,
                                    cursor: (loading || !input.trim()) ? 'not-allowed' : 'pointer',
                                }}
                            >
                                <IoSend />
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default Chatbot
