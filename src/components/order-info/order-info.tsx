import { CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';

import type { ReactElement } from 'react';

import type { Ingredient, Order, OrderStatus } from '../../types';

import styles from './order-info.module.css';

type OrderInfoProps = {
  order: Order;
  ingredients: Ingredient[];
};

type IngredientRow = {
  ingredient: Ingredient;
  count: number;
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
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));

export const OrderInfo = ({ order, ingredients }: OrderInfoProps): ReactElement => {
  const rows = order.ingredients.reduce<IngredientRow[]>((acc, id) => {
    const ingredient = ingredients.find((item) => item._id === id);
    if (!ingredient) return acc;
    const existing = acc.find((item) => item.ingredient._id === id);
    if (existing) existing.count += 1;
    else acc.push({ ingredient, count: 1 });
    return acc;
  }, []);

  const total = rows.reduce((sum, row) => sum + row.ingredient.price * row.count, 0);

  return (
    <div className={styles.container}>
      <p className={`${styles.number} text text_type_digits-default mb-10`}>
        #{order.number}
      </p>
      <h1 className="text text_type_main-medium mb-3">{order.name}</h1>
      <p
        className={`text text_type_main-default mb-15 ${
          order.status === 'done' ? styles.status_done : ''
        }`}
      >
        {statusText[order.status]}
      </p>
      <h2 className="text text_type_main-medium mb-6">Состав:</h2>
      <ul className={`${styles.list} custom-scroll mb-10`}>
        {rows.map(({ ingredient, count }) => (
          <li className={styles.ingredient} key={ingredient._id}>
            <span className={styles.image}>
              <img src={ingredient.image_mobile} alt={ingredient.name} />
            </span>
            <span className={`${styles.ingredientName} text text_type_main-default`}>
              {ingredient.name}
            </span>
            <span className={`${styles.price} text text_type_digits-default`}>
              {count} x {ingredient.price}
              <CurrencyIcon type="primary" />
            </span>
          </li>
        ))}
      </ul>
      <div className={styles.footer}>
        <time className="text text_type_main-default text_color_inactive">
          {formatDate(order.createdAt)}
        </time>
        <span className={`${styles.price} text text_type_digits-default`}>
          {total}
          <CurrencyIcon type="primary" />
        </span>
      </div>
    </div>
  );
};
