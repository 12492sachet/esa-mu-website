import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { CartItem, Product } from '../types'

interface CartContextType {
  items: CartItem[]
  addItem: (product: Product, qty?: number) => void
  removeItem: (productId: number) => void
  updateQty: (productId: number, qty: number) => void
  clearCart: () => void
  total: number
  itemCount: number
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('esamu_cart')
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })

  const save = (newItems: CartItem[]) => {
    setItems(newItems)
    localStorage.setItem('esamu_cart', JSON.stringify(newItems))
  }

  const addItem = useCallback((product: Product, qty = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id)
      const updated = existing
        ? prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + qty } : i)
        : [...prev, { product, quantity: qty }]
      localStorage.setItem('esamu_cart', JSON.stringify(updated))
      return updated
    })
  }, [])

  const removeItem = useCallback((productId: number) => {
    setItems(prev => {
      const updated = prev.filter(i => i.product.id !== productId)
      localStorage.setItem('esamu_cart', JSON.stringify(updated))
      return updated
    })
  }, [])

  const updateQty = useCallback((productId: number, qty: number) => {
    if (qty <= 0) { removeItem(productId); return }
    setItems(prev => {
      const updated = prev.map(i => i.product.id === productId ? { ...i, quantity: qty } : i)
      localStorage.setItem('esamu_cart', JSON.stringify(updated))
      return updated
    })
  }, [removeItem])

  const clearCart = useCallback(() => {
    save([])
  }, [])

  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be inside CartProvider')
  return ctx
}
