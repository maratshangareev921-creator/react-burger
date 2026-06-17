import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { getIngredients as fetchingIngredientsApi } from '../../utils/burger-api';

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchingIngredientsApi();
      return response.data;
    } catch (error) {
      console.error('Критическая ошибка в санке:', error); // ДОБАВИТЬ ЭТУ СТРОКУ
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
