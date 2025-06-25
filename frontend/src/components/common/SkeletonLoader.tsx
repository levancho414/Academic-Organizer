import React from "react";

interface SkeletonLoaderProps {
	type?: "text" | "card" | "assignment" | "note" | "avatar" | "button";
	count?: number;
	className?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
	type = "text",
	count = 1,
	className = "",
}) => {
	const renderSkeleton = () => {
		const baseClass = "animate-pulse bg-gray-200 rounded";

		switch (type) {
			case "text":
				return (
					<div className={`space-y-2 ${className}`}>
						<div className={`${baseClass} h-4 w-3/4`}></div>
						<div className={`${baseClass} h-4 w-1/2`}></div>
					</div>
				);

			case "avatar":
				return (
					<div
						className={`${baseClass} rounded-full h-10 w-10 ${className}`}
					></div>
				);

			case "button":
				return (
					<div className={`${baseClass} h-10 w-24 ${className}`}></div>
				);

			case "card":
				return (
					<div
						className={`bg-white p-6 rounded-lg shadow space-y-4 ${className}`}
					>
						<div className={`${baseClass} h-6 w-3/4`}></div>
						<div className="space-y-2">
							<div className={`${baseClass} h-4 w-full`}></div>
							<div className={`${baseClass} h-4 w-2/3`}></div>
						</div>
						<div className="flex gap-2">
							<div
								className={`${baseClass} h-6 w-16 rounded-full`}
							></div>
							<div
								className={`${baseClass} h-6 w-20 rounded-full`}
							></div>
						</div>
					</div>
				);

			case "assignment":
				return (
					<div
						className={`bg-white p-6 rounded-lg shadow space-y-4 ${className}`}
					>
						<div className="flex justify-between items-start">
							<div className="flex-1 space-y-2">
								<div className={`${baseClass} h-5 w-3/4`}></div>
								<div className={`${baseClass} h-3 w-1/2`}></div>
							</div>
							<div
								className={`${baseClass} h-6 w-16 rounded-full`}
							></div>
						</div>
						<div className="space-y-2">
							<div className={`${baseClass} h-4 w-full`}></div>
							<div className={`${baseClass} h-4 w-2/3`}></div>
						</div>
						<div className="flex gap-2 mb-4">
							<div
								className={`${baseClass} h-5 w-12 rounded-full`}
							></div>
							<div
								className={`${baseClass} h-5 w-16 rounded-full`}
							></div>
						</div>
						<div className="flex justify-between items-center pt-4 border-t border-gray-100">
							<div className="space-y-1">
								<div className={`${baseClass} h-3 w-20`}></div>
								<div className={`${baseClass} h-3 w-24`}></div>
							</div>
							<div className="flex gap-2">
								<div className={`${baseClass} h-8 w-20`}></div>
								<div className={`${baseClass} h-8 w-8`}></div>
							</div>
						</div>
					</div>
				);

			case "note":
				return (
					<div
						className={`bg-white p-6 rounded-lg shadow space-y-4 ${className}`}
					>
						<div className="flex justify-between items-start">
							<div className="flex-1 space-y-2">
								<div className={`${baseClass} h-5 w-2/3`}></div>
								<div className={`${baseClass} h-3 w-1/3`}></div>
							</div>
							<div className="flex gap-1">
								<div className={`${baseClass} h-6 w-6`}></div>
								<div className={`${baseClass} h-6 w-6`}></div>
							</div>
						</div>
						<div className="space-y-2">
							<div className={`${baseClass} h-4 w-full`}></div>
							<div className={`${baseClass} h-4 w-4/5`}></div>
							<div className={`${baseClass} h-4 w-3/4`}></div>
						</div>
						<div className="flex gap-2">
							<div
								className={`${baseClass} h-5 w-12 rounded-full`}
							></div>
							<div
								className={`${baseClass} h-5 w-16 rounded-full`}
							></div>
						</div>
						<div className="flex justify-between text-xs pt-4 border-t border-gray-100">
							<div className={`${baseClass} h-3 w-20`}></div>
							<div className={`${baseClass} h-3 w-24`}></div>
						</div>
					</div>
				);

			default:
				return (
					<div className={`${baseClass} h-4 w-full ${className}`}></div>
				);
		}
	};

	return (
		<div className="space-y-4">
			{Array.from({ length: count }, (_, index) => (
				<div key={index}>{renderSkeleton()}</div>
			))}
		</div>
	);
};

export default SkeletonLoader;
