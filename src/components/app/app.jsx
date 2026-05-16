import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchIngredients } from '../../services/slices/ingredientsSlice.js';
import { AppHeader } from '../app-header/app-header.jsx';
import { BurgerConstructor } from '../burger-constructor/burger-constructor.jsx';
import { BurgerIngredients } from '../burger-ingredients/burger-ingredients.jsx';
import styles from './app.module.css';

export const App = () => {
  const dispatch = useDispatch();
  const { ingredients, isLoading, hasError } = useSelector((state) => state.ingredients);

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
        Соберите бургер
      </h1>
      {isLoading && (
        <p className="text text_type_main-medium pl-5 mt-20">
          Загрузка космических ингредиентов...
        </p>
      )}
      {hasError && (
        <p className="text text_type_main-medium pl-5">
          Произошла ошибка связи с сервером.
        </p>
      )}
      {!isLoading && !hasError && ingredients && ingredients.length > 0 && (
        <main className={`${styles.main} pl-5 pr-5`}>
          <BurgerIngredients ingredients={ingredients} />
          <BurgerConstructor ingredients={ingredients} />
        </main>
      )}
    </div>
  );
};
