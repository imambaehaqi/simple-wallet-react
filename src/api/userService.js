import api from './api';

export const getProfile = async () => {
    const response = await api.get('/users/profile');
    return response; // <-- KEMBALIKAN 'response' UTUH
};

export const updateProfile = async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    return response; // <-- KEMBALIKAN 'response' UTUH
};

export const changePassword = async (passwordData) => {
    const response = await api.post('/users/change-password', passwordData);
    return response; // <-- KEMBALIKAN 'response' UTUH
};

export const deleteAccount = async (passwordData) => {
    const response = await api.delete('/users/account', { data: passwordData });
    return response; // <-- KEMBALIKAN 'response' UTUH
};

export const topUp = async (amount) => {
    // Backend mengharapkan body: { "amount": 100000 }
    const response = await api.post('/users/top-up', { amount });
    return response; // Kembalikan objek response utuh
};