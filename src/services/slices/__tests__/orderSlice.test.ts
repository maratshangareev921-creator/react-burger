import { describe, expect, it } from 'vitest';

import { createOrder } from '../../actions/orderActions';
import reducer, { clearOrder, initialState } from '../orderSlice';

describe('orderSlice', () => {
  it('returns initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('handles create order pending', () => {
    expect(reducer(undefined, { type: createOrder.pending.type })).toEqual({
      orderNumber: initialState.orderNumber,
      isLoading: true,
      error: initialState.error,
    });
  });

  it('handles create order fulfilled', () => {
    expect(
      reducer(
        { ...initialState, isLoading: true },
        { type: createOrder.fulfilled.type, payload: 12345 }
      )
    ).toEqual({
      orderNumber: 12345,
      isLoading: initialState.isLoading,
      error: initialState.error,
    });
  });

  it('handles create order rejected', () => {
    expect(
      reducer(
        { ...initialState, isLoading: true },
        { type: createOrder.rejected.type, payload: 'Order error' }
      )
    ).toEqual({
      orderNumber: initialState.orderNumber,
      isLoading: initialState.isLoading,
      error: 'Order error',
    });
  });

  it('clears order data', () => {
    expect(
      reducer({ ...initialState, orderNumber: 12345, error: 'Error' }, clearOrder())
    ).toEqual(initialState);
  });
});
