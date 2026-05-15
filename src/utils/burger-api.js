const BASE_URL = 'nomoreparties.space';

const checkResponse = (res) => {
  if (res.ok) {
    return res.json();
  }
  return res.json().then((err) => Promise.reject(err));
};

const request = (endpoint, options) => {
  return fetch(`${BASE_URL}${endpoint}`, options).then(checkResponse);
};

export const getIngredients = () => {
  return request('/ingredients');
};
