import React from "react";
import { Link } from "react-router-dom";

const HomePage: React.FC = () => {
	return (
		<div className="text-center">
			<h1 className="text-4xl font-bold text-gray-900 mb-8">
				Welcome to Academic Organizer
			</h1>
			<p className="text-xl text-gray-600 mb-8">
				Keep track of your assignments, notes, and academic progress
			</p>
			<div className="card-grid">
				<Link
					to="/dashboard"
					className="card"
					style={{ textDecoration: "none", color: "inherit" }}
				>
					<h3 className="text-xl font-semibold text-gray-900 mb-2">
						Dashboard
					</h3>
					<p className="text-gray-600">
						View your academic overview and upcoming deadlines
					</p>
				</Link>
				<Link
					to="/assignments"
					className="card"
					style={{ textDecoration: "none", color: "inherit" }}
				>
					<h3 className="text-xl font-semibold text-gray-900 mb-2">
						Assignments
					</h3>
					<p className="text-gray-600">
						Manage your assignments and track progress
					</p>
				</Link>
				<Link
					to="/notes"
					className="card"
					style={{ textDecoration: "none", color: "inherit" }}
				>
					<h3 className="text-xl font-semibold text-gray-900 mb-2">
						Notes
					</h3>
					<p className="text-gray-600">
						Create and organize your study notes
					</p>
				</Link>
			</div>
		</div>
	);
};

export default HomePage;
