import React from "react";

interface LoadingSpinnerProps {
	size?: "sm" | "md" | "lg" | "xl";
	text?: string;
	overlay?: boolean;
	color?: "primary" | "secondary" | "success" | "danger";
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
	size = "md",
	text,
	overlay = false,
	color = "primary",
}) => {
	const sizeClasses = {
		sm: "w-4 h-4",
		md: "w-8 h-8",
		lg: "w-12 h-12",
		xl: "w-16 h-16",
	};

	const colorClasses = {
		primary: "border-blue-600",
		secondary: "border-gray-600",
		success: "border-green-600",
		danger: "border-red-600",
	};

	const textSizes = {
		sm: "text-xs",
		md: "text-sm",
		lg: "text-base",
		xl: "text-lg",
	};

	const spinner = (
		<div
			className={`flex items-center justify-center ${
				overlay ? "flex-col" : ""
			}`}
		>
			<div
				className={`loading-spinner ${sizeClasses[size]} ${colorClasses[color]} border-2 border-gray-200 rounded-full animate-spin`}
				style={{
					borderTopColor:
						color === "primary"
							? "#2563eb"
							: color === "success"
							? "#059669"
							: color === "danger"
							? "#dc2626"
							: "#4b5563",
				}}
			/>
			{text && (
				<p
					className={`text-gray-600 ${textSizes[size]} ${
						overlay ? "mt-3" : "ml-2"
					}`}
				>
					{text}
				</p>
			)}
		</div>
	);

	if (overlay) {
		return (
			<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
				<div className="bg-white rounded-lg p-6 shadow-xl">{spinner}</div>
			</div>
		);
	}

	return spinner;
};

export default LoadingSpinner;
