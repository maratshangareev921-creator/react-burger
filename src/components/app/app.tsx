import { useEffect, type ReactElement } from 'react';
import { Route, Routes, useLocation, type Location } from 'react-router-dom';

import {
  ForgotPasswordPage,
  LoginPage,
  RegisterPage,
  ResetPasswordPage,
} from '../../pages/auth-pages';
import { IngredientModal } from '../../pages/ingredient-modal';
import { IngredientPage } from '../../pages/ingredient-page';
import {
  FeedPage,
  NotFoundPage,
  ProfileForm,
  ProfileLayout,
  ProfileOrdersPage,
} from '../../pages/profile-pages';
import { ProtectedRoute } from '../../pages/protected-route';
import { fetchIngredients } from '../../services/actions/ingredientsActions';
import { checkUserAuth } from '../../services/actions/userActions';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { AppHeader } from '../app-header/app-header';
import { BurgerConstructor } from '../burger-constructor/burger-constructor';
import { BurgerIngredients } from '../burger-ingredients/burger-ingredients';

import styles from './app.module.css';

type BackgroundState = { background: Location };

const isBackgroundState = (value: unknown): value is BackgroundState => {
  if (typeof value !== 'object' || value === null || !('background' in value))
    return false;
  const background: unknown = value.background;
  return (
    typeof background === 'object' && background !== null && 'pathname' in background
  );
};

const HomePage = (): ReactElement => {
  const { ingredients, isLoading, hasError } = useAppSelector(
    (state) => state.ingredients
  );

  return (
    <>
      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
        Соберите бургер
      </h1>
      {isLoading && (
        <p className="text text_type_main-medium pl-5 mt-20">Загрузка ингредиентов...</p>
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

export const App = (): ReactElement => {
  const dispatch = useAppDispatch();
  const { user, isAuthChecked } = useAppSelector((state) => state.user);
  const location = useLocation();
  const locationState: unknown = location.state;
  const background = isBackgroundState(locationState)
    ? locationState.background
    : undefined;

  useEffect(() => {
    void dispatch(fetchIngredients());
    void dispatch(checkUserAuth());
  }, [dispatch]);

  const protectedProps = { user, isAuthChecked };

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background ?? location}>
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
