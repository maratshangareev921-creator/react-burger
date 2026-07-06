export type IngredientType = 'bun' | 'sauce' | 'main';

export type Ingredient = {
  _id: string;
  name: string;
  type: IngredientType;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_mobile: string;
  image_large: string;
  __v: number;
};

export type ConstructorIngredient = Ingredient & {
  constructorId: string;
};

export type User = {
  email: string;
  name: string;
};

export type LoginForm = {
  email: string;
  password: string;
};

export type RegisterForm = LoginForm & {
  name: string;
};

export type ResetPasswordForm = {
  password: string;
  token: string;
};

export type UpdateUserForm = Partial<RegisterForm>;

export type OrderStatus = 'created' | 'pending' | 'done';

export type Order = {
  _id: string;
  ingredients: string[];
  status: OrderStatus;
  name: string;
  createdAt: string;
  updatedAt: string;
  number: number;
};

export type OrdersResponse = {
  success: boolean;
  orders: Order[];
  total: number;
  totalToday: number;
  message?: string;
};
