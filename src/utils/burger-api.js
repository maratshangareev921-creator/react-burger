import { BASE_URL } from './constants';

const checkResponse = (res) => {
  if (res.ok) {
    return res.json();
  }

  return res
    .json()
    .catch(() => ({}))
    .then((data) => Promise.reject(new Error(data.message || `Ошибка: ${res.status}`)));
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

const jsonHeaders = {
  'Content-Type': 'application/json',
};

const saveTokens = (data) => {
  if (data.accessToken) {
    localStorage.setItem('accessToken', data.accessToken);
  }
  if (data.refreshToken) {
    localStorage.setItem('refreshToken', data.refreshToken);
  }
};

const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

const request = (endpoint, options = {}) => {
  return fetch(`/api${endpoint}`, options).then(checkResponse);
};

export const refreshAccessToken = () => {
  return request('/auth/token', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({ token: localStorage.getItem('refreshToken') }),
  }).then((data) => {
    saveTokens(data);
    return data;
  });
};

export const requestWithRefresh = async (endpoint, options = {}) => {
  const headers = {
    ...options.headers,
    authorization: localStorage.getItem('accessToken'),
  };

  try {
    return await request(endpoint, { ...options, headers });
  } catch (err) {
    if (!String(err.message).toLowerCase().includes('jwt')) {
      throw err;
    }

    const refreshed = await refreshAccessToken();
    return request(endpoint, {
      ...options,
      headers: {
        ...options.headers,
        authorization: refreshed.accessToken,
      },
    });
  }
};

export const registerUser = (form) => {
  return request('/auth/register', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(form),
  }).then((data) => {
    saveTokens(data);
    return data;
  });
};

export const loginUser = (form) => {
  return request('/auth/login', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(form),
  }).then((data) => {
    saveTokens(data);
    return data;
  });
};

export const logoutUser = () => {
  return request('/auth/logout', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({ token: localStorage.getItem('refreshToken') }),
  }).finally(clearTokens);
};

export const forgotPassword = (email) => {
  return request('/password-reset', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({ email }),
  });
};

export const resetPassword = (form) => {
  return request('/password-reset/reset', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(form),
  });
};

export const getUser = () => requestWithRefresh('/auth/user');

export const updateUser = (form) => {
  return requestWithRefresh('/auth/user', {
    method: 'PATCH',
    headers: jsonHeaders,
    body: JSON.stringify(form),
  });
};
