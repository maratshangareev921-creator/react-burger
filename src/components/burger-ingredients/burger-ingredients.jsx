import {
  Tab,
  CurrencyIcon,
  Counter,
} from '@ya.praktikum/react-developer-burger-ui-components';
import React from 'react';

import { IngredientDetails } from '../ingredient-details/ingredient-details';
import { Modal } from '../modal/modal';

import styles from './burger-ingredients.module.css';

export const BurgerIngredients = ({ ingredients }) => {
  const [current, setCurrent] = React.useState('bun');
  const [selectedIngredient, setSelectedIngredient] = React.useState(null);

  const buns = ingredients.filter((item) => item.type === 'bun');
  const sauces = ingredients.filter((item) => item.type === 'sauce');
  const mains = ingredients.filter((item) => item.type === 'main');

  const handleOpenModal = (ingredient) => {
    setSelectedIngredient(ingredient);
  };

  const handleCloseModal = () => {
    setSelectedIngredient(null);
  };

  const IngredientCard = ({ item }) => {
    return (
      <li className={styles.card} onClick={() => handleOpenModal(item)}>
        <Counter count={1} size="default" />
        <img src={item.image} alt={item.name} className="ml-4 mr-4" />
        <div className={`${styles.price} mt-1 mb-1`}>
          <span className="text text_type_digits-default mr-2">{item.price}</span>
          <CurrencyIcon type="primary" />
        </div>
        <p className={`${styles.name} text text_type_main-default`}>{item.name}</p>
      </li>
    );
  };

  return (
    <section className={styles.burger_ingredients}>
      <div className={`${styles.tabs} mb-10`}>
        <Tab value="bun" active={current === 'bun'} onClick={setCurrent}>
          Булки
        </Tab>
        <Tab value="sauce" active={current === 'sauce'} onClick={setCurrent}>
          Соусы
        </Tab>
        <Tab value="main" active={current === 'main'} onClick={setCurrent}>
          Начинки
        </Tab>
      </div>

      <div className={`${styles.container} custom-scroll`}>
        <h2 className="text text_type_main-medium mb-6">Булки</h2>
        <ul className={`${styles.list} mb-10 ml-4 mr-4`}>
          {buns.map((item) => (
            <IngredientCard key={item._id} item={item} />
          ))}
        </ul>

        <h2 className="text text_type_main-medium mb-6">Соусы</h2>
        <ul className={`${styles.list} mb-10 ml-4 mr-4`}>
          {sauces.map((item) => (
            <IngredientCard key={item._id} item={item} />
          ))}
        </ul>

        <h2 className="text text_type_main-medium mb-6">Начинки</h2>
        <ul className={`${styles.list} mb-10 ml-4 mr-4`}>
          {mains.map((item) => (
            <IngredientCard key={item._id} item={item} />
          ))}
        </ul>
      </div>

      {selectedIngredient && (
        <Modal title="Детали ингредиента" onClose={handleCloseModal}>
          <IngredientDetails ingredient={selectedIngredient} />
        </Modal>
      )}
    </section>
  );
};
