const checkResponse = (res) => {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Ошибка: ${res.status}`);
};

export const getIngredients = () => {
  return fetch('/api/ingredients').then(checkResponse);
};
