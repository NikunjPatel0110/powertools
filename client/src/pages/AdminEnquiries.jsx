import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminSidebar from '../components/AdminSidebar'
import { api, getToken } from '../api'

export default function AdminEnquiries() {
  const navigate = useNavigate()
  const [enquiries, setEnquiries] = useState([])

  useEffect(() => {
    if (!getToken()) { navigate('/admin/login'); return }
    api.getEnquiries().then(d => Array.isArray(d) ? setEnquiries(d) : setEnquiries([])).catch(() => { })
  }, [])


  const handleDelete = async (id) => {
    if (!window.confirm('Delete this enquiry? This cannot be undone.')) return

    try {
      await api.deleteEnquiry(id)
      setEnquiries(prev => prev.filter(e => e._id !== id))
    } catch (err) {
      alert('Could not delete the enquiry. Please try again.')
    }
  }
  //------------------
  return (
    <div className="admin-layout">
      <AdminSidebar active="enquiries" />
      <main className="admin-main">
        <h2 className="headline-lg" style={{ marginBottom: 24 }}>Enquiry Tables</h2>
        <div className="overflow-x-auto w-full" style={{ border: '1px solid var(--outline-variant)', background: '#fff', marginBottom: 24 }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Product</th>
                <th>Message</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.map(e => (
                <tr key={e._id}>
                  <td style={{ fontWeight: 600 }}>{e.name}</td>
                  <td>{e.email}</td>
                  <td className="data-mono">{e.phone || '—'}</td>
                  <td>{e.product?.name ? (e.message?.includes('Cart Items:') && e.message.split('\n').length > 4 ? `${e.product.name} (+others)` : e.product.name) : '—'}</td>
                  <td style={{ minWidth: 160, maxWidth: 280, wordBreak: 'break-word' }}>{e.message}</td>
                  <td><span className="label-bold" style={{ color: e.status === 'new' ? 'var(--primary)' : 'var(--secondary)' }}>{e.status}</span></td>
                  <td className="data-mono">{new Date(e.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      type="button"
                      className="btn-ghost"
                      style={{ minHeight: 44, color: 'var(--primary)' }}
                      onClick={() => handleDelete(e._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {enquiries.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ color: 'var(--secondary)', textAlign: 'center', padding: 24 }}>
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
