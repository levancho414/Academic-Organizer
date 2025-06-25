import React, { useState } from "react";
import { Assignment } from "../types";
import { format, isToday, isTomorrow, isPast } from "date-fns";

interface AssignmentListProps {
	assignments: Assignment[];
	onEdit?: (assignment: Assignment) => void;
	onDelete?: (id: string) => void;
	onStatusChange?: (id: string, status: Assignment["status"]) => void;
	isLoading?: boolean;
}

type SortField = "dueDate" | "priority" | "title" | "status" | "createdAt";
type SortDirection = "asc" | "desc";

const AssignmentList: React.FC<AssignmentListProps> = ({
	assignments,
	onEdit,
	onDelete,
	onStatusChange,
	isLoading = false,
}) => {
	const [sortField, setSortField] = useState<SortField>("dueDate");
	const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
	const [filterStatus, setFilterStatus] = useState<
		Assignment["status"] | "all"
	>("all");

	// Sort assignments based on current sort settings
	const sortedAssignments = [...assignments].sort((a, b) => {
		let aValue: any;
		let bValue: any;

		switch (sortField) {
			case "dueDate":
				aValue = new Date(a.dueDate).getTime();
				bValue = new Date(b.dueDate).getTime();
				break;
			case "priority":
				const priorityOrder = { high: 3, medium: 2, low: 1 };
				aValue = priorityOrder[a.priority];
				bValue = priorityOrder[b.priority];
				break;
			case "title":
				aValue = a.title.toLowerCase();
				bValue = b.title.toLowerCase();
				break;
			case "status":
				const statusOrder = {
					"not-started": 1,
					"in-progress": 2,
					completed: 3,
					overdue: 4,
				};
				aValue = statusOrder[a.status];
				bValue = statusOrder[b.status];
				break;
			case "createdAt":
				aValue = new Date(a.createdAt).getTime();
				bValue = new Date(b.createdAt).getTime();
				break;
			default:
				aValue = a[sortField];
				bValue = b[sortField];
		}

		if (sortDirection === "desc") {
			return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
		}
		return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
	});

	// Filter assignments by status
	const filteredAssignments = sortedAssignments.filter(
		(assignment) =>
			filterStatus === "all" || assignment.status === filterStatus
	);

	const handleSort = (field: SortField) => {
		if (sortField === field) {
			setSortDirection(sortDirection === "asc" ? "desc" : "asc");
		} else {
			setSortField(field);
			setSortDirection("asc");
		}
	};

	const getPriorityColor = (priority: Assignment["priority"]) => {
		switch (priority) {
			case "high":
				return "priority-high";
			case "medium":
				return "priority-medium";
			case "low":
				return "priority-low";
			default:
				return "priority-default";
		}
	};

	const getStatusColor = (status: Assignment["status"]) => {
		switch (status) {
			case "completed":
				return "status-completed";
			case "in-progress":
				return "status-in-progress";
			case "not-started":
				return "status-not-started";
			case "overdue":
				return "status-overdue";
			default:
				return "status-default";
		}
	};

	const formatDueDate = (dueDate: Date) => {
		const date = new Date(dueDate);

		if (isToday(date)) {
			return "Today";
		} else if (isTomorrow(date)) {
			return "Tomorrow";
		} else if (isPast(date)) {
			return `${format(date, "MMM d")} (Overdue)`;
		} else {
			return format(date, "MMM d, yyyy");
		}
	};

	const getDueDateStyle = (dueDate: Date, status: Assignment["status"]) => {
		const date = new Date(dueDate);

		if (status === "completed") {
			return "due-date-completed";
		} else if (isPast(date)) {
			return "due-date-overdue";
		} else if (isToday(date) || isTomorrow(date)) {
			return "due-date-urgent";
		}
		return "due-date-normal";
	};

	const getSortIcon = (field: SortField) => {
		if (sortField !== field) {
			return "↕️";
		}
		return sortDirection === "asc" ? "↑" : "↓";
	};

	if (isLoading) {
		return (
			<div className="loading-container">
				<div className="loading-spinner"></div>
				<span className="loading-text">Loading assignments...</span>
			</div>
		);
	}

	if (assignments.length === 0) {
		return (
			<div className="empty-state">
				<div className="empty-icon">📝</div>
				<h3 className="empty-title">No assignments yet</h3>
				<p className="empty-description">
					Create your first assignment to get started!
				</p>
			</div>
		);
	}

	return (
		<div className="assignment-list">
			{/* Controls */}
			<div className="assignment-controls">
				{/* Sort Controls */}
				<div className="control-group">
					<label className="control-label">Sort by:</label>
					<select
						value={sortField}
						onChange={(e) => handleSort(e.target.value as SortField)}
						className="form-select text-sm"
					>
						<option value="dueDate">Due Date</option>
						<option value="priority">Priority</option>
						<option value="title">Title</option>
						<option value="status">Status</option>
						<option value="createdAt">Created</option>
					</select>
					<button
						onClick={() =>
							setSortDirection(sortDirection === "asc" ? "desc" : "asc")
						}
						className="sort-direction-btn"
						title={`Sort ${
							sortDirection === "asc" ? "Descending" : "Ascending"
						}`}
					>
						{getSortIcon(sortField)}
					</button>
				</div>

				{/* Filter Controls */}
				<div className="control-group">
					<label className="control-label">Filter:</label>
					<select
						value={filterStatus}
						onChange={(e) =>
							setFilterStatus(
								e.target.value as Assignment["status"] | "all"
							)
						}
						className="form-select text-sm"
					>
						<option value="all">All Status</option>
						<option value="not-started">Not Started</option>
						<option value="in-progress">In Progress</option>
						<option value="completed">Completed</option>
						<option value="overdue">Overdue</option>
					</select>
				</div>

				{/* Results Count */}
				<div className="results-count">
					Showing {filteredAssignments.length} of {assignments.length}{" "}
					assignments
				</div>
			</div>

			{/* Assignment Cards */}
			<div className="assignment-cards">
				{filteredAssignments.map((assignment) => (
					<div key={assignment.id} className="assignment-card">
						{/* Header */}
						<div className="assignment-header">
							<div className="assignment-title-section">
								<h3 className="assignment-title">{assignment.title}</h3>
								<p className="assignment-subject">
									{assignment.subject}
								</p>
							</div>

							{/* Priority Badge */}
							<div
								className={`priority-badge ${getPriorityColor(
									assignment.priority
								)}`}
							>
								{assignment.priority.toUpperCase()}
							</div>
						</div>

						{/* Description */}
						{assignment.description && (
							<p className="assignment-description">
								{assignment.description}
							</p>
						)}

						{/* Tags */}
						{assignment.tags.length > 0 && (
							<div className="assignment-tags">
								{assignment.tags.map((tag, index) => (
									<span key={index} className="tag">
										{tag}
									</span>
								))}
							</div>
						)}

						{/* Footer */}
						<div className="assignment-footer">
							{/* Left side - Due date and time info */}
							<div className="assignment-meta">
								<div
									className={`due-date ${getDueDateStyle(
										assignment.dueDate,
										assignment.status
									)}`}
								>
									📅 {formatDueDate(assignment.dueDate)}
								</div>
								<div className="time-info">
									⏱️ {assignment.estimatedHours}h estimated
									{assignment.actualHours &&
										` • ${assignment.actualHours}h actual`}
								</div>
							</div>

							{/* Right side - Status and actions */}
							<div className="assignment-actions">
								{/* Status Select */}
								<select
									value={assignment.status}
									onChange={(e) =>
										onStatusChange?.(
											assignment.id,
											e.target.value as Assignment["status"]
										)
									}
									className={`status-select ${getStatusColor(
										assignment.status
									)}`}
									disabled={!onStatusChange}
								>
									<option value="not-started">Not Started</option>
									<option value="in-progress">In Progress</option>
									<option value="completed">Completed</option>
									<option value="overdue">Overdue</option>
								</select>

								{/* Action Buttons */}
								<div className="action-buttons">
									{onEdit && (
										<button
											onClick={() => onEdit(assignment)}
											className="action-btn edit-btn"
											title="Edit assignment"
										>
											✏️
										</button>
									)}
									{onDelete && (
										<button
											onClick={() => onDelete(assignment.id)}
											className="action-btn delete-btn"
											title="Delete assignment"
										>
											🗑️
										</button>
									)}
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default AssignmentList;
