import {
  ConstructorElement,
  CurrencyIcon,
  Button,
  DragIcon,
} from '@ya.praktikum/react-developer-burger-ui-components';
import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import { Modal } from '../modal/modal';
import { OrderDetails } from '../order-details/order-details';

import styles from './burger-constructor.module.css';

const placeholderClassByPosition = {
  top: styles.placeholder_top,
  middle: styles.placeholder_middle,
  bottom: styles.placeholder_bottom,
};

const Placeholder = ({ position, children }) => (
  <div className={`${styles.placeholder} ${placeholderClassByPosition[position]}`}>
    <span className="text text_type_main-default text_color_inactive">{children}</span>
  </div>
);

const getDropData = (dataTransfer) => {
  const payload =
    dataTransfer.getData('application/json') || dataTransfer.getData('text/plain');

  if (!payload || payload === '[object Object]') {
    return null;
  }

  try {
    return JSON.parse(payload);
  } catch {
    return null;
  }
};

const ConstructorIngredient = ({
  item,
  index,
  draggedIngredient,
  onAddIngredient,
  onClearDraggedIngredient,
  onRemove,
  onMove,
}) => {
  const ref = useRef(null);

  const [{ isDragging }, dragRef] = useDrag({
    type: 'constructor-ingredient',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isHover }, dropRef] = useDrop({
    accept: ['ingredient', 'constructor-ingredient'],
    hover(dragItem, monitor) {
      if (dragItem.type || dragItem._id) {
        return;
      }

      if (!ref.current || dragItem.index === index) {
        return;
      }

      const hoverRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverRect.bottom - hoverRect.top) / 2;
      const cursor = monitor.getClientOffset();
      const hoverClientY = cursor.y - hoverRect.top;

      if (dragItem.index < index && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragItem.index > index && hoverClientY > hoverMiddleY) {
        return;
      }

      onMove(dragItem.index, index);
      dragItem.index = index;
    },
    collect: (monitor) => ({
      isHover: monitor.isOver(),
    }),
    drop(dragItem) {
      if (dragItem.type || dragItem._id) {
        onAddIngredient(dragItem);
        onClearDraggedIngredient();
      }
    },
  });

  dragRef(dropRef(ref));

  return (
    <li
      ref={ref}
      draggable
      onDragStart={(event) => {
        const payload = JSON.stringify({ kind: 'constructor-ingredient', index });
        event.dataTransfer.setData('application/json', payload);
        event.dataTransfer.setData('text/plain', payload);
      }}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();

        const data = getDropData(event.dataTransfer);
        if (data?.kind === 'ingredient') {
          event.stopPropagation();
          onAddIngredient(data.ingredient);
          onClearDraggedIngredient();
          return;
        }

        if (data?.kind === 'constructor-ingredient') {
          event.stopPropagation();
          onMove(data.index, index);
        }
      }}
      onMouseUp={(event) => {
        if (draggedIngredient) {
          event.stopPropagation();
          onAddIngredient(draggedIngredient);
          onClearDraggedIngredient();
        }
      }}
      className={`${styles.element_wrapper} ${isDragging ? styles.dragging : ''} ${
        isHover ? styles.hover : ''
      } mb-4 ml-4`}
    >
      <div className="mr-2">
        <DragIcon type="primary" />
      </div>
      <ConstructorElement
        text={item.name}
        price={item.price}
        thumbnail={item.image}
        handleClose={() => onRemove(item.constructorId)}
      />
    </li>
  );
};

export const BurgerConstructor = ({
  bun,
  ingredients,
  draggedIngredient,
  onAddIngredient,
  onClearDraggedIngredient,
  onRemoveIngredient,
  onMoveIngredient,
}) => {
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = React.useState(false);

  const [{ isHover }, dropRef] = useDrop({
    accept: 'ingredient',
    drop: (item, monitor) => {
      if (!monitor.didDrop()) {
        onAddIngredient(item);
        onClearDraggedIngredient();
      }
    },
    collect: (monitor) => ({
      isHover: monitor.isOver(),
    }),
  });

  const totalPrice = React.useMemo(() => {
    const ingredientsPrice = ingredients.reduce((prev, item) => prev + item.price, 0);
    const bunPrice = bun ? bun.price * 2 : 0;
    return ingredientsPrice + bunPrice;
  }, [bun, ingredients]);

  const handleOpenModal = () => {
    if (bun) {
      setIsOrderDetailsOpen(true);
    }
  };

  const handleCloseModal = () => setIsOrderDetailsOpen(false);

  const handleNativeDrop = (event) => {
    event.preventDefault();

    const data = getDropData(event.dataTransfer);
    if (data?.kind === 'ingredient') {
      onAddIngredient(data.ingredient);
    }
  };

  const handleMouseUp = () => {
    if (draggedIngredient) {
      onAddIngredient(draggedIngredient);
      onClearDraggedIngredient();
    }
  };

  return (
    <section
      ref={dropRef}
      onDragOver={(event) => event.preventDefault()}
      onDrop={handleNativeDrop}
      onMouseUp={handleMouseUp}
      className={`${styles.burger_constructor} ${isHover ? styles.drop_hover : ''} mt-25`}
    >
      <div className="ml-8 mb-4">
        {bun ? (
          <ConstructorElement
            type="top"
            isLocked={true}
            text={`${bun.name} (верх)`}
            price={bun.price}
            thumbnail={bun.image}
          />
        ) : (
          <Placeholder position="top">Добавьте булку</Placeholder>
        )}
      </div>

      <ul className={`${styles.ingredient_list} custom-scroll`}>
        {ingredients.length > 0 ? (
          ingredients.map((item, index) => (
            <ConstructorIngredient
              key={item.constructorId}
              item={item}
              index={index}
              draggedIngredient={draggedIngredient}
              onAddIngredient={onAddIngredient}
              onClearDraggedIngredient={onClearDraggedIngredient}
              onRemove={onRemoveIngredient}
              onMove={onMoveIngredient}
            />
          ))
        ) : (
          <Placeholder position="middle">Добавьте начинку</Placeholder>
        )}
      </ul>

      <div className="ml-8 mt-4">
        {bun ? (
          <ConstructorElement
            type="bottom"
            isLocked={true}
            text={`${bun.name} (низ)`}
            price={bun.price}
            thumbnail={bun.image}
          />
        ) : (
          <Placeholder position="bottom">Добавьте булку</Placeholder>
        )}
      </div>

      <div className={`${styles.total_container} mt-10 mr-4`}>
        <div className={`${styles.price_wrapper} mr-10`}>
          <span className="text text_type_digits-medium mr-2">{totalPrice}</span>
          <CurrencyIcon type="primary" />
        </div>
        <Button
          htmlType="button"
          type="primary"
          size="large"
          onClick={handleOpenModal}
          disabled={!bun}
        >
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
