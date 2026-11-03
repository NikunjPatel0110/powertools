import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { pathname } = useLocation()
  const { cartCount } = useCart()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Auto-close menu on location change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const closeMenu = () => setMobileMenuOpen(false)

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand" onClick={closeMenu}>AkmultiTools</Link>

        {/* Desktop Links - hidden below md */}
        <nav className="navbar-links hidden md:flex">
          <Link to="/" className={pathname === '/' ? 'active' : ''}>Home</Link>
          <Link to="/products" className={pathname.startsWith('/products') ? 'active' : ''}>Products</Link>
          <a href="#footer">About</a>
          <a href="#footer">Contact</a>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Cart Icon - ALWAYS visible on mobile and desktop */}
          <Link to="/cart" className="cart-icon-btn" title="Cart" onClick={closeMenu} aria-label="Cart">
            <span className="material-symbols-outlined">shopping_cart</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {/* Admin Login - ONLY on desktop (hidden below md, never in mobile menu) */}
          <Link to="/admin/login" className="btn-secondary hidden md:inline-flex">Admin Login</Link>

          {/* Mobile Hamburger Button - below md */}
          <button
            type="button"
            className="navbar-hamburger-btn md:hidden"
            onClick={() => setMobileMenuOpen(prev => !prev)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <span className="material-symbols-outlined">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Full-width mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="mobile-nav-panel md:hidden">
          <nav className="mobile-nav-links">
            <Link to="/" className={pathname === '/' ? 'active' : ''} onClick={closeMenu}>
              Home
            </Link>
            <Link to="/products" className={pathname.startsWith('/products') ? 'active' : ''} onClick={closeMenu}>
              Products
            </Link>
            <a href="#footer" onClick={closeMenu}>
              About
            </a>
            <a href="#footer" onClick={closeMenu}>
              Contact
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
