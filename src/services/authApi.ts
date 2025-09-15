import {
  apiCall,
  setAuthData,
  setUserData,
  clearAuthData,
} from '../config/api';
import { ApiResponse } from '../config/api';

// Auth API types (exactly matching server responses)
export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface VerifyOTPRequest {
  email: string;
  otp: string;
}

export interface ResendOTPRequest {
  email: string;
}

// Server Login Response (exact match)
export interface LoginResponse {
  accessToken: string | null;
  user: {
    uuid: string;
    username: string;
    email: string;
    isActive: boolean;
    otpVerifiedAt?: string;
    createdAt: string;
    updatedAt: string;
  };
  requiresVerification?: boolean;
}

// Server Register Response (exact match)
export interface RegisterResponse {
  message: string;
  user: {
    uuid: string;
    username: string;
    email: string;
    isActive: boolean;
    otpVerifiedAt?: string;
    createdAt: string;
    updatedAt: string;
  };
  otpInfo: {
    expiresIn: string;
    type: string;
  };
}

// Server Verify OTP Response (exact match)
export interface VerifyOTPResponse {
  message: string;
  email: string;
  otpVerifiedAt: string;
  user: {
    uuid: string;
    username: string;
    email: string;
    isActive: boolean;
    otpVerifiedAt: string;
    createdAt: string;
    updatedAt: string;
  };
}

// Server Resend OTP Response (exact match)
export interface ResendOTPResponse {
  message: string;
  email: string;
  username: string;
  otpInfo: {
    expiresIn: string;
    type: string;
  };
}

// Authentication API services
export const authApi = {
  // Login user
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    console.log('🔍 Login request data:', data);
    
    const response = await apiCall<LoginResponse>({
      method: 'POST',
      url: '/auth/login',
      data,
    });

    console.log('🔍 Login API response:', response);
    console.log('🔍 Response type:', typeof response);
    console.log('🔍 Response keys:', Object.keys(response || {}));

    // Store auth data if token exists
    if (response.accessToken) {
      console.log('🔍 Storing auth data with token');
      await setAuthData({
        accessToken: response.accessToken,
        refreshToken: '', // Your server doesn't use refresh tokens
      });
      await setUserData(response.user);
    } else {
      console.log('🔍 No access token in response');
    }

    return response;
  },

  // Register user
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await apiCall<RegisterResponse>({
      method: 'POST',
      url: '/auth/register',
      data,
    });

    // Store user data (no token until OTP verification)
    await setUserData(response.user);

    return response;
  },

  // Verify registration OTP
  verifyOTP: async (data: VerifyOTPRequest): Promise<VerifyOTPResponse> => {
    const response = await apiCall<VerifyOTPResponse>({
      method: 'POST',
      url: '/auth/verify-registration-otp',
      data,
    });

    // Update stored user data
    await setUserData(response.user);

    return response;
  },

  // Resend registration OTP
  resendOTP: async (data: ResendOTPRequest): Promise<ResendOTPResponse> => {
    const response = await apiCall<ResendOTPResponse>({
      method: 'POST',
      url: '/auth/resend-registration-otp',
      data,
    });

    return response;
  },

  // Logout user (client-side only since server doesn't have logout endpoint)
  logout: async (): Promise<void> => {
    // Clear local auth data
    await clearAuthData();
  },
};
