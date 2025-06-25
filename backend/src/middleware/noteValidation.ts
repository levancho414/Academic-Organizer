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
			field: error.type === "field" ? error.path : "unknown",
			message: error.msg,
			value: error.type === "field" ? error.value : undefined,
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
 * Note creation validation rules
 */
export const validateCreateNote = [
	body("title")
		.trim()
		.notEmpty()
		.withMessage("Title is required")
		.isLength({ min: 1, max: 200 })
		.withMessage("Title must be between 1 and 200 characters"),

	body("content")
		.trim()
		.notEmpty()
		.withMessage("Content is required")
		.isLength({ min: 1, max: 10000 })
		.withMessage("Content must be between 1 and 10,000 characters"),

	body("subject")
		.trim()
		.notEmpty()
		.withMessage("Subject is required")
		.isLength({ min: 1, max: 100 })
		.withMessage("Subject must be between 1 and 100 characters"),

	body("tags")
		.optional()
		.isArray()
		.withMessage("Tags must be an array")
		.custom((tags) => {
			if (tags && tags.length > 20) {
				throw new Error("Cannot have more than 20 tags");
			}
			if (
				tags &&
				tags.some((tag: any) => typeof tag !== "string" || tag.length > 50)
			) {
				throw new Error("Each tag must be a string with max 50 characters");
			}
			return true;
		}),

	body("assignmentId")
		.optional()
		.isString()
		.withMessage("Assignment ID must be a string"),

	handleValidationErrors,
];

/**
 * Note update validation rules
 */
export const validateUpdateNote = [
	param("id")
		.notEmpty()
		.withMessage("Note ID is required")
		.isLength({ min: 1 })
		.withMessage("Note ID must not be empty"),

	body("title")
		.optional()
		.trim()
		.isLength({ min: 1, max: 200 })
		.withMessage("Title must be between 1 and 200 characters"),

	body("content")
		.optional()
		.trim()
		.isLength({ min: 1, max: 10000 })
		.withMessage("Content must be between 1 and 10,000 characters"),

	body("subject")
		.optional()
		.trim()
		.isLength({ min: 1, max: 100 })
		.withMessage("Subject must be between 1 and 100 characters"),

	body("tags")
		.optional()
		.isArray()
		.withMessage("Tags must be an array")
		.custom((tags) => {
			if (tags && tags.length > 20) {
				throw new Error("Cannot have more than 20 tags");
			}
			if (
				tags &&
				tags.some((tag: any) => typeof tag !== "string" || tag.length > 50)
			) {
				throw new Error("Each tag must be a string with max 50 characters");
			}
			return true;
		}),

	body("assignmentId")
		.optional()
		.isString()
		.withMessage("Assignment ID must be a string"),

	handleValidationErrors,
];

/**
 * Note ID parameter validation
 */
export const validateNoteId = [
	param("id")
		.notEmpty()
		.withMessage("Note ID is required")
		.isLength({ min: 1 })
		.withMessage("Note ID must not be empty"),

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
