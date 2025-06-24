import { ApiResponse, Assignment } from "../types";

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
 * Generate a simple UUID
 */
export const generateId = (): string => {
	return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
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

/**
 * Calculate assignment status based on due date and current status
 * Returns the proper Assignment status type
 */
export const calculateAssignmentStatus = (
	dueDate: Date,
	currentStatus: Assignment["status"]
): Assignment["status"] => {
	const now = new Date();

	// If already completed, keep it completed
	if (currentStatus === "completed") {
		return "completed";
	}

	// If due date has passed and not completed, mark as overdue
	if (dueDate < now) {
		return "overdue";
	}

	// Otherwise, return the current status
	return currentStatus;
};

/**
 * Validate date string
 */
export const isValidDate = (dateString: string): boolean => {
	const date = new Date(dateString);
	return !isNaN(date.getTime());
};

/**
 * Sanitize string input
 */
export const sanitizeString = (input: string): string => {
	return input.trim().replace(/[<>]/g, "");
};
