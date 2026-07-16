import { useMemo, type ReactElement } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { IngredientDetails } from '../components/ingredient-details/ingredient-details';
import { Modal } from '../components/modal/modal';
import { useAppSelector } from '../services/hooks';

export const IngredientModal = (): ReactElement => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const ingredients = useAppSelector((state) => state.ingredients.ingredients);
  const ingredient = useMemo(
    () => ingredients.find((item) => item._id === id),
    [ingredients, id]
  );

  return (
    <Modal title="Детали ингредиента" onClose={() => navigate(-1)}>
      {ingredient ? (
        <IngredientDetails ingredient={ingredient} />
      ) : (
        <p className="text text_type_main-medium p-10">Загрузка ингредиента...</p>
      )}
    </Modal>
  );
};
