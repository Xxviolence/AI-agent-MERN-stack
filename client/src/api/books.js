import api from './axios';

export const getBooks = (params) => api.get('/books', { params });
export const getBook = (id) => api.get(`/books/${id}`);

export const createBook = (formData) =>
  api.post('/books', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const updateBook = (id, data) => api.put(`/books/${id}`, data);
export const deleteBook = (id) => api.delete(`/books/${id}`);
export const downloadBook = (id) =>
  api.get(`/books/${id}/download`, { responseType: 'blob' });
