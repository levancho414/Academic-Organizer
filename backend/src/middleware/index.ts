import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../utils";

/**
 * Global error handler middleware
 */
export const errorHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	console.error("Error:", err);

	// Default error
	let status = 500;
	let message = "Internal server error";

	// Handle specific error types
	if (err.name === "ValidationError") {
		status = 400;
		message = "Validation error";
	} else if (err.name === "CastError") {
		status = 400;
		message = "Invalid ID format";
	} else if (err.name === "UnauthorizedError") {
		status = 401;
		message = "Unauthorized";
	}

	// Don't leak error details in production
	if (process.env.NODE_ENV === "production") {
		res.status(status).json(errorResponse(message));
	} else {
		res.status(status).json(errorResponse(err.message));
	}
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	res.status(404).json(errorResponse(`Route ${req.originalUrl} not found`));
};

/**
 * Validate JSON middleware
 */
export const validateJSON = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	if (err instanceof SyntaxError && "body" in err) {
		res.status(400).json(errorResponse("Invalid JSON"));
		return;
	}
	next(err);
};

/**
 * Request timeout middleware
 */
export const requestTimeout = (timeoutMs: number = 30000) => {
	return (req: Request, res: Response, next: NextFunction): void => {
		const timeout = setTimeout(() => {
			if (!res.headersSent) {
				res.status(408).json(errorResponse("Request timeout"));
			}
		}, timeoutMs);

		res.on("finish", () => {
			clearTimeout(timeout);
		});

		res.on("close", () => {
			clearTimeout(timeout);
		});

		next();
	};
};
