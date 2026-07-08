import { configureStore } from '@reduxjs/toolkit';

import {
  connectFeed,
  connectProfileOrders,
  disconnectFeed,
  disconnectProfileOrders,
} from './actions/orderFeedActions';
import burgerConstructorReducer from './slices/burgerConstructorSlice';
import feedOrdersReducer, {
  feedClose,
  feedError,
  feedMessage,
  feedOpen,
} from './slices/feedOrdersSlice';
import ingredientDetailsReducer from './slices/ingredientDetailsSlice';
import ingredientsReducer from './slices/ingredientsSlice';
import orderReducer from './slices/orderSlice';
import profileOrdersReducer, {
  profileOrdersClose,
  profileOrdersError,
  profileOrdersMessage,
  profileOrdersOpen,
} from './slices/profileOrdersSlice';
import userReducer from './slices/userSlice';
import { createSocketMiddleware } from './socketMiddleware';

const feedMiddleware = createSocketMiddleware({
  wsUrl: 'wss://new-stellarburgers.education-services.ru/orders/all',
  actions: {
    connect: connectFeed,
    disconnect: disconnectFeed,
    onOpen: feedOpen,
    onClose: feedClose,
    onError: feedError,
    onMessage: feedMessage,
  },
});

const profileOrdersMiddleware = createSocketMiddleware({
  wsUrl: 'wss://new-stellarburgers.education-services.ru/orders',
  withToken: true,
  actions: {
    connect: connectProfileOrders,
    disconnect: disconnectProfileOrders,
    onOpen: profileOrdersOpen,
    onClose: profileOrdersClose,
    onError: profileOrdersError,
    onMessage: profileOrdersMessage,
  },
});

export const store = configureStore({
  reducer: {
    ingredients: ingredientsReducer,
    ingredientDetails: ingredientDetailsReducer,
    order: orderReducer,
    burgerConstructor: burgerConstructorReducer,
    user: userReducer,
    feedOrders: feedOrdersReducer,
    profileOrders: profileOrdersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(feedMiddleware, profileOrdersMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
