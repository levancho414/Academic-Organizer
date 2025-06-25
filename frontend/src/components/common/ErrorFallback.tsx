import React from "react";
import LoadingButton from "./LoadingButton";

interface ErrorFallbackProps {
	error?: Error;
	resetError?: () => void;
	title?: string;
	message?: string;
	showRetry?: boolean;
	showReload?: boolean;
	className?: string;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({
	error,
	resetError,
	title = "Something went wrong",
	message,
	showRetry = true,
	showReload = false,
	className = "",
}) => {
	const getDefaultMessage = () => {
		if (message) return message;
		return "We encountered an unexpected error. Please try again.";
	};

	const handleReload = () => {
		window.location.reload();
	};

	return (
		<div className={`error-fallback ${className}`}>
			<div className="text-center py-8 px-4">
				<div className="max-w-md mx-auto">
					{/* Error Icon */}
					<div className="text-6xl mb-4">😕</div>

					{/* Error Title */}
					<h2 className="text-xl font-semibold text-gray-900 mb-2">
						{title}
					</h2>

					{/* Error Message */}
					<p className="text-gray-600 mb-6">{getDefaultMessage()}</p>

					{/* Development Error Details */}
					{process.env.NODE_ENV === "development" && error && (
						<details className="mb-6 text-left bg-gray-100 p-4 rounded-lg">
							<summary className="cursor-pointer font-medium text-gray-700 mb-2">
								Error Details (Development Only)
							</summary>
							<div className="text-sm text-gray-600">
								<p className="font-medium">Message:</p>
								<p className="mb-2 text-red-600">{error.message}</p>
								{error.stack && (
									<>
										<p className="font-medium">Stack Trace:</p>
										<pre className="text-xs bg-gray-200 p-2 rounded overflow-auto">
											{error.stack}
										</pre>
									</>
								)}
							</div>
						</details>
					)}

					{/* Action Buttons */}
					<div className="flex flex-col sm:flex-row gap-3 justify-center">
						{showRetry && resetError && (
							<LoadingButton
								onClick={resetError}
								variant="primary"
								className="min-w-24"
							>
								Try Again
							</LoadingButton>
						)}

						{showReload && (
							<LoadingButton
								onClick={handleReload}
								variant="secondary"
								className="min-w-24"
							>
								Reload Page
							</LoadingButton>
						)}

						{!showRetry && !showReload && (
							<LoadingButton
								onClick={() => (window.location.href = "/")}
								variant="primary"
								className="min-w-24"
							>
								Go Home
							</LoadingButton>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ErrorFallback;
