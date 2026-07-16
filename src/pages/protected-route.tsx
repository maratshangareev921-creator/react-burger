import { Navigate, useLocation } from 'react-router-dom';

import type { ReactElement, ReactNode } from 'react';

import type { User } from '../types';

type ProtectedRouteProps = {
  children: ReactNode;
  onlyUnAuth?: boolean;
  user: User | null;
  isAuthChecked: boolean;
};

const getPreviousPath = (state: unknown): string => {
  if (typeof state !== 'object' || state === null || !('from' in state)) return '/';
  const from: unknown = state.from;
  if (typeof from !== 'object' || from === null || !('pathname' in from)) return '/';
  return typeof from.pathname === 'string' ? from.pathname : '/';
};

export const ProtectedRoute = ({
  children,
  onlyUnAuth = false,
  user,
  isAuthChecked,
}: ProtectedRouteProps): ReactElement => {
  const location = useLocation();

  if (!isAuthChecked)
    return <p className="text text_type_main-medium p-10">Проверяем авторизацию...</p>;
  if (onlyUnAuth && user)
    return <Navigate to={getPreviousPath(location.state)} replace />;
  if (!onlyUnAuth && !user)
    return <Navigate to="/login" state={{ from: location }} replace />;
  return <>{children}</>;
};
