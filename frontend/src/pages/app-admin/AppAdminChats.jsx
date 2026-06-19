import { useState, useMemo, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { IoChatbubbleEllipsesOutline, IoSearchOutline, IoPersonOutline, IoTimeOutline, IoChevronBack, IoBusinessOutline } from 'react-icons/io5'
import { useAuth } from '../../context/AuthContext'

function AppAdminChats() {
  const { getAllChats, getAllUsers, getAllAdminEvents } = useAuth()
  const allChats = getAllChats()
  const [search, setSearch] = useState('')
  const [selectedChat, setSelectedChat] = useState(null)
  const [eventFilter, setEventFilter] = useState('all')
  const messagesEndRef = useRef(null)

  const users = useMemo(() => { try { return getAllUsers() } catch { return [] } }, [])
  const events = useMemo(() => { try { return getAllAdminEvents() } catch { return [] } }, [])

  const getUserName = (userId) => users.find(u => u.id === userId)?.name || 'Unknown'

  const sortedChats = useMemo(() => {
    return [...allChats].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
  }, [allChats])

  const filteredChats = useMemo(() => {
    let result = sortedChats
    if (eventFilter !== 'all') {
      result = result.filter(c => String(c.eventId) === String(eventFilter))
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(c =>
        c.userName?.toLowerCase().includes(q) ||
        c.eventTitle?.toLowerCase().includes(q) ||
        c.organizerName?.toLowerCase().includes(q) ||
        c.messages?.some(m => m.text?.toLowerCase().includes(q))
      )
    }
    return result
  }, [sortedChats, search, eventFilter])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [selectedChat, allChats])

  const activeChatData = useMemo(() => {
    if (!selectedChat) return null
    return allChats.find(c => c.chatKey === selectedChat.chatKey) || selectedChat
  }, [selectedChat, allChats])

  const formatTime = (ts) => new Date(ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  const formatDate = (ts) => new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  const getLastMessage = (chat) => {
    if (!chat.messages?.length) return 'No messages'
    const last = chat.messages[chat.messages.length - 1]
    return last.text?.length > 50 ? last.text.slice(0, 50) + '...' : last.text
  }

  // Unique events that have chats
  const chatEvents = useMemo(() => {
    const eventIds = new Set(allChats.map(c => c.eventId))
    return [...eventIds].map(id => {
      const chat = allChats.find(c => c.eventId === id)
      return { id, title: chat?.eventTitle || `Event #${id}` }
    })
  }, [allChats])

  const stats = useMemo(() => ({
    total: allChats.length,
    events: new Set(allChats.map(c => c.eventId)).size,
    messages: allChats.reduce((s, c) => s + (c.messages?.length || 0), 0),
    customers: new Set(allChats.map(c => c.userId)).size,
  }), [allChats])

  return (
    <div className="p-4 sm:p-6 md:p-8 h-[calc(100vh-0px)]">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-white m-0">Chat Monitor</h1>
        <p className="text-white/40 text-sm mt-1 m-0">Monitor all customer-organizer conversations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
        {[
          { label: 'Total Conversations', value: stats.total, color: '#8b5cf6' },
          { label: 'Events with Chats', value: stats.events, color: '#f97316' },
          { label: 'Total Messages', value: stats.messages, color: '#3b82f6' },
          { label: 'Unique Customers', value: stats.customers, color: '#10b981' },
        ].map(s => (
          <div key={s.label} className="rounded-xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="text-lg font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-white/30 text-[11px]">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Chat Interface */}
      <div className="rounded-2xl overflow-hidden flex" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', height: 'calc(100vh - 300px)', minHeight: 400 }}>
        {/* Chat List - hidden on mobile when chat selected */}
        <div className={`w-full sm:w-80 shrink-0 flex flex-col ${activeChatData ? 'hidden sm:flex' : 'flex'}`} style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}>
          {/* Search + Filter */}
          <div className="p-3 space-y-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="relative">
              <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search chats..."
                className="w-full bg-transparent text-white text-sm py-2 pl-9 pr-3 rounded-lg outline-none placeholder-white/30"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} />
            </div>
            {chatEvents.length > 0 && (
              <select value={eventFilter} onChange={e => setEventFilter(e.target.value)}
                className="w-full bg-transparent text-white text-xs py-2 px-3 rounded-lg outline-none cursor-pointer"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <option value="all" style={{ background: '#1a1a2e' }}>All Events</option>
                {chatEvents.map(ev => <option key={ev.id} value={ev.id} style={{ background: '#1a1a2e' }}>{ev.title}</option>)}
              </select>
            )}
          </div>

          {/* Chat List Items */}
          <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
            {filteredChats.length === 0 ? (
              <div className="text-center py-12 px-4">
                <IoChatbubbleEllipsesOutline className="text-3xl text-white/10 mx-auto mb-2" />
                <p className="text-white/30 text-sm m-0">{allChats.length === 0 ? 'No conversations yet' : 'No matching chats'}</p>
              </div>
            ) : (
              filteredChats.map(chat => {
                const isActive = activeChatData?.chatKey === chat.chatKey
                return (
                  <button key={chat.chatKey} onClick={() => setSelectedChat(chat)}
                    className={`w-full text-left p-3.5 flex items-start gap-3 border-none cursor-pointer transition-all ${
                      isActive ? 'bg-purple-500/10' : 'bg-transparent hover:bg-white/[0.03]'
                    }`} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 bg-gradient-to-br from-purple-500/20 to-indigo-600/20">
                      <IoPersonOutline className="text-purple-400 text-sm" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-medium truncate ${isActive ? 'text-purple-400' : 'text-white'}`}>{chat.userName || 'Customer'}</span>
                        <span className="text-white/20 text-[10px] shrink-0 ml-2">{formatDate(chat.updatedAt)}</span>
                      </div>
                      <div className="text-white/30 text-[11px] truncate mt-0.5">
                        <span className="text-purple-400/60">{chat.organizerName}</span> · {chat.eventTitle}
                      </div>
                      <div className="text-white/25 text-xs truncate mt-1">{getLastMessage(chat)}</div>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* Chat Viewer */}
        {activeChatData ? (
          <div className={`flex-1 flex-col min-w-0 ${activeChatData ? 'flex' : 'hidden sm:flex'}`}>
            {/* Chat Header */}
            <div className="flex items-center gap-3 px-5 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
              <button onClick={() => setSelectedChat(null)} className="sm:hidden w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white bg-transparent border-none cursor-pointer">
                <IoChevronBack />
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-indigo-600/20">
                    <IoPersonOutline className="text-purple-400 text-xs" />
                  </div>
                  <span className="text-white font-medium text-sm">{activeChatData.userName || 'Customer'}</span>
                  <span className="text-white/20 text-sm mx-1">↔</span>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center bg-gradient-to-br from-orange-500/20 to-orange-600/20">
                    <IoBusinessOutline className="text-orange-400 text-xs" />
                  </div>
                  <span className="text-white/60 text-sm">{activeChatData.organizerName || 'Organizer'}</span>
                </div>
                <div className="text-white/25 text-[11px] mt-0.5 ml-9">{activeChatData.eventTitle}</div>
              </div>
              <div className="flex items-center gap-1 text-white/20 text-[10px]">
                <IoTimeOutline /> {formatDate(activeChatData.updatedAt)}
              </div>
            </div>

            {/* Read-only info banner */}
            <div className="px-4 py-2 text-center" style={{ background: 'rgba(139,92,246,0.05)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <span className="text-purple-400/60 text-[11px]">👁 Monitoring Mode — View Only</span>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
              {activeChatData.messages?.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'organizer' ? 'justify-end' : 'justify-start'}`}>
                  <div className="max-w-[70%]">
                    <div className={`text-[10px] mb-1 ${msg.sender === 'organizer' ? 'text-right text-orange-400/40' : 'text-purple-400/40'}`}>
                      {msg.sender === 'organizer' ? 'Organizer' : activeChatData.userName || 'Customer'}
                    </div>
                    <div className="rounded-2xl px-4 py-2.5"
                      style={{
                        background: msg.sender === 'organizer' ? 'linear-gradient(135deg, rgba(249,115,22,0.2), rgba(234,88,12,0.2))' : 'rgba(255,255,255,0.06)',
                        border: msg.sender === 'organizer' ? '1px solid rgba(249,115,22,0.15)' : '1px solid rgba(255,255,255,0.06)',
                        borderBottomRightRadius: msg.sender === 'organizer' ? 4 : 16,
                        borderBottomLeftRadius: msg.sender === 'customer' ? 4 : 16,
                      }}>
                      <p className="text-white text-sm m-0 leading-relaxed">{msg.text}</p>
                      <p className="text-white/20 text-xs mt-1 m-0">{formatTime(msg.timestamp)}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Statistics Footer */}
            <div className="px-5 py-3 flex items-center justify-between text-[11px] text-white/20" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.01)' }}>
              <span>{activeChatData.messages?.length || 0} messages</span>
              <span>Started {formatDate(activeChatData.createdAt)}</span>
              <span>Last active {formatDate(activeChatData.updatedAt)}</span>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <IoChatbubbleEllipsesOutline className="text-5xl text-white/10 mx-auto mb-3" />
              <p className="text-white/30 text-sm m-0">Select a conversation to view</p>
              <p className="text-white/15 text-xs mt-1 m-0">Monitor customer-organizer communications</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AppAdminChats
