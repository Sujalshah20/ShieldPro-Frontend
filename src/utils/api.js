const getBaseUrl = () => {
    // If VITE_API_URL is set in environment, use it
    const envUrl = import.meta.env.VITE_API_URL;
    
    // Check if we are running on a local development environment
    const isLocalhost = window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1';

    // If we're on localhost but the env variable points to production (Render), 
    // it's likely a misconfigured .env for local testing. Use local backend.
    if (isLocalhost) {
        if (envUrl && envUrl.includes('localhost')) {
            return envUrl.replace('/api', '');
        }
        // Backend default PORT is 10000 based on backend/.env, fallback to 5000 if needed
        return 'http://localhost:10000';
    }

    // In production but envUrl is localhost? Use fallback
    if (!isLocalhost && (envUrl?.includes('localhost') || !envUrl)) {
        return 'https://shieldpro-backend.onrender.com';
    }

    return envUrl?.replace('/api', '') || 'https://shieldpro-backend.onrender.com';
};

export const API_BASE_URL = getBaseUrl();
const API_URL = `${API_BASE_URL}/api`;

console.log(`🛡️ ShieldPro API initialized at: ${API_URL}`);
console.log(`📡 Current Host: ${window.location.host} (Mode: ${import.meta.env.MODE})`);

const handleResponse = async (response) => {
    let data;
    try {
        data = await response.json();
    } catch {
        data = { message: 'Network or parsing error' };
    }
    
    if (!response.ok) {
        console.error(`❌ API Error [${response.status}]: ${response.url}`, data);
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
        try {
            const response = await fetch(`${API_URL}${endpoint}`, getOptions('GET', getHeaders(token)));
            return handleResponse(response);
        } catch (error) {
            console.error(`🚨 Fatal Network Error on GET ${endpoint}:`, error);
            throw error;
        }
    },

    post: async (endpoint, body, token) => {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, getOptions('POST', getHeaders(token), body));
            return handleResponse(response);
        } catch (error) {
            console.error(`🚨 Fatal Network Error on POST ${endpoint}:`, error);
            throw error;
        }
    },

    postForm: async (endpoint, formData, token) => {
        try {
            // Content-Type is set automatically by the browser for FormData, so we pass true
            const response = await fetch(`${API_URL}${endpoint}`, getOptions('POST', getHeaders(token, true), formData, true));
            return handleResponse(response);
        } catch (error) {
            console.error(`🚨 Fatal Network Error on POST Form ${endpoint}:`, error);
            throw error;
        }
    },

    put: async (endpoint, body, token) => {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, getOptions('PUT', getHeaders(token), body));
            return handleResponse(response);
        } catch (error) {
            console.error(`🚨 Fatal Network Error on PUT ${endpoint}:`, error);
            throw error;
        }
    },

    patch: async (endpoint, body, token) => {
        const fullUrl = `${API_URL}${endpoint}`;
        console.log(`📡 Sending PATCH request to: ${fullUrl}`, { body });
        try {
            const response = await fetch(fullUrl, getOptions('PATCH', getHeaders(token), body));
            console.log(`✅ Response Status: ${response.status} for PATCH ${endpoint}`);
            return handleResponse(response);
        } catch (error) {
            console.error(`🚨 Fatal Network Error on PATCH ${endpoint}:`, error);
            if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
                throw new Error('Network Error: Could not connect to the backend server. Please verify the backend is running at ' + API_BASE_URL);
            }
            throw error;
        }
    },

    delete: async (endpoint, token) => {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, getOptions('DELETE', getHeaders(token)));
            return handleResponse(response);
        } catch (error) {
            console.error(`🚨 Fatal Network Error on DELETE ${endpoint}:`, error);
            if (error.message === 'Failed to fetch') {
                throw new Error('Network Error: Could not connect to the backend server.');
            }
            throw error;
        }
    }
};
