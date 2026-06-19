import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoClose, IoSendSharp, IoChatbubbleEllipses } from 'react-icons/io5'
import { useAuth } from '../context/AuthContext'

function OrganizerChat({ isOpen, onClose, event }) {
  const { sendMessage, getChatMessages, user } = useAuth()
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)
  const messages = getChatMessages(event.id)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  const handleSend = () => {
    const text = input.trim()
    if (!text) return
    sendMessage(event.id, event.title, event.organizer, text, 'customer')
    setInput('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const formatTime = (ts) => {
    const d = new Date(ts)
    return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-full max-w-md rounded-2xl overflow-hidden flex flex-col"
            style={{
              background: 'rgba(15, 15, 35, 0.95)',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(24px)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              maxHeight: '80vh',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}
                >
                  <IoChatbubbleEllipses className="text-white text-lg" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm m-0">{event.organizer}</p>
                  <p className="text-white/40 text-xs m-0">{event.title}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white/50 hover:text-white cursor-pointer bg-transparent border-none transition-colors hover:bg-white/10"
              >
                <IoClose className="text-lg" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3"
              style={{ minHeight: 300, maxHeight: 400, scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}
            >
              {messages.length === 0 && (
                <div className="text-center py-10">
                  <IoChatbubbleEllipses className="text-4xl text-white/15 mx-auto mb-3" />
                  <p className="text-white/40 text-sm">Mulai percakapan dengan penyelenggara</p>
                  <p className="text-white/25 text-xs mt-1">Tanyakan tentang acara, tiket, atau hal lainnya</p>
                </div>
              )}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'customer' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className="max-w-[80%] rounded-2xl px-4 py-2.5"
                    style={{
                      background: msg.sender === 'customer'
                        ? 'linear-gradient(135deg, #f97316, #ea580c)'
                        : 'rgba(255,255,255,0.08)',
                      borderBottomRightRadius: msg.sender === 'customer' ? 4 : 16,
                      borderBottomLeftRadius: msg.sender === 'organizer' ? 4 : 16,
                    }}
                  >
                    <p className="text-white text-sm m-0 leading-relaxed">{msg.text}</p>
                    <p className={`text-xs mt-1 m-0 ${msg.sender === 'customer' ? 'text-white/60' : 'text-white/30'}`}>
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ketik pesan..."
                  className="flex-1 bg-transparent text-white text-sm py-3 px-4 rounded-xl outline-none placeholder-white/30"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-white cursor-pointer border-none transition-opacity"
                  style={{
                    background: input.trim() ? 'linear-gradient(135deg, #f97316, #ea580c)' : 'rgba(255,255,255,0.06)',
                    opacity: input.trim() ? 1 : 0.5,
                  }}
                >
                  <IoSendSharp />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default OrganizerChat
