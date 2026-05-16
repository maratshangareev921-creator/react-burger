import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { getIngredients as fetchIngredientsApi } from '../../utils/burger-api';

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchIngredientsApi();
      return response.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Ошибка загрузки');
    }
  }
);

const initialState = {
  ingredients: [],
  isLoading: false,
  hasError: false,
};

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.ingredients = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchIngredients.rejected, (state) => {
        state.isLoading = false;
        state.hasError = true;
      });
  },
});

export default ingredientsSlice.reducer;
