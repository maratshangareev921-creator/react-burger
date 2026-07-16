import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { OrdersResponse } from '../../types';

type OrdersState = {
  orders: OrdersResponse['orders'];
  total: number;
  totalToday: number;
  isConnected: boolean;
  error: string | null;
};

export const initialState: OrdersState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isConnected: false,
  error: null,
};

const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {
    profileOrdersOpen: (state) => {
      state.isConnected = true;
      state.error = null;
    },
    profileOrdersClose: (state) => {
      state.isConnected = false;
    },
    profileOrdersError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isConnected = false;
    },
    profileOrdersMessage: (state, action: PayloadAction<OrdersResponse>) => {
      state.orders = action.payload.orders.filter((order) => order.ingredients.length);
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
      state.error = null;
    },
  },
});

export const {
  profileOrdersOpen,
  profileOrdersClose,
  profileOrdersError,
  profileOrdersMessage,
} = profileOrdersSlice.actions;
export default profileOrdersSlice.reducer;
