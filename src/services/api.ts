import axios from 'axios';
import type { AxiosInstance, AxiosError } from 'axios';

// Base API instance
const API: AxiosInstance = axios.create({
    // Make sure this matches your Spring Boot server port
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * REQUEST INTERCEPTOR
 * Automatically attaches the JWT token from localStorage to every outgoing request.
 */
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

/**
 * RESPONSE INTERCEPTOR
 * If the backend returns 401 (Unauthorized), it means the token is expired or invalid.
 * We clear the token and kick the user back to the login page.
 */
API.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('authToken');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// ========== Auth Endpoints ==========

export const registerUser = async (userData: any) => {
    // Note: Ensure these keys (username, email, password) match your Java User Entity
    const payload = {
        username: userData.fullName || userData.username, 
        email: userData.email,
        password: userData.password
    };
    return API.post('/auth/register', payload);
};

export const loginUser = async (userData: any) => {
    // Sends email and password to /api/auth/login
    const response = await API.post('/auth/login', userData);
    
    // If the backend returns a JSON object { "token": "..." }
    if (response.data && response.data.token) {
        localStorage.setItem('authToken', response.data.token);
    }
    return response;
};

export const logoutUser = () => {
    localStorage.removeItem('authToken');
    // Optional: notify backend if you have a blacklist logic
    // return API.post('/auth/logout'); 
};

// ========== Portfolio Endpoints (Authenticated) ==========

/**
 * These calls will now automatically include the "Authorization: Bearer <token>"
 * header thanks to the Request Interceptor above.
 */
export const getPortfolios = () => API.get('/portfolios');

export const createPortfolio = (portfolioData: any) => API.post('/portfolios', portfolioData);

export const getPortfolioById = (id: string) => API.get(`/portfolios/${id}`);

export const updatePortfolio = (id: string, portfolioData: any) => API.put(`/portfolios/${id}`, portfolioData);

export const deletePortfolio = (id: string) => API.delete(`/portfolios/${id}`);

// Export the instance for any custom calls
export default API;