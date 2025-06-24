import axios from "axios";

// API base URL - uses proxy in development, full URL in production
const API_BASE_URL =
	process.env.NODE_ENV === "production"
		? process.env.REACT_APP_API_URL || "http://localhost:5000"
		: "";

// Create axios instance with default config
export const api = axios.create({
	baseURL: API_BASE_URL,
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
	},
});

// API endpoints
export const API_ENDPOINTS = {
	assignments: "/api/assignments",
	notes: "/api/notes",
	health: "/api/health",
};

// Request interceptor for adding auth headers (future use)
api.interceptors.request.use(
	(config) => {
		// Add auth token if available
		const token = localStorage.getItem("token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Response interceptor for error handling
api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			// Handle unauthorized access
			localStorage.removeItem("token");
			window.location.href = "/login";
		}
		return Promise.reject(error);
	}
);

export default api;
