import React, { useState } from "react";
import { Note, Assignment } from "../types";
import { format } from "date-fns";

interface NoteListProps {
	notes: Note[];
	assignments?: Assignment[];
	onEdit?: (note: Note) => void;
	onDelete?: (id: string) => void;
	isLoading?: boolean;
}

type SortField =
	| "title"
	| "subject"
	| "createdAt"
	| "updatedAt"
	| "lastAccessedAt";
type SortDirection = "asc" | "desc";

const NoteList: React.FC<NoteListProps> = ({
	notes,
	assignments = [],
	onEdit,
	onDelete,
	isLoading = false,
}) => {
	const [sortField, setSortField] = useState<SortField>("updatedAt");
	const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
	const [filterSubject, setFilterSubject] = useState<string>("all");
	const [searchQuery, setSearchQuery] = useState("");

	// Get unique subjects for filter
	const subjects = Array.from(
		new Set(notes.map((note) => note.subject))
	).sort();

	// Sort notes
	const sortedNotes = [...notes].sort((a, b) => {
		let aValue: any;
		let bValue: any;

		switch (sortField) {
			case "createdAt":
			case "updatedAt":
			case "lastAccessedAt":
				aValue = new Date(a[sortField]).getTime();
				bValue = new Date(b[sortField]).getTime();
				break;
			case "title":
			case "subject":
				aValue = a[sortField].toLowerCase();
				bValue = b[sortField].toLowerCase();
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

	// Filter notes
	const filteredNotes = sortedNotes.filter((note) => {
		const matchesSubject =
			filterSubject === "all" || note.subject === filterSubject;
		const matchesSearch =
			!searchQuery ||
			note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
			note.tags.some((tag) =>
				tag.toLowerCase().includes(searchQuery.toLowerCase())
			);

		return matchesSubject && matchesSearch;
	});

	const handleSort = (field: SortField) => {
		if (sortField === field) {
			setSortDirection(sortDirection === "asc" ? "desc" : "asc");
		} else {
			setSortField(field);
			setSortDirection("desc");
		}
	};

	const getSortIcon = (field: SortField) => {
		if (sortField !== field) return "↕️";
		return sortDirection === "asc" ? "↑" : "↓";
	};

	const getLinkedAssignment = (assignmentId?: string) => {
		return assignmentId
			? assignments.find((a) => a.id === assignmentId)
			: null;
	};

	const truncateContent = (content: string, maxLength: number = 200) => {
		if (content.length <= maxLength) return content;
		return content.slice(0, maxLength) + "...";
	};

	if (isLoading) {
		return (
			<div className="loading-container">
				<div className="loading-spinner"></div>
				<span className="loading-text">Loading notes...</span>
			</div>
		);
	}

	if (notes.length === 0) {
		return (
			<div className="empty-state">
				<div className="empty-icon">📝</div>
				<h3 className="empty-title">No notes yet</h3>
				<p className="empty-description">
					Create your first note to get started!
				</p>
			</div>
		);
	}

	return (
		<div className="note-list">
			{/* Controls */}
			<div className="note-controls">
				{/* Search */}
				<div className="control-group">
					<label className="control-label">Search:</label>
					<input
						type="text"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="form-input"
						placeholder="Search notes..."
					/>
				</div>

				{/* Filter by Subject */}
				<div className="control-group">
					<label className="control-label">Subject:</label>
					<select
						value={filterSubject}
						onChange={(e) => setFilterSubject(e.target.value)}
						className="form-select"
					>
						<option value="all">All Subjects</option>
						{subjects.map((subject) => (
							<option key={subject} value={subject}>
								{subject}
							</option>
						))}
					</select>
				</div>

				{/* Sort */}
				<div className="control-group">
					<label className="control-label">Sort by:</label>
					<select
						value={sortField}
						onChange={(e) => handleSort(e.target.value as SortField)}
						className="form-select"
					>
						<option value="updatedAt">Last Modified</option>
						<option value="createdAt">Date Created</option>
						<option value="lastAccessedAt">Last Accessed</option>
						<option value="title">Title</option>
						<option value="subject">Subject</option>
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

				{/* Results Count */}
				<div className="results-count">
					Showing {filteredNotes.length} of {notes.length} notes
				</div>
			</div>

			{/* Notes Grid */}
			<div className="notes-grid">
				{filteredNotes.map((note) => {
					const linkedAssignment = getLinkedAssignment(note.assignmentId);

					return (
						<div key={note.id} className="note-card">
							{/* Note Header */}
							<div className="note-header">
								<div className="note-title-section">
									<h3 className="note-title">{note.title}</h3>
									<p className="note-subject">{note.subject}</p>
								</div>

								{/* Action Buttons */}
								<div className="note-actions">
									{onEdit && (
										<button
											onClick={() => onEdit(note)}
											className="action-btn edit-btn"
											title="Edit note"
										>
											✏️
										</button>
									)}
									{onDelete && (
										<button
											onClick={() => onDelete(note.id)}
											className="action-btn delete-btn"
											title="Delete note"
										>
											🗑️
										</button>
									)}
								</div>
							</div>

							{/* Linked Assignment */}
							{linkedAssignment && (
								<div className="linked-assignment">
									<span className="link-icon">📎</span>
									<span className="assignment-link">
										{linkedAssignment.title}
									</span>
								</div>
							)}

							{/* Note Content Preview */}
							<div className="note-content">
								{truncateContent(note.content)}
							</div>

							{/* Tags */}
							{note.tags.length > 0 && (
								<div className="note-tags">
									{note.tags.map((tag, index) => (
										<span key={index} className="tag">
											{tag}
										</span>
									))}
								</div>
							)}

							{/* Note Footer */}
							<div className="note-footer">
								<div className="note-dates">
									<div className="note-date">
										📅 Created:{" "}
										{format(new Date(note.createdAt), "MMM d, yyyy")}
									</div>
									<div className="note-date">
										✏️ Modified:{" "}
										{format(new Date(note.updatedAt), "MMM d, yyyy")}
									</div>
									<div className="note-date">
										👁️ Accessed:{" "}
										{format(
											new Date(note.lastAccessedAt),
											"MMM d, yyyy"
										)}
									</div>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default NoteList;
