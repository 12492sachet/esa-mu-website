import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { orderService } from '../services/api'

// ─── Cart ─────────────────────────────────────────────────────────
export function CartPage() {
  const { items, removeItem, updateQty, total, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <main className="pt-28 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} strokeLinecap="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.61L23 6H6"/></svg>
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
          <p className="text-gray-500 text-sm mb-8">Add products from the marketplace to get started.</p>
          <Link to="/marketplace"
            className="inline-flex items-center gap-2 bg-gray-950 text-white px-8 py-4 font-mono text-xs uppercase tracking-wider hover:bg-crimson-800 transition-colors">
            Browse Marketplace
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl font-black text-gray-900 tracking-tight">Your Cart</h1>
          <button onClick={clearCart}
            className="font-mono text-[10px] uppercase tracking-wider text-gray-400 hover:text-crimson-700 transition-colors">
            Clear cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-px">
            {items.map(item => (
              <div key={item.product.id} className="bg-white p-5 flex gap-4">
                <div className="w-14 h-14 bg-gray-950 flex items-center justify-center flex-shrink-0">
                  {item.product.image_path
                    ? <img src={`/api/storage/uploads/${item.product.image_path}`} alt={item.product.name}
                        className="w-full h-full object-cover opacity-70" />
                    : <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.61L23 6H6"/></svg>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body font-semibold text-sm text-gray-900 mb-0.5 truncate">{item.product.name}</p>
                  <p className="font-mono text-[10px] text-gray-400 uppercase tracking-wider">{item.product.category_name}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center border border-gray-200">
                      <button onClick={() => updateQty(item.product.id, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors text-sm">−</button>
                      <span className="w-8 h-7 flex items-center justify-center font-mono text-xs border-x border-gray-200">{item.quantity}</span>
                      <button onClick={() => updateQty(item.product.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors text-sm">+</button>
                    </div>
                    <button onClick={() => removeItem(item.product.id)}
                      className="font-mono text-[10px] text-gray-400 hover:text-crimson-700 uppercase tracking-wider transition-colors">
                      Remove
                    </button>
                  </div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="font-display font-black text-base text-gray-900">
                    KES {(Number(item.product.price) * item.quantity).toLocaleString()}
                  </p>
                  <p className="font-mono text-[9px] text-gray-400 mt-1">@ {Number(item.product.price).toLocaleString()} ea</p>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-950 p-6 sticky top-24">
              <h3 className="font-display font-bold text-white text-base mb-5">Order Summary</h3>
              <div className="space-y-2 mb-4 pb-4 border-b border-gray-800">
                {items.map(item => (
                  <div key={item.product.id} className="flex justify-between font-mono text-[10px] text-gray-500">
                    <span className="truncate mr-2">{item.product.name} ×{item.quantity}</span>
                    <span className="flex-shrink-0">
                      {(Number(item.product.price) * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-baseline mb-6">
                <span className="font-mono text-xs text-gray-500 uppercase tracking-wider">Total (KES)</span>
                <span className="font-display font-black text-2xl text-white tracking-tight">
                  {total.toLocaleString()}
                </span>
              </div>
              <Link to="/marketplace/checkout"
                className="block w-full bg-crimson-800 text-white text-center font-mono text-xs uppercase tracking-wider py-4 hover:bg-crimson-700 transition-colors">
                Proceed to Checkout →
              </Link>
              <Link to="/marketplace"
                className="block w-full border border-gray-700 text-gray-500 text-center font-mono text-[10px] uppercase tracking-wider py-3 mt-3 hover:border-gray-500 hover:text-gray-300 transition-colors">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

// ─── Checkout ─────────────────────────────────────────────────────
type Stage = 'form' | 'pending' | 'success' | 'error'

export function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const navigate = useNavigate()
  const [name,    setName]    = useState('')
  const [phone,   setPhone]   = useState('')
  const [error,   setError]   = useState('')
  const [stage,   setStage]   = useState<Stage>('form')
  const [loading, setLoading] = useState(false)

  if (items.length === 0 && stage === 'form') {
    navigate('/marketplace/cart')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const cleaned = phone.replace(/\s+/g,'').replace(/^\+/,'').replace(/^0/,'254')
    if (!/^254\d{9}$/.test(cleaned)) {
      setError('Enter a valid Safaricom number e.g. 0712 345 678')
      return
    }
    setError('')
    setLoading(true)
    try {
      await orderService.create({
        name,
        phone_number: cleaned,
        items: items.map(i => ({ product_id: i.product.id, quantity: i.quantity })),
      })
      setStage('pending')
      clearCart()
      setTimeout(() => setStage('success'), 4000)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message || 'Order failed. Please try again.'
      setError(msg)
      setStage('error')
    } finally {
      setLoading(false)
    }
  }

  if (stage === 'pending') return (
    <main className="pt-28 min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-sm px-6">
        <div className="w-16 h-16 bg-emerald-600 flex items-center justify-center mx-auto mb-6">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
        <h2 className="font-display text-2xl font-bold text-gray-900 mb-3">STK Push Sent</h2>
        <p className="text-gray-500 text-sm leading-relaxed">
          Check your phone <strong className="text-gray-900">{phone}</strong> for the M-Pesa prompt. Enter your PIN to complete payment.
        </p>
      </div>
    </main>
  )

  if (stage === 'success') return (
    <main className="pt-28 min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-sm px-6">
        <div className="w-16 h-16 bg-emerald-600 flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h2 className="font-display text-2xl font-bold text-gray-900 mb-3">Payment Confirmed</h2>
        <p className="text-gray-500 text-sm mb-8">Your order has been placed. You will receive an M-Pesa confirmation SMS shortly.</p>
        <Link to="/marketplace"
          className="inline-flex items-center gap-2 bg-gray-950 text-white px-8 py-4 font-mono text-xs uppercase tracking-wider hover:bg-crimson-800 transition-colors">
          Continue Shopping
        </Link>
      </div>
    </main>
  )

  return (
    <main className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="font-display text-3xl font-black text-gray-900 tracking-tight mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-white p-7">
              <h2 className="font-display font-bold text-lg text-gray-900 mb-6">Payment Details</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-2">Full Name</label>
                  <input className="w-full border border-gray-200 px-4 py-3 text-sm font-body focus:outline-none focus:border-crimson-400 transition-colors"
                    placeholder="John Kamau" value={name} onChange={e => setName(e.target.value)} required />
                </div>
                <div>
                  <label className="block font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-2">Safaricom Phone Number</label>
                  <input className="w-full border border-gray-200 px-4 py-3 text-sm font-body focus:outline-none focus:border-crimson-400 transition-colors"
                    placeholder="0712 345 678" value={phone} onChange={e => setPhone(e.target.value)} required type="tel" />
                  {error && <p className="font-mono text-[10px] text-crimson-700 mt-2 uppercase tracking-wider">{error}</p>}
                  <p className="font-mono text-[10px] text-gray-400 mt-2 uppercase tracking-wider">You will receive an M-Pesa STK push to this number</p>
                </div>
                <div className="bg-emerald-950 border border-emerald-900 p-4 flex items-center gap-3">
                  <div className="w-9 h-9 bg-emerald-600 flex items-center justify-center flex-shrink-0 font-display font-black text-white text-sm">M</div>
                  <div>
                    <p className="font-mono text-xs text-emerald-400 uppercase tracking-wider font-semibold">Secure M-Pesa Payment</p>
                    <p className="font-mono text-[10px] text-emerald-700 mt-0.5">Powered by Safaricom Daraja API</p>
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full bg-emerald-700 text-white py-4 font-mono text-xs uppercase tracking-wider hover:bg-emerald-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                  {loading ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Processing...</>
                  ) : (
                    `Pay KES ${total.toLocaleString()} via M-Pesa →`
                  )}
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-gray-950 p-6">
              <h3 className="font-display font-bold text-white text-base mb-5">Order Summary</h3>
              <div className="space-y-2 mb-4 pb-4 border-b border-gray-800">
                {items.map(item => (
                  <div key={item.product.id} className="flex justify-between font-mono text-[10px] text-gray-500">
                    <span className="truncate mr-3">{item.product.name} ×{item.quantity}</span>
                    <span className="flex-shrink-0 text-gray-400">{(Number(item.product.price) * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-baseline">
                <span className="font-mono text-xs text-gray-500 uppercase tracking-wider">Total (KES)</span>
                <span className="font-display font-black text-2xl text-white tracking-tight">{total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
