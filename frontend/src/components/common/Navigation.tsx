import React from "react";
import { Link, useLocation } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle";

const Navigation: React.FC = () => {
	const location = useLocation();

	const navItems = [
		{ path: "/", label: "Home" },
		{ path: "/dashboard", label: "Dashboard" },
		{ path: "/assignments", label: "Assignments" },
		{ path: "/notes", label: "Notes" },
	];

	return (
		<nav className="nav">
			<div className="nav-container">
				<Link to="/" className="nav-brand">
					Academic Organizer
				</Link>
				<ul className="nav-links">
					{navItems.map((item) => (
						<li key={item.path}>
							<Link
								to={item.path}
								className={`nav-link ${
									location.pathname === item.path ? "active" : ""
								}`}
							>
								{item.label}
							</Link>
						</li>
					))}
				</ul>
				<DarkModeToggle />
			</div>
		</nav>
	);
};

export default Navigation;
