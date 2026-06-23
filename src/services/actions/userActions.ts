import { createAsyncThunk } from '@reduxjs/toolkit';

import {
  forgotPassword,
  getUser,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  updateUser,
} from '../../utils/burger-api';

import type {
  LoginForm,
  RegisterForm,
  ResetPasswordForm,
  UpdateUserForm,
  User,
} from '../../types';

type MessageResponse = { success: boolean; message?: string };

const clearTokens = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

const errorMessage = (error: unknown, fallback: string): string =>
  error instanceof Error ? error.message : fallback;

export const checkUserAuth = createAsyncThunk<
  User | null,
  void,
  { rejectValue: string }
>('user/checkAuth', async (_, { rejectWithValue }) => {
  if (!localStorage.getItem('accessToken')) return null;

  try {
    return (await getUser()).user;
  } catch (error: unknown) {
    clearTokens();
    return rejectWithValue(errorMessage(error, 'Ошибка проверки пользователя'));
  }
});

export const login = createAsyncThunk<User, LoginForm, { rejectValue: string }>(
  'user/login',
  async (form, { rejectWithValue }) => {
    try {
      return (await loginUser(form)).user;
    } catch (error: unknown) {
      return rejectWithValue(errorMessage(error, 'Ошибка входа'));
    }
  }
);

export const register = createAsyncThunk<User, RegisterForm, { rejectValue: string }>(
  'user/register',
  async (form, { rejectWithValue }) => {
    try {
      return (await registerUser(form)).user;
    } catch (error: unknown) {
      return rejectWithValue(errorMessage(error, 'Ошибка регистрации'));
    }
  }
);

export const logout = createAsyncThunk<null, void>('user/logout', async () => {
  await logoutUser().catch(() => undefined);
  return null;
});

export const updateProfile = createAsyncThunk<
  User,
  UpdateUserForm,
  { rejectValue: string }
>('user/updateProfile', async (form, { rejectWithValue }) => {
  try {
    return (await updateUser(form)).user;
  } catch (error: unknown) {
    return rejectWithValue(errorMessage(error, 'Ошибка обновления профиля'));
  }
});

export const forgotPasswordRequest = createAsyncThunk<
  MessageResponse,
  string,
  { rejectValue: string }
>('user/forgotPassword', async (email, { rejectWithValue }) => {
  try {
    return await forgotPassword(email);
  } catch (error: unknown) {
    return rejectWithValue(errorMessage(error, 'Ошибка восстановления пароля'));
  }
});

export const resetPasswordRequest = createAsyncThunk<
  MessageResponse,
  ResetPasswordForm,
  { rejectValue: string }
>('user/resetPassword', async (form, { rejectWithValue }) => {
  try {
    return await resetPassword(form);
  } catch (error: unknown) {
    return rejectWithValue(errorMessage(error, 'Ошибка сброса пароля'));
  }
});
