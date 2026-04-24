import type { ApiResponse } from '../types/lottery';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function apiPost<TRequest, TResponse>(
  endpoint: string,
  body: TRequest,
): Promise<ApiResponse<TResponse>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: data.error || `Request failed with status ${response.status}`,
      };
    }

    return { data };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}
