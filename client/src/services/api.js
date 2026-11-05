// Backend API base URL
const API_BASE_URL = "http://localhost:5000/api";

// Common API request function
const apiRequest = async (endpoint, options = {}) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
    }

    return data;
};

// Register a new user
export const registerUser = (userData) => {
    return apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify(userData)
    });
};

// Login an existing user
export const loginUser = (credentials) => {
    return apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials)
    });
};

// Get currently logged-in user
export const getCurrentUser = (token) => {
    return apiRequest("/auth/me", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};