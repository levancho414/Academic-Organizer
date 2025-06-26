import React, { useState, useEffect } from "react";
import AssignmentForm from "../components/AssignmentForm";
import AssignmentList from "../components/AssignmentList";
import LoadingSpinner from "../components/common/LoadingSpinner";
import SkeletonLoader from "../components/common/SkeletonLoader";
import ErrorBoundary from "../components/common/ErrorBoundary";
import NetworkError from "../components/common/NetworkError";
import ExportDropdown from "../components/common/ExportDropdown";
import { Assignment, AssignmentFormData } from "../types";
import { assignmentsApi } from "../api/assignments";
import { ApiError } from "../api/errors";

const AssignmentsPage: React.FC = () => {
	const [assignments, setAssignments] = useState<Assignment[]>([]);
	const [showForm, setShowForm] = useState(false);
	const [editingAssignment, setEditingAssignment] =
		useState<Assignment | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<ApiError | null>(null);

	// Load assignments on component mount
	useEffect(() => {
		loadAssignments();
	}, []);

	const loadAssignments = async () => {
		setIsLoading(true);
		setError(null);
		try {
			const data = await assignmentsApi.getAll();
			setAssignments(Array.isArray(data) ? data : []);
		} catch (error) {
			console.error("Error loading assignments:", error);
			if (error instanceof ApiError) {
				setError(error);
			} else {
				setError(
					new ApiError(
						"Failed to load assignments. Please try again.",
						500,
						error
					)
				);
			}
			setAssignments([]);
		} finally {
			setIsLoading(false);
		}
	};

	const handleFormSubmit = async (data: AssignmentFormData) => {
		setIsSubmitting(true);
		setError(null);
		try {
			if (editingAssignment) {
				const updated = await assignmentsApi.update(
					editingAssignment.id,
					data
				);
				setAssignments((prev) =>
					prev.map((assignment) =>
						assignment.id === editingAssignment.id ? updated : assignment
					)
				);
			} else {
				const newAssignment = await assignmentsApi.create(data);
				setAssignments((prev) => [newAssignment, ...prev]);
			}
			setShowForm(false);
			setEditingAssignment(null);
		} catch (error: any) {
			console.error("Error saving assignment:", error);
			if (error instanceof ApiError) {
				setError(error);
			} else {
				setError(
					new ApiError(
						"Failed to save assignment. Please try again.",
						500,
						error
					)
				);
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleFormCancel = () => {
		setShowForm(false);
		setEditingAssignment(null);
		setError(null);
	};

	const handleEdit = (assignment: Assignment) => {
		setEditingAssignment(assignment);
		setShowForm(true);
		setError(null);
	};

	const handleDelete = async (id: string) => {
		const assignment = assignments.find((a) => a.id === id);
		const assignmentTitle = assignment ? assignment.title : "this assignment";

		const confirmMessage = `Are you sure you want to delete "${assignmentTitle}"?\n\nThis action cannot be undone.`;

		if (!window.confirm(confirmMessage)) {
			return;
		}

		try {
			await assignmentsApi.delete(id);
			setAssignments((prev) =>
				prev.filter((assignment) => assignment.id !== id)
			);
			setError(null);
			console.log(`Assignment "${assignmentTitle}" deleted successfully`);
		} catch (error: any) {
			console.error("Error deleting assignment:", error);
			if (error instanceof ApiError) {
				setError(error);
			} else {
				setError(
					new ApiError(
						`Failed to delete "${assignmentTitle}". Please try again.`,
						500,
						error
					)
				);
			}
		}
	};

	const handleStatusChange = async (
		id: string,
		status: Assignment["status"]
	) => {
		try {
			const updated = await assignmentsApi.updateStatus(id, status);
			setAssignments((prev) =>
				prev.map((assignment) =>
					assignment.id === id ? updated : assignment
				)
			);
			setError(null);
		} catch (error: any) {
			console.error("Error updating status:", error);
			if (error instanceof ApiError) {
				setError(error);
			} else {
				setError(
					new ApiError(
						"Failed to update status. Please try again.",
						500,
						error
					)
				);
			}
		}
	};

	const handleRetry = () => {
		if (showForm) {
			setError(null);
		} else {
			loadAssignments();
		}
	};

	const handleDismissError = () => {
		setError(null);
	};

	const getInitialFormData = (): Partial<AssignmentFormData> | undefined => {
		if (!editingAssignment) return undefined;
		return {
			title: editingAssignment.title,
			description: editingAssignment.description,
			subject: editingAssignment.subject,
			dueDate: new Date(editingAssignment.dueDate)
				.toISOString()
				.slice(0, 16),
			priority: editingAssignment.priority,
			estimatedHours: editingAssignment.estimatedHours,
			tags: editingAssignment.tags,
		};
	};

	// Handle error boundary errors
	const handleErrorBoundaryError = (error: Error, errorInfo: any) => {
		console.error(
			"ErrorBoundary caught error in AssignmentsPage:",
			error,
			errorInfo
		);
	};

	if (showForm) {
		return (
			<ErrorBoundary
				onError={handleErrorBoundaryError}
				fallback={
					<div className="p-8 text-center">
						<h2 className="text-xl font-semibold mb-4">Form Error</h2>
						<p className="text-gray-600 mb-4">
							There was an error loading the form.
						</p>
						<button
							onClick={() => setShowForm(false)}
							className="btn btn-primary"
						>
							Back to Assignments
						</button>
					</div>
				}
			>
				<div>
					{error && (
						<NetworkError
							error={error}
							onRetry={handleRetry}
							onDismiss={handleDismissError}
							showDetails={process.env.NODE_ENV === "development"}
						/>
					)}
					<AssignmentForm
						onSubmit={handleFormSubmit}
						onCancel={handleFormCancel}
						initialData={getInitialFormData()}
						isLoading={isSubmitting}
					/>
				</div>
			</ErrorBoundary>
		);
	}

	return (
		<ErrorBoundary
			onError={handleErrorBoundaryError}
			fallback={
				<div className="p-8 text-center">
					<h2 className="text-xl font-semibold mb-4">Assignments Error</h2>
					<p className="text-gray-600 mb-4">
						There was an error loading your assignments.
					</p>
					<button
						onClick={() => window.location.reload()}
						className="btn btn-primary"
					>
						Reload Page
					</button>
				</div>
			}
		>
			<div>
				<div className="flex-between mb-8">
					<h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
					<div className="flex gap-3 items-center">
						<ExportDropdown
							assignments={assignments}
							type="assignments"
							className="hidden sm:block"
						/>
						<button
							className="btn btn-primary"
							onClick={() => setShowForm(true)}
							disabled={isLoading}
						>
							Add Assignment
						</button>
					</div>
				</div>

				{/* Mobile Export Button */}
				<div className="sm:hidden mb-4">
					<ExportDropdown
						assignments={assignments}
						type="assignments"
						className="w-full"
					/>
				</div>

				{error && (
					<NetworkError
						error={error}
						onRetry={handleRetry}
						onDismiss={handleDismissError}
						showDetails={process.env.NODE_ENV === "development"}
					/>
				)}

				{/* Show skeleton loader while loading */}
				{isLoading && assignments.length === 0 ? (
					<div>
						<LoadingSpinner size="lg" text="Loading assignments..." />
						<div className="mt-6">
							<SkeletonLoader type="assignment" count={3} />
						</div>
					</div>
				) : (
					<AssignmentList
						assignments={assignments}
						onEdit={handleEdit}
						onDelete={handleDelete}
						onStatusChange={handleStatusChange}
						isLoading={isLoading}
					/>
				)}
			</div>
		</ErrorBoundary>
	);
};

export default AssignmentsPage;
