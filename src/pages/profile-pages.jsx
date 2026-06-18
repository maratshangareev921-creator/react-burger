import {
  Button,
  Input,
  PasswordInput,
} from '@ya.praktikum/react-developer-burger-ui-components';
import { useEffect, useMemo, useState } from 'react';
import { NavLink, Outlet, useOutletContext } from 'react-router-dom';

import { logoutUser, updateUser } from '../utils/burger-api.js';

import styles from './pages.module.css';

export const ProfileLayout = ({ onLogout, user }) => {
  const handleLogout = () => {
    logoutUser().finally(onLogout);
  };

  return (
    <main className={styles.profilePage}>
      <aside className={styles.profileMenu}>
        <NavLink
          to="/profile"
          end
          className={({ isActive }) =>
            `${styles.profileLink} ${isActive ? styles.profileLinkActive : ''}`
          }
        >
          Профиль
        </NavLink>
        <NavLink
          to="/profile/orders"
          className={({ isActive }) =>
            `${styles.profileLink} ${isActive ? styles.profileLinkActive : ''}`
          }
        >
          История заказов
        </NavLink>
        <button className={styles.logoutButton} type="button" onClick={handleLogout}>
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

export const ProfileForm = ({ onUserChange }) => {
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
    updateUser(form)
      .then((data) => {
        onUserChange(data.user);
        setForm({ name: data.user.name, email: data.user.email, password: '' });
      })
      .catch((err) => setError(err.message))
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
