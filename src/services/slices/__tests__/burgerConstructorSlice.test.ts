import { describe, expect, it, vi } from 'vitest';

import reducer, {
  addConstructorItem,
  clearConstructor,
  initialState,
  moveConstructorItem,
  removeConstructorItem,
  selectTotalPrice,
} from '../burgerConstructorSlice';
import { bun, constructorMain, constructorSauce, main, sauce } from './fixtures';

import type { RootState } from '../../store';

describe('burgerConstructorSlice', () => {
  it('returns initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('adds bun as selected bun', () => {
    vi.stubGlobal('crypto', { randomUUID: () => 'bun-constructor-id' });

    expect(reducer(undefined, addConstructorItem(bun))).toEqual({
      bun: { ...bun, constructorId: 'bun-constructor-id' },
      ingredients: initialState.ingredients,
    });

    vi.unstubAllGlobals();
  });

  it('adds non-bun ingredients to constructor list', () => {
    vi.stubGlobal('crypto', { randomUUID: () => 'main-constructor-id' });

    expect(reducer(undefined, addConstructorItem(main))).toEqual({
      bun: initialState.bun,
      ingredients: [{ ...main, constructorId: 'main-constructor-id' }],
    });

    vi.unstubAllGlobals();
  });

  it('removes constructor item by constructor id', () => {
    const state = {
      bun,
      ingredients: [constructorMain, constructorSauce],
    };

    expect(reducer(state, removeConstructorItem(constructorMain.constructorId))).toEqual(
      {
        bun,
        ingredients: [constructorSauce],
      }
    );
  });

  it('moves constructor item', () => {
    const state = {
      bun,
      ingredients: [constructorMain, constructorSauce],
    };

    expect(
      reducer(state, moveConstructorItem({ dragIndex: 0, hoverIndex: 1 })).ingredients
    ).toEqual([constructorSauce, constructorMain]);
  });

  it('clears constructor', () => {
    const state = {
      bun,
      ingredients: [constructorMain],
    };

    expect(reducer(state, clearConstructor())).toEqual({
      ...initialState,
    });
  });

  it('selects total price with double bun price', () => {
    const state = {
      burgerConstructor: {
        bun,
        ingredients: [constructorMain, { ...sauce, constructorId: 'sauce-2' }],
      },
    } as unknown as RootState;

    expect(selectTotalPrice(state)).toBe(bun.price * 2 + main.price + sauce.price);
  });
});
