import { describe, expect, it } from 'vitest';

import { fetchIngredients } from '../../actions/ingredientsActions';
import reducer from '../ingredientsSlice';
import { bun, main } from './fixtures';

describe('ingredientsSlice', () => {
  it('returns initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual({
      ingredients: [],
      isLoading: false,
      hasError: false,
    });
  });

  it('handles fetch pending', () => {
    expect(reducer(undefined, { type: fetchIngredients.pending.type })).toEqual({
      ingredients: [],
      isLoading: true,
      hasError: false,
    });
  });

  it('handles fetch fulfilled', () => {
    expect(
      reducer(
        { ingredients: [], isLoading: true, hasError: false },
        { type: fetchIngredients.fulfilled.type, payload: [bun, main] }
      )
    ).toEqual({
      ingredients: [bun, main],
      isLoading: false,
      hasError: false,
    });
  });

  it('handles fetch rejected', () => {
    expect(
      reducer(
        { ingredients: [], isLoading: true, hasError: false },
        { type: fetchIngredients.rejected.type }
      )
    ).toEqual({
      ingredients: [],
      isLoading: false,
      hasError: true,
    });
  });
});
