import React from "react";

const AssignmentsPage: React.FC = () => {
	return (
		<div>
			<div className="flex-between mb-8">
				<h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
				<button className="btn btn-primary">Add Assignment</button>
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
