import { createContext, useContext, useReducer, useEffect } from 'react'

const CartContext = createContext()

const STORAGE_KEY = 'industrialdirect_cart'

function loadCart() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch { return [] }
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existing = state.find(item => item._id === action.payload._id)
      if (existing) {
        return state.map(item =>
          item._id === action.payload._id
            ? { ...item, qty: item.qty + (action.payload.qty || 1) }
            : item
        )
      }
      return [...state, { ...action.payload, qty: action.payload.qty || 1 }]
    }
    case 'REMOVE_FROM_CART':
      return state.filter(item => item._id !== action.payload)
    case 'UPDATE_QUANTITY':
      return state.map(item =>
        item._id === action.payload.id
          ? { ...item, qty: Math.max(1, action.payload.qty) }
          : item
      )
    case 'CLEAR_CART':
      return []
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [cartItems, dispatch] = useReducer(cartReducer, [], loadCart)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (product, qty = 1) => dispatch({ type: 'ADD_TO_CART', payload: { ...product, qty } })
  const removeFromCart = (id) => dispatch({ type: 'REMOVE_FROM_CART', payload: id })
  const updateQuantity = (id, qty) => dispatch({ type: 'UPDATE_QUANTITY', payload: { id, qty } })
  const clearCart = () => dispatch({ type: 'CLEAR_CART' })

  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0)
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price || 0) * item.qty, 0)

  return (
    <CartContext.Provider value={{ cartItems, cartCount, cartTotal, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be inside CartProvider')
  return ctx
}
