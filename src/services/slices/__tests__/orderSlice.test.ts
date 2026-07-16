import { describe, expect, it } from 'vitest';

import { createOrder } from '../../actions/orderActions';
import reducer, { clearOrder } from '../orderSlice';

describe('orderSlice', () => {
  it('returns initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual({
      orderNumber: null,
      isLoading: false,
      error: null,
    });
  });

  it('handles create order pending', () => {
    expect(reducer(undefined, { type: createOrder.pending.type })).toEqual({
      orderNumber: null,
      isLoading: true,
      error: null,
    });
  });

  it('handles create order fulfilled', () => {
    expect(
      reducer(
        { orderNumber: null, isLoading: true, error: null },
        { type: createOrder.fulfilled.type, payload: 12345 }
      )
    ).toEqual({
      orderNumber: 12345,
      isLoading: false,
      error: null,
    });
  });

  it('handles create order rejected', () => {
    expect(
      reducer(
        { orderNumber: null, isLoading: true, error: null },
        { type: createOrder.rejected.type, payload: 'Order error' }
      )
    ).toEqual({
      orderNumber: null,
      isLoading: false,
      error: 'Order error',
    });
  });

  it('clears order data', () => {
    expect(
      reducer({ orderNumber: 12345, isLoading: false, error: 'Error' }, clearOrder())
    ).toEqual({
      orderNumber: null,
      isLoading: false,
      error: null,
    });
  });
});
