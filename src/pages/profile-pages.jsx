import {
  Button,
  Input,
  PasswordInput,
} from '@ya.praktikum/react-developer-burger-ui-components';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { NavLink, Outlet, useOutletContext } from 'react-router-dom';

import { logout, updateProfile } from '../services/actions/userActions.js';

import styles from './pages.module.css';

const getErrorMessage = (err) => (err instanceof Error ? err.message : String(err));

export const ProfileLayout = ({ user }) => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <main className={styles.profilePage}>
      <aside className={styles.profileMenu}>
        <NavLink
          to="/profile"
          end
          className={({ isActive }) =>
            `${styles.profileLink} text text_type_main-medium ${
              isActive ? styles.profileLinkActive : ''
            }`
          }
        >
          Профиль
        </NavLink>
        <NavLink
          to="/profile/orders"
          className={({ isActive }) =>
            `${styles.profileLink} text text_type_main-medium ${
              isActive ? styles.profileLinkActive : ''
            }`
          }
        >
          История заказов
        </NavLink>
        <button
          className={`${styles.logoutButton} text text_type_main-medium`}
          type="button"
          onClick={handleLogout}
        >
          Выход
        </button>
        <p className="text text_type_main-default text_color_inactive mt-20">
          В этом разделе вы можете изменить свои персональные данные
        </p>
      </aside>
      <Outlet context={{ user }} />
    </main>
  );
};

export const ProfileForm = () => {
  const dispatch = useDispatch();
  const { user } = useOutletContext();
  const initialForm = useMemo(
    () => ({
      name: user?.name || '',
      email: user?.email || '',
      password: '',
    }),
    [user]
  );
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    setForm(initialForm);
  }, [initialForm]);

  const isChanged =
    form.name !== initialForm.name ||
    form.email !== initialForm.email ||
    form.password !== '';

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleCancel = () => {
    setForm(initialForm);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSending(true);
    dispatch(updateProfile(form))
      .unwrap()
      .then((updatedUser) => {
        setForm({ name: updatedUser.name, email: updatedUser.email, password: '' });
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setIsSending(false));
  };

  return (
    <form className={styles.profileForm} onSubmit={handleSubmit}>
      <Input name="name" placeholder="Имя" value={form.name} onChange={handleChange} />
      <Input
        name="email"
        placeholder="Логин"
        value={form.email}
        onChange={handleChange}
      />
      <PasswordInput
        name="password"
        placeholder="Пароль"
        value={form.password}
        onChange={handleChange}
      />
      {error && <p className="text text_type_main-default text_color_error">{error}</p>}
      {isChanged && (
        <div className={styles.profileActions}>
          <Button
            htmlType="button"
            type="secondary"
            size="medium"
            onClick={handleCancel}
          >
            Отмена
          </Button>
          <Button htmlType="submit" type="primary" size="medium" disabled={isSending}>
            Сохранить
          </Button>
        </div>
      )}
    </form>
  );
};

export const ProfileOrdersPage = () => (
  <section className={styles.development}>
    <h1 className="text text_type_main-medium">История заказов</h1>
    <p className="text text_type_main-default text_color_inactive mt-4">
      Страница находится в разработке.
    </p>
  </section>
);

export const FeedPage = () => (
  <main className={styles.centerPage}>
    <h1 className="text text_type_main-large">Лента заказов</h1>
    <p className="text text_type_main-default text_color_inactive mt-4">
      Страница находится в разработке.
    </p>
  </main>
);

export const NotFoundPage = () => (
  <main className={styles.centerPage}>
    <h1 className="text text_type_digits-large">404</h1>
    <p className="text text_type_main-medium mt-4">Страница не найдена</p>
  </main>
);
