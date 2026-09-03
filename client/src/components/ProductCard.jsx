import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import Toast from './Toast'

function getBadge(stock) {
  if (stock > 10) return <div className="badge badge-in-stock">In Stock</div>
  if (stock > 0) return <div className="badge badge-low-stock">Low Stock</div>
  return <div className="badge badge-out-of-stock">Out of Stock</div>
}

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const [toast, setToast] = useState(false)
  const isOutOfStock = product.stock === 0
  const imgUrl = product.images?.[0] || ''

  const handleAdd = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product, 1)
    setToast(true)
  }

  return (
    <>
      <Link to={`/products/${product._id}`} className="product-card">
        <div className="card-img" style={isOutOfStock ? { opacity: 0.7 } : {}}>
          {getBadge(product.stock)}
          {imgUrl ?
            <img src={imgUrl} alt={product.name} style={isOutOfStock ? { filter: 'grayscale(1)' } : {}} /> :
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 64, color: 'var(--tertiary)' }}>build</span>
            </div>
          }
        </div>
        <div className="card-body">
          <div>
            <span className="data-mono" style={{ color: 'var(--secondary)', marginBottom: 4, display: 'block' }}>SKU: {product.slug || 'N/A'}</span>
            <h3 className="body-md" style={{ fontWeight: 600, marginBottom: 8 }}>{product.name}</h3>
            {product.pricing_type === 'fixed' && product.price ?
              <p className="headline-md" style={{ color: 'var(--primary)', fontWeight: 700, marginBottom: 16 }}>${product.price.toFixed(2)}</p> :
              <p className="body-sm" style={{ color: 'var(--secondary)', marginBottom: 16 }}>Contact for Pricing</p>
            }
          </div>
          {product.pricing_type === 'fixed' && product.stock > 0 ?
            <button className="btn-secondary" style={{ width: '100%', textAlign: 'center' }} onClick={handleAdd}>Add to Cart</button> :
            <button className="btn-ghost" style={{ width: '100%', textAlign: 'center' }} onClick={e => e.preventDefault()}>Enquire Now</button>
          }
        </div>
      </Link>
      {toast && <Toast message="Added to cart" type="success" onClose={() => setToast(false)} />}
    </>
  )
}
