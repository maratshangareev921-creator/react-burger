import { BASE_URL } from './constants';

const checkResponse = (res) => {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Ошибка: ${res.status}`);
};

export const getIngredients = () => {
  return fetch(BASE_URL + '/ingredients').then(checkResponse);
};

export const createOrderApi = (ingredientIds) => {
  return fetch(BASE_URL + '/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ingredients: ingredientIds }),
  }).then(checkResponse);
};
