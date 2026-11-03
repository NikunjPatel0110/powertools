import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

export default function AdminSidebar({ active }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Auto-close drawer on location change
  useEffect(() => {
    setDrawerOpen(false)
  }, [location.pathname])

  const logout = () => {
    localStorage.removeItem('admin_token')
    navigate('/admin/login')
  }

  const closeDrawer = () => setDrawerOpen(false)

  const activeTitle = {
    dashboard: 'Dashboard',
    products: 'Product Management',
    categories: 'Category Management',
    enquiries: 'Enquiry Tables',
  }[active] || 'Admin Panel'

  return (
    <>
      {/* Top bar below lg (< 1024px) */}
      <header className="admin-topbar lg:hidden">
        <button
          type="button"
          className="admin-hamburger-btn"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open sidebar menu"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span className="label-bold" style={{ color: 'var(--on-surface)', fontSize: 14 }}>Admin Panel</span>
          <span className="body-sm" style={{ color: 'var(--secondary)', fontSize: 14 }}>{activeTitle}</span>
        </div>

        <Link to="/" className="cart-icon-btn" title="Back to site" aria-label="Back to site">
          <span className="material-symbols-outlined">home</span>
        </Link>
      </header>

      {/* Drawer backdrop below lg */}
      {drawerOpen && (
        <div
          className="admin-drawer-backdrop lg:hidden"
          onClick={closeDrawer}
          aria-hidden="true"
        />
      )}

      {/* Sidebar (Desktop sidebar + Mobile/Tablet slide-in drawer) */}
      <aside className={`admin-sidebar ${drawerOpen ? 'drawer-open' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingRight: 16 }}>
          <div>
            <h1>Admin Panel</h1>
            <span className="subtitle">System Overview</span>
          </div>
          {/* Close X button inside drawer below lg */}
          <button
            type="button"
            className="lg:hidden"
            onClick={closeDrawer}
            aria-label="Close drawer"
            style={{
              width: 44,
              height: 44,
              minWidth: 44,
              minHeight: 44,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: 'none',
              color: 'var(--on-surface)',
              cursor: 'pointer',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 24 }}>close</span>
          </button>
        </div>

        <Link to="/admin" className={active === 'dashboard' ? 'active' : ''} onClick={closeDrawer}>
          <span className="material-symbols-outlined">dashboard</span> Dashboard
        </Link>

        <Link to="/admin/products" className={active === 'products' ? 'active' : ''} onClick={closeDrawer}>
          <span className="material-symbols-outlined">inventory_2</span> Product Management
        </Link>

        <Link to="/admin/categories" className={active === 'categories' ? 'active' : ''} onClick={closeDrawer}>
          <span className="material-symbols-outlined">category</span> Categories
        </Link>

        <Link to="/admin/enquiries" className={active === 'enquiries' ? 'active' : ''} onClick={closeDrawer}>
          <span className="material-symbols-outlined">mail</span> Enquiry Tables
        </Link>

        {/* Spacer */}
        <div style={{ flex: 1, minHeight: 24 }} />

        <Link to="/" className="back-to-site-link" onClick={closeDrawer}>
          <span className="material-symbols-outlined">home</span> Back to Site
        </Link>

        <button type="button" onClick={logout}>
          <span className="material-symbols-outlined">logout</span> Logout
        </button>
      </aside>
    </>
  )
}
