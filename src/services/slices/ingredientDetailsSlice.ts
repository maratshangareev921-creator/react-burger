import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { Ingredient } from '../../types';

type IngredientDetailsState = { ingredient: Ingredient | null };

const initialState: IngredientDetailsState = { ingredient: null };

const ingredientDetailsSlice = createSlice({
  name: 'ingredientDetails',
  initialState,
  reducers: {
    setIngredient: (state, action: PayloadAction<Ingredient>) => {
      state.ingredient = action.payload;
    },
    clearIngredient: (state) => {
      state.ingredient = null;
    },
  },
});

export const { setIngredient, clearIngredient } = ingredientDetailsSlice.actions;
export default ingredientDetailsSlice.reducer;
