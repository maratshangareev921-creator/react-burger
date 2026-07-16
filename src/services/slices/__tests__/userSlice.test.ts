import { describe, expect, it } from 'vitest';

import {
  checkUserAuth,
  login,
  logout,
  register,
  updateProfile,
} from '../../actions/userActions';
import reducer, { clearUserError } from '../userSlice';
import { user } from './fixtures';

describe('userSlice', () => {
  it('returns initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual({
      user: null,
      isAuthChecked: false,
      isLoading: false,
      error: null,
    });
  });

  it('handles auth check lifecycle', () => {
    expect(reducer(undefined, { type: checkUserAuth.pending.type })).toMatchObject({
      isLoading: true,
      error: null,
    });

    expect(
      reducer(undefined, { type: checkUserAuth.fulfilled.type, payload: user })
    ).toEqual({
      user,
      isAuthChecked: true,
      isLoading: false,
      error: null,
    });

    expect(
      reducer(undefined, {
        type: checkUserAuth.rejected.type,
        payload: 'Auth error',
      })
    ).toEqual({
      user: null,
      isAuthChecked: true,
      isLoading: false,
      error: 'Auth error',
    });
  });

  it('handles login and register lifecycle', () => {
    expect(reducer(undefined, { type: login.pending.type })).toMatchObject({
      isLoading: true,
      error: null,
    });

    expect(reducer(undefined, { type: login.fulfilled.type, payload: user })).toEqual({
      user,
      isAuthChecked: true,
      isLoading: false,
      error: null,
    });

    expect(
      reducer(undefined, { type: register.fulfilled.type, payload: user })
    ).toMatchObject({
      user,
      isAuthChecked: true,
      isLoading: false,
    });

    expect(
      reducer(undefined, { type: login.rejected.type, payload: 'Login error' }).error
    ).toBe('Login error');
  });

  it('handles logout and profile update', () => {
    expect(
      reducer(
        { user, isAuthChecked: true, isLoading: false, error: null },
        { type: logout.fulfilled.type, payload: null }
      )
    ).toEqual({
      user: null,
      isAuthChecked: true,
      isLoading: false,
      error: null,
    });

    expect(
      reducer(undefined, { type: updateProfile.fulfilled.type, payload: user })
    ).toMatchObject({
      user,
      isLoading: false,
    });
  });

  it('clears user error', () => {
    expect(
      reducer(
        { user: null, isAuthChecked: true, isLoading: false, error: 'Error' },
        clearUserError()
      ).error
    ).toBeNull();
  });
});
