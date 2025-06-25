export class ApiError extends Error {
	public statusCode: number;
	public isOperational: boolean;
	public originalError?: any;
	public timestamp: Date;

	constructor(message: string, statusCode: number = 500, originalError?: any) {
		super(message);
		this.name = "ApiError";
		this.statusCode = statusCode;
		this.isOperational = true;
		this.originalError = originalError;
		this.timestamp = new Date();

		Error.captureStackTrace(this, this.constructor);
	}

	static fromResponse(error: any): ApiError {
		const status = error.response?.status || 500;
		const message =
			error.response?.data?.error ||
			error.response?.data?.message ||
			error.message ||
			"An unexpected error occurred";

		return new ApiError(message, status, error);
	}

	static getErrorMessage(statusCode: number): string {
		switch (statusCode) {
			case 400:
				return "Bad request - please check your input";
			case 401:
				return "Unauthorized - please login again";
			case 403:
				return "Forbidden - you don't have permission";
			case 404:
				return "Not found - the requested resource doesn't exist";
			case 408:
				return "Request timeout - please try again";
			case 429:
				return "Too many requests - please wait before trying again";
			case 500:
				return "Server error - please try again later";
			case 502:
				return "Bad gateway - server is temporarily unavailable";
			case 503:
				return "Service unavailable - please try again later";
			default:
				return "An unexpected error occurred";
		}
	}
}

// Export an empty object to make this a module
export {};
