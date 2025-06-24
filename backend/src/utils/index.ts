import { ApiResponse, ApiError } from "../types";

/**
 * Create a standardized API response
 */
export const createResponse = <T>(
	success: boolean,
	data?: T,
	message?: string,
	error?: string
): ApiResponse<T> => ({
	success,
	data,
	message,
	error,
});

/**
 * Create a success response
 */
export const successResponse = <T>(
	data?: T,
	message?: string
): ApiResponse<T> => createResponse(true, data, message);

/**
 * Create an error response
 */
export const errorResponse = (error: string, message?: string): ApiResponse =>
	createResponse(false, undefined, message, error);

/**
 * Generate a UUID (simple version for demo - use proper uuid package in production)
 */
export const generateId = (): string => {
	return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
};

/**
 * Validate date string
 */
export const isValidDate = (dateString: string): boolean => {
	const date = new Date(dateString);
	return !isNaN(date.getTime());
};

/**
 * Check if date is in the future
 */
export const isFutureDate = (dateString: string): boolean => {
	const date = new Date(dateString);
	const now = new Date();
	return date > now;
};

/**
 * Sanitize string input
 */
export const sanitizeString = (input: string): string => {
	return input.trim().replace(/[<>]/g, "");
};

/**
 * Calculate assignment status based on due date and current status
 */
export const calculateAssignmentStatus = (
	dueDate: Date,
	currentStatus: string
): string => {
	const now = new Date();

	if (currentStatus === "completed") {
		return "completed";
	}

	if (dueDate < now && currentStatus !== "completed") {
		return "overdue";
	}

	return currentStatus;
};

/**
 * Log error with timestamp
 */
export const logError = (error: Error | string, context?: string): void => {
	const timestamp = new Date().toISOString();
	const errorMessage = error instanceof Error ? error.message : error;
	const stackTrace = error instanceof Error ? error.stack : "";

	console.error(
		`[${timestamp}] ${context ? `[${context}] ` : ""}${errorMessage}`
	);
	if (stackTrace) {
		console.error(stackTrace);
	}
};

/**
 * Validate required fields
 */
export const validateRequiredFields = (
	obj: Record<string, any>,
	requiredFields: string[]
): string[] => {
	const missingFields: string[] = [];

	requiredFields.forEach((field) => {
		if (
			!obj[field] ||
			(typeof obj[field] === "string" && !obj[field].trim())
		) {
			missingFields.push(field);
		}
	});

	return missingFields;
};
