import { Request, Response, NextFunction } from "express";
import { body, param, query, validationResult } from "express-validator";
import { errorResponse } from "../utils";

/**
 * Handle validation results and return errors if any
 */
export const handleValidationErrors = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const errorMessages = errors.array().map((error) => ({
			field: error.type === 'field' ? error.path : 'unknown',
			message: error.msg,
			value: error.type === 'field' ? error.value : undefined,
		}));

		res.status(400).json(
			errorResponse("Validation failed", {
				errors: errorMessages,
			} as any)
		);
		return;
	}
	next();
};

/**
 * Assignment creation validation rules
 */
export const validateCreateAssignment = [
	body("title")
		.trim()
		.notEmpty()
		.withMessage("Title is required")
		.isLength({ min: 1, max: 200 })
		.withMessage("Title must be between 1 and 200 characters"),

	body("subject")
		.trim()
		.notEmpty()
		.withMessage("Subject is required")
		.isLength({ min: 1, max: 100 })
		.withMessage("Subject must be between 1 and 100 characters"),

	body("description")
		.optional()
		.trim()
		.isLength({ max: 1000 })
		.withMessage("Description must not exceed 1000 characters"),

	body("dueDate")
		.notEmpty()
		.withMessage("Due date is required")
		.isISO8601()
		.withMessage("Due date must be a valid ISO 8601 date")
		.custom((value) => {
			const dueDate = new Date(value);
			const now = new Date();
			now.setHours(0, 0, 0, 0); // Set to start of today
			if (dueDate < now) {
				throw new Error("Due date cannot be in the past");
			}
			return true;
		}),

	body("priority")
		.notEmpty()
		.withMessage("Priority is required")
		.isIn(["low", "medium", "high"])
		.withMessage("Priority must be low, medium, or high"),

	body("estimatedHours")
		.notEmpty()
		.withMessage("Estimated hours is required")
		.isFloat({ min: 0.1, max: 1000 })
		.withMessage("Estimated hours must be between 0.1 and 1000"),

	body("tags")
		.optional()
		.isArray()
		.withMessage("Tags must be an array")
		.custom((tags) => {
			if (tags && tags.length > 20) {
				throw new Error("Cannot have more than 20 tags");
			}
			if (tags && tags.some((tag: any) => typeof tag !== "string" || tag.length > 50)) {
				throw new Error("Each tag must be a string with max 50 characters");
			}
			return true;
		}),

	handleValidationErrors,
];

/**
 * Assignment update validation rules
 */
export const validateUpdateAssignment = [
	param("id")
		.notEmpty()
		.withMessage("Assignment ID is required")
		.isLength({ min: 1 })
		.withMessage("Assignment ID must not be empty"),

	body("title")
		.optional()
		.trim()
		.isLength({ min: 1, max: 200 })
		.withMessage("Title must be between 1 and 200 characters"),

	body("subject")
		.optional()
		.trim()
		.isLength({ min: 1, max: 100 })
		.withMessage("Subject must be between 1 and 100 characters"),

	body("description")
		.optional()
		.trim()
		.isLength({ max: 1000 })
		.withMessage("Description must not exceed 1000 characters"),

	body("dueDate")
		.optional()
		.isISO8601()
		.withMessage("Due date must be a valid ISO 8601 date"),

	body("priority")
		.optional()
		.isIn(["low", "medium", "high"])
		.withMessage("Priority must be low, medium, or high"),

	body("status")
		.optional()
		.isIn(["not-started", "in-progress", "completed", "overdue"])
		.withMessage("Status must be not-started, in-progress, completed, or overdue"),

	body("estimatedHours")
		.optional()
		.isFloat({ min: 0.1, max: 1000 })
		.withMessage("Estimated hours must be between 0.1 and 1000"),

	body("actualHours")
		.optional()
		.isFloat({ min: 0, max: 1000 })
		.withMessage("Actual hours must be between 0 and 1000"),

	body("tags")
		.optional()
		.isArray()
		.withMessage("Tags must be an array")
		.custom((tags) => {
			if (tags && tags.length > 20) {
				throw new Error("Cannot have more than 20 tags");
			}
			if (tags && tags.some((tag: any) => typeof tag !== "string" || tag.length > 50)) {
				throw new Error("Each tag must be a string with max 50 characters");
			}
			return true;
		}),

	handleValidationErrors,
];

/**
 * Assignment ID parameter validation
 */
export const validateAssignmentId = [
	param("id")
		.notEmpty()
		.withMessage("Assignment ID is required")
		.isLength({ min: 1 })
		.withMessage("Assignment ID must not be empty"),

	handleValidationErrors,
];

/**
 * Status update validation
 */
export const validateStatusUpdate = [
	param("id")
		.notEmpty()
		.withMessage("Assignment ID is required"),

	body("status")
		.notEmpty()
		.withMessage("Status is required")
		.isIn(["not-started", "in-progress", "completed", "overdue"])
		.withMessage("Status must be not-started, in-progress, completed, or overdue"),

	handleValidationErrors,
];

/**
 * Search query validation
 */
export const validateSearchQuery = [
	query("q")
		.notEmpty()
		.withMessage("Search query is required")
		.isLength({ min: 1, max: 100 })
		.withMessage("Search query must be between 1 and 100 characters")
		.trim(),

	handleValidationErrors,
];

/**
 * General ID validation for routes
 */
export const validateId = (paramName: string = "id") => [
	param(paramName)
		.notEmpty()
		.withMessage(`${paramName} is required`)
		.isLength({ min: 1 })
		.withMessage(`${paramName} must not be empty`),

	handleValidationErrors,
];

/**
 * Pagination validation
 */
export const validatePagination = [
	query("page")
		.optional()
		.isInt({ min: 1 })
		.withMessage("Page must be a positive integer"),

	query("limit")
		.optional()
		.isInt({ min: 1, max: 100 })
		.withMessage("Limit must be between 1 and 100"),

	handleValidationErrors,
];

/**
 * Date range validation
 */
export const validateDateRange = [
	query("startDate")
		.optional()
		.isISO8601()
		.withMessage("Start date must be a valid ISO 8601 date"),

	query("endDate")
		.optional()
		.isISO8601()
		.withMessage("End date must be a valid ISO 8601 date")
		.custom((endDate, { req }) => {
			if (endDate && req.query?.startDate) {
				const start = new Date(req.query.startDate as string);
				const end = new Date(endDate);
				if (end < start) {
					throw new Error("End date must be after start date");
				}
			}
			return true;
		}),

	handleValidationErrors,
];