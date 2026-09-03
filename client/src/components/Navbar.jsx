import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { pathname } = useLocation()
  const { cartCount } = useCart()

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">IndustrialDirect</Link>
        <nav className="navbar-links desktop-only">
          <Link to="/" className={pathname === '/' ? 'active' : ''}>Home</Link>
          <Link to="/products" className={pathname.startsWith('/products') ? 'active' : ''}>Products</Link>
          <a href="#footer">About</a>
          <a href="#footer">Contact</a>
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link to="/cart" className="cart-icon-btn" title="Cart">
            <span className="material-symbols-outlined">shopping_cart</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
          <Link to="/admin/login" className="btn-secondary desktop-only">Admin Login</Link>
        </div>
      </div>
    </header>
  )
}
