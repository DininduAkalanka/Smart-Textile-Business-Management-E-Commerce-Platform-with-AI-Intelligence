'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, totalItems, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Confirm

  const [address, setAddress] = useState({
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Sri Lanka',
    phone: '',
  });

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
        <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛒</p>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>No items in your cart</h2>
        <Link href="/products" className="btn btn-primary">Shop Now</Link>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
        <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</p>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>Please sign in to checkout</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>You need an account to place an order</p>
        <Link href="/login" className="btn btn-primary btn-lg">Sign In</Link>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError('');
    try {
      const orderData = {
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
        shippingAddress: address,
      };

      const order = await api.createOrder(orderData);

      // Create payment intent
      await api.createPaymentIntent(order.id);

      // Simulate payment confirmation (in production, this would be Stripe)
      await api.confirmPayment(order.id);

      clearCart();
      router.push(`/orders/${order.id}?success=true`);
    } catch (err: any) {
      setError(err.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const isAddressValid = address.fullName && address.addressLine1 && address.city && address.state && address.postalCode && address.country;

  return (
    <div className="container" style={{ padding: '2rem 0 4rem' }}>
      <h1 className="font-display" style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem' }}>
        Checkout
      </h1>

      {/* Progress Steps */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2.5rem' }}>
        {[
          { num: 1, label: 'Shipping' },
          { num: 2, label: 'Review' },
          { num: 3, label: 'Complete' },
        ].map((s, i) => (
          <div key={s.num} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div
              style={{
                width: '2rem',
                height: '2rem',
                borderRadius: '50%',
                background: step >= s.num ? 'var(--color-accent)' : 'var(--color-border)',
                color: step >= s.num ? 'white' : 'var(--color-text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 600,
                transition: 'all 0.3s',
              }}
            >
              {step > s.num ? '✓' : s.num}
            </div>
            <span style={{ fontSize: '0.875rem', fontWeight: step === s.num ? 600 : 400, color: step === s.num ? 'var(--color-text)' : 'var(--color-text-muted)' }}>
              {s.label}
            </span>
            {i < 2 && <div style={{ width: '3rem', height: '2px', background: step > s.num ? 'var(--color-accent)' : 'var(--color-border)', margin: '0 0.5rem' }} />}
          </div>
        ))}
      </div>

      {error && (
        <div style={{ background: '#fef2f2', color: '#991b1b', padding: '0.75rem 1rem', borderRadius: '0.5rem', fontSize: '0.875rem', marginBottom: '1.5rem', border: '1px solid #fecaca' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2.5rem', alignItems: 'start' }}>
        {/* Main Content */}
        <div>
          {step === 1 && (
            <div className="card" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Shipping Address</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label className="input-label">Full Name *</label>
                  <input className="input" name="fullName" value={address.fullName} onChange={handleChange} placeholder="John Doe" required />
                </div>
                <div>
                  <label className="input-label">Address Line 1 *</label>
                  <input className="input" name="addressLine1" value={address.addressLine1} onChange={handleChange} placeholder="123 Main Street" required />
                </div>
                <div>
                  <label className="input-label">Address Line 2</label>
                  <input className="input" name="addressLine2" value={address.addressLine2} onChange={handleChange} placeholder="Apt 4B" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="input-label">City *</label>
                    <input className="input" name="city" value={address.city} onChange={handleChange} placeholder="Colombo" required />
                  </div>
                  <div>
                    <label className="input-label">State / Province *</label>
                    <input className="input" name="state" value={address.state} onChange={handleChange} placeholder="Western Province" required />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="input-label">Postal Code *</label>
                    <input className="input" name="postalCode" value={address.postalCode} onChange={handleChange} placeholder="10100" required />
                  </div>
                  <div>
                    <label className="input-label">Country *</label>
                    <input className="input" name="country" value={address.country} onChange={handleChange} placeholder="Sri Lanka" required />
                  </div>
                </div>
                <div>
                  <label className="input-label">Phone</label>
                  <input className="input" name="phone" value={address.phone} onChange={handleChange} placeholder="+94 77 123 4567" />
                </div>
                <button
                  className="btn btn-primary btn-lg"
                  style={{ marginTop: '0.5rem' }}
                  onClick={() => setStep(2)}
                  disabled={!isAddressValid}
                >
                  Continue to Review
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              {/* Address Review */}
              <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Shipping Address</h3>
                  <button onClick={() => setStep(1)} className="btn btn-outline btn-sm">Edit</button>
                </div>
                <p style={{ fontSize: '0.9375rem', lineHeight: 1.7, color: 'var(--color-text-muted)' }}>
                  {address.fullName}<br />
                  {address.addressLine1}{address.addressLine2 ? `, ${address.addressLine2}` : ''}<br />
                  {address.city}, {address.state} {address.postalCode}<br />
                  {address.country}
                  {address.phone && <><br />{address.phone}</>}
                </p>
              </div>

              {/* Items Review */}
              <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Order Items</h3>
                {items.map((item) => (
                  <div key={item.product.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--color-border-light)' }}>
                    <div>
                      <p style={{ fontWeight: 500, fontSize: '0.9375rem' }}>{item.product.name}</p>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>Qty: {item.quantity} × ${Number(item.product.price).toFixed(2)}</p>
                    </div>
                    <p style={{ fontWeight: 600 }}>${(Number(item.product.price) * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <button
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
                onClick={handlePlaceOrder}
                disabled={loading}
              >
                {loading ? 'Processing Payment...' : `Place Order — $${subtotal().toFixed(2)}`}
              </button>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div
          style={{
            background: 'white',
            borderRadius: '1rem',
            border: '1px solid var(--color-border-light)',
            padding: '1.5rem',
            position: 'sticky',
            top: '6rem',
          }}
        >
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.5rem' }}>Order Summary</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
            {items.map((item) => (
              <div key={item.product.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>{item.product.name} × {item.quantity}</span>
                <span>${(Number(item.product.price) * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--color-border-light)', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9375rem' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Subtotal</span>
              <span>${subtotal().toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9375rem' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Shipping</span>
              <span style={{ color: '#065f46' }}>Free</span>
            </div>
          </div>

          <div style={{ borderTop: '2px solid var(--color-border)', marginTop: '1rem', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', fontSize: '1.125rem', fontWeight: 700 }}>
            <span>Total</span>
            <span>${subtotal().toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
