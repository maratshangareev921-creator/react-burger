import {
  ConstructorElement,
  CurrencyIcon,
  Button,
} from '@ya.praktikum/react-developer-burger-ui-components';
import { useDrop } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { createOrder } from '../../services/actions/orderActions';
import {
  addConstructorItem,
  clearConstructor,
  selectTotalPrice,
} from '../../services/slices/burgerConstructorSlice';
import { clearOrder } from '../../services/slices/orderSlice';
import { Modal } from '../modal/modal';
import { OrderDetails } from '../order-details/order-details';
import { ConstructorItem } from './constructor-item';

import styles from './burger-constructor.module.css';

export const BurgerConstructor = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { orderNumber, isLoading, error } = useSelector((state) => state.order);
  const { bun, ingredients: mainIngredients } = useSelector(
    (state) => state.burgerConstructor
  );
  const totalPrice = useSelector(selectTotalPrice);

  const [, dropTargetRef] = useDrop({
    accept: 'ingredient',
    drop(item) {
      dispatch(addConstructorItem(item));
    },
  });

  const handleCheckout = () => {
    if (!bun) return;

    if (!localStorage.getItem('accessToken')) {
      navigate('/login', { state: { from: location } });
      return;
    }

    const orderIngredients = [
      bun._id,
      ...mainIngredients.map((item) => item._id),
      bun._id,
    ];
    dispatch(createOrder(orderIngredients)).then((action) => {
      if (createOrder.fulfilled.match(action)) {
        dispatch(clearConstructor());
      }
    });
  };

  const handleCloseModal = () => {
    dispatch(clearOrder());
  };

  return (
    <section
      ref={dropTargetRef}
      className={`${styles.burger_constructor} mt-25`}
      style={{ minHeight: '400px' }}
    >
      {bun ? (
        <div className="ml-8 mb-4">
          <ConstructorElement
            type="top"
            isLocked={true}
            text={`${bun.name} (верх)`}
            price={bun.price}
            thumbnail={bun.image}
          />
        </div>
      ) : (
        <div
          className={`${styles.stub} ${styles.stub_top} ml-8 mb-4 text text_type_main-default`}
        >
          Выберите булки
        </div>
      )}

      <div className={`${styles.ingredient_list} custom-scroll`}>
        {mainIngredients.length > 0 ? (
          mainIngredients.map((item, index) => (
            <ConstructorItem key={item.constructorId} item={item} index={index} />
          ))
        ) : (
          <div
            className={`${styles.stub} ${styles.stub_middle} ml-8 text text_type_main-default`}
          >
            Выберите начинки
          </div>
        )}
      </div>

      {bun ? (
        <div className="ml-8 mt-4">
          <ConstructorElement
            type="bottom"
            isLocked={true}
            text={`${bun.name} (низ)`}
            price={bun.price}
            thumbnail={bun.image}
          />
        </div>
      ) : (
        <div
          className={`${styles.stub} ${styles.stub_bottom} ml-8 mt-4 text text_type_main-default`}
        >
          Выберите булки
        </div>
      )}

      <div className={`${styles.total_container} mt-10 mr-4`}>
        <div className={`${styles.price_wrapper} mr-10`}>
          <span className="text text_type_digits-medium mr-2">{totalPrice}</span>
          <CurrencyIcon type="primary" />
        </div>
        <Button
          htmlType="button"
          type="primary"
          size="large"
          onClick={handleCheckout}
          disabled={isLoading || !bun}
        >
          {isLoading ? 'Оформление...' : 'Оформить заказ'}
        </Button>
      </div>

      {error && (
        <p
          className="text text_type_main-default mt-4 text_color_error"
          style={{ textAlign: 'right' }}
        >
          Произошла ошибка при создании заказа: {error}
        </p>
      )}

      {orderNumber && (
        <Modal onClose={handleCloseModal}>
          <OrderDetails />
        </Modal>
      )}
    </section>
  );
};
