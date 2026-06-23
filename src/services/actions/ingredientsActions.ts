import { createAsyncThunk } from '@reduxjs/toolkit';

import { getIngredients as getIngredientsApi } from '../../utils/burger-api';

import type { Ingredient } from '../../types';

export const fetchIngredients = createAsyncThunk<
  Ingredient[],
  void,
  { rejectValue: string }
>('ingredients/fetchIngredients', async (_, { rejectWithValue }) => {
  try {
    return (await getIngredientsApi()).data;
  } catch (error: unknown) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Ошибка загрузки ингредиентов'
    );
  }
});
