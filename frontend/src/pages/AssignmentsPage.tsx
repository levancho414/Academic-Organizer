import React, { useState, useEffect } from "react";
import AssignmentForm from "../components/AssignmentForm";
import AssignmentList from "../components/AssignmentList";
import { Assignment, AssignmentFormData } from "../types";
import { assignmentsApi } from "../api/assignments";

const AssignmentsPage: React.FC = () => {
	const [assignments, setAssignments] = useState<Assignment[]>([]);
	const [showForm, setShowForm] = useState(false);
	const [editingAssignment, setEditingAssignment] =
		useState<Assignment | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Load assignments on component mount
	useEffect(() => {
		loadAssignments();
	}, []);

	const loadAssignments = async () => {
		setIsLoading(true);
		try {
			const data = await assignmentsApi.getAll();
			setAssignments(data);
		} catch (error) {
			console.error("Error loading assignments:", error);
			setError("Failed to load assignments. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleFormSubmit = async (data: AssignmentFormData) => {
		setIsLoading(true);
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
			setError("Failed to save assignment. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleFormCancel = () => {
		setShowForm(false);
		setEditingAssignment(null);
	};

	const handleEdit = (assignment: Assignment) => {
		setEditingAssignment(assignment);
		setShowForm(true);
	};

	const handleDelete = async (id: string) => {
		// Find the assignment to show in confirmation
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

			// Show success feedback
			console.log(`Assignment "${assignmentTitle}" deleted successfully`);
		} catch (error: any) {
			console.error("Error deleting assignment:", error);
			setError(`Failed to delete "${assignmentTitle}". Please try again.`);
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
		} catch (error: any) {
			console.error("Error updating status:", error);
			setError("Failed to update status. Please try again.");
		}
	};

	// Convert editing assignment to form data
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

	if (showForm) {
		return (
			<div>
				{error && (
					<div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
						<p className="text-red-800">{error}</p>
						<button
							onClick={() => setError(null)}
							className="mt-2 text-sm text-red-600 hover:text-red-800"
						>
							Dismiss
						</button>
					</div>
				)}
				<AssignmentForm
					onSubmit={handleFormSubmit}
					onCancel={handleFormCancel}
					initialData={getInitialFormData()}
					isLoading={isLoading}
				/>
			</div>
		);
	}

	return (
		<div>
			<div className="flex-between mb-8">
				<h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
				<button
					className="btn btn-primary"
					onClick={() => setShowForm(true)}
				>
					Add Assignment
				</button>
			</div>

			{error && (
				<div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
					<p className="text-red-800">{error}</p>
					<button
						onClick={() => setError(null)}
						className="mt-2 text-sm text-red-600 hover:text-red-800"
					>
						Dismiss
					</button>
				</div>
			)}

			<AssignmentList
				assignments={assignments}
				onEdit={handleEdit}
				onDelete={handleDelete}
				onStatusChange={handleStatusChange}
				isLoading={isLoading}
			/>
		</div>
	);
};

export default AssignmentsPage;
