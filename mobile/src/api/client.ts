import axios, { AxiosError } from 'axios';

/**
 * Single Axios instance for the PHP API.
 * Base URL comes from mobile/.env (EXPO_PUBLIC_API_URL), never hardcoded.
 */
export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
  headers: { Accept: 'application/json' },
});

/** The API's own error envelope, when it managed to send one. */
interface ApiErrorBody {
  success?: boolean;
  message?: string;
}

/**
 * Turn any thrown value into a sentence the user can act on.
 * Prefers the API's own `message`, then network conditions, then a generic fallback.
 */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const err = error as AxiosError<ApiErrorBody>;
    const apiMessage = err.response?.data?.message;
    if (typeof apiMessage === 'string' && apiMessage.trim() !== '') {
      return apiMessage;
    }
    if (err.code === 'ECONNABORTED') {
      return 'The server took too long to respond.';
    }
    if (!err.response) {
      return 'Could not reach the server. Check your connection.';
    }
    return `Server error (${err.response.status}).`;
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return 'Something went wrong.';
}

export function isConfigured(): boolean {
  return typeof process.env.EXPO_PUBLIC_API_URL === 'string' && process.env.EXPO_PUBLIC_API_URL !== '';
}

/**
 * Write endpoints need the shared admin key (EXPO_PUBLIC_ADMIN_KEY in .env, matching
 * ADMIN_KEY on the server). When it is not set the app hides the add/edit/delete controls.
 */
export function isAdminEnabled(): boolean {
  const key = process.env.EXPO_PUBLIC_ADMIN_KEY;
  return typeof key === 'string' && key.trim() !== '';
}

export function adminHeaders(): Record<string, string> {
  const key = process.env.EXPO_PUBLIC_ADMIN_KEY;
  return key ? { 'X-Admin-Key': key } : {};
}
