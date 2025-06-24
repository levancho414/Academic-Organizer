import { Request, Response, NextFunction } from "express";
import { errorResponse, logError } from "../utils";

export const errorHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	logError(err, "ErrorHandler");


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

	if (process.env.NODE_ENV === "production") {
		res.status(status).json(errorResponse(message));
	} else {
		res.status(status).json(errorResponse(err.message, err.stack));
	}
};


export const notFoundHandler = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	res.status(404).json(errorResponse(`Route ${req.originalUrl} not found`));
};


export const requestLogger = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	const start = Date.now();

	res.on("finish", () => {
		const duration = Date.now() - start;
		console.log(
			`${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`
		);
	});

	next();
};


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
 * Rate limiting exceeded handler
 */
export const rateLimitHandler = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	res.status(429).json(
		errorResponse(
			"Too many requests, please try again later.",
			"Rate limit exceeded"
		)
	);
};

export const corsHandler = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	if (req.method === "OPTIONS") {
		res.header(
			"Access-Control-Allow-Methods",
			"GET, POST, PUT, DELETE, PATCH"
		);
		res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
		res.status(200).send();
		return;
	}
	next();
};


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
