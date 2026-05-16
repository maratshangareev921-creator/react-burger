import { createSlice, createSelector } from '@reduxjs/toolkit';

const initialState = {
  bun: null,
  ingredients: [],
};

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addConstructorItem: {
      reducer: (state, action) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },
      prepare: (item) => {
        return { payload: { ...item, constructorId: crypto.randomUUID() } };
      },
    },
    removeConstructorItem: (state, action) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.constructorId !== action.payload
      );
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    },
    moveConstructorItem: (state, action) => {
      const { dragIndex, hoverIndex } = action.payload;
      const dragItem = state.ingredients[dragIndex];
      state.ingredients.splice(dragIndex, 1);
      state.ingredients.splice(hoverIndex, 0, dragItem);
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

const selectBun = (state) => state.burgerConstructor.bun;
const selectIngredients = (state) => state.burgerConstructor.ingredients;

export const selectTotalPrice = createSelector(
  [selectBun, selectIngredients],
  (bun, ingredients) => {
    const ingredientsPrice = ingredients.reduce((sum, item) => sum + item.price, 0);
    const bunPrice = bun ? bun.price * 2 : 0;
    return ingredientsPrice + bunPrice;
  }
);
