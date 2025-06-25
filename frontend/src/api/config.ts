import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { ApiError } from "./errors";

// API base URL - uses proxy in development, full URL in production
const API_BASE_URL =
	process.env.NODE_ENV === "production"
		? process.env.REACT_APP_API_URL || "http://localhost:5000"
		: "";

// Request retry configuration
const RETRY_CONFIG = {
	maxRetries: 3,
	retryDelay: 1000, // Start with 1 second
	retryDelayMultiplier: 2, // Double delay each retry
};

// Create axios instance with enhanced config
export const api = axios.create({
	baseURL: API_BASE_URL,
	timeout: 15000, // 15 second timeout
	headers: {
		"Content-Type": "application/json",
	},
});

// Request ID for logging
let requestId = 0;

// Request interceptor with logging and auth
api.interceptors.request.use(
	(config: any) => {
		// Add request ID for tracking
		config.metadata = { requestId: ++requestId, startTime: Date.now() };

		// Add auth token if available
		const token = localStorage.getItem("token");
		if (token) {
			config.headers = config.headers || {};
			config.headers.Authorization = `Bearer ${token}`;
		}

		// Log request in development
		if (process.env.NODE_ENV === "development") {
			console.log(`🚀 API Request [${config.metadata.requestId}]:`, {
				method: config.method?.toUpperCase(),
				url: config.url,
				data: config.data,
				params: config.params,
			});
		}

		return config;
	},
	(error) => {
		console.error("❌ Request Error:", error);
		return Promise.reject(new ApiError("Request failed", 0, error));
	}
);

// Response interceptor with enhanced error handling
api.interceptors.response.use(
	(response: AxiosResponse) => {
		// Log response in development
		if (process.env.NODE_ENV === "development") {
			const startTime = (response.config as any).metadata?.startTime;
			const duration = startTime ? Date.now() - startTime : 0;
			const requestId = (response.config as any).metadata?.requestId;

			console.log(`✅ API Response [${requestId || "unknown"}]:`, {
				status: response.status,
				duration: `${duration}ms`,
				data: response.data,
			});
		}

		return response;
	},
	async (error) => {
		const originalRequest = error.config;

		// Log error in development
		if (process.env.NODE_ENV === "development") {
			const startTime = originalRequest?.metadata?.startTime;
			const duration = startTime ? Date.now() - startTime : 0;
			const requestId = originalRequest?.metadata?.requestId;

			console.error(`❌ API Error [${requestId || "unknown"}]:`, {
				status: error.response?.status,
				duration: `${duration}ms`,
				message: error.message,
				response: error.response?.data,
			});
		}

		// Handle 401 errors (unauthorized)
		if (error.response?.status === 401) {
			localStorage.removeItem("token");
			// Don't redirect if already on login page
			if (window.location.pathname !== "/login") {
				window.location.href = "/login";
			}
		}

		// Retry logic for network errors and specific status codes
		if (shouldRetry(error) && !originalRequest?._isRetry) {
			return retryRequest(originalRequest);
		}

		// Convert to ApiError
		throw ApiError.fromResponse(error);
	}
);

// Retry logic
function shouldRetry(error: any): boolean {
	// Don't retry client errors (4xx except 408, 429)
	if (error.response?.status >= 400 && error.response?.status < 500) {
		return error.response.status === 408 || error.response.status === 429;
	}

	// Retry network errors and server errors
	return (
		!error.response || // Network error
		error.code === "ECONNABORTED" || // Timeout
		error.response.status >= 500 // Server error
	);
}

async function retryRequest(originalRequest: AxiosRequestConfig): Promise<any> {
	if (originalRequest) {
		(originalRequest as any)._isRetry = true;
	}
	let retryCount = 0;

	while (retryCount < RETRY_CONFIG.maxRetries) {
		try {
			await delay(
				RETRY_CONFIG.retryDelay *
					Math.pow(RETRY_CONFIG.retryDelayMultiplier, retryCount)
			);

			if (process.env.NODE_ENV === "development") {
				const requestId = (originalRequest as any)?.metadata?.requestId;
				console.log(
					`🔄 Retrying request [${requestId || "unknown"}] - Attempt ${
						retryCount + 1
					}`
				);
			}

			return await api(originalRequest!);
		} catch (error) {
			retryCount++;
			if (retryCount >= RETRY_CONFIG.maxRetries) {
				throw error;
			}
		}
	}
}

function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

// API health check
export const checkApiHealth = async (): Promise<boolean> => {
	try {
		const response = await api.get("/api/health");
		return response.data.success === true;
	} catch (error) {
		return false;
	}
};

// API endpoints
export const API_ENDPOINTS = {
	assignments: "/api/assignments",
	notes: "/api/notes",
	health: "/api/health",
	stats: "/api/stats",
};

export default api;