import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../utils";

/**
 * Custom error class for application errors
 */
export class AppError extends Error {
	public statusCode: number;
	public isOperational: boolean;

	constructor(message: string, statusCode: number = 500) {
		super(message);
		this.statusCode = statusCode;
		this.isOperational = true;
		this.name = this.constructor.name;

		Error.captureStackTrace(this, this.constructor);
	}
}

/**
 * Async error handler wrapper
 */
export const asyncHandler = (fn: Function) => {
	return (req: Request, res: Response, next: NextFunction) => {
		Promise.resolve(fn(req, res, next)).catch(next);
	};
};

/**
 * Global error handler middleware
 */
export const errorHandler = (
	err: Error | AppError,
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	let error = { ...err } as AppError;
	error.message = err.message;

	// Log error details
	console.error("Error:", {
		message: err.message,
		stack: err.stack,
		url: req.url,
		method: req.method,
		ip: req.ip,
		timestamp: new Date().toISOString(),
	});

	// Default error values
	let statusCode = 500;
	let message = "Internal server error";

	// Handle specific error types
	if (err instanceof AppError) {
		statusCode = err.statusCode;
		message = err.message;
	} else if (err.name === "ValidationError") {
		statusCode = 400;
		message = "Validation error";
	} else if (err.name === "CastError") {
		statusCode = 400;
		message = "Invalid ID format";
	} else if (err.name === "JsonWebTokenError") {
		statusCode = 401;
		message = "Invalid token";
	} else if (err.name === "TokenExpiredError") {
		statusCode = 401;
		message = "Token expired";
	} else if (err.name === "MongoError" && (err as any).code === 11000) {
		statusCode = 400;
		message = "Duplicate field value";
	}

	// Handle specific HTTP errors
	if ((err as any).code === "ENOTFOUND") {
		statusCode = 503;
		message = "Service unavailable";
	}

	// Handle file system errors
	if ((err as any).code === "ENOENT") {
		statusCode = 404;
		message = "File not found";
	}

	if ((err as any).code === "EACCES") {
		statusCode = 403;
		message = "Permission denied";
	}


	const response =
		process.env.NODE_ENV === "production"
			? errorResponse(message)
			: errorResponse(message, {
					stack: err.stack,
					details: error,
			  } as any);

	res.status(statusCode).json(response);
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	const message = `Route ${req.method} ${req.originalUrl} not found`;
	res.status(404).json(errorResponse(message));
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
		res.status(400).json(errorResponse("Invalid JSON format"));
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

		res.on("finish", () => clearTimeout(timeout));
		res.on("close", () => clearTimeout(timeout));

		next();
	};
};

/**
 * Security headers middleware
 */
export const securityHeaders = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	// Remove sensitive headers
	res.removeHeader("X-Powered-By");
	// Add security headers
	res.setHeader("X-Content-Type-Options", "nosniff");
	res.setHeader("X-Frame-Options", "DENY");
	res.setHeader("X-XSS-Protection", "1; mode=block");
	res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
	next();
};

/**
 * Request logging middleware
 */
export const requestLogger = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	const start = Date.now();
	res.on("finish", () => {
		const duration = Date.now() - start;
		const logData = {
			method: req.method,
			url: req.url,
			status: res.statusCode,
			duration: `${duration}ms`,
			ip: req.ip,
			userAgent: req.get("User-Agent"),
			timestamp: new Date().toISOString(),
		};

		// Log based on status code
		if (res.statusCode >= 400) {
			console.error("Request Error:", logData);
		} else {
			console.log("Request:", logData);
		}
	});

	next();
};

/**
 * API rate limiting by IP
 */

export const rateLimitByIP = (
	maxRequests: number = 100,
	windowMs: number = 15 * 60 * 1000
) => {
	const requests: { [key: string]: { count: number; resetTime: number } } = {};

	return (req: Request, res: Response, next: NextFunction): void => {
		const ip = req.ip || req.connection.remoteAddress || "unknown";

		const now = Date.now();

		if (!requests[ip] || now > requests[ip].resetTime) {
			requests[ip] = {
				count: 1,
				resetTime: now + windowMs,
			};
		} else {
			requests[ip].count++;
		}

		if (requests[ip].count > maxRequests) {
			res.status(429).json(
				errorResponse(
					"Too many requests from this IP. Please try again later."
				)

			);
			return;
		}

		next();
	};
};
