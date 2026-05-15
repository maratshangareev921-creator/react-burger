import { useState, useEffect } from 'react';

import { getIngredients } from '../../utils/ingredients.js';
import { AppHeader } from '../app-header/app-header.jsx';
import { BurgerConstructor } from '../burger-constructor/burger-constructor.jsx';
import { BurgerIngredients } from '../burger-ingredients/burger-ingredients.jsx';

import styles from './app.module.css';

export const App = () => {
  const [ingredients, setIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    getIngredients()
      .then((res) => {
        setIngredients(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Ошибка получения данных:', err);
        setHasError(true);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className={styles.app}>
      <AppHeader />

      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
        Соберите бургер
      </h1>

      {isLoading && (
        <p className="text text_type_main-medium pl-5">Загрузка ингредиентов...</p>
      )}
      {hasError && (
        <p className="text text_type_main-medium pl-5">
          Произошла ошибка связи с сервером.
        </p>
      )}

      {!isLoading && !hasError && (
        <main className={`${styles.main} pl-5 pr-5`}>
          <BurgerIngredients ingredients={ingredients} />
          <BurgerConstructor ingredients={ingredients} />
        </main>
      )}
    </div>
  );
};
