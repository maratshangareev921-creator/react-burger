import styles from './order-details.module.css';

export const OrderDetails = () => {
  return (
    <div className={`${styles.container} mt-4 mb-30`}>
      <h2 className={`${styles.order_id} text text_type_digits-large mb-8`}>034536</h2>
      <p className="text text_type_main-medium mb-15">идентификатор заказа</p>
      <div className={styles.done_placeholder}>✓</div>
      <p className="text text_type_main-default mb-2">Ваш заказ начали готовить</p>
      <p className="text text_type_main-default text_color_inactive">
        Дождитесь готовности на орбитальной станции
      </p>
    </div>
  );
};
