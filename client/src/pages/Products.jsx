import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import { api } from '../api'

export default function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [searchParams] = useSearchParams()
  const catFilter = searchParams.get('category')

  useEffect(() => {
    api.getProducts().then(setProducts).catch(console.error)
    api.getCategories().then(setCategories).catch(console.error)
  }, [])

  const filtered = catFilter
    ? products.filter(p => (p.category?._id === catFilter || p.category === catFilter))
    : products

  const activeCategory = categories.find(c => c._id === catFilter)
  const activeCategoryLabel = activeCategory ? activeCategory.name : 'All Categories'

  return (
    <>
      <Navbar />
      <main className="container" style={{ paddingTop: 96, paddingBottom: 40 }}>
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <span style={{ color: 'var(--on-surface)', fontWeight: 600 }}>Products</span>
        </div>

        <div className="section-header">
          <h1 className="headline-lg">All Products</h1>
          <span className="body-sm" style={{ color: 'var(--secondary)' }}>{filtered.length} items</span>
        </div>

        {/* Mobile Filter Toggle Button (below md) */}
        {categories.length > 0 && (
          <div className="md:hidden">
            <button
              type="button"
              className="filter-toggle-btn"
              onClick={() => setMobileFiltersOpen(prev => !prev)}
              aria-expanded={mobileFiltersOpen}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="material-symbols-outlined">tune</span>
                <span>Category: {activeCategoryLabel}</span>
              </span>
              <span className="material-symbols-outlined">
                {mobileFiltersOpen ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {/* Collapsible filter panel on mobile */}
            {mobileFiltersOpen && (
              <div className="filter-panel-mobile">
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <Link
                    to="/products"
                    className="label-bold"
                    onClick={() => setMobileFiltersOpen(false)}
                    style={{
                      minHeight: 44,
                      padding: '10px 16px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid var(--outline-variant)',
                      color: !catFilter ? 'var(--on-primary)' : 'var(--secondary)',
                      background: !catFilter ? 'var(--black)' : 'transparent',
                    }}
                  >
                    All
                  </Link>
                  {categories.map(c => (
                    <Link
                      to={`/products?category=${c._id}`}
                      key={c._id}
                      className="label-bold"
                      onClick={() => setMobileFiltersOpen(false)}
                      style={{
                        minHeight: 44,
                        padding: '10px 16px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid var(--outline-variant)',
                        color: catFilter === c._id ? 'var(--on-primary)' : 'var(--secondary)',
                        background: catFilter === c._id ? 'var(--black)' : 'transparent',
                      }}
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Desktop Filter Chips (md and up) */}
        {categories.length > 0 && (
          <div className="hidden md:flex" style={{ gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
            <Link
              to="/products"
              className="label-bold"
              style={{
                minHeight: 44,
                padding: '10px 20px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--outline-variant)',
                color: !catFilter ? 'var(--on-primary)' : 'var(--secondary)',
                background: !catFilter ? 'var(--black)' : 'transparent',
              }}
            >
              All
            </Link>
            {categories.map(c => (
              <Link
                to={`/products?category=${c._id}`}
                key={c._id}
                className="label-bold"
                style={{
                  minHeight: 44,
                  padding: '10px 20px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--outline-variant)',
                  color: catFilter === c._id ? 'var(--on-primary)' : 'var(--secondary)',
                  background: catFilter === c._id ? 'var(--black)' : 'transparent',
                }}
              >
                {c.name}
              </Link>
            ))}
          </div>
        )}

        {/* Product Grid */}
        <div className="grid-4">
          {filtered.map(p => <ProductCard product={p} key={p._id} />)}
          {filtered.length === 0 && (
            <p className="body-sm" style={{ color: 'var(--secondary)', gridColumn: '1/-1', textAlign: 'center', padding: 32 }}>
              No products found in this category.
            </p>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
