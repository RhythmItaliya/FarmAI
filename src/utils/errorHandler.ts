import { Alert } from 'react-native';
import { showGlobalToast } from '../components/Toast';

// Error types
export interface AppError {
  message: string;
  code?: string;
  status?: number;
}

// Common error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'Session expired. Please login again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
};

// Error handler class
export class ErrorHandler {
  static handle(error: any): AppError {
    // Network error
    if (!error.response) {
      return {
        message: ERROR_MESSAGES.NETWORK_ERROR,
        code: 'NETWORK_ERROR',
      };
    }

    const { status, data } = error.response;
    const message =
      data?.message || data?.error || ERROR_MESSAGES.UNKNOWN_ERROR;

    switch (status) {
      case 400:
        return {
          message: data?.message || ERROR_MESSAGES.VALIDATION_ERROR,
          code: 'VALIDATION_ERROR',
          status,
        };
      case 401:
        return {
          message: ERROR_MESSAGES.UNAUTHORIZED,
          code: 'UNAUTHORIZED',
          status,
        };
      case 403:
        return {
          message: ERROR_MESSAGES.FORBIDDEN,
          code: 'FORBIDDEN',
          status,
        };
      case 404:
        return {
          message: ERROR_MESSAGES.NOT_FOUND,
          code: 'NOT_FOUND',
          status,
        };
      case 422:
        return {
          message: data?.message || ERROR_MESSAGES.VALIDATION_ERROR,
          code: 'VALIDATION_ERROR',
          status,
        };
      case 500:
      case 502:
      case 503:
        return {
          message: ERROR_MESSAGES.SERVER_ERROR,
          code: 'SERVER_ERROR',
          status,
        };
      default:
        return {
          message,
          code: 'UNKNOWN_ERROR',
          status,
        };
    }
  }

  static showAlert(error: AppError, title: string = 'Error'): void {
    Alert.alert(title, error.message);
  }

  static showToast(error: AppError): void {
    showGlobalToast(error.message, { type: 'error' });
  }

  static logError(error: any, context?: string): void {
    if (__DEV__) {
      console.error(`[${context || 'ErrorHandler'}]`, error);
    }
  }
}

// Utility functions
export const isNetworkError = (error: any): boolean => {
  return !error.response;
};

export const isValidationError = (error: any): boolean => {
  return error.response?.status === 400 || error.response?.status === 422;
};

export const isAuthError = (error: any): boolean => {
  return error.response?.status === 401 || error.response?.status === 403;
};

export const getErrorMessage = (error: any): string => {
  const appError = ErrorHandler.handle(error);
  return appError.message;
};
