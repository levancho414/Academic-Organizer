import React from "react";
import Navigation from "./Navigation";

interface LayoutProps {
	children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
	return (
		<div>
			<Navigation />
			<main className="main-content">
				<div className="container">{children}</div>
			</main>
		</div>
	);
};

export default Layout;
