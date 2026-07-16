import { createSelector, createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { ConstructorIngredient, Ingredient } from '../../types';
import type { RootState } from '../store';

type BurgerConstructorState = {
  bun: Ingredient | null;
  ingredients: ConstructorIngredient[];
};

type MovePayload = { dragIndex: number; hoverIndex: number };

export const initialState: BurgerConstructorState = { bun: null, ingredients: [] };

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addConstructorItem: {
      reducer: (state, action: PayloadAction<ConstructorIngredient>) => {
        if (action.payload.type === 'bun') state.bun = action.payload;
        else state.ingredients.push(action.payload);
      },
      prepare: (item: Ingredient) => ({
        payload: { ...item, constructorId: crypto.randomUUID() },
      }),
    },
    removeConstructorItem: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.constructorId !== action.payload
      );
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    },
    moveConstructorItem: (state, action: PayloadAction<MovePayload>) => {
      const { dragIndex, hoverIndex } = action.payload;
      const [dragItem] = state.ingredients.splice(dragIndex, 1);
      if (dragItem) state.ingredients.splice(hoverIndex, 0, dragItem);
    },
  },
});

export const {
  addConstructorItem,
  removeConstructorItem,
  clearConstructor,
  moveConstructorItem,
} = burgerConstructorSlice.actions;

export default burgerConstructorSlice.reducer;

const selectBun = (state: RootState): Ingredient | null => state.burgerConstructor.bun;
const selectIngredients = (state: RootState): ConstructorIngredient[] =>
  state.burgerConstructor.ingredients;

export const selectTotalPrice = createSelector(
  [selectBun, selectIngredients],
  (bun, ingredients): number =>
    ingredients.reduce((sum, item) => sum + item.price, 0) + (bun ? bun.price * 2 : 0)
);
