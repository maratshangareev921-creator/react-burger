import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { IngredientDetails } from '../components/ingredient-details/ingredient-details.jsx';
import { Modal } from '../components/modal/modal.jsx';

export const IngredientModal = ({ ingredients }) => {
  const { id } = useParams();
  const navigate = useNavigate();
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
