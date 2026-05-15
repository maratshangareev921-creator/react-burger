import { BASE_URL } from './constants.js';

const checkResponse = (res) => {
  if (res.ok) {
    return res.json();
  }
  return res.json().then((err) => Promise.reject(err));
};

export const getIngredients = () => {
  return fetch(`${BASE_URL}/ingredients`).then(checkResponse);
};
