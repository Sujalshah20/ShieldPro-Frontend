const getBaseUrl = () => {
    // Priority 1: Environment variable
    const envUrl = import.meta.env.VITE_API_URL;
    
    // Priority 2: Hardcoded Production URL for live environment
    const PROD_API_URL = 'https://shieldpro-backend.onrender.com';

    // Localhost detection
    const isLocalhost = window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1';

    if (isLocalhost) {
        // If we have an envUrl and it looks like a local one, use it
        if (envUrl && envUrl.includes('localhost')) {
            return envUrl.replace('/api', '');
        }
        // Fallback for local development
        return 'http://localhost:10000';
    }

    // In production, prioritize the Render URL even if VITE_API_URL is missing
    return (envUrl && !envUrl.includes('localhost')) ? envUrl.replace('/api', '') : PROD_API_URL;
};

export const API_BASE_URL = getBaseUrl();
const API_URL = `${API_BASE_URL}/api`;

// REMOVED: Debug log - console.log(`🛡️ ShieldPro API initialized at: ${API_URL}`);

const handleResponse = async (response) => {
    let data;
    try {
        data = await response.json();
    } catch {
        data = { message: 'Network or parsing error' };
    }
    
    if (!response.ok) {
        // GLOBAL 401/403 HANDLER: Force logout on session expiration or invalidity
        const isAuthError = response.status === 401 || (response.status === 403 && (
            data.message?.toLowerCase().includes('token') || 
            data.message?.toLowerCase().includes('suspended') ||
            data.message?.toLowerCase().includes('verification required')
        ));
        
        if (isAuthError && !window.location.pathname.includes('/login')) {
            console.warn('🚨 Session invalid/expired. Forcing logout...');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Hard redirect to clear all memory state
            window.location.href = '/login?expired=true';
        }

        console.error(`❌ API Error [${response.status}]: ${response.url}`, data);
        
        // Structured Error Object
        const error = new Error(data.message || 'An unexpected error occurred');
        error.status = response.status;
        error.data = data;
        error.url = response.url;
        throw error;
    }
    return data;
};

const getOptions = (method, headers = {}, body = null, isFormData = false) => {
    const options = {
        method,
        headers: { ...headers },
        credentials: 'include' // Essential for cookie-based auth fallback
    };

    if (!isFormData) {
        options.headers['Content-Type'] = 'application/json';
    }

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
        const response = await fetch(`${API_URL}${endpoint}`, getOptions('POST', getHeaders(token, true), formData, true));
        return handleResponse(response);
    },

    put: async (endpoint, body, token) => {
        const response = await fetch(`${API_URL}${endpoint}`, getOptions('PUT', getHeaders(token), body));
        return handleResponse(response);
    },

    patch: async (endpoint, body, token) => {
        const response = await fetch(`${API_URL}${endpoint}`, getOptions('PATCH', getHeaders(token), body));
        return handleResponse(response);
    },

    delete: async (endpoint, token) => {
        const response = await fetch(`${API_URL}${endpoint}`, getOptions('DELETE', getHeaders(token)));
        return handleResponse(response);
    }
};
