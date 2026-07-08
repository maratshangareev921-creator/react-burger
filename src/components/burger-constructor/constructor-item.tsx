import {
  ConstructorElement,
  DragIcon,
} from '@ya.praktikum/react-developer-burger-ui-components';
import { useRef, type ReactElement } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import { useAppDispatch } from '../../services/hooks';
import {
  moveConstructorItem,
  removeConstructorItem,
} from '../../services/slices/burgerConstructorSlice';

import type { ConstructorIngredient } from '../../types';

import styles from './constructor-item.module.css';

type ConstructorItemProps = { item: ConstructorIngredient; index: number };
type SortItem = { constructorId: string; index: number };
type DragCollectedProps = { isDragging: boolean };

export const ConstructorItem = ({ item, index }: ConstructorItemProps): ReactElement => {
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop<SortItem>({
    accept: 'sort_ingredient',
    hover(draggedItem, monitor) {
      const element = ref.current;
      if (!element || draggedItem.index === index) return;

      const bounds = element.getBoundingClientRect();
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;

      const hoverClientY = clientOffset.y - bounds.top;
      const hoverMiddleY = (bounds.bottom - bounds.top) / 2;
      if (draggedItem.index < index && hoverClientY < hoverMiddleY) return;
      if (draggedItem.index > index && hoverClientY > hoverMiddleY) return;

      dispatch(moveConstructorItem({ dragIndex: draggedItem.index, hoverIndex: index }));
      draggedItem.index = index;
    },
  });

  const [{ isDragging }, drag] = useDrag<SortItem, void, DragCollectedProps>({
    type: 'sort_ingredient',
    item: () => ({ constructorId: item.constructorId, index }),
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`${styles.element_wrapper} mb-4 ml-4`}
      style={{ opacity: isDragging ? 0 : 1 }}
    >
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
