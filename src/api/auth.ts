import { api, apiRequest, setAccessToken, clearAccessToken } from './client';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  profilePicture?: string;
  role: string;
  orgId?: string;
  authMethods: string[];
  isEmailVerified: boolean;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface ChangePasswordRequest {
  currentPassword?: string;
  newPassword?: string;
}

export interface SetPasswordRequest {
  password?: string;
}

export interface VerifyEmailRequest {
  email?: string;
  otp: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  password?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  console.error('VITE_API_BASE_URL is not defined in auth.ts!');
}

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', data);
    setAccessToken(response.accessToken);
    return response;
  },

  register: async (data: RegisterRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/register', data);
    setAccessToken(response.accessToken);
    return response;
  },

  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } finally {
      clearAccessToken();
    }
  },

  getMe: async (): Promise<User> => {
    return api.get<User>('/auth/me');
  },

  refreshToken: async (): Promise<string | null> => {
    try {
      const response = await apiRequest<{ accessToken: string }>('/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      }, true);
      if (response.accessToken) {
        setAccessToken(response.accessToken);
        return response.accessToken;
      }
      return null;
    } catch {
      return null;
    }
  },

  updateProfile: async (data: UpdateProfileRequest): Promise<User> => {
    return api.patch<User>('/auth/profile', data);
  },

  uploadProfilePicture: async (file: File): Promise<User> => {
    const formData = new FormData();
    formData.append('profilePicture', file);
    return api.patch<User>('/auth/profile', formData);
  },

  getGoogleAuthUrl: (): string => {
    return `${API_BASE_URL}/auth/google`;
  },

  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    await api.post('/auth/change-password', data);
  },

  setPassword: async (data: SetPasswordRequest): Promise<void> => {
    await api.post('/auth/set-password', data);
  },

  verifyEmail: async (data: VerifyEmailRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/verify-email', data);
    setAccessToken(response.accessToken);
    return response;
  },

  resendVerification: async (email: string): Promise<void> => {
    await api.post('/auth/resend-verification', { email });
  },

  forgotPassword: async (data: ForgotPasswordRequest): Promise<void> => {
    await api.post('/auth/forgot-password', data);
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<void> => {
    await api.post('/auth/reset-password', data);
  },
};
