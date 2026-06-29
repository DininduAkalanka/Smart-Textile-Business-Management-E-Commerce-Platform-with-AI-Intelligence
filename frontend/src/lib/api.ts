import { ApiResponse, AuthResponse, ProductsResponse, Product, OrdersResponse, Order, Category, PaymentIntentResponse, InstallmentSchedule } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.data !== undefined ? data.data : data;
  }

  // ─── Auth ─────────────────────────────────────────────

  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  // ─── Products ─────────────────────────────────────────

  async getProducts(params?: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
    categorySlug?: string;
    subCategory?: string;
    collection?: string;
    offers?: string;
    tier?: string;
    period?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<ProductsResponse> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.set(key, String(value));
        }
      });
    }
    const query = searchParams.toString();
    return this.request<ProductsResponse>(`/products${query ? `?${query}` : ''}`);
  }

  async getProductBySlug(slug: string): Promise<Product> {
    return this.request<Product>(`/products/slug/${slug}`);
  }

  async getProductById(id: string): Promise<Product> {
    return this.request<Product>(`/products/${id}`);
  }

  async createProduct(data: any): Promise<Product> {
    return this.request<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProduct(id: string, data: any): Promise<Product> {
    return this.request<Product>(`/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteProduct(id: string): Promise<void> {
    return this.request(`/products/${id}`, { method: 'DELETE' });
  }

  // ─── Categories ───────────────────────────────────────

  async getCategories(): Promise<Category[]> {
    return this.request<Category[]>('/categories');
  }

  async createCategory(data: {
    name: string;
    description?: string;
  }): Promise<Category> {
    return this.request<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ─── Orders ───────────────────────────────────────────

  async createOrder(data: {
    items: { productId: string; quantity: number }[];
    shippingAddress: any;
    billingAddress?: any;
    notes?: string;
  }): Promise<Order> {
    return this.request<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getOrders(page = 1, limit = 10): Promise<OrdersResponse> {
    return this.request<OrdersResponse>(`/orders?page=${page}&limit=${limit}`);
  }

  async getOrderById(id: string): Promise<Order> {
    return this.request<Order>(`/orders/${id}`);
  }

  async getAllOrders(page = 1, limit = 20, status?: string): Promise<OrdersResponse> {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (status) params.set('status', status);
    return this.request<OrdersResponse>(`/orders/admin/all?${params}`);
  }

  async updateOrderStatus(id: string, status: string): Promise<Order> {
    return this.request<Order>(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // ─── Payments ─────────────────────────────────────────

  async getStripeConfig(): Promise<{ publishableKey: string | null; isConfigured: boolean }> {
    return this.request('/payments/config');
  }

  async createFullPayment(orderId: string): Promise<PaymentIntentResponse> {
    return this.request<PaymentIntentResponse>('/payments/full', {
      method: 'POST',
      body: JSON.stringify({ orderId }),
    });
  }

  async createInstallmentPayment(orderId: string, installmentCount: number): Promise<PaymentIntentResponse> {
    return this.request<PaymentIntentResponse>('/payments/installment', {
      method: 'POST',
      body: JSON.stringify({ orderId, installmentCount }),
    });
  }

  async payInstallment(installmentId: string): Promise<{ installmentId: string; installmentNo: number; amount: number; clientSecret: string }> {
    return this.request(`/payments/installment/${installmentId}/pay`, {
      method: 'POST',
    });
  }

  async getPayment(orderId: string) {
    return this.request(`/payments/${orderId}`);
  }

  async getInstallmentSchedule(orderId: string): Promise<InstallmentSchedule> {
    return this.request<InstallmentSchedule>(`/payments/${orderId}/installments`);
  }

  async confirmPayment(orderId: string) {
    return this.request(`/payments/confirm/${orderId}`, {
      method: 'POST',
    });
  }

  async confirmInstallment(installmentId: string) {
    return this.request(`/payments/confirm-installment/${installmentId}`, {
      method: 'POST',
    });
  }
}

export const api = new ApiClient();

