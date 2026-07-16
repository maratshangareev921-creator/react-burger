import { useAppSelector } from '../../services/hooks';

import type { ReactElement } from 'react';

import styles from './order-details.module.css';

export const OrderDetails = (): ReactElement => {
  const orderNumber = useAppSelector((state) => state.order.orderNumber);

  return (
    <div className={`${styles.container} mt-4 mb-30`} data-testid="order-details">
      <h2 className={`${styles.order_id} text text_type_digits-large mb-8`}>
        {orderNumber}
      </h2>
      <p className="text text_type_main-medium mb-15">идентификатор заказа</p>
      <div className={styles.done_placeholder}>✓</div>
      <p className="text text_type_main-default mb-2">Ваш заказ начали готовить</p>
      <p className="text text_type_main-default text_color_inactive">
        Дождитесь готовности на орбитальной станции
      </p>
    </div>
  );
};
