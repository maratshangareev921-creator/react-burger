import { useAppSelector } from '../../services/hooks';

import type { ReactElement } from 'react';

import type { Ingredient } from '../../types';

import styles from './ingredient-details.module.css';

type IngredientDetailsProps = { ingredient?: Ingredient };

export const IngredientDetails = ({
  ingredient: ingredientProp,
}: IngredientDetailsProps): ReactElement | null => {
  const selectedIngredient = useAppSelector(
    (state) => state.ingredientDetails.ingredient
  );
  const ingredient = ingredientProp ?? selectedIngredient;
  if (!ingredient) return null;

  const nutrition = [
    ['Калории, ккал', ingredient.calories],
    ['Белки, г', ingredient.proteins],
    ['Жиры, г', ingredient.fat],
    ['Углеводы, г', ingredient.carbohydrates],
  ] as const;

  return (
    <div className={styles.container}>
      <img
        src={ingredient.image_large}
        alt={ingredient.name}
        className={`${styles.image} mb-4`}
      />
      <h3 className="text text_type_main-medium mb-8">{ingredient.name}</h3>
      <ul className={`${styles.nutrition_list} mb-15`}>
        {nutrition.map(([label, value]) => (
          <li className={styles.nutrition_item} key={label}>
            <span className="text text_type_main-default text_color_inactive">
              {label}
            </span>
            <span className="text text_type_digits-default text_color_inactive">
              {value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
