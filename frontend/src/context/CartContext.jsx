import { createContext, useContext, useReducer, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

const EMPTY_CART = { items: [], total: 0 }
const GUEST_CART_KEY = 'tixflow_cart_guest'

function loadCartFromStorage(storageKey) {
  if (!storageKey) return EMPTY_CART
  try {
    const stored = localStorage.getItem(storageKey)
    return stored ? JSON.parse(stored) : EMPTY_CART
  } catch {
    return EMPTY_CART
  }
}

function saveCartToStorage(storageKey, state) {
  if (!storageKey) return
  try {
    localStorage.setItem(storageKey, JSON.stringify(state))
  } catch { /* silently fail */ }
}

function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

function cartReducer(state, action) {
  let newState

  switch (action.type) {
    case 'ADD_TICKET': {
      const existing = state.items.find(
        item => item.id === action.payload.id && item.itemType === 'ticket'
      )
      if (existing) {
        const items = state.items.map(item =>
          item.id === action.payload.id && item.itemType === 'ticket'
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        )
        newState = { ...state, items, total: calculateTotal(items) }
      } else {
        const items = [...state.items, { ...action.payload, itemType: 'ticket' }]
        newState = { ...state, items, total: calculateTotal(items) }
      }
      break
    }

    case 'ADD_MERCH': {
      const key = `${action.payload.id}-${action.payload.size || 'default'}-${action.payload.color || 'default'}`
      const existing = state.items.find(
        item => item.cartKey === key && item.itemType === 'merch'
      )
      if (existing) {
        const items = state.items.map(item =>
          item.cartKey === key && item.itemType === 'merch'
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        )
        newState = { ...state, items, total: calculateTotal(items) }
      } else {
        const items = [...state.items, { ...action.payload, cartKey: key, itemType: 'merch' }]
        newState = { ...state, items, total: calculateTotal(items) }
      }
      break
    }

    case 'UPDATE_QUANTITY': {
      const items = state.items.map(item => {
        const matchKey = action.payload.cartKey || action.payload.id
        const itemKey = item.cartKey || item.id
        if (itemKey === matchKey && item.itemType === action.payload.itemType) {
          return { ...item, quantity: Math.max(0, action.payload.quantity) }
        }
        return item
      }).filter(item => item.quantity > 0)
      newState = { ...state, items, total: calculateTotal(items) }
      break
    }

    case 'REMOVE_ITEM': {
      const matchKey = action.payload.cartKey || action.payload.id
      const items = state.items.filter(item => {
        const itemKey = item.cartKey || item.id
        return !(itemKey === matchKey && item.itemType === action.payload.itemType)
      })
      newState = { ...state, items, total: calculateTotal(items) }
      break
    }

    case 'CLEAR_CART':
      newState = { items: [], total: 0 }
      break

    case 'REMOVE_SELECTED_ITEMS': {
      const selectedKeys = new Set(action.payload)
      const items = state.items.filter((item) => {
        const itemKey = item.cartKey || `${item.itemType}-${item.id}`
        return !selectedKeys.has(itemKey)
      })
      newState = { ...state, items, total: calculateTotal(items) }
      break
    }

    case 'SET_STATE':
      newState = action.payload
      break

    default:
      return state
  }

  return newState
}

export function CartProvider({ children }) {
  const { user, isAuthenticated } = useAuth()
  const storageKey = isAuthenticated && user?.id ? `tixflow_cart_${user.id}` : GUEST_CART_KEY
  const [state, dispatch] = useReducer(cartReducer, EMPTY_CART)
  const [hydratedKey, setHydratedKey] = useState(null)

  useEffect(() => {
    const userCart = loadCartFromStorage(storageKey)

    // When user logs in, migrate guest cart once if user cart is still empty.
    if (storageKey !== GUEST_CART_KEY && userCart.items.length === 0) {
      const guestCart = loadCartFromStorage(GUEST_CART_KEY)
      if (guestCart.items.length > 0) {
        dispatch({ type: 'SET_STATE', payload: guestCart })
        saveCartToStorage(storageKey, guestCart)
        localStorage.removeItem(GUEST_CART_KEY)
        setHydratedKey(storageKey)
        return
      }
    }

    dispatch({ type: 'SET_STATE', payload: userCart })
    setHydratedKey(storageKey)
  }, [storageKey])

  useEffect(() => {
    if (hydratedKey !== storageKey) return
    saveCartToStorage(storageKey, state)
  }, [storageKey, state, hydratedKey])

  const addTicket = (ticket) => dispatch({ type: 'ADD_TICKET', payload: ticket })
  const addMerch = (merch) => dispatch({ type: 'ADD_MERCH', payload: merch })
  const updateQuantity = (id, itemType, quantity, cartKey) =>
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, itemType, quantity, cartKey } })
  const removeItem = (id, itemType, cartKey) =>
    dispatch({ type: 'REMOVE_ITEM', payload: { id, itemType, cartKey } })
  const clearCart = () => dispatch({ type: 'CLEAR_CART' })
  const removeSelectedItems = (selectedItems) => dispatch({
    type: 'REMOVE_SELECTED_ITEMS',
    payload: selectedItems.map((item) => item.cartKey || `${item.itemType}-${item.id}`),
  })

  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider value={{
      items: state.items,
      total: state.total,
      itemCount,
      addTicket,
      addMerch,
      updateQuantity,
      removeItem,
      clearCart,
      removeSelectedItems,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}
