import { useEffect, useMemo, useState, type ReactElement } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { Modal } from '../components/modal/modal';
import { OrderInfo } from '../components/order-info/order-info';
import {
  connectFeed,
  connectProfileOrders,
  disconnectFeed,
  disconnectProfileOrders,
} from '../services/actions/orderFeedActions';
import { useAppDispatch, useAppSelector } from '../services/hooks';
import { getOrderByNumber } from '../utils/burger-api';

import type { Order } from '../types';

import styles from './pages.module.css';

const getAccessToken = (): string =>
  localStorage.getItem('accessToken')?.replace(/^Bearer\s+/i, '') ?? '';

const useOrder = (): {
  order: Order | null;
  isLoading: boolean;
  hasError: boolean;
} => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const feedOrders = useAppSelector((state) => state.feedOrders.orders);
  const profileOrders = useAppSelector((state) => state.profileOrders.orders);
  const [loadedOrder, setLoadedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const socketOrder = useMemo(
    () =>
      [...feedOrders, ...profileOrders].find(
        (order) => String(order.number) === number
      ) ?? null,
    [feedOrders, number, profileOrders]
  );

  useEffect(() => {
    if (!number || socketOrder) return;

    setIsLoading(true);
    setHasError(false);
    void getOrderByNumber(number)
      .then((response) => {
        const order = response.orders[0] ?? null;
        setLoadedOrder(order);
        setHasError(!order);
      })
      .catch(() => setHasError(true))
      .finally(() => setIsLoading(false));
  }, [number, socketOrder]);

  useEffect(() => {
    if (socketOrder) return undefined;

    if (location.pathname.startsWith('/feed/')) {
      dispatch(connectFeed());
      return (): void => {
        dispatch(disconnectFeed());
      };
    }

    if (location.pathname.startsWith('/profile/orders/')) {
      const token = getAccessToken();
      if (token) dispatch(connectProfileOrders(token));
      return (): void => {
        dispatch(disconnectProfileOrders());
      };
    }

    return undefined;
  }, [dispatch, location.pathname, socketOrder]);

  return { order: socketOrder ?? loadedOrder, isLoading, hasError };
};

const OrderContent = (): ReactElement => {
  const ingredients = useAppSelector((state) => state.ingredients.ingredients);
  const { order, isLoading, hasError } = useOrder();

  if (isLoading || !order) {
    return (
      <p className="text text_type_main-medium p-10">
        {hasError ? 'Не удалось загрузить заказ' : 'Загрузка заказа...'}
      </p>
    );
  }

  return <OrderInfo order={order} ingredients={ingredients} />;
};

export const OrderPage = (): ReactElement => (
  <main className={styles.orderPage}>
    <OrderContent />
  </main>
);

export const OrderModal = (): ReactElement => {
  const navigate = useNavigate();

  return (
    <Modal title="Информация о заказе" onClose={() => navigate(-1)}>
      <OrderContent />
    </Modal>
  );
};
