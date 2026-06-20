'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Product } from '@/types';
import { useCartStore } from '@/store/useCartStore';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    if (slug) {
      api.getProductBySlug(slug).then(setProduct).catch(console.error).finally(() => setLoading(false));
    }
  }, [slug]);

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '3rem 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
          <div className="skeleton" style={{ height: '500px' }} />
          <div>
            <div className="skeleton" style={{ height: '2rem', width: '60%', marginBottom: '1rem' }} />
            <div className="skeleton" style={{ height: '1rem', width: '40%', marginBottom: '2rem' }} />
            <div className="skeleton" style={{ height: '6rem', marginBottom: '2rem' }} />
            <div className="skeleton" style={{ height: '3rem', width: '200px' }} />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
        <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>😕</p>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>Product Not Found</h2>
        <Link href="/products" className="btn btn-primary" style={{ marginTop: '1rem' }}>Back to Products</Link>
      </div>
    );
  }

  const discount = product.compareAtPrice
    ? Math.round((1 - Number(product.price) / Number(product.compareAtPrice)) * 100)
    : 0;

  return (
    <div className="container" style={{ padding: '2rem 0 4rem' }}>
      {/* Breadcrumb */}
      <nav style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
        <Link href="/" style={{ textDecoration: 'none', color: 'var(--color-text-muted)' }}>Home</Link>
        <span>/</span>
        <Link href="/products" style={{ textDecoration: 'none', color: 'var(--color-text-muted)' }}>Products</Link>
        <span>/</span>
        <span style={{ color: 'var(--color-text)' }}>{product.name}</span>
      </nav>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>
        {/* Image */}
        <div
          style={{
            borderRadius: '1rem',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, hsl(220, 25%, 88%), hsl(250, 30%, 82%))',
            height: '500px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            position: 'relative',
          }}
        >
          {discount > 0 && (
            <div className="sale-tag" style={{ fontSize: '0.875rem', padding: '0.375rem 0.875rem' }}>
              -{discount}% OFF
            </div>
          )}
          <span style={{ fontSize: '5rem' }}>🧵</span>
          <span style={{ fontSize: '1rem', color: 'rgba(0,0,0,0.4)', fontWeight: 500 }}>
            {product.attributes?.fabricType || 'Premium Fabric'}
          </span>
        </div>

        {/* Details */}
        <div>
          {product.category && (
            <Link
              href={`/products?categoryId=${product.category.id}`}
              style={{
                display: 'inline-block',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--color-accent)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                textDecoration: 'none',
                marginBottom: '0.75rem',
              }}
            >
              {product.category.name}
            </Link>
          )}

          <h1 className="font-display" style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem', lineHeight: 1.3 }}>
            {product.name}
          </h1>

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text)' }}>
              ${Number(product.price).toFixed(2)}
            </span>
            {product.compareAtPrice && (
              <span style={{ fontSize: '1.125rem', color: 'var(--color-text-light)', textDecoration: 'line-through' }}>
                ${Number(product.compareAtPrice).toFixed(2)}
              </span>
            )}
            {discount > 0 && (
              <span className="badge badge-success" style={{ fontSize: '0.8125rem' }}>Save {discount}%</span>
            )}
          </div>

          {/* Description */}
          <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: '2rem', fontSize: '0.9375rem' }}>
            {product.description}
          </p>

          {/* Attributes */}
          {product.attributes && Object.keys(product.attributes).length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)' }}>
                Specifications
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                {Object.entries(product.attributes).map(([key, value]) => (
                  <div
                    key={key}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '0.625rem 0.875rem',
                      background: 'var(--color-border-light)',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                    }}
                  >
                    <span style={{ color: 'var(--color-text-muted)', textTransform: 'capitalize' }}>
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span style={{ fontWeight: 500 }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SKU */}
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-light)', marginBottom: '1.5rem' }}>
            SKU: {product.sku}
          </p>

          {/* Stock */}
          <div style={{ marginBottom: '1.5rem' }}>
            {product.stockQuantity > 10 ? (
              <span className="badge badge-success">✓ In Stock ({product.stockQuantity} available)</span>
            ) : product.stockQuantity > 0 ? (
              <span className="badge badge-warning">⚠ Only {product.stockQuantity} left</span>
            ) : (
              <span className="badge badge-danger">✕ Out of Stock</span>
            )}
          </div>

          {/* Add to Cart */}
          {product.stockQuantity > 0 && (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--color-border)', borderRadius: '0.5rem', overflow: 'hidden' }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ padding: '0.625rem 1rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', fontWeight: 600 }}
                >
                  −
                </button>
                <span style={{ padding: '0.625rem 1rem', minWidth: '3rem', textAlign: 'center', fontSize: '0.9375rem', fontWeight: 500, borderLeft: '1px solid var(--color-border)', borderRight: '1px solid var(--color-border)' }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                  style={{ padding: '0.625rem 1rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', fontWeight: 600 }}
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className={`btn btn-lg ${added ? 'btn-secondary' : 'btn-primary'}`}
                style={{ flex: 1 }}
              >
                {added ? '✓ Added to Cart!' : 'Add to Cart'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
