import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = 'https://new-stellarburgers.education-services.ru/api/orders';

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (ingredientIds, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients: ingredientIds }),
      });

      if (!response.ok) {
        throw new Error('Ошибка при отправке заказа');
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error('Сервер вернул success: false');
      }

      return data.order.number;
    } catch (error) {
      return rejectWithValue(error.message);
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
