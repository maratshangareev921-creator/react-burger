import { useSelector } from 'react-redux';

import styles from './ingredient-details.module.css';

export const IngredientDetails = ({ ingredient: ingredientProp }) => {
  const selectedIngredient = useSelector((state) => state.ingredientDetails.ingredient);
  const ingredient = ingredientProp || selectedIngredient;

  if (!ingredient) return null;

  return (
    <div className={styles.container}>
      <img
        src={ingredient.image_large}
        alt={ingredient.name}
        className={`${styles.image} mb-4`}
      />
      <h3 className="text text_type_main-medium mb-8">{ingredient.name}</h3>
      <ul className={`${styles.nutrition_list} mb-15`}>
        <li className={styles.nutrition_item}>
          <span className="text text_type_main-default text_color_inactive">
            Калории, ккал
          </span>
          <span className="text text_type_digits-default text_color_inactive">
            {ingredient.calories}
          </span>
        </li>
        <li className={styles.nutrition_item}>
          <span className="text text_type_main-default text_color_inactive">
            Белки, г
          </span>
          <span className="text text_type_digits-default text_color_inactive">
            {ingredient.proteins}
          </span>
        </li>
        <li className={styles.nutrition_item}>
          <span className="text text_type_main-default text_color_inactive">
            Жиры, г
          </span>
          <span className="text text_type_digits-default text_color_inactive">
            {ingredient.fat}
          </span>
        </li>
        <li className={styles.nutrition_item}>
          <span className="text text_type_main-default text_color_inactive">
            Углеводы, г
          </span>
          <span className="text text_type_digits-default text_color_inactive">
            {ingredient.carbohydrates}
          </span>
        </li>
      </ul>
    </div>
  );
};
