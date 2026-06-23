import { createAsyncThunk } from '@reduxjs/toolkit';

import {
  getUser,
  forgotPassword,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  updateUser,
} from '../../utils/burger-api';

const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

export const checkUserAuth = createAsyncThunk(
  'user/checkAuth',
  async (_, { rejectWithValue }) => {
    if (!localStorage.getItem('accessToken')) {
      return null;
    }

    try {
      const data = await getUser();
      return data.user;
    } catch (error) {
      clearTokens();
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка проверки пользователя'
      );
    }
  }
);

export const login = createAsyncThunk(
  'user/login',
  async (form, { rejectWithValue }) => {
    try {
      const data = await loginUser(form);
      return data.user;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Ошибка входа');
    }
  }
);

export const register = createAsyncThunk(
  'user/register',
  async (form, { rejectWithValue }) => {
    try {
      const data = await registerUser(form);
      return data.user;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка регистрации'
      );
    }
  }
);

export const logout = createAsyncThunk('user/logout', async () => {
  await logoutUser().catch(() => undefined);
  return null;
});

export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (form, { rejectWithValue }) => {
    try {
      const data = await updateUser(form);
      return data.user;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка обновления профиля'
      );
    }
  }
);

export const forgotPasswordRequest = createAsyncThunk(
  'user/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      return await forgotPassword(email);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка восстановления пароля'
      );
    }
  }
);

export const resetPasswordRequest = createAsyncThunk(
  'user/resetPassword',
  async (form, { rejectWithValue }) => {
    try {
      return await resetPassword(form);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка сброса пароля'
      );
    }
  }
);
