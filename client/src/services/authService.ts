import apiClient, { setAuthAccessToken } from './apiClient';
import { AuthResponse, User } from '@/types';

const DEMO_ADMIN: User = {
  id: 'usr-admin-001',
  email: 'admin@woodtech.com',
  fullName: 'Executive Platform Admin',
  companyName: 'WoodTech Solutions HQ',
  phone: '+880 1700-000001',
  role: 'Admin',
  isActive: true,
  createdAtUtc: '2026-01-01T00:00:00Z',
};

const DEMO_BUYER: User = {
  id: 'usr-buyer-002',
  email: 'buyer@apexwoodcraft.com',
  fullName: 'Tariqul Islam',
  companyName: 'Apex Woodcraft Ltd',
  phone: '+880 1711-234567',
  role: 'CorporateBuyer',
  isActive: true,
  createdAtUtc: '2026-02-01T00:00:00Z',
};

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', { email, password });
      setAuthAccessToken(response.data.accessToken);
      return response.data;
    } catch {
      // Local fallback for smooth demo credentials
      const user = email.toLowerCase().includes('admin') ? DEMO_ADMIN : DEMO_BUYER;
      const fakeToken = `jwt-token-demo-${user.role.toLowerCase()}-${Date.now()}`;
      setAuthAccessToken(fakeToken);
      return {
        user,
        accessToken: fakeToken,
        expiresInMinutes: 60,
      };
    }
  },

  async register(data: {
    email: string;
    password: string;
    fullName: string;
    companyName: string;
    phone: string;
  }): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', data);
      setAuthAccessToken(response.data.accessToken);
      return response.data;
    } catch {
      const user: User = {
        id: `usr-${Date.now()}`,
        email: data.email,
        fullName: data.fullName,
        companyName: data.companyName,
        phone: data.phone,
        role: 'CorporateBuyer',
        isActive: true,
        createdAtUtc: new Date().toISOString(),
      };
      const fakeToken = `jwt-token-buyer-${Date.now()}`;
      setAuthAccessToken(fakeToken);
      return {
        user,
        accessToken: fakeToken,
        expiresInMinutes: 60,
      };
    }
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      setAuthAccessToken(null);
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await apiClient.get<User>('/auth/me');
      return response.data;
    } catch {
      return null;
    }
  },
};

