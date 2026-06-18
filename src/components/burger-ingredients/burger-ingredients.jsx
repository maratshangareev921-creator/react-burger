import {
  Tab,
  CurrencyIcon,
  Counter,
} from '@ya.praktikum/react-developer-burger-ui-components';
import React, { useEffect, useRef } from 'react';
import { useDrag } from 'react-dnd';
import { Link, useLocation } from 'react-router-dom';

import styles from './burger-ingredients.module.css';

const SECTION_REFS = {
  bun: 'bunsRef',
  sauce: 'saucesRef',
  main: 'mainsRef',
};

const IngredientCard = ({ item, count, location, onDragIntentStart }) => {
  const [{ isDragging }, dragRef] = useDrag({
    type: 'ingredient',
    item,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <li
      ref={dragRef}
      draggable
      onMouseDown={() => onDragIntentStart(item)}
      onDragStart={(event) => {
        const payload = JSON.stringify({ kind: 'ingredient', ingredient: item });
        event.dataTransfer.setData('application/json', payload);
        event.dataTransfer.setData('text/plain', payload);
      }}
      className={`${styles.card} ${isDragging ? styles.card_dragging : ''}`}
    >
      <Link
        className={styles.card_link}
        to={`/ingredients/${item._id}`}
        state={{ background: location }}
        draggable={false}
      >
        {count > 0 && <Counter count={count} size="default" />}
        <img src={item.image} alt={item.name} className="ml-4 mr-4" draggable={false} />
        <div className={`${styles.price} mt-1 mb-1`}>
          <span className="text text_type_digits-default mr-2">{item.price}</span>
          <CurrencyIcon type="primary" />
        </div>
        <p className={`${styles.name} text text_type_main-default`}>{item.name}</p>
      </Link>
    </li>
  );
};

export const BurgerIngredients = ({ ingredients, counts = {}, onDragIntentStart }) => {
  const [current, setCurrent] = React.useState('bun');
  const location = useLocation();
  const containerRef = useRef(null);
  const bunsRef = useRef(null);
  const saucesRef = useRef(null);
  const mainsRef = useRef(null);
  const refs = { bunsRef, saucesRef, mainsRef };

  const buns = ingredients.filter((item) => item.type === 'bun');
  const sauces = ingredients.filter((item) => item.type === 'sauce');
  const mains = ingredients.filter((item) => item.type === 'main');

  const handleTabClick = (value) => {
    setCurrent(value);
    refs[SECTION_REFS[value]].current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const handleScroll = () => {
      const containerTop = container.getBoundingClientRect().top;
      const sections = [
        { value: 'bun', ref: bunsRef },
        { value: 'sauce', ref: saucesRef },
        { value: 'main', ref: mainsRef },
      ];

      const closest = sections.reduce(
        (nearest, section) => {
          const distance = Math.abs(
            section.ref.current.getBoundingClientRect().top - containerTop
          );

          return distance < nearest.distance
            ? { value: section.value, distance }
            : nearest;
        },
        { value: 'bun', distance: Infinity }
      );

      setCurrent(closest.value);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const renderCards = (items) =>
    items.map((item) => (
      <IngredientCard
        key={item._id}
        item={item}
        count={counts[item._id] || 0}
        location={location}
        onDragIntentStart={onDragIntentStart}
      />
    ));

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

      <div ref={containerRef} className={`${styles.container} custom-scroll`}>
        <h2 ref={bunsRef} className="text text_type_main-medium mb-6">
          Булки
        </h2>
        <ul className={`${styles.list} mb-10 ml-4 mr-4`}>{renderCards(buns)}</ul>

        <h2 ref={saucesRef} className="text text_type_main-medium mb-6">
          Соусы
        </h2>
        <ul className={`${styles.list} mb-10 ml-4 mr-4`}>{renderCards(sauces)}</ul>

        <h2 ref={mainsRef} className="text text_type_main-medium mb-6">
          Начинки
        </h2>
        <ul className={`${styles.list} mb-10 ml-4 mr-4`}>{renderCards(mains)}</ul>
      </div>
    </section>
  );
};
