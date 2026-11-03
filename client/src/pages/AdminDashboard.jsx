import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminSidebar from '../components/AdminSidebar'
import { api, getToken } from '../api'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [enquiries, setEnquiries] = useState([])
  const [categories, setCategories] = useState([])

  useEffect(() => {
    if (!getToken()) { navigate('/admin/login'); return }
    api.getProducts().then(setProducts).catch(console.error)
    api.getEnquiries().then(d => Array.isArray(d) ? setEnquiries(d) : setEnquiries([])).catch(() => {})
    api.getCategories().then(setCategories).catch(console.error)
  }, [])

  return (
    <div className="admin-layout">
      <AdminSidebar active="dashboard" />
      <main className="admin-main">
        <h2 className="headline-lg" style={{ marginBottom: 24 }}>Dashboard</h2>
        <div className="stat-cards">
          <div className="stat-card">
            <div className="stat-label">Total Products</div>
            <div className="stat-value">{products.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Categories</div>
            <div className="stat-value">{categories.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Enquiries</div>
            <div className="stat-value">{enquiries.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Low Stock</div>
            <div className="stat-value">{products.filter(p => p.stock > 0 && p.stock <= 10).length}</div>
          </div>
        </div>

        <div className="section-header">
          <h3 className="headline-md">Recent Enquiries</h3>
        </div>
        <div className="overflow-x-auto w-full" style={{ border: '1px solid var(--outline-variant)', background: '#fff', marginBottom: 24 }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Product</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.slice(0, 5).map(e => (
                <tr key={e._id}>
                  <td style={{ fontWeight: 600 }}>{e.name}</td>
                  <td>{e.email}</td>
                  <td>{e.product?.name ? (e.message?.includes('Cart Items:') && e.message.split('\n').length > 4 ? `${e.product.name} (+others)` : e.product.name) : '—'}</td>
                  <td><span className="label-bold" style={{ color: e.status === 'new' ? 'var(--primary)' : 'var(--secondary)' }}>{e.status}</span></td>
                  <td className="data-mono">{new Date(e.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {enquiries.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ color: 'var(--secondary)', textAlign: 'center', padding: 24 }}>
                    No enquiries yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
