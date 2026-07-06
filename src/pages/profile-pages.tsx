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

import { OrderCard } from '../components/order-card/order-card';
import {
  connectFeed,
  connectProfileOrders,
  disconnectFeed,
  disconnectProfileOrders,
} from '../services/actions/orderFeedActions';
import { logout, updateProfile } from '../services/actions/userActions';
import { useAppDispatch, useAppSelector } from '../services/hooks';

import type { Order, RegisterForm, User } from '../types';

import styles from './pages.module.css';

type ProfileLayoutProps = { user: User | null };
type ProfileContext = { user: User | null };

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

const handlePointerCapture = (): void => undefined;

const getAccessToken = (): string =>
  localStorage.getItem('accessToken')?.replace(/^Bearer\s+/i, '') ?? '';

const chunk = <T,>(items: T[], size: number): T[][] =>
  Array.from({ length: Math.ceil(items.length / size) }, (_, index) =>
    items.slice(index * size, index * size + size)
  );

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

export const ProfileOrdersPage = (): ReactElement => {
  const dispatch = useAppDispatch();
  const { orders, error } = useAppSelector((state) => state.profileOrders);
  const ingredients = useAppSelector((state) => state.ingredients.ingredients);

  useEffect(() => {
    const token = getAccessToken();
    if (token) dispatch(connectProfileOrders(token));
    return (): void => {
      dispatch(disconnectProfileOrders());
    };
  }, [dispatch]);

  return (
    <section className={styles.profileOrders}>
      {error && <p className="text text_type_main-default text_color_error">{error}</p>}
      <div className={`${styles.orderList} custom-scroll`}>
        {orders.map((order) => (
          <OrderCard
            key={order._id}
            order={order}
            ingredients={ingredients}
            showStatus
            to={`/profile/orders/${order.number}`}
          />
        ))}
      </div>
    </section>
  );
};

const OrderNumbers = ({
  title,
  orders,
  done = false,
}: {
  title: string;
  orders: Order[];
  done?: boolean;
}): ReactElement => {
  const columns = chunk(orders.slice(0, 20), 10);

  return (
    <section>
      <h2 className="text text_type_main-medium mb-6">{title}</h2>
      <div className={styles.statusColumns}>
        {columns.map((column, index) => (
          <ul className={styles.statusList} key={index}>
            {column.map((order) => (
              <li
                className={`text text_type_digits-default ${
                  done ? styles.statusDone : ''
                }`}
                key={order._id}
              >
                {order.number}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
};

export const FeedPage = (): ReactElement => {
  const dispatch = useAppDispatch();
  const { orders, total, totalToday, error } = useAppSelector(
    (state) => state.feedOrders
  );
  const ingredients = useAppSelector((state) => state.ingredients.ingredients);
  const doneOrders = orders.filter((order) => order.status === 'done');
  const pendingOrders = orders.filter((order) => order.status === 'pending');

  useEffect(() => {
    dispatch(connectFeed());
    return (): void => {
      dispatch(disconnectFeed());
    };
  }, [dispatch]);

  return (
    <main className={styles.feedPage}>
      <h1 className="text text_type_main-large mb-5">Лента заказов</h1>
      {error && <p className="text text_type_main-default text_color_error">{error}</p>}
      <div className={styles.feedLayout}>
        <section className={`${styles.orderList} custom-scroll`}>
          {orders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              ingredients={ingredients}
              to={`/feed/${order.number}`}
            />
          ))}
        </section>
        <aside className={styles.feedStats}>
          <div className={styles.statusBoard}>
            <OrderNumbers title="Готовы:" orders={doneOrders} done />
            <OrderNumbers title="В работе:" orders={pendingOrders} />
          </div>
          <section>
            <h2 className="text text_type_main-medium">Выполнено за все время:</h2>
            <p className="text text_type_digits-large">{total}</p>
          </section>
          <section>
            <h2 className="text text_type_main-medium">Выполнено за сегодня:</h2>
            <p className="text text_type_digits-large">{totalToday}</p>
          </section>
        </aside>
      </div>
    </main>
  );
};

export const NotFoundPage = (): ReactElement => (
  <main className={styles.centerPage}>
    <h1 className="text text_type_digits-large">404</h1>
    <p className="text text_type_main-medium mt-4">Страница не найдена</p>
  </main>
);
