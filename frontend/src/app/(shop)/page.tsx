'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState, useRef, useCallback } from 'react';
import { api } from '@/lib/api';
import { Product } from '@/types';
import ProductCard from '@/components/products/ProductCard';

/* ── SVG Icons ──────────────────────────────────────────────── */
const IconArrow = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
  </svg>
);
const IconChevronLeft = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6"/>
  </svg>
);
const IconChevronRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6"/>
  </svg>
);
const IconStore = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/>
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
    <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/>
    <path d="M2 7h20"/>
  </svg>
);

/* ── Content Data ───────────────────────────────────────────── */
const HERO_SLIDES = [
  {
    id: 1,
    eyebrow: 'Women Collection 2026',
    headline: 'Editorial Sarees & Dress Materials',
    subheadline: 'Crafted with premium silk blends and traditional weaves. Elevate your wardrobe for the new season.',
    primaryCta: { label: "Shop Women's Wear", href: '/products?category=women' },
    secondaryCta: { label: 'View Latest Sarees', href: '/products?category=women&sub=sarees' },
    accentColor: 'var(--clr-brand)',
    image: '/images/categories/women.jpg',
  },
  {
    id: 2,
    eyebrow: 'Modern Menswear',
    headline: 'Slim Fit Chinos & Classic Oxfords',
    subheadline: 'Crisp fabrics and comfortable fits engineered for the modern gentleman, from workwear to dinners.',
    primaryCta: { label: "Explore Men's Wear", href: '/products?category=men' },
    secondaryCta: { label: 'Formal Shirts', href: '/products?category=men&sub=shirts' },
    accentColor: 'var(--clr-gold)',
    image: '/images/categories/men.jpg',
  },
  {
    id: 3,
    eyebrow: 'Uniform Specialists',
    headline: 'School & Corporate Attire',
    subheadline: 'Durable, government-approved fabrics designed to stand up to heavy daily wear and washing.',
    primaryCta: { label: 'Browse Uniforms', href: '/products?category=uniforms' },
    secondaryCta: { label: 'Office blazer', href: '/products?category=uniforms&sub=corporate' },
    accentColor: 'var(--clr-brand)',
    image: '/images/categories/uniforms.jpg',
  },
];

const DEPARTMENTS = [
  { id: 'women', label: 'Women', subLabel: 'Sarees & Dresses', href: '/products?category=women', img: '/images/categories/women.jpg' },
  { id: 'men', label: 'Men', subLabel: 'Formal & Casual', href: '/products?category=men', img: '/images/categories/men.jpg' },
  { id: 'teenagers', label: 'Teenagers', subLabel: 'Trendy Streetwear', href: '/products?category=teenagers', img: '/images/categories/teenagers.jpg' },
  { id: 'uniforms', label: 'Uniforms', subLabel: 'School & Corporate', href: '/products?category=uniforms', img: '/images/categories/uniforms.jpg' },
];

const TRUST_ITEMS = [
  { id: 'delivery', iconPath: 'M5 12h14M12 5l7 7-7 7M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z', title: 'Island-Wide Delivery', body: 'Reliable delivery across all 25 districts. Free on orders above Rs. 5,000.' },
  { id: 'koko', iconPath: 'M9 12l2 2 4-4M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', title: '3 Split Payments (Koko)', body: 'Buy now, pay later. Divide your order into 3 interest-free installments.' },
  { id: 'returns', iconPath: 'M3 2v6h6M3 8C4.657 4.953 8.045 3 12 3c4.418 0 8 3.582 8 8s-3.582 8-8 8c-3.566 0-6.618-2.167-7.747-5.25', title: 'Easy 7-Day Returns', body: 'Wrong size or fit? Exchange locally or ship back within 7 days.' },
];

/* ── Brand Logos SVGs ───────────────────────────────────────── */
const LogoAivo = () => (
  <svg width="140" height="50" viewBox="0 0 140 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 10L24.5 22L36 24.5L24.5 27L22 38.5L19.5 27L8 24.5L19.5 22L22 10Z" fill="#0083c4" stroke="#0083c4" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M16 16L18 23L25 25L18 27L16 34L14 27L7 25L14 23L16 16Z" fill="#fff"/>
    <text x="44" y="28" fontFamily="var(--font-sans)" fontSize="20" fontWeight="700" fill="#0083c4" letterSpacing="-0.02em">Aivo</text>
    <text x="44" y="38" fontFamily="var(--font-mono)" fontSize="6" fontWeight="600" fill="#a8a8a8" letterSpacing="0.18em">SPECIAL GUEST</text>
  </svg>
);

const LogoUSPolo = () => (
  <svg width="140" height="50" viewBox="0 0 140 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 8C22 8 20.5 10 19 11.5C18 12.5 17 14 17.5 15.5C18 17 19.5 18 20.5 19C21 19.5 21.5 20.5 21.5 21.5C21.5 23 20 24.5 19 25.5C18.5 26 18 27 18.5 28C19 29 20.5 29.5 21.5 29.5C23 29.5 24 28 24.5 27C25 26 26.5 25 26 23C25.5 21 24.5 19 24.5 18.5C24.5 18 25 17.5 25.5 17.5C26 17.5 27 18 27.5 18.5C28.5 19.5 29 21.5 30 22C30.5 22.5 31.5 21.5 31 20.5C30.5 19.5 29 17 28 15.5C27 14 25.5 12 25.5 11.5C25.5 11 26 10.5 26.5 10.5C27 10.5 28.5 12 29 12.5C29.5 13 30.5 12.5 30 11.5C29.5 10.5 27.5 8 26.5 7C25.5 6 24 5 23 5C22 5 22 8 22 8Z" fill="#1d2e5a"/>
    <text x="36" y="24" fontFamily="var(--font-serif)" fontSize="12" fontWeight="700" fill="#1d2e5a" letterSpacing="0.05em">U.S. POLO ASSN.</text>
    <text x="36" y="32" fontFamily="var(--font-mono)" fontSize="5.5" fontWeight="500" fill="#a8a8a8" letterSpacing="0.1em">SINCE 1890</text>
  </svg>
);

const LogoGiggles = () => (
  <svg width="140" height="50" viewBox="0 0 140 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="14" y="30" fontFamily="var(--font-sans)" fontSize="26" fontWeight="800" fill="#b0268d" letterSpacing="-0.04em">Giggles</text>
    <text x="16" y="40" fontFamily="var(--font-mono)" fontSize="5.5" fontWeight="600" fill="#a8a8a8" letterSpacing="0.1em">INFANT COLLECTION</text>
  </svg>
);

const LogoFlipFlop = () => (
  <svg width="140" height="50" viewBox="0 0 140 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="16" y="30" fontFamily="var(--font-sans)" fontSize="22" fontWeight="700" fill="#0b7a8d" letterSpacing="0.02em">Flip Flop</text>
    <text x="18" y="38" fontFamily="var(--font-mono)" fontSize="5.5" fontWeight="500" fill="#a8a8a8" letterSpacing="0.08em">CASUAL FOOTWEAR</text>
  </svg>
);

const LogoEthnicFusion = () => (
  <svg width="150" height="50" viewBox="0 0 150 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="5" width="140" height="40" fill="#091428" rx="2"/>
    <text x="16" y="29" fontFamily="var(--font-serif)" fontSize="15" fontStyle="italic" fill="#e8c84a" letterSpacing="0.04em">Ethnic Fusion</text>
  </svg>
);

const BRANDS = [
  { name: 'Aivo', render: LogoAivo },
  { name: 'U.S. Polo Assn.', render: LogoUSPolo },
  { name: 'Giggles', render: LogoGiggles },
  { name: 'Flip Flop', render: LogoFlipFlop },
  { name: 'Ethnic Fusion', render: LogoEthnicFusion },
];

const MARQUEE_ITEMS = [
  'Island-Wide Delivery across Sri Lanka',
  '3 Interest-Free Installments with Koko & Mintpay',
  'Nandana Textile — Premium Quality Since 2009',
  'Uniform Orders Open for Schools & Offices',
  'Saree & Dress Materials Collection Now Live',
  'Free Delivery on Orders Over Rs. 5,000',
];

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'new' | 'trending' | 'premium'>('new');
  const [slide, setSlide] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* Brand Marquee Logic (seamless scroll) */
  const marqueeBrands = [...BRANDS, ...BRANDS, ...BRANDS, ...BRANDS];

  /* Slider Logic */
  const startTimer = useCallback(() => {
    timerRef.current = setInterval(() => setSlide(s => (s + 1) % HERO_SLIDES.length), 5500);
  }, []);

  const goToSlide = useCallback((i: number) => {
    setSlide(i);
    if (timerRef.current) clearInterval(timerRef.current);
    startTimer();
  }, [startTimer]);

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [startTimer]);

  /* Tabbed Product Fetching */
  useEffect(() => {
    setProductsLoading(true);
    const params: any = { limit: 8 };
    if (activeTab === 'new') {
      params.sortBy = 'createdAt';
      params.sortOrder = 'desc';
    } else if (activeTab === 'trending') {
      params.sortBy = 'price';
      params.sortOrder = 'desc';
    } else if (activeTab === 'premium') {
      params.subCategory = 'corporate';
    }

    api.getProducts(params)
      .then(r => setProducts(r.products || []))
      .catch(console.error)
      .finally(() => setProductsLoading(false));
  }, [activeTab]);

  const current = HERO_SLIDES[slide];

  return (
    <div style={{ background: 'var(--clr-surface)' }}>

      {/* ══════════════════════════════════════════════════
          HERO SLIDER (With Ken Burns Zoom)
      ══════════════════════════════════════════════════ */}
      <section
        id="hero"
        aria-label="Welcome Slider"
        style={{
          position: 'relative',
          overflow: 'hidden',
          minHeight: 'min(90vh, 680px)',
          display: 'flex',
          alignItems: 'center',
          background: 'var(--obsidian-950)',
        }}
      >
        {/* Animated Slide Image wrapper */}
        <div
          key={`hero-img-${current.id}`}
          className="ken-burns"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
          }}
        >
          <Image
            src={current.image}
            alt={current.headline}
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>

        {/* Readability Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.55) 60%, transparent 100%)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 2, padding: '5rem 2rem' }}>
          <div style={{ maxWidth: '640px' }}>
            {/* Slide Title */}
            <div
              key={`title-${current.id}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1.5rem',
                animation: 'fadeInUp 0.5s var(--ease-out-expo) both',
              }}
            >
              <span style={{ display: 'block', width: '24px', height: '1.5px', background: current.accentColor }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: current.accentColor }}>
                {current.eyebrow}
              </span>
            </div>

            {/* Headline */}
            <h1
              key={`headline-${current.id}`}
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2.2rem, 5vw, 3.85rem)',
                fontWeight: 600,
                lineHeight: 1.1,
                color: '#fff',
                marginBottom: '1.25rem',
                animation: 'fadeInUp 0.55s 0.08s var(--ease-out-expo) both',
              }}
            >
              {current.headline}
            </h1>

            {/* Subheadline */}
            <p
              key={`desc-${current.id}`}
              style={{
                fontSize: '0.95rem',
                lineHeight: 1.75,
                color: 'rgba(255,255,255,0.6)',
                marginBottom: '2.5rem',
                maxWidth: '480px',
                animation: 'fadeInUp 0.55s 0.16s var(--ease-out-expo) both',
              }}
            >
              {current.subheadline}
            </p>

            {/* CTAs */}
            <div
              key={`actions-${current.id}`}
              style={{
                display: 'flex',
                gap: '0.875rem',
                flexWrap: 'wrap',
                animation: 'fadeInUp 0.55s 0.24s var(--ease-out-expo) both',
              }}
            >
              <Link href={current.primaryCta.href} className="btn btn-brand btn-lg">
                {current.primaryCta.label}
                <IconArrow />
              </Link>
              <Link href={current.secondaryCta.href} className="btn btn-ghost-white btn-lg">
                {current.secondaryCta.label}
              </Link>
            </div>
          </div>
        </div>

        {/* Slide Controls */}
        <div
          style={{
            position: 'absolute',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            zIndex: 5,
          }}
        >
          <button
            aria-label="Previous Slide"
            onClick={() => goToSlide((slide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
            style={{
              width: '2.25rem', height: '2.25rem', borderRadius: '50%',
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 200ms ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--clr-brand)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
          >
            <IconChevronLeft />
          </button>

          <div style={{ display: 'flex', gap: '0.375rem' }}>
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                aria-label={`Slide index ${i}`}
                onClick={() => goToSlide(i)}
                style={{
                  height: '2px',
                  width: i === slide ? '28px' : '12px',
                  background: i === slide ? 'var(--clr-brand)' : 'rgba(255,255,255,0.25)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 300ms var(--ease-out-expo)',
                }}
              />
            ))}
          </div>

          <button
            aria-label="Next Slide"
            onClick={() => goToSlide((slide + 1) % HERO_SLIDES.length)}
            style={{
              width: '2.25rem', height: '2.25rem', borderRadius: '50%',
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 200ms ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--clr-brand)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
          >
            <IconChevronRight />
          </button>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          SCROLLING MARQUEE
      ══════════════════════════════════════════════════ */}
      <div
        style={{
          background: 'var(--clr-brand)',
          padding: '0.625rem 0',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div className="marquee-track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span
              key={i}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2rem',
                paddingRight: '4rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                textTransform: 'uppercase',
                color: '#fff',
                whiteSpace: 'nowrap',
                letterSpacing: '0.08em',
              }}
            >
              {item}
              <span style={{ display: 'block', width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          TRUST STRIP (BNPL Localized)
      ══════════════════════════════════════════════════ */}
      <section style={{ background: '#fff', borderBottom: '1px solid var(--clr-border-2)', padding: '2.5rem 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {TRUST_ITEMS.map(t => (
              <div key={t.id} className="trust-item">
                <div className="trust-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d={t.iconPath} />
                  </svg>
                </div>
                <div>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--clr-text)', marginBottom: '0.15rem' }}>{t.title}</h4>
                  <p style={{ fontSize: '0.76rem', color: 'var(--clr-text-2)', lineHeight: 1.5 }}>{t.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          EDITORIAL DEPARTMENTS GRID
      ══════════════════════════════════════════════════ */}
      <section style={{ padding: '4.5rem 0', background: 'var(--warm-50)' }}>
        <div className="container">
          <div className="section-header-center">
            <span className="label-eyebrow">Departments</span>
            <h2 className="heading-xl">Shop by Segment</h2>
            <span className="section-rule" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            {DEPARTMENTS.map((dept, idx) => (
              <Link
                key={dept.id}
                href={dept.href}
                className="animate-fade-in-up"
                style={{
                  display: 'block',
                  position: 'relative',
                  aspectRatio: '3/4',
                  borderRadius: 'var(--r-md)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-sm)',
                  animationDelay: `${idx * 0.08}s`,
                }}
              >
                {/* Background image under dark overlay */}
                <Image
                  src={dept.img}
                  alt={dept.label}
                  fill
                  style={{ objectFit: 'cover', transition: 'transform 0.4s ease' }}
                  className="dept-image"
                />
                <div
                  style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)',
                    zIndex: 1,
                  }}
                />

                {/* Content Overlay */}
                <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', right: '1.5rem', zIndex: 2 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--clr-brand)', display: 'block', marginBottom: '0.2rem' }}>
                    {dept.subLabel}
                  </span>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 600, color: '#fff', marginBottom: '0.5rem' }}>
                    {dept.label}
                  </h3>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#fff', display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
                    Shop Now <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          DYNAMIC TABBED SHOWCASE
      ══════════════════════════════════════════════════ */}
      <section style={{ padding: '5rem 0', background: '#fff' }}>
        <div className="container">
          <div className="section-header-center" style={{ marginBottom: '2rem' }}>
            <span className="label-eyebrow">Discover</span>
            <h2 className="heading-xl">Featured Showcase</h2>
            <span className="section-rule" />
          </div>

          {/* Selector Tabs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
            {[
              { id: 'new', label: 'New Arrivals' },
              { id: 'trending', label: 'Trending Items' },
              { id: 'premium', label: 'Premium Selection' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  padding: '0.5rem 1.25rem',
                  fontSize: '0.78rem',
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  borderBottom: `2px solid ${activeTab === tab.id ? 'var(--clr-brand)' : 'transparent'}`,
                  color: activeTab === tab.id ? 'var(--clr-text)' : 'var(--clr-text-3)',
                  fontWeight: activeTab === tab.id ? 600 : 400,
                  transition: 'all 200ms ease',
                  cursor: 'pointer',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Loader or Grid */}
          {productsLoading ? (
            <div className="product-grid animate-fade-in">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton-product-card">
                  <div className="skeleton-image" />
                  <div className="skeleton-info">
                    <div className="skeleton-line tag" />
                    <div className="skeleton-line title-1" />
                    <div className="skeleton-line price" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--clr-text-3)' }}>
              No products found in this category.
            </div>
          ) : (
            <div className="product-grid animate-fade-in" key={activeTab}>
              {products.map((product, idx) => (
                <ProductCard key={product.id} product={product} index={idx} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          BUY NOW PAY LATER BANNER (Koko / Mintpay Integration)
      ══════════════════════════════════════════════════ */}
      <section
        style={{
          background: 'linear-gradient(135deg, var(--crimson-950) 0%, var(--obsidian-950) 100%)',
          padding: '4.5rem 0',
          position: 'relative',
          overflow: 'hidden',
          borderTop: '1px solid var(--clr-border-dark)',
          borderBottom: '1px solid var(--clr-border-dark)',
        }}
      >
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '3rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--clr-gold)', display: 'block', marginBottom: '0.75rem' }}>
                Shop Smart In Sri Lanka
              </span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.6rem, 3vw, 2.35rem)', color: '#fff', fontWeight: 600, lineHeight: 1.2, marginBottom: '0.75rem' }}>
                Interest-Free Installments with Koko
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, maxWidth: '540px' }}>
                Split any order above Rs. 3,000 into 3 completely interest-free monthly payments at checkout. Buy your school uniforms or festive dress materials today and pay later.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minWidth: '220px' }}>
              <Link href="/products" className="btn btn-brand btn-lg" style={{ justifyContent: 'center' }}>
                Shop Collection Now
              </Link>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem', fontFamily: 'var(--font-mono)' }}>
                <span>● KOKO</span>
                <span>● MINTPAY</span>
                <span>● VISA/MASTER</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          OUR BRANDS SHOWCASE (Continuous Smooth Marquee)
      ══════════════════════════════════════════════════ */}
      <section style={{ padding: '4.5rem 0', background: 'var(--warm-50)', borderBottom: '3px solid var(--clr-brand)', position: 'relative' }}>
        <div className="container-fluid" style={{ overflow: 'hidden' }}>
          <div className="section-header-center" style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.15rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--clr-text)', margin: 0 }}>
              Our Brands
            </h2>
            <span className="section-rule" />
          </div>

          <div className="brands-marquee-container">
            <div className="brands-marquee-track">
              {marqueeBrands.map((brand, idx) => {
                const BrandLogo = brand.render;
                return (
                  <div key={idx} className="brand-slide">
                    <div className="brand-slide-inner">
                      <BrandLogo />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          NEWSLETTER SIGNUP
      ══════════════════════════════════════════════════ */}
      <section
        style={{
          background: 'var(--obsidian-950)',
          padding: '5rem 0',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <div className="container-xs" style={{ position: 'relative', zIndex: 2 }}>
          <span className="label-eyebrow" style={{ color: 'rgba(255,255,255,0.3)' }}>Join the Club</span>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', color: '#fff', fontWeight: 600, marginTop: '0.5rem', marginBottom: '1rem' }}>
            Subscribe to our Lookbook
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, marginBottom: '2.5rem' }}>
            Receive seasonal trend reports, early access to sales events, and customized bulk offers straight to your inbox.
          </p>

          <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', gap: '0.5rem', maxWidth: '440px', margin: '0 auto' }}>
            <input
              type="email"
              placeholder="Your email address"
              required
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                fontSize: '0.875rem',
                color: '#fff',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 'var(--r-xs)',
                outline: 'none',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--clr-brand)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
            />
            <button type="submit" className="btn btn-brand" style={{ padding: '0 1.5rem', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)' }}>
              Join
            </button>
          </form>
        </div>
      </section>

    </div>
  );
}
