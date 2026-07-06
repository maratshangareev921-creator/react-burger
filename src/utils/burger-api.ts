import { BASE_URL } from './constants';

import type {
  Ingredient,
  LoginForm,
  OrdersResponse,
  RegisterForm,
  ResetPasswordForm,
  UpdateUserForm,
  User,
} from '../types';

type ApiResponse = { success: boolean; message?: string };
type IngredientsResponse = ApiResponse & { data: Ingredient[] };
type AuthResponse = ApiResponse & {
  accessToken: string;
  refreshToken: string;
  user: User;
};
type TokenResponse = ApiResponse & { accessToken: string; refreshToken: string };
type UserResponse = ApiResponse & { user: User };

export type OrderResponse = ApiResponse & {
  name: string;
  order: { number: number };
};

const readResponse = async <T>(response: Response): Promise<T> => {
  const data: unknown = await response.json().catch(() => ({}));

  if (response.ok) return data as T;

  const message =
    typeof data === 'object' &&
    data !== null &&
    'message' in data &&
    typeof data.message === 'string'
      ? data.message
      : `Ошибка: ${response.status}`;

  throw new Error(message);
};

const request = <T>(endpoint: string, options: RequestInit = {}): Promise<T> =>
  fetch(`${BASE_URL}${endpoint}`, options).then((response) => readResponse<T>(response));

const jsonHeaders: HeadersInit = { 'Content-Type': 'application/json' };

const saveTokens = (data: TokenResponse): void => {
  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);
};

const clearTokens = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

const withAuthorization = (headers?: HeadersInit): Headers => {
  const result = new Headers(headers);
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) result.set('authorization', accessToken);
  return result;
};

export const getIngredients = (): Promise<IngredientsResponse> =>
  request<IngredientsResponse>('/ingredients');

export const refreshAccessToken = (): Promise<TokenResponse> =>
  request<TokenResponse>('/auth/token', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({ token: localStorage.getItem('refreshToken') }),
  }).then((data) => {
    saveTokens(data);
    return data;
  });

export const requestWithRefresh = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  try {
    return await request<T>(endpoint, {
      ...options,
      headers: withAuthorization(options.headers),
    });
  } catch (error: unknown) {
    if (!(error instanceof Error) || !error.message.toLowerCase().includes('jwt')) {
      throw error;
    }

    const refreshed = await refreshAccessToken();
    const headers = new Headers(options.headers);
    headers.set('authorization', refreshed.accessToken);
    return request<T>(endpoint, { ...options, headers });
  }
};

export const createOrderApi = (ingredientIds: string[]): Promise<OrderResponse> =>
  requestWithRefresh<OrderResponse>('/orders', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({ ingredients: ingredientIds }),
  });

export const getOrderByNumber = (number: string): Promise<OrdersResponse> =>
  request<OrdersResponse>(`/orders/${number}`);

export const registerUser = (form: RegisterForm): Promise<AuthResponse> =>
  request<AuthResponse>('/auth/register', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(form),
  }).then((data) => {
    saveTokens(data);
    return data;
  });

export const loginUser = (form: LoginForm): Promise<AuthResponse> =>
  request<AuthResponse>('/auth/login', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(form),
  }).then((data) => {
    saveTokens(data);
    return data;
  });

export const logoutUser = (): Promise<ApiResponse> =>
  request<ApiResponse>('/auth/logout', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({ token: localStorage.getItem('refreshToken') }),
  }).finally(clearTokens);

export const forgotPassword = (email: string): Promise<ApiResponse> =>
  request<ApiResponse>('/password-reset', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({ email }),
  });

export const resetPassword = (form: ResetPasswordForm): Promise<ApiResponse> =>
  request<ApiResponse>('/password-reset/reset', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(form),
  });

export const getUser = (): Promise<UserResponse> =>
  requestWithRefresh<UserResponse>('/auth/user');

export const updateUser = (form: UpdateUserForm): Promise<UserResponse> =>
  requestWithRefresh<UserResponse>('/auth/user', {
    method: 'PATCH',
    headers: jsonHeaders,
    body: JSON.stringify(form),
  });
