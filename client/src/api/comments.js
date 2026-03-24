import api from './axios';

export const getComments = (bookId) =>
  api.get('/comments', { params: { book: bookId } });
export const createComment = (data) => api.post('/comments', data);
export const deleteComment = (id) => api.delete(`/comments/${id}`);
