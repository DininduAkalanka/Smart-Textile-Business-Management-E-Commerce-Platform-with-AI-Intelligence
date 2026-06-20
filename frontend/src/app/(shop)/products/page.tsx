'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Product, Category } from '@/types';
import ProductCard from '@/components/products/ProductCard';

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    categoryId: searchParams.get('categoryId') || '',
    sortBy: 'createdAt',
    sortOrder: 'desc' as 'asc' | 'desc',
    minPrice: '',
    maxPrice: '',
  });

  const [page, setPage] = useState(1);

  const loadProducts = async (currentPage = 1) => {
    setLoading(true);
    try {
      const res = await api.getProducts({
        page: currentPage,
        limit: 12,
        search: filters.search || undefined,
        categoryId: filters.categoryId || undefined,
        minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
        maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      });
      setProducts(res.products || []);
      setPagination(res.pagination);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    api.getCategories().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    loadProducts(page);
  }, [page, filters.categoryId, filters.sortBy, filters.sortOrder]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadProducts(1);
  };

  return (
    <div style={{ padding: '2rem 0 4rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 className="font-display" style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Our Products
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem' }}>
            Browse our curated collection of premium quality fabrics
          </p>
        </div>

        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          {/* Sidebar Filters */}
          <aside style={{ width: '240px', flexShrink: 0 }}>
            {/* Search */}
            <form onSubmit={handleSearch} style={{ marginBottom: '1.5rem' }}>
              <label className="input-label">Search</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  className="input"
                  placeholder="Search fabrics..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>
            </form>

            {/* Categories */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="input-label">Category</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                <button
                  onClick={() => { setFilters({ ...filters, categoryId: '' }); setPage(1); }}
                  style={{
                    textAlign: 'left',
                    padding: '0.5rem 0.75rem',
                    background: !filters.categoryId ? 'var(--color-accent)' : 'transparent',
                    color: !filters.categoryId ? 'white' : 'var(--color-text)',
                    border: 'none',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => { setFilters({ ...filters, categoryId: cat.id }); setPage(1); }}
                    style={{
                      textAlign: 'left',
                      padding: '0.5rem 0.75rem',
                      background: filters.categoryId === cat.id ? 'var(--color-accent)' : 'transparent',
                      color: filters.categoryId === cat.id ? 'white' : 'var(--color-text)',
                      border: 'none',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="input-label">Price Range</label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  className="input"
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                  style={{ width: '50%' }}
                />
                <span style={{ color: 'var(--color-text-muted)' }}>—</span>
                <input
                  className="input"
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                  style={{ width: '50%' }}
                />
              </div>
              <button
                onClick={() => { setPage(1); loadProducts(1); }}
                className="btn btn-outline btn-sm"
                style={{ width: '100%', marginTop: '0.5rem' }}
              >
                Apply Price Filter
              </button>
            </div>

            {/* Sort */}
            <div>
              <label className="input-label">Sort By</label>
              <select
                className="input"
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split('-');
                  setFilters({ ...filters, sortBy, sortOrder: sortOrder as 'asc' | 'desc' });
                  setPage(1);
                }}
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A-Z</option>
                <option value="name-desc">Name: Z-A</option>
              </select>
            </div>
          </aside>

          {/* Product Grid */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Results count */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                {pagination.total} products found
              </p>
            </div>

            {loading ? (
              <div className="product-grid">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="skeleton" style={{ height: '360px' }} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</p>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>No products found</h3>
                <p style={{ color: 'var(--color-text-muted)' }}>Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <>
                <div className="product-grid">
                  {products.map((product, idx) => (
                    <ProductCard key={product.id} product={product} index={idx} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2.5rem' }}>
                    <button
                      className="btn btn-outline btn-sm"
                      disabled={page <= 1}
                      onClick={() => setPage(page - 1)}
                    >
                      Previous
                    </button>
                    {Array.from({ length: pagination.totalPages }, (_, i) => (
                      <button
                        key={i + 1}
                        className={`btn btn-sm ${page === i + 1 ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => setPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      className="btn btn-outline btn-sm"
                      disabled={page >= pagination.totalPages}
                      onClick={() => setPage(page + 1)}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}><div className="skeleton" style={{ height: '400px' }} /></div>}>
      <ProductsContent />
    </Suspense>
  );
}
