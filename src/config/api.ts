import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DEV_SERVERS = {
  LOCALHOST: 'http://localhost:8080',
  IP_ADDRESS: 'http://10.214.129.12:8080',
};

const DEV_SERVER = DEV_SERVERS.IP_ADDRESS;

export const API_CONFIG = {
  BASE_URL: __DEV__ ? DEV_SERVER : 'https://your-production-api.com', // Production URL
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};

// Token storage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
};

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message: string;
  error?: string;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

// Create axios instance
const createApiInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  // Request interceptor to add auth token
  instance.interceptors.request.use(
    async config => {
      try {
        const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.warn('Failed to get token from storage:', error);
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );

  // Response interceptor for error handling
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async error => {
      const originalRequest = error.config;

      // Handle 401 Unauthorized
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = await AsyncStorage.getItem(
            STORAGE_KEYS.REFRESH_TOKEN
          );
          if (refreshToken) {
            // Try to refresh token
            const response = await axios.post(
              `${API_CONFIG.BASE_URL}/auth/refresh`,
              {
                refreshToken,
              }
            );

            const { accessToken } = response.data.data;
            await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);

            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return instance(originalRequest);
          }
        } catch (refreshError) {
          // Refresh failed, clear tokens and redirect to login
          await clearAuthData();
          throw refreshError;
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

// API instance
export const api = createApiInstance();

// Helper functions
export const clearAuthData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.ACCESS_TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
      STORAGE_KEYS.USER_DATA,
    ]);
  } catch (error) {
    console.warn('Failed to clear auth data:', error);
  }
};

export const setAuthData = async (tokens: {
  accessToken: string;
  refreshToken: string;
}): Promise<void> => {
  try {
    await AsyncStorage.multiSet([
      [STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken],
      [STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken],
    ]);
  } catch (error) {
    console.warn('Failed to set auth data:', error);
  }
};

export const setUserData = async (userData: any): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.USER_DATA,
      JSON.stringify(userData)
    );
  } catch (error) {
    console.warn('Failed to set user data:', error);
  }
};

export const getUserData = async (): Promise<any | null> => {
  try {
    const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.warn('Failed to get user data:', error);
    return null;
  }
};

// Generic API call function
export const apiCall = async <T = any>(
  config: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  try {
    const response = await api(config);
    return response.data;
  } catch (error: any) {
    const apiError: ApiError = {
      message:
        error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status || 500,
      code: error.response?.data?.code,
    };
    throw apiError;
  }
};
