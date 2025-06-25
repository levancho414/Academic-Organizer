import React from "react";
import { ApiError } from "../../api/errors";

interface NetworkErrorProps {
	error?: ApiError | Error;
	onRetry?: () => void;
	onDismiss?: () => void;
	showDetails?: boolean;
	title?: string;
	message?: string;
}

const NetworkError: React.FC<NetworkErrorProps> = ({
	error,
	onRetry,
	onDismiss,
	showDetails = false,
	title,
	message,
}) => {
	const isApiError = error instanceof ApiError;
	const statusCode = isApiError ? error.statusCode : 0;

	const getErrorIcon = () => {
		if (statusCode === 0) return "🌐"; // Network error
		if (statusCode >= 500) return "🔧"; // Server error
		if (statusCode === 404) return "🔍"; // Not found
		if (statusCode === 401 || statusCode === 403) return "🔒"; // Auth error
		return "⚠️"; // Generic error
	};

	const getErrorTitle = () => {
		if (title) return title;
		if (statusCode === 0) return "Connection Problem";
		if (statusCode >= 500) return "Server Error";
		if (statusCode === 404) return "Not Found";
		if (statusCode === 401) return "Authentication Required";
		if (statusCode === 403) return "Access Denied";
		return "Error";
	};

	const getErrorMessage = () => {
		if (message) return message;
		if (isApiError) {
			return error.message;
		}
		return error?.message || "An unexpected error occurred";
	};

	const getActionText = () => {
		if (statusCode === 0) return "Check Connection";
		if (statusCode >= 500) return "Try Again";
		if (statusCode === 401) return "Login";
		return "Retry";
	};

	const getSuggestion = () => {
		if (statusCode === 0)
			return "Please check your internet connection and try again.";
		if (statusCode >= 500)
			return "The server is experiencing issues. Please try again in a moment.";
		if (statusCode === 404) return "The requested resource was not found.";
		if (statusCode === 401) return "Please log in to continue.";
		if (statusCode === 403)
			return "You don't have permission to access this resource.";
		return "Please try again or contact support if the problem persists.";
	};

	return (
		<div className="network-error bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
			<div className="flex items-start">
				<div className="flex-shrink-0 text-2xl mr-3">{getErrorIcon()}</div>

				<div className="flex-1 min-w-0">
					<h3 className="text-lg font-medium text-red-800 mb-1">
						{getErrorTitle()}
					</h3>

					<p className="text-red-700 mb-2">{getErrorMessage()}</p>

					<p className="text-red-600 text-sm mb-3">{getSuggestion()}</p>

					{showDetails && isApiError && (
						<details className="mb-3">
							<summary className="cursor-pointer text-sm font-medium text-red-800 hover:text-red-900">
								Technical Details
							</summary>
							<div className="mt-2 text-sm text-red-600 bg-red-100 p-3 rounded">
								<p>
									<strong>Status Code:</strong> {statusCode}
								</p>
								<p>
									<strong>Timestamp:</strong>{" "}
									{error.timestamp.toLocaleString()}
								</p>
								{process.env.NODE_ENV === "development" &&
									error.originalError && (
										<div className="mt-2">
											<p>
												<strong>Original Error:</strong>
											</p>
											<pre className="text-xs bg-red-200 p-2 rounded mt-1 overflow-auto">
												{JSON.stringify(
													error.originalError,
													null,
													2
												)}
											</pre>
										</div>
									)}
							</div>
						</details>
					)}

					<div className="flex flex-wrap gap-3">
						{onRetry && (
							<button
								onClick={onRetry}
								className="btn btn-primary btn-sm"
							>
								{getActionText()}
							</button>
						)}

						{statusCode === 0 && (
							<button
								onClick={() => window.location.reload()}
								className="btn btn-secondary btn-sm"
							>
								Reload Page
							</button>
						)}

						{statusCode === 401 && (
							<button
								onClick={() => (window.location.href = "/login")}
								className="btn btn-primary btn-sm"
							>
								Go to Login
							</button>
						)}

						{onDismiss && (
							<button
								onClick={onDismiss}
								className="btn btn-secondary btn-sm"
							>
								Dismiss
							</button>
						)}
					</div>
				</div>

				{onDismiss && (
					<button
						onClick={onDismiss}
						className="flex-shrink-0 ml-3 text-red-400 hover:text-red-600 transition-colors"
						aria-label="Dismiss error"
					>
						<svg
							className="h-5 w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				)}
			</div>
		</div>
	);
};

export default NetworkError;
