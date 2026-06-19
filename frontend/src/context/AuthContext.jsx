import { createContext, useContext, useState, useEffect } from 'react'
import { apiFetch, setToken, getToken } from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [publicEvents, setPublicEvents] = useState([])
  const [adminEvents, setAdminEvents] = useState([])
  const [orders, setOrders] = useState([])
  const [categories, setCategories] = useState([])
  const [vouchers, setVouchers] = useState([])
  const [refunds, setRefunds] = useState([])
  const [chats, setChats] = useState([])
  const [allUsers, setAllUsers] = useState([])

  // ─── Initialization ───
  useEffect(() => {
    const init = async () => {
      try {
        const [cats, events] = await Promise.all([
          apiFetch('/categories').catch(() => []),
          apiFetch('/events').catch(() => []),
        ])
        const fallbackCategories = Array.from(
          new Set((events || []).map(e => e.category).filter(Boolean))
        ).map((name, idx) => ({
          id: `fallback-${idx}`,
          name,
          icon: 'IoSparkles',
          gradient: 'linear-gradient(135deg, #f97316, #ea580c)',
        }))

        setCategories(Array.isArray(cats) && cats.length > 0 ? cats : fallbackCategories)
        setPublicEvents(events)

        const token = getToken()
        if (token) {
          try {
            const userData = await apiFetch('/auth/me')
            setUser(userData)
            await loadUserData(userData)
          } catch {
            setToken(null)
          }
        }
      } catch (e) {
        console.error('Init error:', e)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  const loadUserData = async (u) => {
    const isAdmin = u.role === 'event_admin' || u.role === 'app_admin'
    const [ordersData, vouchersData, refundsData, chatsData] = await Promise.all([
      apiFetch(isAdmin ? '/orders' : '/orders/my-orders').catch(() => []),
      apiFetch('/vouchers').catch(() => []),
      apiFetch('/refunds').catch(() => []),
      apiFetch(isAdmin ? '/chats/all' : '/chats/my-chats').catch(() => []),
    ])
    setOrders(ordersData)
    setVouchers(vouchersData)
    setRefunds(refundsData)
    setChats(chatsData)

    if (isAdmin) {
      const events = await apiFetch('/events/admin/my-events').catch(() => [])
      setAdminEvents(events)
    }
    if (u.role === 'app_admin') {
      const users = await apiFetch('/users').catch(() => [])
      setAllUsers(users)
    }
  }

  // ─── Auth Functions ───
  const register = async (userData) => {
    try {
      const data = await apiFetch('/auth/register', { method: 'POST', body: userData })
      setToken(data.token)
      setUser(data.user)
      await loadUserData(data.user)
      return { success: true }
    } catch (err) {
      return { success: false, message: err.message }
    }
  }

  const login = async (email, password) => {
    try {
      const data = await apiFetch('/auth/login', { method: 'POST', body: { email, password } })
      setToken(data.token)
      setUser(data.user)
      await loadUserData(data.user)
      return { success: true }
    } catch (err) {
      return { success: false, message: err.message }
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    setOrders([])
    setAdminEvents([])
    setVouchers([])
    setRefunds([])
    setChats([])
    setAllUsers([])
  }

  // ─── Order Functions ───
  const addOrder = async (orderData) => {
    const data = await apiFetch('/orders', { method: 'POST', body: orderData })
    setOrders(prev => [data, ...prev])
    return data
  }

  const getUserOrders = () => {
    if (!user) return []
    return orders.filter(o => Number(o.userId) === Number(user.id))
  }

  const getEventOrders = (eventId) => {
    return orders.filter(o =>
      o.items?.some(item => Number(item.eventId) === Number(eventId))
    )
  }

  const getAllOrders = () => orders

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await apiFetch(`/orders/${orderId}/status`, { method: 'PUT', body: { status: newStatus } })
      setOrders(prev => prev.map(o =>
        (o.id === orderId || o.orderId === orderId) ? { ...o, status: newStatus } : o
      ))
    } catch (err) {
      console.error('Update order status error:', err)
    }
  }

  // ─── Event Admin Functions ───
  const addAdminEvent = async (eventData) => {
    const data = await apiFetch('/events', { method: 'POST', body: eventData })
    setAdminEvents(prev => [data, ...prev])
    if (data.status === 'published') {
      setPublicEvents(prev => [...prev, data])
    }
    return data
  }

  const updateAdminEvent = async (eventId, eventData) => {
    try {
      const data = await apiFetch(`/events/${eventId}`, { method: 'PUT', body: eventData })
      setAdminEvents(prev => prev.map(e => Number(e.id) === Number(eventId) ? data : e))
      setPublicEvents(prev => {
        const idx = prev.findIndex(e => Number(e.id) === Number(eventId))
        if (data.status === 'published') {
          return idx >= 0 ? prev.map(e => Number(e.id) === Number(eventId) ? data : e) : [...prev, data]
        }
        return idx >= 0 ? prev.filter(e => Number(e.id) !== Number(eventId)) : prev
      })
    } catch (err) {
      console.error('Update event error:', err)
    }
  }

  const deleteAdminEvent = async (eventId) => {
    try {
      await apiFetch(`/events/${eventId}`, { method: 'DELETE' })
      setAdminEvents(prev => prev.filter(e => Number(e.id) !== Number(eventId)))
      setPublicEvents(prev => prev.filter(e => Number(e.id) !== Number(eventId)))
    } catch (err) {
      console.error('Delete event error:', err)
    }
  }

  const getMyEvents = () => adminEvents
  const getAllAdminEvents = () => adminEvents

  // ─── User Functions (app_admin) ───
  const getAllUsers = () => allUsers

  const updateUserRole = async (userId, newRole) => {
    try {
      await apiFetch(`/users/${userId}/role`, { method: 'PUT', body: { role: newRole } })
      setAllUsers(prev => prev.map(u => Number(u.id) === Number(userId) ? { ...u, role: newRole } : u))
      if (Number(user?.id) === Number(userId)) setUser(prev => ({ ...prev, role: newRole }))
    } catch (err) {
      console.error('Update user role error:', err)
    }
  }

  const toggleUserStatus = async (userId) => {
    try {
      const result = await apiFetch(`/users/${userId}/toggle-status`, { method: 'PUT' })
      setAllUsers(prev => prev.map(u => Number(u.id) === Number(userId) ? { ...u, isActive: result.isActive } : u))
    } catch (err) {
      console.error('Toggle user status error:', err)
    }
  }

  const deleteUser = async (userId) => {
    try {
      await apiFetch(`/users/${userId}`, { method: 'DELETE' })
      setAllUsers(prev => prev.filter(u => Number(u.id) !== Number(userId)))
    } catch (err) {
      console.error('Delete user error:', err)
    }
  }

  // ─── Category Functions ───
  const getCategories = () => categories

  const addCategory = async (categoryData) => {
    try {
      const data = await apiFetch('/categories', { method: 'POST', body: categoryData })
      setCategories(prev => [...prev, data])
      return data
    } catch (err) {
      console.error('Add category error:', err)
    }
  }

  const updateCategory = async (catId, data) => {
    try {
      const result = await apiFetch(`/categories/${catId}`, { method: 'PUT', body: data })
      setCategories(prev => prev.map(c => Number(c.id) === Number(catId) ? result : c))
    } catch (err) {
      console.error('Update category error:', err)
    }
  }

  const deleteCategory = async (catId) => {
    try {
      await apiFetch(`/categories/${catId}`, { method: 'DELETE' })
      setCategories(prev => prev.filter(c => Number(c.id) !== Number(catId)))
    } catch (err) {
      console.error('Delete category error:', err)
    }
  }

  // ─── Voucher Functions ───
  const validateVoucher = async (code, orderTotal, eventIds = []) => {
    try {
      return await apiFetch('/vouchers/validate', { method: 'POST', body: { code, orderTotal, eventIds } })
    } catch (err) {
      return { valid: false, message: err.message }
    }
  }

  const useVoucher = async (code, orderId, discountAmount) => {
    try {
      await apiFetch('/vouchers/use', { method: 'POST', body: { code, orderId, discountAmount } })
      setVouchers(prev => prev.map(v =>
        v.code === code.toUpperCase() ? { ...v, usedCount: (v.usedCount || 0) + 1 } : v
      ))
    } catch (err) {
      console.error('Use voucher error:', err)
    }
  }

  const addVoucher = async (voucherData) => {
    try {
      const data = await apiFetch('/vouchers', { method: 'POST', body: voucherData })
      setVouchers(prev => [...prev, data])
      return { success: true }
    } catch (err) {
      return { success: false, message: err.message }
    }
  }

  const updateVoucher = async (code, updates) => {
    try {
      const v = vouchers.find(v => v.code === code)
      if (!v) return
      const data = await apiFetch(`/vouchers/${v.id}`, { method: 'PUT', body: updates })
      setVouchers(prev => prev.map(v => v.code === code ? data : v))
    } catch (err) {
      console.error('Update voucher error:', err)
    }
  }

  const deleteVoucher = async (code) => {
    try {
      const v = vouchers.find(v => v.code === code)
      if (!v) return
      await apiFetch(`/vouchers/${v.id}`, { method: 'DELETE' })
      setVouchers(prev => prev.filter(v => v.code !== code))
    } catch (err) {
      console.error('Delete voucher error:', err)
    }
  }

  // ─── Discount Functions ───
  const setEventDiscount = async (eventId, discount) => {
    try {
      await apiFetch(`/events/${eventId}/discount`, { method: 'POST', body: discount })
      setAdminEvents(prev => prev.map(e =>
        Number(e.id) === Number(eventId) ? { ...e, discount } : e
      ))
      setPublicEvents(prev => prev.map(e =>
        Number(e.id) === Number(eventId) ? { ...e, discount } : e
      ))
    } catch (err) {
      console.error('Set discount error:', err)
    }
  }

  const removeEventDiscount = async (eventId) => {
    try {
      await apiFetch(`/events/${eventId}/discount`, { method: 'DELETE' })
      const removeDiscount = e => {
        if (Number(e.id) === Number(eventId)) {
          const { discount, ...rest } = e
          return rest
        }
        return e
      }
      setAdminEvents(prev => prev.map(removeDiscount))
      setPublicEvents(prev => prev.map(removeDiscount))
    } catch (err) {
      console.error('Remove discount error:', err)
    }
  }

  // ─── Refund Functions ───
  const requestRefund = async (orderId, reason, itemId) => {
    try {
      const result = await apiFetch('/refunds', { method: 'POST', body: { orderId, reason, itemId } })
      if (result.refund) setRefunds(prev => [result.refund, ...prev])
      return result
    } catch (err) {
      return { success: false, message: err.message }
    }
  }

  const getRefundByOrderId = (orderId) => {
    return refunds.filter(r => r.orderId === orderId)
  }

  const getAllRefunds = () => refunds

  const updateRefundStatus = async (refundId, newStatus) => {
    try {
      const data = await apiFetch(`/refunds/${refundId}/process`, { method: 'PUT', body: { status: newStatus } })
      setRefunds(prev => prev.map(r => r.id === refundId ? data : r))
      if (newStatus === 'approved') {
        const refund = data || refunds.find(r => r.id === refundId)
        if (refund) {
          setOrders(prev => prev.map(o => {
            if (o.id !== refund.orderId) return o

            const items = (o.items || []).map(item =>
              Number(item.id) === Number(refund.itemId) ? { ...item, refundStatus: 'approved' } : item
            )
            const allRefunded = items.length > 0 && items.every(item => item.refundStatus === 'approved')
            return {
              ...o,
              items,
              status: allRefunded ? 'refunded' : o.status,
            }
          }))
        }
      }
    } catch (err) {
      console.error('Update refund status error:', err)
    }
  }

  // ─── Chat Functions ───
  const sendMessage = async (eventId, eventTitle, organizerName, messageText) => {
    try {
      const data = await apiFetch('/chats/send', {
        method: 'POST',
        body: { eventId, eventTitle, organizerName, message: messageText },
      })
      setChats(prev => {
        const idx = prev.findIndex(c => c.chatKey === data.chatKey)
        if (idx >= 0) return prev.map((c, i) => i === idx ? data : c)
        return [...prev, data]
      })
    } catch (err) {
      console.error('Send message error:', err)
    }
  }

  const getChatMessages = (eventId) => {
    if (!user) return []
    const chatKey = `${user.id}-${eventId}`
    const chat = chats.find(c => c.chatKey === chatKey)
    return chat ? chat.messages : []
  }

  const getUserChats = () => {
    if (!user) return []
    return chats.filter(c => Number(c.userId) === Number(user.id))
  }

  const sendAdminReply = async (chatKey, messageText) => {
    try {
      const data = await apiFetch(`/chats/${chatKey}/reply`, {
        method: 'POST',
        body: { message: messageText },
      })
      setChats(prev => {
        const idx = prev.findIndex(c => c.chatKey === chatKey)
        if (idx >= 0) return prev.map((c, i) => i === idx ? data : c)
        return [...prev, data]
      })
    } catch (err) {
      console.error('Send admin reply error:', err)
    }
  }

  const getEventChats = (eventId) => {
    return chats.filter(c => Number(c.eventId) === Number(eventId))
  }

  const getAllChats = () => chats

  // ─── Loading State ───
  if (loading) {
    return (
      <div className="bg-[#0B0D1A] min-h-screen flex items-center justify-center">
        <div className="text-white/50 text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      loading,
      register,
      login,
      logout,
      // Events
      publicEvents,
      allEvents: publicEvents,
      adminEvents,
      addAdminEvent,
      updateAdminEvent,
      deleteAdminEvent,
      getMyEvents,
      getAllAdminEvents,
      // Orders
      addOrder,
      getUserOrders,
      orders,
      getEventOrders,
      getAllOrders,
      updateOrderStatus,
      // Users
      getAllUsers,
      updateUserRole,
      toggleUserStatus,
      deleteUser,
      // Categories
      categories,
      getCategories,
      addCategory,
      updateCategory,
      deleteCategory,
      // Vouchers
      validateVoucher,
      useVoucher,
      addVoucher,
      updateVoucher,
      deleteVoucher,
      vouchers,
      // Discounts
      setEventDiscount,
      removeEventDiscount,
      // Refunds
      requestRefund,
      getRefundByOrderId,
      getAllRefunds,
      updateRefundStatus,
      refunds,
      // Chat
      sendMessage,
      getChatMessages,
      getUserChats,
      sendAdminReply,
      getEventChats,
      getAllChats,
      chats,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
