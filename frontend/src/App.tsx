import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/common/Layout";
import HomePage from "./pages/HomePage";
import AssignmentsPage from "./pages/AssignmentsPage";
import NotesPage from "./pages/NotesPage";
import DashboardPage from "./pages/DashboardPage";
import "./styles/index.css";

function App() {
	return (
		<Router>
			<Layout>
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/dashboard" element={<DashboardPage />} />
					<Route path="/assignments" element={<AssignmentsPage />} />
					<Route path="/notes" element={<NotesPage />} />
				</Routes>
			</Layout>
		</Router>
	);
}

export default App;
