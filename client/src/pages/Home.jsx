import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import { api } from '../api'

const CATEGORY_ICONS = ['construction','precision_manufacturing','handyman','hardware','carpenter','home_repair_service','engineering','plumbing','electrical_services','measuring_tape']

export default function Home() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])

  useEffect(() => {
    api.getProducts().then(setProducts).catch(console.error)
    api.getCategories().then(setCategories).catch(console.error)
  }, [])

  return (
    <>
      <Navbar />
      <main className="container" style={{ paddingTop: 72, paddingBottom: 40 }}>
        {/* Hero */}
        <section className="hero">
          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1hv1_3eZzgMMW0JRBkazc8d83wB3LCorTqszfrf3sWilyHL2eRr_WvqJNU9grVtgXgNekVr0ZjT5Vz6Sf-91HhxurEYlqO5dbi6S5rMUpJNbK3Al5qnNxXXDfq8Fa6Ootlf9uASrRHa5HbxvbbLq9C5jGsK2Peg41L_QC0y5NAhd-I2qHWkpvvhn8s1aXm4zcE8WdlZ3qSFKafJ6Z3FCWTdsNAi4cpOAPaTuTzuxTjzuPrFw22VHjhtQpEBvDHirbQZkYaRgnlVBz" alt="Industrial tools" />
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <h1 className="headline-xl" style={{ marginBottom: 16 }}>Precision Engineered. Reliable Performance.</h1>
            <p className="body-lg" style={{ color: 'var(--on-surface-variant)', marginBottom: 24 }}>Equipping professionals with the highest-grade tools for demanding environments. Explore our comprehensive catalog of industrial hardware.</p>
            <Link to="/products" className="btn-primary" style={{ minHeight: 44 }}>Shop the Catalog</Link>
          </div>
        </section>

        {/* Categories */}
        <section style={{ marginBottom: 40 }}>
          <div className="section-header">
            <h2 className="headline-lg">Categories</h2>
            <Link to="/products" className="label-bold" style={{ color: 'var(--primary)', minHeight: 44, display: 'inline-flex', alignItems: 'center' }}>View All</Link>
          </div>
          <div className="grid-5">
            {categories.length > 0 ? categories.slice(0, 10).map((cat, i) => (
              <Link to={`/products?category=${cat._id}`} className="category-card" key={cat._id}>
                <span className="material-symbols-outlined">{cat.icon || CATEGORY_ICONS[i % CATEGORY_ICONS.length]}</span>
                <h3 className="label-bold">{cat.name}</h3>
              </Link>
            )) : CATEGORY_ICONS.map((icon, i) => (
              <div className="category-card" key={i}>
                <span className="material-symbols-outlined">{icon}</span>
                <h3 className="label-bold">{['Power Drills','Grinders','Hand Tools','Fasteners','Saws','Tool Storage','Safety Gear','Plumbing','Electrical','Measurement'][i]}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* Popular Products */}
        <section style={{ marginBottom: 40 }}>
          <div className="section-header">
            <h2 className="headline-lg">Popular Equipment</h2>
          </div>
          <div className="grid-4">
            {products.slice(0, 4).map(p => <ProductCard product={p} key={p._id} />)}
            {products.length === 0 && <p className="body-sm" style={{ color: 'var(--secondary)', gridColumn: '1/-1' }}>No products found. Add products from the admin panel.</p>}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
