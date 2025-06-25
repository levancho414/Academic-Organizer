import React, { Component, ErrorInfo, ReactNode } from "react";
import { ApiError } from "../../api/errors";

interface Props {
	children: ReactNode;
	fallback?: ReactNode;
	onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
	hasError: boolean;
	error?: Error;
	errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error: Error): State {
		return {
			hasError: true,
			error,
		};
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		this.setState({
			error,
			errorInfo,
		});

		// Log error
		console.error("ErrorBoundary caught an error:", error, errorInfo);

		// Call onError prop if provided
		if (this.props.onError) {
			this.props.onError(error, errorInfo);
		}

		// Report to error reporting service in production
		if (process.env.NODE_ENV === "production") {
			// You can integrate with services like Sentry here
			console.error("Production error:", error);
		}
	}

	handleRetry = () => {
		this.setState({
			hasError: false,
			error: undefined,
			errorInfo: undefined,
		});
	};

	render() {
		if (this.state.hasError) {
			if (this.props.fallback) {
				return this.props.fallback;
			}

			return (
				<div className="error-boundary">
					<div className="max-w-md mx-auto mt-8 p-6 bg-red-50 border border-red-200 rounded-lg">
						<div className="flex items-center mb-4">
							<div className="flex-shrink-0">
								<svg
									className="h-8 w-8 text-red-400"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
									/>
								</svg>
							</div>
							<div className="ml-3">
								<h3 className="text-lg font-medium text-red-800">
									Something went wrong
								</h3>
							</div>
						</div>

						<div className="mb-4">
							<p className="text-red-700">
								We're sorry, but something unexpected happened. Please
								try refreshing the page.
							</p>

							{process.env.NODE_ENV === "development" &&
								this.state.error && (
									<details className="mt-4 p-3 bg-red-100 rounded border">
										<summary className="cursor-pointer font-medium text-red-800">
											Error Details (Development)
										</summary>
										<div className="mt-2 text-sm text-red-700">
											<p>
												<strong>Error:</strong>{" "}
												{this.state.error.message}
											</p>
											<p>
												<strong>Stack:</strong>
											</p>
											<pre className="whitespace-pre-wrap text-xs bg-red-200 p-2 rounded mt-1">
												{this.state.error.stack}
											</pre>
										</div>
									</details>
								)}
						</div>

						<div className="flex gap-3">
							<button
								onClick={this.handleRetry}
								className="btn btn-primary"
							>
								Try Again
							</button>
							<button
								onClick={() => window.location.reload()}
								className="btn btn-secondary"
							>
								Reload Page
							</button>
						</div>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
