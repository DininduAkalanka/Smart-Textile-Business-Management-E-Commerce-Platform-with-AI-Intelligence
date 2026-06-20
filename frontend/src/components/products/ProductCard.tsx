'use client';

import Link from 'next/link';
import { Product } from '@/types';
import { useCartStore } from '@/store/useCartStore';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const discount = product.compareAtPrice
    ? Math.round((1 - Number(product.price) / Number(product.compareAtPrice)) * 100)
    : 0;

  return (
    <div
      className="card animate-fade-in-up"
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        animationDelay: `${index * 0.05}s`,
      }}
    >
      {/* Sale Badge */}
      {discount > 0 && <div className="sale-tag">-{discount}%</div>}

      {/* Image Placeholder */}
      <Link
        href={`/products/${product.slug}`}
        style={{ textDecoration: 'none' }}
      >
        <div
          style={{
            height: '220px',
            background: `linear-gradient(135deg, hsl(${(index * 37 + 200) % 360}, 25%, 88%), hsl(${(index * 37 + 230) % 360}, 30%, 82%))`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <span style={{ fontSize: '2.5rem' }}>🧵</span>
          <span
            style={{
              fontSize: '0.75rem',
              color: 'rgba(0,0,0,0.4)',
              fontWeight: 500,
            }}
          >
            {product.attributes?.fabricType || 'Fabric'}
          </span>

          {/* Hover overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(26,26,46,0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0,
              transition: 'opacity 0.3s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
          >
            <span
              style={{
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: 500,
                padding: '0.5rem 1.25rem',
                border: '1.5px solid white',
                borderRadius: '0.375rem',
              }}
            >
              View Details
            </span>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Category */}
        {product.category && (
          <p style={{ fontSize: '0.6875rem', color: 'var(--color-accent)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.375rem' }}>
            {product.category.name}
          </p>
        )}

        {/* Name */}
        <Link
          href={`/products/${product.slug}`}
          style={{
            textDecoration: 'none',
            color: 'var(--color-text)',
            fontSize: '0.9375rem',
            fontWeight: 600,
            lineHeight: 1.4,
            marginBottom: '0.5rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {product.name}
        </Link>

        {/* Attributes */}
        <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          {product.attributes?.color && (
            <span style={{ fontSize: '0.6875rem', padding: '0.125rem 0.5rem', background: 'var(--color-border-light)', borderRadius: '0.25rem', color: 'var(--color-text-muted)' }}>
              {product.attributes.color}
            </span>
          )}
          {product.attributes?.gsm && (
            <span style={{ fontSize: '0.6875rem', padding: '0.125rem 0.5rem', background: 'var(--color-border-light)', borderRadius: '0.25rem', color: 'var(--color-text-muted)' }}>
              {product.attributes.gsm} GSM
            </span>
          )}
        </div>

        {/* Price + Cart */}
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-text)' }}>
              ${Number(product.price).toFixed(2)}
            </span>
            {product.compareAtPrice && (
              <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-light)', textDecoration: 'line-through', marginLeft: '0.5rem' }}>
                ${Number(product.compareAtPrice).toFixed(2)}
              </span>
            )}
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              addItem(product, 1);
            }}
            className="btn btn-primary btn-sm"
            style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem' }}
            title="Add to Cart"
          >
            + Cart
          </button>
        </div>

        {/* Stock indicator */}
        {product.stockQuantity <= 10 && product.stockQuantity > 0 && (
          <p style={{ fontSize: '0.6875rem', color: 'var(--color-accent)', marginTop: '0.5rem', fontWeight: 500 }}>
            Only {product.stockQuantity} left in stock
          </p>
        )}
      </div>
    </div>
  );
}
