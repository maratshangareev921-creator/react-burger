import { CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import { Link, useLocation } from 'react-router-dom';

import type { ReactElement } from 'react';

import type { Ingredient, Order, OrderStatus } from '../../types';

import styles from './order-card.module.css';

type OrderCardProps = {
  order: Order;
  ingredients: Ingredient[];
  showStatus?: boolean;
  to: string;
};

const statusText: Record<OrderStatus, string> = {
  created: 'Создан',
  pending: 'Готовится',
  done: 'Выполнен',
};

const formatDate = (value: string): string =>
  new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));

export const getOrderPrice = (order: Order, ingredients: Ingredient[]): number =>
  order.ingredients.reduce((total, id) => {
    const ingredient = ingredients.find((item) => item._id === id);
    return total + (ingredient?.price ?? 0);
  }, 0);

export const OrderCard = ({
  order,
  ingredients,
  showStatus = false,
  to,
}: OrderCardProps): ReactElement => {
  const location = useLocation();
  const orderIngredients = order.ingredients
    .map((id) => ingredients.find((item) => item._id === id))
    .filter((item): item is Ingredient => Boolean(item));
  const visibleIngredients = orderIngredients.slice(0, 6);
  const hiddenCount = orderIngredients.length - visibleIngredients.length;
  const price = getOrderPrice(order, ingredients);

  return (
    <Link to={to} state={{ background: location }} className={styles.card}>
      <div className={`${styles.header} mb-6`}>
        <span className="text text_type_digits-default">#{order.number}</span>
        <time className="text text_type_main-default text_color_inactive">
          {formatDate(order.createdAt)}
        </time>
      </div>
      <h2 className={`${styles.name} text text_type_main-medium mb-6`}>{order.name}</h2>
      {showStatus && (
        <p
          className={`text text_type_main-default mb-6 ${
            order.status === 'done' ? styles.status_done : ''
          }`}
        >
          {statusText[order.status]}
        </p>
      )}
      <div className={styles.footer}>
        <ul className={styles.ingredients}>
          {visibleIngredients.map((ingredient, index) => (
            <li
              className={styles.ingredient}
              key={`${ingredient._id}-${index}`}
              style={{ zIndex: visibleIngredients.length - index }}
            >
              <img src={ingredient.image_mobile} alt={ingredient.name} />
              {index === 5 && hiddenCount > 0 && (
                <span className={`${styles.more} text text_type_main-default`}>
                  +{hiddenCount}
                </span>
              )}
            </li>
          ))}
        </ul>
        <div className={styles.price}>
          <span className="text text_type_digits-default">{price}</span>
          <CurrencyIcon type="primary" />
        </div>
      </div>
    </Link>
  );
};
