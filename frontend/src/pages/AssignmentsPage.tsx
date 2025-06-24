// pages/AssignmentsPage.tsx
import React, { useState } from "react";
import AssignmentForm from "../components/AssignmentForm";
import { AssignmentFormData } from "../types";

const AssignmentsPage: React.FC = () => {
	const [showForm, setShowForm] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handleFormSubmit = async (data: AssignmentFormData) => {
		setIsLoading(true);

		try {
			// TODO: Replace with actual API call using axios
			console.log("Assignment data to submit:", data);

			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Close form after successful submission
			setShowForm(false);

			// TODO: Refresh assignments list
			// TODO: Show success message
		} catch (error) {
			console.error("Error creating assignment:", error);
			// TODO: Show error message
		} finally {
			setIsLoading(false);
		}
	};

	const handleFormCancel = () => {
		setShowForm(false);
	};

	if (showForm) {
		return (
			<div>
				<AssignmentForm
					onSubmit={handleFormSubmit}
					onCancel={handleFormCancel}
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

			<div className="card">
				<p className="text-gray-600">
					No assignments yet. Create your first assignment to get started!
				</p>
			</div>
		</div>
	);
};

export default AssignmentsPage;
