import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Assignment, Note } from "../types";
import { assignmentsApi } from "../api/assignments";
import { notesApi } from "../api/notes";
import {
	format,
	isToday,
	isTomorrow,
	isPast,
	differenceInDays,
	addDays,
} from "date-fns";

const DashboardPage: React.FC = () => {
	const [assignments, setAssignments] = useState<Assignment[]>([]);
	const [notes, setNotes] = useState<Note[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		loadDashboardData();
	}, []);

	const loadDashboardData = async () => {
		setIsLoading(true);
		try {
			const [assignmentsData, notesData] = await Promise.all([
				assignmentsApi.getAll(),
				notesApi.getAll(),
			]);
			setAssignments(Array.isArray(assignmentsData) ? assignmentsData : []);
			setNotes(Array.isArray(notesData) ? notesData : []);
		} catch (error) {
			console.error("Error loading dashboard data:", error);
			setError("Failed to load dashboard data");
		} finally {
			setIsLoading(false);
		}
	};

	// Calculate statistics
	const stats = {
		total: assignments.length,
		completed: assignments.filter((a) => a.status === "completed").length,
		inProgress: assignments.filter((a) => a.status === "in-progress").length,
		overdue: assignments.filter((a) => a.status === "overdue").length,
		notStarted: assignments.filter((a) => a.status === "not-started").length,
		totalNotes: notes.length,
		totalEstimatedHours: assignments.reduce(
			(sum, a) => sum + a.estimatedHours,
			0
		),
		totalActualHours: assignments.reduce(
			(sum, a) => sum + (a.actualHours || 0),
			0
		),
	};

	const completionRate =
		stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

	// Get upcoming assignments (next 7 days)
	const upcomingAssignments = assignments
		.filter((a) => {
			const dueDate = new Date(a.dueDate);
			const today = new Date();
			const inSevenDays = addDays(today, 7);
			return (
				dueDate >= today &&
				dueDate <= inSevenDays &&
				a.status !== "completed"
			);
		})
		.sort(
			(a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
		)
		.slice(0, 5);

	// Get overdue assignments
	const overdueAssignments = assignments
		.filter((a) => isPast(new Date(a.dueDate)) && a.status !== "completed")
		.sort(
			(a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
		)
		.slice(0, 3);

	// Get recent notes (last 5)
	const recentNotes = notes
		.sort(
			(a, b) =>
				new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
		)
		.slice(0, 5);

	const getDueDateWarning = (dueDate: Date, status: Assignment["status"]) => {
		if (status === "completed") return null;

		const date = new Date(dueDate);
		const daysUntilDue = differenceInDays(date, new Date());

		if (isPast(date)) {
			return {
				type: "overdue",
				message: "OVERDUE",
				class: "warning-overdue",
			};
		} else if (isToday(date)) {
			return { type: "today", message: "DUE TODAY", class: "warning-today" };
		} else if (isTomorrow(date)) {
			return {
				type: "tomorrow",
				message: "DUE TOMORROW",
				class: "warning-tomorrow",
			};
		} else if (daysUntilDue <= 3) {
			return {
				type: "soon",
				message: `${daysUntilDue} DAYS LEFT`,
				class: "warning-soon",
			};
		}
		return null;
	};

	const formatDueDate = (dueDate: Date) => {
		const date = new Date(dueDate);
		if (isToday(date)) return "Today";
		if (isTomorrow(date)) return "Tomorrow";
		return format(date, "MMM d");
	};

	const getPriorityIcon = (priority: Assignment["priority"]) => {
		switch (priority) {
			case "high":
				return "🔴";
			case "medium":
				return "🟡";
			case "low":
				return "🟢";
			default:
				return "⚪";
		}
	};

	if (isLoading) {
		return (
			<div className="loading-container">
				<div className="loading-spinner"></div>
				<span className="loading-text">Loading dashboard...</span>
			</div>
		);
	}

	return (
		<div className="dashboard">
			<div className="dashboard-header">
				<h1 className="dashboard-title">Dashboard</h1>
				<p className="dashboard-subtitle">
					Welcome back! Here's your academic overview
				</p>
			</div>

			{error && (
				<div className="error-banner">
					<p className="error-text">{error}</p>
					<button onClick={() => setError(null)} className="error-close">
						✕
					</button>
				</div>
			)}

			{/* Stats Overview */}
			<div className="stats-section">
				<h2 className="section-title">Overview</h2>
				<div className="stats-grid">
					<div className="stat-card">
						<div className="stat-icon">📚</div>
						<div className="stat-content">
							<div className="stat-number">{stats.total}</div>
							<div className="stat-label">Total Assignments</div>
						</div>
					</div>
					<div className="stat-card">
						<div className="stat-icon">✅</div>
						<div className="stat-content">
							<div className="stat-number text-green-600">
								{stats.completed}
							</div>
							<div className="stat-label">Completed</div>
						</div>
					</div>
					<div className="stat-card">
						<div className="stat-icon">⚡</div>
						<div className="stat-content">
							<div className="stat-number text-blue-600">
								{stats.inProgress}
							</div>
							<div className="stat-label">In Progress</div>
						</div>
					</div>
					<div className="stat-card">
						<div className="stat-icon">⚠️</div>
						<div className="stat-content">
							<div className="stat-number text-red-600">
								{stats.overdue}
							</div>
							<div className="stat-label">Overdue</div>
						</div>
					</div>
					<div className="stat-card">
						<div className="stat-icon">📝</div>
						<div className="stat-content">
							<div className="stat-number text-purple-600">
								{stats.totalNotes}
							</div>
							<div className="stat-label">Notes</div>
						</div>
					</div>
					<div className="stat-card">
						<div className="stat-icon">⏱️</div>
						<div className="stat-content">
							<div className="stat-number text-orange-600">
								{stats.totalEstimatedHours}h
							</div>
							<div className="stat-label">Est. Hours</div>
						</div>
					</div>
				</div>

				{/* Progress Bar */}
				<div className="progress-section">
					<div className="progress-header">
						<h3 className="progress-title">Overall Progress</h3>
						<span className="progress-percentage">
							{completionRate.toFixed(1)}%
						</span>
					</div>
					<div className="progress-bar">
						<div
							className="progress-fill"
							style={{ width: `${completionRate}%` }}
						></div>
					</div>
					<div className="progress-details">
						<span className="progress-detail">
							{stats.completed} of {stats.total} assignments completed
						</span>
					</div>
				</div>
			</div>

			{/* Main Content Grid */}
			<div className="dashboard-grid">
				{/* Overdue Assignments (High Priority) */}
				{overdueAssignments.length > 0 && (
					<div className="dashboard-card urgent">
						<div className="card-header">
							<h3 className="card-title">⚠️ Overdue Assignments</h3>
							<Link to="/assignments" className="card-link">
								View All
							</Link>
						</div>
						<div className="assignments-list">
							{overdueAssignments.map((assignment) => (
								<div
									key={assignment.id}
									className="assignment-item overdue"
								>
									<div className="assignment-content">
										<div className="assignment-title">
											{assignment.title}
										</div>
										<div className="assignment-subject">
											{assignment.subject}
										</div>
									</div>
									<div className="assignment-meta">
										<div className="assignment-priority">
											{getPriorityIcon(assignment.priority)}
										</div>
										<div className="assignment-due overdue-text">
											{format(new Date(assignment.dueDate), "MMM d")}
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Upcoming Assignments */}
				<div className="dashboard-card">
					<div className="card-header">
						<h3 className="card-title">📅 Upcoming Assignments</h3>
						<Link to="/assignments" className="card-link">
							View All
						</Link>
					</div>
					{upcomingAssignments.length > 0 ? (
						<div className="assignments-list">
							{upcomingAssignments.map((assignment) => {
								const warning = getDueDateWarning(
									new Date(assignment.dueDate),
									assignment.status
								);
								return (
									<div key={assignment.id} className="assignment-item">
										<div className="assignment-content">
											<div className="assignment-title">
												{assignment.title}
											</div>
											<div className="assignment-subject">
												{assignment.subject}
											</div>
											{warning && (
												<div
													className={`due-warning ${warning.class}`}
												>
													{warning.message}
												</div>
											)}
										</div>
										<div className="assignment-meta">
											<div className="assignment-priority">
												{getPriorityIcon(assignment.priority)}
											</div>
											<div className="assignment-due">
												{formatDueDate(
													new Date(assignment.dueDate)
												)}
											</div>
										</div>
									</div>
								);
							})}
						</div>
					) : (
						<div className="empty-message">
							<div className="empty-icon">🎉</div>
							<p>No upcoming assignments! You're all caught up.</p>
						</div>
					)}
				</div>

				{/* Recent Notes */}
				<div className="dashboard-card">
					<div className="card-header">
						<h3 className="card-title">📝 Recent Notes</h3>
						<Link to="/notes" className="card-link">
							View All
						</Link>
					</div>
					{recentNotes.length > 0 ? (
						<div className="notes-list">
							{recentNotes.map((note) => (
								<div key={note.id} className="note-item">
									<div className="note-content">
										<div className="note-title">{note.title}</div>
										<div className="note-subject">{note.subject}</div>
									</div>
									<div className="note-date">
										{format(new Date(note.updatedAt), "MMM d")}
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="empty-message">
							<div className="empty-icon">📝</div>
							<p>No notes yet. Create your first note!</p>
							<Link to="/notes" className="btn btn-primary btn-sm">
								Add Note
							</Link>
						</div>
					)}
				</div>

				{/* Quick Actions */}
				<div className="dashboard-card">
					<div className="card-header">
						<h3 className="card-title">⚡ Quick Actions</h3>
					</div>
					<div className="quick-actions">
						<Link to="/assignments" className="quick-action">
							<div className="action-icon">➕</div>
							<div className="action-text">New Assignment</div>
						</Link>
						<Link to="/notes" className="quick-action">
							<div className="action-icon">📝</div>
							<div className="action-text">New Note</div>
						</Link>
						<button onClick={loadDashboardData} className="quick-action">
							<div className="action-icon">🔄</div>
							<div className="action-text">Refresh</div>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DashboardPage;
