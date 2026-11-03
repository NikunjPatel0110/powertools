import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useCart } from '../context/CartContext'
import { api } from '../api'

export default function Cart() {
  const { cartItems, cartTotal, removeFromCart, updateQuantity, clearCart } = useCart()
  const [checkoutStep, setCheckoutStep] = useState('cart') // 'cart', 'form', 'success'
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })

  const handleProceed = () => {
    setCheckoutStep('form')
  }

  const handleEnquiry = async (e) => {
    e.preventDefault()
    const cartDetails = cartItems.map(item => `${item.qty}x ${item.name} (SKU: ${item.slug || 'N/A'})`).join('\n')
    const fullMessage = `${form.message}\n\nCart Items:\n${cartDetails}`

    try {
      await api.createEnquiry({
        ...form,
        message: fullMessage,
        product: cartItems[0]?._id // Link to the first product so it shows up in Admin
      })
      clearCart()
      setCheckoutStep('success')
    } catch (err) {
      console.error(err)
    }
  }

  if (checkoutStep === 'success') {
    return (
      <>
        <Navbar />
        <main className="container" style={{ paddingTop: 96, paddingBottom: 40, minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 72, color: 'var(--primary)', marginBottom: 16 }}>check_circle</span>
          <h1 className="headline-lg" style={{ marginBottom: 8, textAlign: 'center' }}>Enquiry Submitted</h1>
          <p className="body-lg" style={{ color: 'var(--secondary)', marginBottom: 24, textAlign: 'center', maxWidth: 480 }}>
            Your enquiry has been received. Our procurement team will contact you within 24 hours with a detailed quote.
          </p>
          <Link to="/products" className="btn-primary" style={{ minHeight: 44 }}>Continue Browsing</Link>
        </main>
        <Footer />
      </>
    )
  }

  if (checkoutStep === 'form') {
    return (
      <>
        <Navbar />
        <main className="container" style={{ paddingTop: 96, paddingBottom: 40 }}>
          <div className="breadcrumb">
            <Link to="/">Home</Link><span>/</span>
            <button
              type="button"
              onClick={() => setCheckoutStep('cart')}
              style={{ background: 'none', border: 'none', color: 'var(--secondary)', cursor: 'pointer', padding: 0, font: 'inherit', minHeight: 44, display: 'inline-flex', alignItems: 'center' }}
            >
              Cart
            </button>
            <span>/</span>
            <span style={{ color: 'var(--on-surface)', fontWeight: 600 }}>Checkout</span>
          </div>

          <div className="enquiry-form" style={{ maxWidth: 600, margin: '0 auto' }}>
            <h3 className="headline-md">Request Technical Quote</h3>
            <form onSubmit={handleEnquiry}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label>Full Name</label>
                  <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your Name" />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="email@company.com" />
                </div>
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+1 (555) 000-0000" />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea rows={4} required value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Any specific requirements..."></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3" style={{ marginTop: 24 }}>
                <button type="submit" className="btn-primary" style={{ width: '100%', minHeight: 44, textAlign: 'center' }}>Submit Enquiry</button>
                <button type="button" className="btn-ghost" style={{ width: '100%', minHeight: 44, textAlign: 'center' }} onClick={() => setCheckoutStep('cart')}>Back to Cart</button>
              </div>
            </form>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (cartItems.length === 0) {
    return (
      <>
        <Navbar />
        <main className="container" style={{ paddingTop: 96, paddingBottom: 40, minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 72, color: 'var(--tertiary)', marginBottom: 16 }}>shopping_cart</span>
          <h1 className="headline-lg" style={{ marginBottom: 8, textAlign: 'center' }}>Your Cart is Empty</h1>
          <p className="body-md" style={{ color: 'var(--secondary)', marginBottom: 24, textAlign: 'center' }}>Browse our catalog and add items to get started.</p>
          <Link to="/products" className="btn-primary" style={{ minHeight: 44 }}>Shop the Catalog</Link>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="container" style={{ paddingTop: 96, paddingBottom: 40 }}>
        <div className="breadcrumb">
          <Link to="/">Home</Link><span>/</span>
          <span style={{ color: 'var(--on-surface)', fontWeight: 600 }}>Cart</span>
        </div>

        <div className="section-header">
          <h1 className="headline-lg">Your Cart</h1>
          <span className="body-sm" style={{ color: 'var(--secondary)' }}>{cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</span>
        </div>

        <div className="cart-layout">
          {/* Main items section: Desktop Table & Mobile Stacked Cards */}
          <div>
            {/* Desktop / Tablet Table (md and up) */}
            <div className="hidden md:block cart-table-wrap" style={{ border: '1px solid var(--outline-variant)', background: '#fff' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Unit Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map(item => {
                    const imgUrl = item.images?.[0] || ''
                    const subtotal = (item.price || 0) * item.qty
                    return (
                      <tr key={item._id}>
                        <td>
                          <div className="cart-product-cell">
                            <div className="cart-product-img">
                              {imgUrl ? (
                                <img src={imgUrl} alt={item.name} />
                              ) : (
                                <span className="material-symbols-outlined" style={{ fontSize: 32, color: 'var(--tertiary)' }}>build</span>
                              )}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600 }}>{item.name}</div>
                              <div className="data-mono" style={{ color: 'var(--secondary)', marginTop: 2 }}>SKU: {item.slug || 'N/A'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="data-mono">{item.price ? `$${item.price.toFixed(2)}` : 'Enquiry'}</td>
                        <td>
                          <div className="qty-selector">
                            <button type="button" onClick={() => updateQuantity(item._id, item.qty - 1)} disabled={item.qty <= 1} aria-label="Decrease quantity">−</button>
                            <input
                              type="number"
                              min="1"
                              value={item.qty}
                              onChange={e => updateQuantity(item._id, parseInt(e.target.value) || 1)}
                              aria-label="Quantity"
                            />
                            <button type="button" onClick={() => updateQuantity(item._id, item.qty + 1)} aria-label="Increase quantity">+</button>
                          </div>
                        </td>
                        <td className="data-mono" style={{ fontWeight: 700 }}>${subtotal.toFixed(2)}</td>
                        <td>
                          <button
                            type="button"
                            className="cart-remove-btn"
                            onClick={() => removeFromCart(item._id)}
                            title="Remove"
                            aria-label={`Remove ${item.name} from cart`}
                          >
                            <span className="material-symbols-outlined">delete</span>
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Stacked Cards (below md) */}
            <div className="md:hidden">
              {cartItems.map(item => {
                const imgUrl = item.images?.[0] || ''
                const subtotal = (item.price || 0) * item.qty
                return (
                  <div className="cart-card-item" key={item._id}>
                    <div className="cart-card-header">
                      <div className="cart-product-img">
                        {imgUrl ? (
                          <img src={imgUrl} alt={item.name} />
                        ) : (
                          <span className="material-symbols-outlined" style={{ fontSize: 32, color: 'var(--tertiary)' }}>build</span>
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 15, wordBreak: 'break-word' }}>{item.name}</div>
                        <div className="data-mono" style={{ color: 'var(--secondary)', marginTop: 2 }}>SKU: {item.slug || 'N/A'}</div>
                        <div className="data-mono" style={{ color: 'var(--primary)', marginTop: 4, fontWeight: 700 }}>
                          {item.price ? `$${item.price.toFixed(2)}` : 'Enquiry'}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="cart-remove-btn"
                        onClick={() => removeFromCart(item._id)}
                        title="Remove"
                        aria-label={`Remove ${item.name}`}
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>

                    <div className="cart-card-body">
                      <div className="qty-selector">
                        <button type="button" onClick={() => updateQuantity(item._id, item.qty - 1)} disabled={item.qty <= 1} aria-label="Decrease quantity">−</button>
                        <input
                          type="number"
                          min="1"
                          value={item.qty}
                          onChange={e => updateQuantity(item._id, parseInt(e.target.value) || 1)}
                          aria-label="Quantity"
                        />
                        <button type="button" onClick={() => updateQuantity(item._id, item.qty + 1)} aria-label="Increase quantity">+</button>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span className="body-sm" style={{ color: 'var(--secondary)', display: 'block', fontSize: 14 }}>Subtotal</span>
                        <span className="data-mono" style={{ fontWeight: 700, fontSize: 16 }}>${subtotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Order Summary */}
          <div className="cart-summary">
            <h3 className="headline-md" style={{ marginBottom: 20 }}>Order Summary</h3>
            <div className="cart-summary-row">
              <span className="body-md">Subtotal</span>
              <span className="headline-md" style={{ color: 'var(--primary)' }}>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="cart-summary-note">
              <span className="material-symbols-outlined" style={{ fontSize: 18, verticalAlign: 'middle', marginRight: 4 }}>info</span>
              Taxes and shipping calculated during final quote.
            </div>
            <button className="btn-primary" style={{ width: '100%', minHeight: 44, textAlign: 'center', marginTop: 16 }} onClick={handleProceed}>
              Proceed to Enquiry
            </button>
            <Link to="/products" className="btn-ghost" style={{ width: '100%', minHeight: 44, textAlign: 'center', marginTop: 8, display: 'flex' }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
