export const API_BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'https://shieldpro-backend.onrender.com';
const API_URL = `${API_BASE_URL}/api`;

const handleResponse = async (response) => {
    let data;
    try {
        data = await response.json();
    } catch {
        data = { message: 'Network or parsing error' };
    }
    
    if (!response.ok) {
        // Throw structured error object
        const error = new Error(data.message || 'Something went wrong');
        error.errors = data.errors;
        error.status = response.status;
        error.response = { data };
        throw error;
    }
    return data;
};

// Helper for fetch config
const getOptions = (method, headers = {}, body = null, isFormData = false) => {
    const options = {
        method,
        headers: { ...headers },
        credentials: 'include' // This is essential for HttpOnly cookies
    };

    if (!isFormData) {
        options.headers['Content-Type'] = 'application/json';
    }

    // Don't stringify FormData
    if (body) {
        options.body = isFormData ? body : JSON.stringify(body);
    }

    return options;
};

const getHeaders = (token, isFormData = false) => {
    const headers = {};
    const authToken = token || localStorage.getItem('token');
    
    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    if (!isFormData) {
        headers['Content-Type'] = 'application/json';
    }
    
    return headers;
};

export const api = {
    get: async (endpoint, token) => {
        const response = await fetch(`${API_URL}${endpoint}`, getOptions('GET', getHeaders(token)));
        return handleResponse(response);
    },

    post: async (endpoint, body, token) => {
        const response = await fetch(`${API_URL}${endpoint}`, getOptions('POST', getHeaders(token), body));
        return handleResponse(response);
    },

    postForm: async (endpoint, formData, token) => {
        // Content-Type is set automatically by the browser for FormData, so we pass true
        const response = await fetch(`${API_URL}${endpoint}`, getOptions('POST', getHeaders(token, true), formData, true));
        return handleResponse(response);
    },

    put: async (endpoint, body, token) => {
        const response = await fetch(`${API_URL}${endpoint}`, getOptions('PUT', getHeaders(token), body));
        return handleResponse(response);
    },

    delete: async (endpoint, token) => {
        const response = await fetch(`${API_URL}${endpoint}`, getOptions('DELETE', getHeaders(token)));
        return handleResponse(response);
    }
};
