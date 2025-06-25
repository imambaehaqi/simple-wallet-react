import api from './api';

export const getTransactions = async (params) => {
    const response = await api.get('/transactions', { params });
    return response; // <-- KEMBALIKAN 'response' UTUH
};

export const createTransaction = async (transactionData) => {
    const response = await api.post('/transactions', transactionData);
    return response; // <-- KEMBALIKAN 'response' UTUH
};

export const updateTransaction = async (id, transactionData) => {
    const response = await api.put(`/transactions/${id}`, transactionData);
    return response; // <-- KEMBALIKAN 'response' UTUH
};

export const deleteTransaction = async (id) => {
    const response = await api.delete(`/transactions/${id}`);
    return response; // <-- KEMBALIKAN 'response' UTUH
};

export const getSummary = async (params) => {
    const response = await api.get('/transactions/summary', { params });
    return response; // <-- KEMBALIKAN 'response' UTUH
};