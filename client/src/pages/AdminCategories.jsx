import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminSidebar from '../components/AdminSidebar'
import { api, getToken } from '../api'

export default function AdminCategories() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', slug: '', icon: '', description: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!getToken()) { navigate('/admin/login'); return }
    loadData()
  }, [])

  const loadData = () => {
    api.getCategories().then(setCategories).catch(console.error)
  }

  const handleNameChange = (e) => {
    const name = e.target.value
    setForm(prev => {
      // Auto-generate slug if it's empty or was previously auto-generated from the previous name
      const prevExpectedSlug = prev.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      const newSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      
      const shouldUpdateSlug = prev.slug === '' || prev.slug === prevExpectedSlug

      return {
        ...prev,
        name,
        slug: shouldUpdateSlug ? newSlug : prev.slug
      }
    })
  }

  const handleSlugChange = (e) => {
    setForm(prev => ({ ...prev, slug: e.target.value }))
  }

  const openEdit = (cat) => {
    setEditing(cat._id)
    setForm({
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon || '',
      description: cat.description || ''
    })
    setError('')
    setSuccess('')
  }

  const resetForm = () => {
    setEditing(null)
    setForm({ name: '', slug: '', icon: '', description: '' })
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!form.name || !form.slug) {
      setError('Name and Slug are required.')
      return
    }

    try {
      if (editing) {
        await api.updateCategory(editing, form)
        setSuccess('Category updated successfully!')
      } else {
        await api.createCategory(form)
        setSuccess('Category created successfully!')
      }
      resetForm()
      loadData()
      
      // Clear success message after 3s
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.message || 'An error occurred while saving the category.')
    }
  }

  const handleDelete = async (id) => {
    if (confirm('Delete this category?')) {
      try {
        await api.deleteCategory(id)
        loadData()
      } catch (err) {
        console.error(err)
        setError('Failed to delete category.')
      }
    }
  }

  return (
    <div className="admin-layout">
      <AdminSidebar active="categories" />
      <main className="admin-main">
        <h2 className="headline-lg" style={{ marginBottom: 24 }}>Category Management</h2>

        <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
          {/* LEFT PANEL */}
          <div style={{ flex: '0 0 350px', background: 'var(--surface)', padding: 24, border: '1px solid var(--black)' }}>
            <h3 className="headline-md" style={{ marginBottom: 16 }}>
              {editing ? 'Edit Category' : 'Add New Category'}
            </h3>
            
            {error && <div style={{ color: 'var(--error)', marginBottom: 16, fontSize: 14 }}>{error}</div>}
            {success && <div style={{ color: 'var(--primary)', marginBottom: 16, fontSize: 14 }}>{success}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Category Name *</label>
                <input required value={form.name} onChange={handleNameChange} placeholder="e.g., Power Drills" />
              </div>
              
              <div className="form-group">
                <label>Slug *</label>
                <input required value={form.slug} onChange={handleSlugChange} placeholder="power-drills" />
              </div>
              
              <div className="form-group">
                <label>Icon Name</label>
                <input value={form.icon} onChange={e => setForm({...form, icon: e.target.value})} placeholder="e.g., power" />
                <span className="body-sm" style={{ color: 'var(--secondary)', display: 'block', marginTop: 4 }}>
                  Material Symbols icon name
                </span>
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                <button type="submit" className="btn-primary" style={{ flex: 1, padding: '12px' }}>{editing ? 'Update' : 'Save'}</button>
                <button type="button" className="btn-ghost" style={{ flex: 1, padding: '12px' }} onClick={resetForm}>Cancel</button>
              </div>
            </form>
          </div>

          {/* RIGHT PANEL */}
          <div style={{ flex: 1, overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: 60 }}>Icon</th>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Description</th>
                  <th style={{ width: 140 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(cat => (
                  <tr key={cat._id}>
                    <td>
                      <span className="material-symbols-outlined" style={{ color: 'var(--secondary)' }}>
                        {cat.icon || 'category'}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{cat.name}</td>
                    <td className="data-mono">{cat.slug}</td>
                    <td>{cat.description || '—'}</td>
                    <td>
                      <button className="label-bold" style={{ color: 'var(--primary)', background: 'none', marginRight: 12 }} onClick={() => openEdit(cat)}>Edit</button>
                      <button className="label-bold" style={{ color: 'var(--error)', background: 'none' }} onClick={() => handleDelete(cat._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ color: 'var(--secondary)', textAlign: 'center', padding: 32 }}>
                      No categories yet. Create your first category on the left.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
