import { createAsyncThunk } from '@reduxjs/toolkit';

import { createOrderApi } from '../../utils/burger-api';

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (ingredientIds, { rejectWithValue }) => {
    try {
      const data = await createOrderApi(ingredientIds);

      if (!data.success) {
        throw new Error('Сервер вернул success: false');
      }

      return data.order.number;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка при отправке заказа'
      );
    }
  }
);
