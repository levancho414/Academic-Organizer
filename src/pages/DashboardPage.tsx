import React from "react";

const DashboardPage: React.FC = () => {
	return (
		<div>
			<h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
			<div className="stats-grid">
				<div className="stat-card">
					<h3 className="text-lg font-semibold text-gray-900">
						Total Assignments
					</h3>
					<div className="stat-number text-blue-600">0</div>
				</div>
				<div className="stat-card">
					<h3 className="text-lg font-semibold text-gray-900">
						Completed
					</h3>
					<div className="stat-number text-green-600">0</div>
				</div>
				<div className="stat-card">
					<h3 className="text-lg font-semibold text-gray-900">
						In Progress
					</h3>
					<div className="stat-number text-yellow-600">0</div>
				</div>
				<div className="stat-card">
					<h3 className="text-lg font-semibold text-gray-900">Overdue</h3>
					<div className="stat-number text-red-600">0</div>
				</div>
			</div>

			<div className="card">
				<h2 className="text-2xl font-bold mb-4">Upcoming Assignments</h2>
				<p className="text-gray-600">
					No upcoming assignments. Great job staying on top of your work!
				</p>
			</div>
		</div>
	);
};

export default DashboardPage;
