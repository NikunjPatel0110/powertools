import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminSidebar from '../components/AdminSidebar'
import { api, getToken } from '../api'

export default function AdminProducts() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name:'', slug:'', description:'', category:'', brand:'', pricing_type:'fixed', price:'', stock:'', featured:false })
  const [imageFile, setImageFile] = useState(null)

  useEffect(() => {
    if (!getToken()) { navigate('/admin/login'); return }
    loadData()
  }, [])

  const loadData = () => {
    api.getProducts().then(setProducts).catch(console.error)
    api.getCategories().then(setCategories).catch(console.error)
  }

  const openAdd = () => { api.getCategories().then(setCategories).catch(console.error); setEditing(null); setForm({name:'',slug:'',description:'',category:'',brand:'',pricing_type:'fixed',price:'',stock:'',featured:false}); setImageFile(null); setShowModal(true) }
  const openEdit = (p) => { api.getCategories().then(setCategories).catch(console.error); setEditing(p._id); setForm({name:p.name,slug:p.slug,description:p.description||'',category:p.category?._id||p.category||'',brand:p.brand||'',pricing_type:p.pricing_type||'fixed',price:p.price||'',stock:p.stock||'',featured:p.featured||false}); setImageFile(null); setShowModal(true) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    let images = []
    if (imageFile) {
      const res = await api.uploadImage(imageFile)
      if (res.url) images = [res.url]
    }
    const payload = { ...form, price: Number(form.price)||0, stock: Number(form.stock)||0, ...(images.length ? { images } : {}) }
    if (editing) { await api.updateProduct(editing, payload) }
    else { await api.createProduct(payload) }
    setShowModal(false); loadData()
  }

  const handleDelete = async (id) => { if(confirm('Delete this product?')) { await api.deleteProduct(id); loadData() } }

  return (
    <div className="admin-layout">
      <AdminSidebar active="products" />
      <main className="admin-main">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
          <h2 className="headline-lg">Product Management</h2>
          <button className="btn-primary" onClick={openAdd}>+ Add Product</button>
        </div>

        <table className="admin-table">
          <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Type</th><th>Actions</th></tr></thead>
          <tbody>
            {products.map(p => (
              <tr key={p._id}>
                <td style={{fontWeight:600}}>{p.name}</td>
                <td>{p.category?.name || '—'}</td>
                <td className="data-mono">{p.pricing_type==='fixed'?`$${p.price?.toFixed(2)}`:'Enquiry'}</td>
                <td className="data-mono">{p.stock}</td>
                <td><span className="label-bold" style={{color:p.featured?'var(--primary)':'var(--secondary)'}}>{p.featured?'Featured':'Standard'}</span></td>
                <td>
                  <button className="label-bold" style={{color:'var(--primary)',background:'none',marginRight:12}} onClick={()=>openEdit(p)}>Edit</button>
                  <button className="label-bold" style={{color:'var(--error)',background:'none'}} onClick={()=>handleDelete(p._id)}>Delete</button>
                </td>
              </tr>
            ))}
            {products.length===0 && <tr><td colSpan={6} style={{color:'var(--secondary)'}}>No products yet.</td></tr>}
          </tbody>
        </table>

        {showModal && (
          <div className="modal-overlay" onClick={()=>setShowModal(false)}>
            <div className="modal" onClick={e=>e.stopPropagation()}>
              <h2>{editing ? 'Edit Product' : 'Add New Product'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group"><label>Product Name</label><input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div>
                <div className="form-group"><label>Slug / SKU</label><input required value={form.slug} onChange={e=>setForm({...form,slug:e.target.value})} /></div>
                <div className="form-group"><label>Description</label><textarea rows={3} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} /></div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
                  <div className="form-group"><label>Category</label>
                    <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} required style={{background:'var(--surface-container-low)',border:'none',borderBottom:'2px solid var(--black)',padding:'10px 12px',width:'100%',fontSize:16}}>
                      <option value="">Select...</option>
                      {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group"><label>Brand</label><input value={form.brand} onChange={e=>setForm({...form,brand:e.target.value})} /></div>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:16}}>
                  <div className="form-group"><label>Pricing Type</label>
                    <select value={form.pricing_type} onChange={e=>setForm({...form,pricing_type:e.target.value})} style={{background:'var(--surface-container-low)',border:'none',borderBottom:'2px solid var(--black)',padding:'10px 12px',width:'100%',fontSize:16}}>
                      <option value="fixed">Fixed Price</option><option value="enquiry">Enquiry</option>
                    </select>
                  </div>
                  <div className="form-group"><label>Price</label><input type="number" step="0.01" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} disabled={form.pricing_type==='enquiry'} /></div>
                  <div className="form-group"><label>Stock</label><input type="number" value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})} /></div>
                </div>
                <div className="form-group">
                  <label>Product Image</label>
                  <div className="upload-area" onClick={()=>document.getElementById('file-input').click()}>
                    <span className="material-symbols-outlined" style={{fontSize:36,color:'var(--tertiary)'}}>cloud_upload</span>
                    <p className="body-sm" style={{color:'var(--secondary)'}}>Drag and drop or click to browse</p>
                    <p className="body-sm" style={{color:'var(--tertiary)',fontSize:12}}>Supports: JPG, PNG (Max 5MB)</p>
                    {imageFile && <p className="label-bold" style={{marginTop:8,color:'var(--primary)'}}>{imageFile.name}</p>}
                  </div>
                  <input type="file" id="file-input" accept="image/*" style={{display:'none'}} onChange={e=>setImageFile(e.target.files[0])} />
                </div>
                <div className="form-group" style={{display:'flex',alignItems:'center',gap:8}}>
                  <input type="checkbox" id="featured" checked={form.featured} onChange={e=>setForm({...form,featured:e.target.checked})} style={{width:16,height:16}} />
                  <label htmlFor="featured" style={{margin:0}}>Featured Product</label>
                </div>
                <div style={{display:'flex',gap:12,marginTop:16}}>
                  <button type="submit" className="btn-primary" style={{flex:1,textAlign:'center'}}>{editing ? 'Update' : 'Create'} Product</button>
                  <button type="button" className="btn-ghost" style={{flex:1,textAlign:'center'}} onClick={()=>setShowModal(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
