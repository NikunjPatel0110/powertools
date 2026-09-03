// import { Link, useNavigate } from 'react-router-dom'

// export default function AdminSidebar({ active }) {
//   const navigate = useNavigate()
//   const logout = () => { localStorage.removeItem('admin_token'); navigate('/admin/login') }

//   return (
//     <aside className="admin-sidebar">
//       <h1>Admin Panel</h1>
//       <span className="subtitle">System Overview</span>
//       <Link to="/admin" className={active === 'dashboard' ? 'active' : ''}>
//         <span className="material-symbols-outlined">dashboard</span> Dashboard
//       </Link>
//       <Link to="/admin/products" className={active === 'products' ? 'active' : ''}>
//         <span className="material-symbols-outlined">inventory_2</span> Product Management
//       </Link>
//       <Link to="/admin/enquiries" className={active === 'enquiries' ? 'active' : ''}>
//         <span className="material-symbols-outlined">mail</span> Enquiry Tables
//       </Link>
//       <div style={{flex:1}} />
//       <button onClick={logout}>
//         <span className="material-symbols-outlined">logout</span> Logout
//       </button>
//     </aside>
//   )
// }
import { Link, useNavigate } from 'react-router-dom'

export default function AdminSidebar({ active }) {
  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login')
  }

  return (
    <aside className="admin-sidebar">
      <h1>Admin Panel</h1>
      <span className="subtitle">System Overview</span>

      <Link to="/admin" className={active === 'dashboard' ? 'active' : ''}>
        <span className="material-symbols-outlined">dashboard</span> Dashboard
      </Link>

      <Link to="/admin/products" className={active === 'products' ? 'active' : ''}>
        <span className="material-symbols-outlined">inventory_2</span> Product Management
      </Link>

      <Link to="/admin/categories" className={active === 'categories' ? 'active' : ''}>
        <span className="material-symbols-outlined">category</span> Categories
      </Link>

      <Link to="/admin/enquiries" className={active === 'enquiries' ? 'active' : ''}>
        <span className="material-symbols-outlined">mail</span> Enquiry Tables
      </Link>

      {/* This spacer pushes the following items to the bottom */}
      <div style={{ flex: 1 }} />

      {/* --- NEW: Back to Home Link --- */}
      <Link to="/" className="back-to-site-link">
        <span className="material-symbols-outlined">home</span> Back to Site
      </Link>

      <button onClick={logout}>
        <span className="material-symbols-outlined">logout</span> Logout
      </button>
    </aside>
  )
}