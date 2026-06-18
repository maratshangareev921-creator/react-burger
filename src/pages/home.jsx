import { useEffect, useMemo, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { BurgerConstructor } from '../components/burger-constructor/burger-constructor.jsx';
import { BurgerIngredients } from '../components/burger-ingredients/burger-ingredients.jsx';

import styles from '../components/app/app.module.css';

export const Home = ({ ingredients, isLoading, hasError }) => {
  const [bun, setBun] = useState(null);
  const [constructorIngredients, setConstructorIngredients] = useState([]);
  const [draggedIngredient, setDraggedIngredient] = useState(null);

  useEffect(() => {
    const clearDraggedIngredient = () => setDraggedIngredient(null);
    window.addEventListener('mouseup', clearDraggedIngredient);
    return () => window.removeEventListener('mouseup', clearDraggedIngredient);
  }, []);

  const ingredientCounts = useMemo(() => {
    const counts = {};

    if (bun) {
      counts[bun._id] = 2;
    }

    constructorIngredients.forEach((ingredient) => {
      counts[ingredient._id] = (counts[ingredient._id] || 0) + 1;
    });

    return counts;
  }, [bun, constructorIngredients]);

  const handleAddIngredient = (ingredient) => {
    const ingredientWithKey = {
      ...ingredient,
      constructorId: `${ingredient._id}-${Date.now()}-${Math.random()}`,
    };

    if (ingredient.type === 'bun') {
      setBun(ingredientWithKey);
      return;
    }

    setConstructorIngredients((items) => [...items, ingredientWithKey]);
  };

  const handleRemoveIngredient = (constructorId) => {
    setConstructorIngredients((items) =>
      items.filter((item) => item.constructorId !== constructorId)
    );
  };

  const handleMoveIngredient = (dragIndex, hoverIndex) => {
    setConstructorIngredients((items) => {
      const nextItems = [...items];
      const [draggedItem] = nextItems.splice(dragIndex, 1);
      nextItems.splice(hoverIndex, 0, draggedItem);
      return nextItems;
    });
  };

  return (
    <>
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
        <DndProvider backend={HTML5Backend}>
          <main className={`${styles.main} pl-5 pr-5`}>
            <BurgerIngredients
              ingredients={ingredients}
              counts={ingredientCounts}
              onDragIntentStart={setDraggedIngredient}
            />
            <BurgerConstructor
              bun={bun}
              ingredients={constructorIngredients}
              draggedIngredient={draggedIngredient}
              onAddIngredient={handleAddIngredient}
              onClearDraggedIngredient={() => setDraggedIngredient(null)}
              onRemoveIngredient={handleRemoveIngredient}
              onMoveIngredient={handleMoveIngredient}
            />
          </main>
        </DndProvider>
      )}
    </>
  );
};
