import { describe, expect, it } from 'vitest';

import reducer, { clearIngredient, setIngredient } from '../ingredientDetailsSlice';
import { bun } from './fixtures';

describe('ingredientDetailsSlice', () => {
  it('returns initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual({ ingredient: null });
  });

  it('sets selected ingredient', () => {
    expect(reducer(undefined, setIngredient(bun))).toEqual({ ingredient: bun });
  });

  it('clears selected ingredient', () => {
    expect(reducer({ ingredient: bun }, clearIngredient())).toEqual({
      ingredient: null,
    });
  });
});
