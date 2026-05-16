import {
  ConstructorElement,
  DragIcon,
} from '@ya.praktikum/react-developer-burger-ui-components';
import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useDispatch } from 'react-redux';

import {
  removeConstructorItem,
  moveConstructorItem,
} from '../../services/slices/burgerConstructorSlice';

import styles from './constructor-item.module.css';

export const ConstructorItem = ({ item, index }) => {
  const dispatch = useDispatch();
  const ref = useRef(null);

  const [, drop] = useDrop({
    accept: 'sort_ingredient',
    hover(draggedItem, monitor) {
      if (!ref.current) return;

      const dragIndex = draggedItem.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      dispatch(moveConstructorItem({ dragIndex, hoverIndex }));
      draggedItem.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'sort_ingredient',
    item: () => ({ constructorId: item.constructorId, index }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));
  const opacity = isDragging ? 0 : 1;

  return (
    <div ref={ref} className={`${styles.element_wrapper} mb-4 ml-4`} style={{ opacity }}>
      <div className={`${styles.drag_handle} mr-2`}>
        <DragIcon type="primary" />
      </div>
      <ConstructorElement
        text={item.name}
        price={item.price}
        thumbnail={item.image}
        handleClose={() => dispatch(removeConstructorItem(item.constructorId))}
      />
    </div>
  );
};
