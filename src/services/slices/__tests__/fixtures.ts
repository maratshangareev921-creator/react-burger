import type { ConstructorIngredient, Ingredient, Order, User } from '../../../types';

export const bun: Ingredient = {
  _id: 'bun-1',
  name: 'Краторная булка',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'bun.png',
  image_mobile: 'bun-mobile.png',
  image_large: 'bun-large.png',
  __v: 0,
};

export const main: Ingredient = {
  _id: 'main-1',
  name: 'Биокотлета',
  type: 'main',
  proteins: 42,
  fat: 24,
  carbohydrates: 21,
  calories: 4242,
  price: 424,
  image: 'main.png',
  image_mobile: 'main-mobile.png',
  image_large: 'main-large.png',
  __v: 0,
};

export const sauce: Ingredient = {
  _id: 'sauce-1',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: 'sauce.png',
  image_mobile: 'sauce-mobile.png',
  image_large: 'sauce-large.png',
  __v: 0,
};

export const constructorMain: ConstructorIngredient = {
  ...main,
  constructorId: 'constructor-main',
};

export const constructorSauce: ConstructorIngredient = {
  ...sauce,
  constructorId: 'constructor-sauce',
};

export const order: Order = {
  _id: 'order-1',
  ingredients: [bun._id, main._id, bun._id],
  status: 'done',
  name: 'Космический бургер',
  createdAt: '2026-07-16T10:00:00.000Z',
  updatedAt: '2026-07-16T10:05:00.000Z',
  number: 2010,
};

export const invalidOrder: Order = {
  ...order,
  _id: 'order-invalid',
  ingredients: [],
  number: 2011,
};

export const user: User = {
  email: 'test@example.com',
  name: 'Test User',
};
