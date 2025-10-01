import { ApiResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// PUBLIC_INTERFACE
export async function getHeaders(): Promise<Record<string, string>> {
  /**
   * Get headers for API requests including authentication and tenant context
   */
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  // Add tenant context if available
  if (typeof window !== 'undefined') {
    const tenantId = localStorage.getItem('tenantId');
    if (tenantId) {
      headers['X-Tenant-ID'] = tenantId;
    }

    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
}

// PUBLIC_INTERFACE
export async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  /**
   * Make authenticated API request to the backend
   */
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = await getHeaders();

    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        status: 'error',
        message: data.message || 'Request failed',
        code: data.code,
        retryAfter: data.retry_after,
      };
    }

    return {
      status: 'success',
      data,
    };
  } catch (error) {
    console.error('API request failed:', error);
    return {
      status: 'error',
      message: 'Network error occurred',
    };
  }
}

// PUBLIC_INTERFACE
export async function get<T = unknown>(endpoint: string): Promise<ApiResponse<T>> {
  /**
   * Make GET request to API endpoint
   */
  return apiRequest<T>(endpoint, { method: 'GET' });
}

// PUBLIC_INTERFACE
export async function post<T = unknown>(
  endpoint: string,
  data?: unknown
): Promise<ApiResponse<T>> {
  /**
   * Make POST request to API endpoint
   */
  return apiRequest<T>(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
}

// PUBLIC_INTERFACE
export async function put<T = unknown>(
  endpoint: string,
  data?: unknown
): Promise<ApiResponse<T>> {
  /**
   * Make PUT request to API endpoint
   */
  return apiRequest<T>(endpoint, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
}

// PUBLIC_INTERFACE
export async function del<T = unknown>(endpoint: string): Promise<ApiResponse<T>> {
  /**
   * Make DELETE request to API endpoint
   */
  return apiRequest<T>(endpoint, { method: 'DELETE' });
}

// PUBLIC_INTERFACE
export async function uploadFile<T = unknown>(
  endpoint: string,
  file: File,
  additionalData?: Record<string, string>
): Promise<ApiResponse<T>> {
  /**
   * Upload file to API endpoint
   */
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = await getHeaders();
    
    // Remove Content-Type to let browser set it with boundary for FormData
    delete headers['Content-Type'];

    const formData = new FormData();
    formData.append('file', file);

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        status: 'error',
        message: data.message || 'Upload failed',
        code: data.code,
      };
    }

    return {
      status: 'success',
      data,
    };
  } catch (error) {
    console.error('File upload failed:', error);
    return {
      status: 'error',
      message: 'Upload failed',
    };
  }
}

// PUBLIC_INTERFACE
export function buildQueryString(params: Record<string, unknown>): string {
  /**
   * Build query string from parameters object
   */
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      queryParams.append(key, String(value));
    }
  });

  const queryString = queryParams.toString();
  return queryString ? `?${queryString}` : '';
}

// PUBLIC_INTERFACE
export function handleApiError(error: ApiResponse): string {
  /**
   * Extract user-friendly error message from API response
   */
  if (error.code === 'TOKEN_EXPIRED') {
    return 'Your session has expired. Please log in again.';
  }
  
  if (error.code === 'RATE_LIMITED') {
    const retryAfter = error.retryAfter ? Math.ceil(error.retryAfter / 60) : 1;
    return `Rate limit exceeded. Please try again in ${retryAfter} minute(s).`;
  }
  
  if (error.code === 'VALIDATION') {
    return error.message || 'Please check your input and try again.';
  }

  return error.message || 'An unexpected error occurred. Please try again.';
}
