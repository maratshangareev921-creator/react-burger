import { describe, expect, it } from 'vitest';

import feedReducer, {
  feedClose,
  feedError,
  feedMessage,
  feedOpen,
} from '../feedOrdersSlice';
import profileReducer, {
  profileOrdersClose,
  profileOrdersError,
  profileOrdersMessage,
  profileOrdersOpen,
} from '../profileOrdersSlice';
import { invalidOrder, order } from './fixtures';

const response = {
  success: true,
  orders: [order, invalidOrder],
  total: 10,
  totalToday: 2,
};

describe('feedOrdersSlice', () => {
  it('returns initial state', () => {
    expect(feedReducer(undefined, { type: 'unknown' })).toEqual({
      orders: [],
      total: 0,
      totalToday: 0,
      isConnected: false,
      error: null,
    });
  });

  it('handles socket lifecycle and messages', () => {
    const opened = feedReducer(undefined, feedOpen());
    expect(opened).toMatchObject({ isConnected: true, error: null });

    const withError = feedReducer(opened, feedError('Socket error'));
    expect(withError).toMatchObject({
      isConnected: false,
      error: 'Socket error',
    });

    const withMessage = feedReducer(withError, feedMessage(response));
    expect(withMessage).toEqual({
      orders: [order],
      total: 10,
      totalToday: 2,
      isConnected: false,
      error: null,
    });

    expect(feedReducer(opened, feedClose()).isConnected).toBe(false);
  });
});

describe('profileOrdersSlice', () => {
  it('returns initial state', () => {
    expect(profileReducer(undefined, { type: 'unknown' })).toEqual({
      orders: [],
      total: 0,
      totalToday: 0,
      isConnected: false,
      error: null,
    });
  });

  it('handles socket lifecycle and messages', () => {
    const opened = profileReducer(undefined, profileOrdersOpen());
    expect(opened).toMatchObject({ isConnected: true, error: null });

    const withError = profileReducer(opened, profileOrdersError('Socket error'));
    expect(withError).toMatchObject({
      isConnected: false,
      error: 'Socket error',
    });

    const withMessage = profileReducer(withError, profileOrdersMessage(response));
    expect(withMessage).toEqual({
      orders: [order],
      total: 10,
      totalToday: 2,
      isConnected: false,
      error: null,
    });

    expect(profileReducer(opened, profileOrdersClose()).isConnected).toBe(false);
  });
});
