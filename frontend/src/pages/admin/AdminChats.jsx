import { useState, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoChatbubbleEllipsesOutline, IoSearchOutline, IoSendSharp, IoChevronBack, IoPersonOutline, IoTimeOutline } from 'react-icons/io5'
import { useAuth } from '../../context/AuthContext'

function AdminChats() {
  const { getMyEvents, chats, sendAdminReply, getAllUsers } = useAuth()
  const myEvents = getMyEvents()
  const [search, setSearch] = useState('')
  const [selectedChat, setSelectedChat] = useState(null)
  const [replyText, setReplyText] = useState('')
  const messagesEndRef = useRef(null)

  const myEventIds = useMemo(() => new Set(myEvents.map(e => e.id)), [myEvents])

  // Get all chats related to my events
  const myChats = useMemo(() => {
    return chats
      .filter(c => myEventIds.has(c.eventId) || myEventIds.has(Number(c.eventId)))
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
  }, [chats, myEventIds])

  const filteredChats = useMemo(() => {
    if (!search.trim()) return myChats
    const q = search.toLowerCase()
    return myChats.filter(c =>
      c.userName?.toLowerCase().includes(q) ||
      c.eventTitle?.toLowerCase().includes(q) ||
      c.messages?.some(m => m.text?.toLowerCase().includes(q))
    )
  }, [myChats, search])

  // Auto-scroll when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [selectedChat, chats])

  // Refresh selected chat data when chats change
  const activeChatData = useMemo(() => {
    if (!selectedChat) return null
    return chats.find(c => c.chatKey === selectedChat.chatKey) || selectedChat
  }, [selectedChat, chats])

  const handleSendReply = () => {
    const text = replyText.trim()
    if (!text || !activeChatData) return
    sendAdminReply(activeChatData.chatKey, text)
    setReplyText('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendReply()
    }
  }

  const formatTime = (ts) => new Date(ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  const formatDate = (ts) => new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  const getLastMessage = (chat) => {
    if (!chat.messages?.length) return 'No messages'
    const last = chat.messages[chat.messages.length - 1]
    return last.text?.length > 50 ? last.text.slice(0, 50) + '...' : last.text
  }

  const getUnreadCount = (chat) => {
    // Count customer messages after the last organizer message
    const msgs = chat.messages || []
    let lastOrgIdx = -1
    for (let i = msgs.length - 1; i >= 0; i--) {
      if (msgs[i].sender === 'organizer') { lastOrgIdx = i; break }
    }
    return msgs.filter((m, i) => i > lastOrgIdx && m.sender === 'customer').length
  }

  const stats = useMemo(() => ({
    total: myChats.length,
    active: myChats.filter(c => {
      const last = c.messages?.[c.messages.length - 1]
      return last?.sender === 'customer'
    }).length,
    messages: myChats.reduce((s, c) => s + (c.messages?.length || 0), 0),
  }), [myChats])

  return (
    <div className="p-4 sm:p-6 md:p-8 h-[calc(100vh-0px)]">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-white m-0">Customer Chats</h1>
        <p className="text-white/40 text-sm mt-1 m-0">Reply to messages from your event customers</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
        {[
          { label: 'Total Conversations', value: stats.total, color: '#f97316' },
          { label: 'Awaiting Reply', value: stats.active, color: '#eab308' },
          { label: 'Total Messages', value: stats.messages, color: '#3b82f6' },
        ].map(s => (
          <div key={s.label} className="rounded-xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="text-lg font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-white/30 text-[11px]">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Chat Interface */}
      <div className="rounded-2xl overflow-hidden flex" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', height: 'calc(100vh - 280px)', minHeight: 400 }}>
        {/* Chat List - hidden on mobile when chat selected */}
        <div className={`w-full sm:w-80 shrink-0 flex flex-col ${activeChatData ? 'hidden sm:flex' : 'flex'}`} style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}>
          {/* Search */}
          <div className="p-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="relative">
              <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search chats..."
                className="w-full bg-transparent text-white text-sm py-2 pl-9 pr-3 rounded-lg outline-none placeholder-white/30"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} />
            </div>
          </div>

          {/* Chat List Items */}
          <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
            {filteredChats.length === 0 ? (
              <div className="text-center py-12 px-4">
                <IoChatbubbleEllipsesOutline className="text-3xl text-white/10 mx-auto mb-2" />
                <p className="text-white/30 text-sm m-0">{myChats.length === 0 ? 'No chats yet' : 'No matching chats'}</p>
              </div>
            ) : (
              filteredChats.map(chat => {
                const unread = getUnreadCount(chat)
                const isActive = activeChatData?.chatKey === chat.chatKey
                return (
                  <button key={chat.chatKey} onClick={() => setSelectedChat(chat)}
                    className={`w-full text-left p-3.5 flex items-start gap-3 border-none cursor-pointer transition-all ${
                      isActive ? 'bg-orange-500/10' : 'bg-transparent hover:bg-white/[0.03]'
                    }`} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 bg-gradient-to-br from-orange-500/20 to-orange-600/20">
                      <IoPersonOutline className="text-orange-400 text-sm" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-medium truncate ${isActive ? 'text-orange-400' : 'text-white'}`}>{chat.userName || 'Customer'}</span>
                        <span className="text-white/20 text-[10px] shrink-0 ml-2">{formatDate(chat.updatedAt)}</span>
                      </div>
                      <div className="text-white/30 text-[11px] truncate mt-0.5">{chat.eventTitle}</div>
                      <div className="text-white/25 text-xs truncate mt-1">{getLastMessage(chat)}</div>
                    </div>
                    {unread > 0 && (
                      <span className="w-5 h-5 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{unread}</span>
                    )}
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* Chat Window */}
        {activeChatData ? (
          <div className={`flex-1 flex-col min-w-0 ${activeChatData ? 'flex' : 'hidden sm:flex'}`}>
            {/* Chat Header */}
            <div className="flex items-center gap-3 px-5 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
              <button onClick={() => setSelectedChat(null)} className="sm:hidden w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white bg-transparent border-none cursor-pointer">
                <IoChevronBack />
              </button>
              <div className="w-9 h-9 rounded-full flex items-center justify-center bg-gradient-to-br from-orange-500/20 to-orange-600/20">
                <IoPersonOutline className="text-orange-400 text-sm" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-medium text-sm">{activeChatData.userName || 'Customer'}</div>
                <div className="text-white/30 text-[11px] truncate">{activeChatData.eventTitle}</div>
              </div>
              <div className="flex items-center gap-1 text-white/20 text-[10px]">
                <IoTimeOutline />
                {formatDate(activeChatData.updatedAt)}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
              {activeChatData.messages?.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'organizer' ? 'justify-end' : 'justify-start'}`}>
                  <div className="max-w-[70%] rounded-2xl px-4 py-2.5"
                    style={{
                      background: msg.sender === 'organizer' ? 'linear-gradient(135deg, #f97316, #ea580c)' : 'rgba(255,255,255,0.08)',
                      borderBottomRightRadius: msg.sender === 'organizer' ? 4 : 16,
                      borderBottomLeftRadius: msg.sender === 'customer' ? 4 : 16,
                    }}>
                    <p className="text-white text-sm m-0 leading-relaxed">{msg.text}</p>
                    <p className={`text-xs mt-1 m-0 ${msg.sender === 'organizer' ? 'text-white/60' : 'text-white/30'}`}>{formatTime(msg.timestamp)}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Reply Input */}
            <div className="p-3" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center gap-2">
                <input type="text" value={replyText} onChange={e => setReplyText(e.target.value)} onKeyDown={handleKeyDown}
                  placeholder="Type your reply..."
                  className="flex-1 bg-transparent text-white text-sm py-3 px-4 rounded-xl outline-none placeholder-white/30"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }} />
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={handleSendReply} disabled={!replyText.trim()}
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-white cursor-pointer border-none transition-opacity"
                  style={{ background: replyText.trim() ? 'linear-gradient(135deg, #f97316, #ea580c)' : 'rgba(255,255,255,0.06)', opacity: replyText.trim() ? 1 : 0.5 }}>
                  <IoSendSharp />
                </motion.button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <IoChatbubbleEllipsesOutline className="text-5xl text-white/10 mx-auto mb-3" />
              <p className="text-white/30 text-sm m-0">Select a conversation to start replying</p>
              <p className="text-white/15 text-xs mt-1 m-0">Customer messages will appear here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminChats
