import { useEffect, useMemo, useState, type ReactElement } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

import { Modal } from '../components/modal/modal';
import { OrderInfo } from '../components/order-info/order-info';
import { useAppSelector } from '../services/hooks';
import { getOrderByNumber } from '../utils/burger-api';

import type { Order } from '../types';

import styles from './pages.module.css';

const useOrder = (): {
  order: Order | null;
  isLoading: boolean;
  hasError: boolean;
} => {
  const { number } = useParams<{ number: string }>();
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
        setLoadedOrder(response.orders[0] ?? null);
      })
      .catch(() => setHasError(true))
      .finally(() => setIsLoading(false));
  }, [number, socketOrder]);

  return { order: socketOrder ?? loadedOrder, isLoading, hasError };
};

const OrderContent = (): ReactElement => {
  const ingredients = useAppSelector((state) => state.ingredients.ingredients);
  const { order, isLoading, hasError } = useOrder();

  if (hasError) return <Navigate to="*" replace />;
  if (isLoading || !order) {
    return <p className="text text_type_main-medium p-10">Загрузка заказа...</p>;
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
