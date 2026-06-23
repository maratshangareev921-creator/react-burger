import {
  Counter,
  CurrencyIcon,
  Tab,
} from '@ya.praktikum/react-developer-burger-ui-components';
import { useMemo, useRef, useState, type ReactElement } from 'react';
import { useDrag } from 'react-dnd';
import { Link, useLocation } from 'react-router-dom';

import { useAppSelector } from '../../services/hooks';

import type { Ingredient, IngredientType } from '../../types';

import styles from './burger-ingredients.module.css';

type IngredientCardProps = { item: Ingredient };
type DragCollectedProps = { isDragging: boolean };

const IngredientCard = ({ item }: IngredientCardProps): ReactElement => {
  const location = useLocation();
  const { bun, ingredients: constructorIngredients } = useAppSelector(
    (state) => state.burgerConstructor
  );
  const [{ isDragging }, dragRef] = useDrag<Ingredient, void, DragCollectedProps>({
    type: 'ingredient',
    item,
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  const count = useMemo(() => {
    if (item.type === 'bun') return bun?._id === item._id ? 2 : 0;
    return constructorIngredients.filter(({ _id }) => _id === item._id).length;
  }, [bun, constructorIngredients, item]);

  return (
    <li
      ref={(node) => {
        dragRef(node);
      }}
      className={styles.card}
      style={{ opacity: isDragging ? 0.4 : 1, cursor: 'grab' }}
    >
      <Link
        to={`/ingredients/${item._id}`}
        state={{ background: location }}
        className={styles.card_link}
      >
        {count > 0 && <Counter count={count} size="default" />}
        <img src={item.image} alt={item.name} className="ml-4 mr-4" />
        <div className={`${styles.price} mt-1 mb-1`}>
          <span className="text text_type_digits-default mr-2">{item.price}</span>
          <CurrencyIcon type="primary" />
        </div>
        <p className={`${styles.name} text text_type_main-default`}>{item.name}</p>
      </Link>
    </li>
  );
};

const isIngredientType = (value: string): value is IngredientType =>
  value === 'bun' || value === 'sauce' || value === 'main';

export const BurgerIngredients = (): ReactElement => {
  const { ingredients } = useAppSelector((state) => state.ingredients);
  const [current, setCurrent] = useState<IngredientType>('bun');
  const containerRef = useRef<HTMLDivElement>(null);
  const bunRef = useRef<HTMLHeadingElement>(null);
  const sauceRef = useRef<HTMLHeadingElement>(null);
  const mainRef = useRef<HTMLHeadingElement>(null);

  const buns = useMemo(
    () => ingredients.filter((item) => item.type === 'bun'),
    [ingredients]
  );
  const sauces = useMemo(
    () => ingredients.filter((item) => item.type === 'sauce'),
    [ingredients]
  );
  const mains = useMemo(
    () => ingredients.filter((item) => item.type === 'main'),
    [ingredients]
  );

  const handleTabClick = (value: string): void => {
    if (!isIngredientType(value)) return;
    setCurrent(value);

    const container = containerRef.current;
    const target = {
      bun: bunRef.current,
      sauce: sauceRef.current,
      main: mainRef.current,
    }[value];
    if (!container || !target) return;

    const scrollTarget =
      container.scrollTop +
      (target.getBoundingClientRect().top - container.getBoundingClientRect().top);
    container.scrollTo({ top: scrollTarget, behavior: 'smooth' });
  };

  const handleScroll = (): void => {
    const container = containerRef.current;
    const bun = bunRef.current;
    const sauce = sauceRef.current;
    const main = mainRef.current;
    if (!container || !bun || !sauce || !main) return;

    const containerTop = container.getBoundingClientRect().top;
    const distances: Record<IngredientType, number> = {
      bun: Math.abs(bun.getBoundingClientRect().top - containerTop),
      sauce: Math.abs(sauce.getBoundingClientRect().top - containerTop),
      main: Math.abs(main.getBoundingClientRect().top - containerTop),
    };
    const closest = (Object.keys(distances) as IngredientType[]).reduce((a, b) =>
      distances[a] < distances[b] ? a : b
    );
    setCurrent(closest);
  };

  return (
    <section className={styles.burger_ingredients}>
      <div className={`${styles.tabs} mb-10`}>
        <Tab value="bun" active={current === 'bun'} onClick={handleTabClick}>
          Булки
        </Tab>
        <Tab value="sauce" active={current === 'sauce'} onClick={handleTabClick}>
          Соусы
        </Tab>
        <Tab value="main" active={current === 'main'} onClick={handleTabClick}>
          Начинки
        </Tab>
      </div>
      <div
        className={`${styles.container} custom-scroll`}
        ref={containerRef}
        onScroll={handleScroll}
      >
        <h2 className="text text_type_main-medium mb-6" ref={bunRef}>
          Булки
        </h2>
        <ul className={`${styles.list} mb-10 ml-4 mr-4`}>
          {buns.map((item) => (
            <IngredientCard key={item._id} item={item} />
          ))}
        </ul>
        <h2 className="text text_type_main-medium mb-6" ref={sauceRef}>
          Соусы
        </h2>
        <ul className={`${styles.list} mb-10 ml-4 mr-4`}>
          {sauces.map((item) => (
            <IngredientCard key={item._id} item={item} />
          ))}
        </ul>
        <h2 className="text text_type_main-medium mb-6" ref={mainRef}>
          Начинки
        </h2>
        <ul className={`${styles.list} mb-10 ml-4 mr-4`}>
          {mains.map((item) => (
            <IngredientCard key={item._id} item={item} />
          ))}
        </ul>
      </div>
    </section>
  );
};
