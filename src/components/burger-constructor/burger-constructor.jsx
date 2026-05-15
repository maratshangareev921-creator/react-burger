import {
  ConstructorElement,
  CurrencyIcon,
  Button,
  DragIcon,
} from '@ya.praktikum/react-developer-burger-ui-components';
import React from 'react';

import { Modal } from '../modal/modal';
import { OrderDetails } from '../order-details/order-details';

import styles from './burger-constructor.module.css';

export const BurgerConstructor = ({ ingredients }) => {
  const bun = ingredients.find((item) => item.type === 'bun');
  const mainIngredients = ingredients.filter((item) => item.type !== 'bun');

  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = React.useState(false);

  const totalPrice = React.useMemo(() => {
    const mainPrice = mainIngredients.reduce((prev, item) => prev + item.price, 0);
    const bunPrice = bun ? bun.price * 2 : 0;
    return mainPrice + bunPrice;
  }, [bun, mainIngredients]);

  const handleOpenModal = () => setIsOrderDetailsOpen(true);
  const handleCloseModal = () => setIsOrderDetailsOpen(false);

  return (
    <section className={`${styles.burger_constructor} mt-25`}>
      {bun && (
        <div className="ml-8 mb-4">
          <ConstructorElement
            type="top"
            isLocked={true}
            text={`${bun.name} (верх)`}
            price={bun.price}
            thumbnail={bun.image}
          />
        </div>
      )}

      <div className={`${styles.ingredient_list} custom-scroll`}>
        {mainIngredients.map((item) => (
          <div key={item._id} className={`${styles.element_wrapper} mb-4 ml-4`}>
            <div className="mr-2">
              <DragIcon type="primary" />
            </div>
            <ConstructorElement
              text={item.name}
              price={item.price}
              thumbnail={item.image}
            />
          </div>
        ))}
      </div>

      {bun && (
        <div className="ml-8 mt-4">
          <ConstructorElement
            type="bottom"
            isLocked={true}
            text={`${bun.name} (низ)`}
            price={bun.price}
            thumbnail={bun.image}
          />
        </div>
      )}

      <div className={`${styles.total_container} mt-10 mr-4`}>
        <div className={`${styles.price_wrapper} mr-10`}>
          <span className="text text_type_digits-medium mr-2">{totalPrice}</span>
          <CurrencyIcon type="primary" />
        </div>
        <Button htmlType="button" type="primary" size="large" onClick={handleOpenModal}>
          Оформить заказ
        </Button>
      </div>

      {isOrderDetailsOpen && (
        <Modal onClose={handleCloseModal}>
          <OrderDetails />
        </Modal>
      )}
    </section>
  );
};
