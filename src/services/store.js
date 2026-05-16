import { configureStore } from '@reduxjs/toolkit';

import burgerConstructorReducer from './slices/burgerConstructorSlice';
import ingredientDetailsReducer from './slices/ingredientDetailsSlice';
import ingredientsReducer from './slices/ingredientsSlice.js';
import orderReducer from './slices/orderSlice';

export const store = configureStore({
  reducer: {
    ingredients: ingredientsReducer,
    ingredientDetails: ingredientDetailsReducer,
    order: orderReducer,
    burgerConstructor: burgerConstructorReducer,
  },
});
