import React from "react";

const NotesPage: React.FC = () => {
	return (
		<div>
			<div className="flex-between mb-8">
				<h1 className="text-3xl font-bold text-gray-900">Notes</h1>
				<button className="btn btn-success">Add Note</button>
			</div>
			<div className="card">
				<p className="text-gray-600">
					No notes yet. Create your first note to get started!
				</p>
			</div>
		</div>
	);
};

export default NotesPage;
