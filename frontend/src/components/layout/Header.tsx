'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const items = useCartStore((s) => s.items) || [];
  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--color-border-light)',
      }}
    >
      {/* Top Bar */}
      <div
        style={{
          background: 'var(--color-primary)',
          color: 'white',
          fontSize: '0.75rem',
          padding: '0.375rem 0',
          textAlign: 'center',
          letterSpacing: '0.05em',
        }}
      >
        ✨ Free shipping on orders over $100 | Use code <strong>TEXTILE20</strong> for 20% off
      </div>

      {/* Main Nav */}
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '4rem' }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div
            style={{
              width: '2.25rem',
              height: '2.25rem',
              borderRadius: '0.5rem',
              background: 'linear-gradient(135deg, var(--color-accent), var(--color-gold))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1rem',
              fontWeight: 700,
            }}
          >
            T
          </div>
          <span
            className="font-display"
            style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)' }}
          >
            TextileShop
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="hide-mobile">
          <Link href="/" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500, transition: 'color 0.2s' }}>
            Home
          </Link>
          <Link href="/products" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500, transition: 'color 0.2s' }}>
            Products
          </Link>
          <Link href="/categories" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500, transition: 'color 0.2s' }}>
            Categories
          </Link>
        </nav>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Search Icon */}
          <button className="btn-icon" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: '0.5rem' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
          </button>

          {/* Cart */}
          <Link
            href="/cart"
            style={{
              position: 'relative',
              color: 'var(--color-text-muted)',
              textDecoration: 'none',
              padding: '0.5rem',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="8" cy="21" r="1"/>
              <circle cx="19" cy="21" r="1"/>
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
            </svg>
            {mounted && totalItemsCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '0',
                  right: '0',
                  background: 'var(--color-accent)',
                  color: 'white',
                  fontSize: '0.625rem',
                  fontWeight: 700,
                  width: '1.125rem',
                  height: '1.125rem',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {totalItemsCount}
              </span>
            )}
          </Link>

          {/* Auth */}
          {mounted && (isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-text)',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  padding: '0.375rem 0.75rem',
                  borderRadius: '0.5rem',
                  transition: 'background 0.2s',
                }}
              >
                <div
                  style={{
                    width: '2rem',
                    height: '2rem',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--color-accent), var(--color-gold))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                  }}
                >
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
              </button>

              {profileOpen && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '100%',
                    marginTop: '0.5rem',
                    background: 'white',
                    borderRadius: '0.75rem',
                    boxShadow: 'var(--shadow-xl)',
                    border: '1px solid var(--color-border-light)',
                    padding: '0.5rem',
                    minWidth: '12rem',
                    zIndex: 100,
                    animation: 'fadeIn 0.2s ease-out',
                  }}
                >
                  <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--color-border-light)', marginBottom: '0.25rem' }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user?.firstName} {user?.lastName}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{user?.email}</p>
                  </div>
                  <Link
                    href="/orders"
                    onClick={() => setProfileOpen(false)}
                    style={{
                      display: 'block',
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.875rem',
                      color: 'var(--color-text)',
                      textDecoration: 'none',
                      borderRadius: '0.375rem',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-border-light)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    📦 My Orders
                  </Link>
                  {user?.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      onClick={() => setProfileOpen(false)}
                      style={{
                        display: 'block',
                        padding: '0.5rem 0.75rem',
                        fontSize: '0.875rem',
                        color: 'var(--color-text)',
                        textDecoration: 'none',
                        borderRadius: '0.375rem',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-border-light)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      ⚙️ Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setProfileOpen(false);
                    }}
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.875rem',
                      color: 'var(--color-accent)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: '0.375rem',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#fef2f2')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link href="/login" className="btn btn-outline btn-sm">
                Login
              </Link>
              <Link href="/register" className="btn btn-primary btn-sm hide-mobile">
                Register
              </Link>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .hide-mobile {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
