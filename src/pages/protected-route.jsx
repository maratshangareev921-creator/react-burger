import { Navigate, useLocation } from 'react-router-dom';

export const ProtectedRoute = ({
  children,
  onlyUnAuth = false,
  user,
  isAuthChecked,
}) => {
  const location = useLocation();

  if (!isAuthChecked) {
    return <p className="text text_type_main-medium p-10">Проверяем авторизацию...</p>;
  }

  if (onlyUnAuth && user) {
    return <Navigate to={location.state?.from?.pathname || '/'} replace />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
