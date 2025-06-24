import React from "react";

interface LoadingSpinnerProps {
	size?: "sm" | "md" | "lg";
	text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
	size = "md",
	text,
}) => {
	const spinnerStyle = {
		width: size === "sm" ? "1rem" : size === "lg" ? "3rem" : "2rem",
		height: size === "sm" ? "1rem" : size === "lg" ? "3rem" : "2rem",
	};

	return (
		<div className="flex-center" style={{ flexDirection: "column" }}>
			<div className="loading-spinner" style={spinnerStyle}></div>
			{text && <p className="mt-2 text-gray-600">{text}</p>}
		</div>
	);
};

export default LoadingSpinner;
