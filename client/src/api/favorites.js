import api from './axios';

export const getFavorites = () => api.get('/favorites');
export const addFavorite = (bookId) => api.post('/favorites', { book: bookId });
export const removeFavorite = (bookId) => api.delete(`/favorites/${bookId}`);
export const checkFavorite = (bookId) =>
  api.get(`/favorites/check/${bookId}`);
