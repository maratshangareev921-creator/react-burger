import {
  Counter,
  CurrencyIcon,
  Tab,
} from '@ya.praktikum/react-developer-burger-ui-components';
import { useMemo, useRef, useState } from 'react';
import { useDrag } from 'react-dnd';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';

import styles from './burger-ingredients.module.css';

const IngredientCard = ({ item }) => {
  const location = useLocation();
  const { bun, ingredients: constructorIngredients } = useSelector(
    (state) => state.burgerConstructor
  );
  const [{ isDragging }, dragRef] = useDrag({
    type: 'ingredient',
    item,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const count = useMemo(() => {
    if (item.type === 'bun') {
      return bun && bun._id === item._id ? 2 : 0;
    }

    return constructorIngredients.filter(
      (constructorItem) => constructorItem._id === item._id
    ).length;
  }, [bun, constructorIngredients, item]);

  return (
    <li
      ref={dragRef}
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

export const BurgerIngredients = () => {
  const { ingredients } = useSelector((state) => state.ingredients);
  const [current, setCurrent] = useState('bun');
  const containerRef = useRef(null);
  const bunRef = useRef(null);
  const sauceRef = useRef(null);
  const mainRef = useRef(null);

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

  const handleTabClick = (value) => {
    setCurrent(value);
    if (
      !containerRef.current ||
      !bunRef.current ||
      !sauceRef.current ||
      !mainRef.current
    ) {
      return;
    }

    const targetRef = { bun: bunRef, sauce: sauceRef, main: mainRef }[value];
    if (targetRef?.current) {
      const containerTop = containerRef.current.getBoundingClientRect().top;
      const targetTop = targetRef.current.getBoundingClientRect().top;
      const scrollTarget = containerRef.current.scrollTop + (targetTop - containerTop);

      containerRef.current.scrollTo({ top: scrollTarget, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (
      !containerRef.current ||
      !bunRef.current ||
      !sauceRef.current ||
      !mainRef.current
    ) {
      return;
    }

    const containerTop = containerRef.current.getBoundingClientRect().top;
    const bunDiff = Math.abs(bunRef.current.getBoundingClientRect().top - containerTop);
    const sauceDiff = Math.abs(
      sauceRef.current.getBoundingClientRect().top - containerTop
    );
    const mainDiff = Math.abs(
      mainRef.current.getBoundingClientRect().top - containerTop
    );

    if (bunDiff < sauceDiff && bunDiff < mainDiff) {
      setCurrent('bun');
    } else if (sauceDiff < bunDiff && sauceDiff < mainDiff) {
      setCurrent('sauce');
    } else {
      setCurrent('main');
    }
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
