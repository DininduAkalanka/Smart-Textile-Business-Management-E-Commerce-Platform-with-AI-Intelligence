'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Product, Category, ProductsResponse } from '@/types';
import ProductCard from '@/components/products/ProductCard';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          api.getProducts({ limit: 8, sortBy: 'createdAt', sortOrder: 'desc' }),
          api.getCategories(),
        ]);
        setFeaturedProducts(productsRes.products || []);
        setCategories(categoriesRes || []);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div>
      {/* ─── Hero Section ─────────────────────────────────── */}
      <section
        className="bg-gradient-hero"
        style={{
          position: 'relative',
          overflow: 'hidden',
          padding: '6rem 0 5rem',
          color: 'white',
        }}
      >
        {/* Decorative Elements */}
        <div
          style={{
            position: 'absolute',
            top: '-50%',
            right: '-20%',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(233,69,96,0.15) 0%, transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-30%',
            left: '-10%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(201,169,110,0.1) 0%, transparent 70%)',
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '640px' }}>
            <div
              className="badge badge-gold"
              style={{ marginBottom: '1.5rem', fontSize: '0.8125rem', padding: '0.375rem 1rem' }}
            >
              ✨ New Collection 2024
            </div>
            <h1
              className="font-display animate-fade-in-up"
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 3.75rem)',
                fontWeight: 700,
                lineHeight: 1.15,
                marginBottom: '1.5rem',
              }}
            >
              Premium Quality{' '}
              <span style={{ color: 'var(--color-gold)' }}>Textiles</span> for
              Every Creation
            </h1>
            <p
              className="animate-fade-in-up"
              style={{
                fontSize: '1.125rem',
                color: 'rgba(255,255,255,0.75)',
                marginBottom: '2rem',
                lineHeight: 1.7,
                animationDelay: '0.1s',
              }}
            >
              Discover our curated collection of world-class fabrics — from luxurious
              Egyptian cotton to stunning mulberry silk. Crafted for designers, tailors,
              and creators who demand the finest.
            </p>
            <div
              className="animate-fade-in-up"
              style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', animationDelay: '0.2s' }}
            >
              <Link href="/products" className="btn btn-primary btn-lg">
                Shop Collection
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </Link>
              <Link href="/categories" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
                Browse Categories
              </Link>
            </div>

            {/* Stats */}
            <div
              className="animate-fade-in-up"
              style={{
                display: 'flex',
                gap: '2.5rem',
                marginTop: '3rem',
                paddingTop: '2rem',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                animationDelay: '0.3s',
              }}
            >
              {[
                { value: '500+', label: 'Fabric Types' },
                { value: '10K+', label: 'Happy Customers' },
                { value: '99%', label: 'Quality Rate' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-gold)' }}>{stat.value}</p>
                  <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.5)' }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Categories Section ───────────────────────────── */}
      <section style={{ padding: '5rem 0 3rem' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{ color: 'var(--color-accent)', fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Explore
            </p>
            <h2 className="font-display" style={{ fontSize: '2rem', fontWeight: 700 }}>
              Shop by Category
            </h2>
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="skeleton" style={{ height: '120px' }} />
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
              {categories.map((cat, idx) => (
                <Link
                  key={cat.id}
                  href={`/products?categoryId=${cat.id}`}
                  className="card animate-fade-in-up"
                  style={{
                    padding: '1.5rem',
                    textAlign: 'center',
                    textDecoration: 'none',
                    color: 'var(--color-text)',
                    animationDelay: `${idx * 0.05}s`,
                  }}
                >
                  <div
                    style={{
                      width: '3rem',
                      height: '3rem',
                      borderRadius: '0.75rem',
                      background: `hsl(${idx * 55 + 200}, 60%, 95%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 0.75rem',
                      fontSize: '1.25rem',
                    }}
                  >
                    {['🧵', '✨', '🌾', '🔷', '👖'][idx] || '🧶'}
                  </div>
                  <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                    {cat.name}
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    {cat._count?.products || 0} products
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── Featured Products ────────────────────────────── */}
      <section style={{ padding: '2rem 0 5rem', background: 'var(--color-border-light)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
            <div>
              <p style={{ color: 'var(--color-accent)', fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Curated Selection
              </p>
              <h2 className="font-display" style={{ fontSize: '2rem', fontWeight: 700 }}>
                Featured Fabrics
              </h2>
            </div>
            <Link
              href="/products"
              style={{
                color: 'var(--color-accent)',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              View All
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </Link>
          </div>

          {loading ? (
            <div className="product-grid">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="skeleton" style={{ height: '360px' }} />
              ))}
            </div>
          ) : (
            <div className="product-grid">
              {featuredProducts.map((product, idx) => (
                <ProductCard key={product.id} product={product} index={idx} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── CTA Section ──────────────────────────────────── */}
      <section style={{ padding: '5rem 0', background: 'var(--color-primary)', color: 'white', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '640px' }}>
          <h2 className="font-display" style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>
            Ready to Transform Your Creations?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', marginBottom: '2rem', lineHeight: 1.7 }}>
            Join thousands of designers and tailors who trust TextileShop for premium quality fabrics.
            Free shipping on orders over $100.
          </p>
          <Link href="/products" className="btn btn-gold btn-lg">
            Start Shopping
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
