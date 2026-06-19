import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

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

const initialState = {
  orderNumber: null,
  isLoading: false,
  error: null,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.orderNumber = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderNumber = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
