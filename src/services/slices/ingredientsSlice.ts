import { createSlice } from '@reduxjs/toolkit';

import { fetchIngredients } from '../actions/ingredientsActions';

import type { Ingredient } from '../../types';

type IngredientsState = {
  ingredients: Ingredient[];
  isLoading: boolean;
  hasError: boolean;
};

const initialState: IngredientsState = {
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
