import { describe, expect, it } from 'vitest';

import { fetchIngredients } from '../../actions/ingredientsActions';
import reducer, { initialState } from '../ingredientsSlice';
import { bun, main } from './fixtures';

describe('ingredientsSlice', () => {
  it('returns initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('handles fetch pending', () => {
    expect(reducer(undefined, { type: fetchIngredients.pending.type })).toEqual({
      ingredients: initialState.ingredients,
      isLoading: true,
      hasError: initialState.hasError,
    });
  });

  it('handles fetch fulfilled', () => {
    expect(
      reducer(
        { ...initialState, isLoading: true },
        { type: fetchIngredients.fulfilled.type, payload: [bun, main] }
      )
    ).toEqual({
      ingredients: [bun, main],
      isLoading: initialState.isLoading,
      hasError: initialState.hasError,
    });
  });

  it('handles fetch rejected', () => {
    expect(
      reducer(
        { ...initialState, isLoading: true },
        { type: fetchIngredients.rejected.type }
      )
    ).toEqual({
      ingredients: initialState.ingredients,
      isLoading: initialState.isLoading,
      hasError: true,
    });
  });
});
