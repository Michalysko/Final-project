const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

export const apiRequest = (endpoint, options = {}) => {
    const url = endpoint.startsWith('http')
        ? endpoint
        : `${API_BASE_URL}${endpoint}`;

    return fetch(url, options).then((response) => {
        if (!response.ok) {
            return response.json().then((errorData) => {
                const error = new Error('API request failed');
                error.status = response.status;
                error.data = errorData;
                throw error;
            });
        }

        if (response.status === 204) {
            return null;
        }

        return response.json();
    });
};

export const getAuthHeaders = (authToken) => ({
    Authorization: `Token ${authToken}`,
});

export const getJsonHeaders = (authToken) => ({
    'Content-Type': 'application/json',
    ...getAuthHeaders(authToken),
});