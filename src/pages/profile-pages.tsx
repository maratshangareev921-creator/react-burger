import {
  Button,
  Input,
  PasswordInput,
} from '@ya.praktikum/react-developer-burger-ui-components';
import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactElement,
} from 'react';
import { NavLink, Outlet, useOutletContext } from 'react-router-dom';

import { logout, updateProfile } from '../services/actions/userActions';
import { useAppDispatch } from '../services/hooks';

import type { RegisterForm, User } from '../types';

import styles from './pages.module.css';

type ProfileLayoutProps = { user: User | null };
type ProfileContext = { user: User | null };

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

const handlePointerCapture = (): void => undefined;

export const ProfileLayout = ({ user }: ProfileLayoutProps): ReactElement => {
  const dispatch = useAppDispatch();

  return (
    <main className={styles.profilePage}>
      <aside className={styles.profileMenu}>
        <NavLink
          to="/profile"
          end
          className={({ isActive }) =>
            `${styles.profileLink} text text_type_main-medium ${isActive ? styles.profileLinkActive : ''}`
          }
        >
          Профиль
        </NavLink>
        <NavLink
          to="/profile/orders"
          className={({ isActive }) =>
            `${styles.profileLink} text text_type_main-medium ${isActive ? styles.profileLinkActive : ''}`
          }
        >
          История заказов
        </NavLink>
        <button
          className={`${styles.logoutButton} text text_type_main-medium`}
          type="button"
          onClick={() => {
            void dispatch(logout());
          }}
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

export const ProfileForm = (): ReactElement => {
  const dispatch = useAppDispatch();
  const { user } = useOutletContext<ProfileContext>();
  const initialForm = useMemo<RegisterForm>(
    () => ({ name: user?.name ?? '', email: user?.email ?? '', password: '' }),
    [user]
  );
  const [form, setForm] = useState<RegisterForm>(initialForm);
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => setForm(initialForm), [initialForm]);

  const isChanged =
    form.name !== initialForm.name ||
    form.email !== initialForm.email ||
    form.password !== '';

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.currentTarget;
    if (name === 'name') setForm((current) => ({ ...current, name: value }));
    if (name === 'email') setForm((current) => ({ ...current, email: value }));
    if (name === 'password') setForm((current) => ({ ...current, password: value }));
    setError('');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setIsSending(true);
    void dispatch(updateProfile(form))
      .unwrap()
      .then((updatedUser) => setForm({ ...updatedUser, password: '' }))
      .catch((reason: unknown) => setError(getErrorMessage(reason)))
      .finally(() => setIsSending(false));
  };

  return (
    <form className={styles.profileForm} onSubmit={handleSubmit}>
      <Input
        name="name"
        placeholder="Имя"
        value={form.name}
        onChange={handleChange}
        onPointerEnterCapture={handlePointerCapture}
        onPointerLeaveCapture={handlePointerCapture}
      />
      <Input
        name="email"
        placeholder="Логин"
        value={form.email}
        onChange={handleChange}
        onPointerEnterCapture={handlePointerCapture}
        onPointerLeaveCapture={handlePointerCapture}
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
            onClick={() => {
              setForm(initialForm);
              setError('');
            }}
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

export const ProfileOrdersPage = (): ReactElement => (
  <section className={styles.development}>
    <h1 className="text text_type_main-medium">История заказов</h1>
    <p className="text text_type_main-default text_color_inactive mt-4">
      Страница находится в разработке.
    </p>
  </section>
);

export const FeedPage = (): ReactElement => (
  <main className={styles.centerPage}>
    <h1 className="text text_type_main-large">Лента заказов</h1>
    <p className="text text_type_main-default text_color_inactive mt-4">
      Страница находится в разработке.
    </p>
  </main>
);

export const NotFoundPage = (): ReactElement => (
  <main className={styles.centerPage}>
    <h1 className="text text_type_digits-large">404</h1>
    <p className="text text_type_main-medium mt-4">Страница не найдена</p>
  </main>
);
