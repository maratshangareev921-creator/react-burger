import { createAction } from '@reduxjs/toolkit';

export const connectFeed = createAction('feed/connect');
export const disconnectFeed = createAction('feed/disconnect');

export const connectProfileOrders = createAction<string>('profileOrders/connect');
export const disconnectProfileOrders = createAction('profileOrders/disconnect');
