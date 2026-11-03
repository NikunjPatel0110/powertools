import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Toast from '../components/Toast'
import { useCart } from '../context/CartContext'
import { api } from '../api'

export default function ProductDetail() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [qty, setQty] = useState(1)
  const [toast, setToast] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [sent, setSent] = useState(false)

  useEffect(() => {
    api.getProduct(id).then(setProduct).catch(console.error)
  }, [id])

  const handleAddToCart = () => {
    if (!product) return
    addToCart(product, qty)
    setToast('Added to cart')
    setQty(1)
  }

  const handleEnquiry = async (e) => {
    e.preventDefault()
    await api.createEnquiry({ ...form, product: id })
    setSent(true)
    setForm({ name: '', email: '', phone: '', message: '' })
    setTimeout(() => setSent(false), 3000)
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <main className="container" style={{ paddingTop: 96, minHeight: '60vh' }}>
          <p className="body-md">Loading product details...</p>
        </main>
      </>
    )
  }

  const imgUrl = product.images?.[0] || ''
  const specs = product.specifications
    ? Object.entries(product.specifications instanceof Map ? Object.fromEntries(product.specifications) : product.specifications)
    : []

  return (
    <>
      <Navbar />
      <main className="container" style={{ paddingTop: 96, paddingBottom: 40 }}>
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/products">Products</Link>
          <span>/</span>
          <span style={{ color: 'var(--on-surface)', fontWeight: 600 }}>{product.name}</span>
        </div>

        {/* Product Detail: Image stacks above details below md */}
        <div className="product-detail">
          <div className="product-detail-img">
            {imgUrl ? (
              <img src={imgUrl} alt={product.name} />
            ) : (
              <span className="material-symbols-outlined" style={{ fontSize: 96, color: 'var(--tertiary)' }}>build</span>
            )}
          </div>
          <div>
            <span className="data-mono" style={{ color: 'var(--secondary)', marginBottom: 8, display: 'block' }}>
              SKU: {product.slug}
            </span>
            <h1 className="headline-lg" style={{ marginBottom: 16 }}>{product.name}</h1>
            <p className="body-lg" style={{ color: 'var(--on-surface-variant)', marginBottom: 24 }}>{product.description}</p>

            {product.pricing_type === 'fixed' && product.price ? (
              <p className="headline-xl" style={{ color: 'var(--primary)', marginBottom: 24 }}>${product.price.toFixed(2)}</p>
            ) : (
              <p className="headline-md" style={{ color: 'var(--secondary)', marginBottom: 24 }}>Contact for Pricing</p>
            )}

            {product.stock > 0 ? (
              <span className="badge badge-in-stock" style={{ position: 'static', display: 'inline-block', marginBottom: 24 }}>
                In Stock ({product.stock})
              </span>
            ) : (
              <span className="badge badge-out-of-stock" style={{ position: 'static', display: 'inline-block', marginBottom: 24 }}>
                Out of Stock
              </span>
            )}

            {/* Quantity Selector + Add to Cart (minimum 44px tap targets) */}
            {product.pricing_type === 'fixed' && product.stock > 0 ? (
              <div style={{ marginBottom: 24 }}>
                <label className="label-bold" style={{ display: 'block', marginBottom: 8 }}>Quantity</label>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                  <div className="qty-selector">
                    <button type="button" onClick={() => setQty(q => Math.max(1, q - 1))} disabled={qty <= 1} aria-label="Decrease quantity">−</button>
                    <input
                      type="number"
                      min="1"
                      value={qty}
                      onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                      aria-label="Quantity"
                    />
                    <button type="button" onClick={() => setQty(q => q + 1)} aria-label="Increase quantity">+</button>
                  </div>
                  <button className="btn-secondary" style={{ flex: 1, minHeight: 44, textAlign: 'center' }} onClick={handleAddToCart}>
                    Add to Cart
                  </button>
                </div>
              </div>
            ) : (
              <button className="btn-ghost" style={{ display: 'flex', width: '100%', minHeight: 44, textAlign: 'center', marginBottom: 24 }}>
                Request Quote
              </button>
            )}
          </div>
        </div>

        {/* Technical Specifications */}
        {specs.length > 0 && (
          <section style={{ marginBottom: 40 }}>
            <div className="section-header">
              <h2 className="headline-md">Technical Specifications</h2>
            </div>
            <div className="overflow-x-auto w-full" style={{ border: '1px solid var(--outline-variant)', background: '#fff' }}>
              <table className="specs-table">
                <tbody>
                  {specs.map(([k, v]) => (
                    <tr key={k}>
                      <td>{k}</td>
                      <td>{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Technical Quote Enquiry Form */}
        <div className="enquiry-form">
          <h3 className="headline-md">Request Technical Quote</h3>
          {sent && <div className="toast success" style={{ position: 'static', marginBottom: 16 }}>Enquiry sent successfully!</div>}
          <form onSubmit={handleEnquiry}>
            {/* Single column below md, 2 columns on md+ */}
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
              <textarea rows={4} required value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Describe your requirements..."></textarea>
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', minHeight: 44, textAlign: 'center' }}>
              Submit Enquiry
            </button>
          </form>
        </div>
      </main>
      <Footer />
      {toast && <Toast message={toast} type="success" onClose={() => setToast(null)} />}
    </>
  )
}
