import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import {
  ForgotPasswordPage,
  LoginPage,
  RegisterPage,
  ResetPasswordPage,
} from '../../pages/auth-pages.jsx';
import { Home } from '../../pages/home.jsx';
import { IngredientModal } from '../../pages/ingredient-modal.jsx';
import { IngredientPage } from '../../pages/ingredient-page.jsx';
import {
  FeedPage,
  NotFoundPage,
  ProfileForm,
  ProfileLayout,
  ProfileOrdersPage,
} from '../../pages/profile-pages.jsx';
import { ProtectedRoute } from '../../pages/protected-route.jsx';
import { getIngredients, getUser } from '../../utils/burger-api.js';
import { AppHeader } from '../app-header/app-header.jsx';

import styles from './app.module.css';

export const App = () => {
  const [ingredients, setIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const location = useLocation();
  const background = location.state?.background;

  useEffect(() => {
    getIngredients()
      .then((res) => {
        setIngredients(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Ошибка получения данных:', err);
        setHasError(true);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!localStorage.getItem('accessToken')) {
      setIsAuthChecked(true);
      return;
    }

    getUser()
      .then((data) => setUser(data.user))
      .catch(() => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      })
      .finally(() => setIsAuthChecked(true));
  }, []);

  const protectedProps = { user, isAuthChecked };

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        <Route
          path="/"
          element={
            <Home ingredients={ingredients} isLoading={isLoading} hasError={hasError} />
          }
        />
        <Route
          path="/ingredients/:id"
          element={<IngredientPage ingredients={ingredients} />}
        />
        <Route path="/feed" element={<FeedPage />} />
        <Route
          path="/login"
          element={
            <ProtectedRoute onlyUnAuth {...protectedProps}>
              <LoginPage onLogin={setUser} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute onlyUnAuth {...protectedProps}>
              <RegisterPage onLogin={setUser} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <ProtectedRoute onlyUnAuth {...protectedProps}>
              <ForgotPasswordPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <ProtectedRoute onlyUnAuth {...protectedProps}>
              <ResetPasswordPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute {...protectedProps}>
              <ProfileLayout user={user} onLogout={() => setUser(null)} />
            </ProtectedRoute>
          }
        >
          <Route index element={<ProfileForm onUserChange={setUser} />} />
          <Route path="orders" element={<ProfileOrdersPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {background && (
        <Routes>
          <Route
            path="/ingredients/:id"
            element={<IngredientModal ingredients={ingredients} />}
          />
        </Routes>
      )}
    </div>
  );
};
