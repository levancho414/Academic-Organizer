import React from "react";
import LoadingSpinner from "./LoadingSpinner";

interface LoadingButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	isLoading?: boolean;
	loadingText?: string;
	variant?: "primary" | "secondary" | "success" | "danger";
	size?: "sm" | "md" | "lg";
	fullWidth?: boolean;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
	children,
	isLoading = false,
	loadingText,
	variant = "primary",
	size = "md",
	fullWidth = false,
	disabled,
	className = "",
	...props
}) => {
	const baseClasses =
		"inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

	const variantClasses = {
		primary:
			"bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-300",
		secondary:
			"bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 disabled:bg-gray-300",
		success:
			"bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 disabled:bg-green-300",
		danger:
			"bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300",
	};

	const sizeClasses = {
		sm: "px-3 py-1.5 text-sm",
		md: "px-4 py-2 text-base",
		lg: "px-6 py-3 text-lg",
	};

	const spinnerSize = size === "sm" ? "sm" : size === "lg" ? "md" : "sm";
	const spinnerColor = variant === "secondary" ? "secondary" : "primary";

	return (
		<button
			{...props}
			disabled={disabled || isLoading}
			className={`
        ${baseClasses} 
        ${variantClasses[variant]} 
        ${sizeClasses[size]} 
        ${fullWidth ? "w-full" : ""} 
        ${isLoading ? "cursor-not-allowed opacity-75" : ""} 
        ${className}
      `}
		>
			{isLoading && (
				<div className="mr-2">
					<div
						className={`loading-spinner border-2 border-white border-t-transparent rounded-full animate-spin ${
							spinnerSize === "sm" ? "w-4 h-4" : "w-5 h-5"
						}`}
					/>
				</div>
			)}
			<span>{isLoading && loadingText ? loadingText : children}</span>
		</button>
	);
};

export default LoadingButton;
