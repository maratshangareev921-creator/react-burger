import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useParams } from 'react-router-dom';

import { IngredientDetails } from '../components/ingredient-details/ingredient-details.jsx';

import styles from './pages.module.css';

export const IngredientPage = () => {
  const { id } = useParams();
  const { ingredients } = useSelector((state) => state.ingredients);
  const ingredient = useMemo(
    () => ingredients.find((item) => item._id === id),
    [ingredients, id]
  );

  if (!ingredient && ingredients.length > 0) {
    return <Navigate to="*" replace />;
  }

  return (
    <main className={styles.centerPage}>
      <h1 className="text text_type_main-large mb-8">Детали ингредиента</h1>
      {ingredient ? (
        <IngredientDetails ingredient={ingredient} />
      ) : (
        <p className="text text_type_main-medium">Загрузка ингредиента...</p>
      )}
    </main>
  );
};
