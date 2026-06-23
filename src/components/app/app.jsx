import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes, useLocation } from 'react-router-dom';

import {
  ForgotPasswordPage,
  LoginPage,
  RegisterPage,
  ResetPasswordPage,
} from '../../pages/auth-pages.jsx';
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
import { fetchIngredients } from '../../services/actions/ingredientsActions.js';
import { checkUserAuth } from '../../services/actions/userActions.js';
import { AppHeader } from '../app-header/app-header.jsx';
import { BurgerConstructor } from '../burger-constructor/burger-constructor.jsx';
import { BurgerIngredients } from '../burger-ingredients/burger-ingredients.jsx';

import styles from './app.module.css';

const HomePage = () => {
  const { ingredients, isLoading, hasError } = useSelector((state) => state.ingredients);

  return (
    <>
      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
        Соберите бургер
      </h1>
      {isLoading && (
        <p className="text text_type_main-medium pl-5 mt-20">
          Загрузка космических ингредиентов...
        </p>
      )}
      {hasError && (
        <p className="text text_type_main-medium pl-5">
          Произошла ошибка связи с сервером.
        </p>
      )}
      {!isLoading && !hasError && ingredients.length > 0 && (
        <main className={`${styles.main} pl-5 pr-5`}>
          <BurgerIngredients />
          <BurgerConstructor />
        </main>
      )}
    </>
  );
};

export const App = () => {
  const dispatch = useDispatch();
  const { user, isAuthChecked } = useSelector((state) => state.user);
  const location = useLocation();
  const background = location.state?.background;

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  useEffect(() => {
    dispatch(checkUserAuth());
  }, [dispatch]);

  const protectedProps = { user, isAuthChecked };

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        <Route path="/" element={<HomePage />} />
        <Route path="/ingredients/:id" element={<IngredientPage />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route
          path="/login"
          element={
            <ProtectedRoute onlyUnAuth {...protectedProps}>
              <LoginPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute onlyUnAuth {...protectedProps}>
              <RegisterPage />
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
              <ProfileLayout user={user} />
            </ProtectedRoute>
          }
        >
          <Route index element={<ProfileForm />} />
          <Route path="orders" element={<ProfileOrdersPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {background && (
        <Routes>
          <Route path="/ingredients/:id" element={<IngredientModal />} />
        </Routes>
      )}
    </div>
  );
};
