import React, { useState, useEffect } from "react";
import NoteForm from "../components/NoteForm";
import NoteList from "../components/NoteList";
import { Note, NoteFormData, Assignment } from "../types";
import { notesApi } from "../api/notes";
import { assignmentsApi } from "../api/assignments";

const NotesPage: React.FC = () => {
	const [notes, setNotes] = useState<Note[]>([]);
	const [assignments, setAssignments] = useState<Assignment[]>([]);
	const [showForm, setShowForm] = useState(false);
	const [editingNote, setEditingNote] = useState<Note | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Load notes and assignments on component mount
	useEffect(() => {
		loadData();
	}, []);

	const loadData = async () => {
		setIsLoading(true);
		try {
			const [notesData, assignmentsData] = await Promise.all([
				notesApi.getAll(),
				assignmentsApi.getAll(),
			]);
			setNotes(notesData);
			setAssignments(assignmentsData);
		} catch (error) {
			console.error("Error loading data:", error);
			setError("Failed to load notes. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleFormSubmit = async (data: NoteFormData) => {
		setIsLoading(true);
		try {
			if (editingNote) {
				const updated = await notesApi.update(editingNote.id, data);
				setNotes((prev) =>
					prev.map((note) => (note.id === editingNote.id ? updated : note))
				);
			} else {
				const newNote = await notesApi.create(data);
				setNotes((prev) => [newNote, ...prev]);
			}
			setShowForm(false);
			setEditingNote(null);
		} catch (error: any) {
			console.error("Error saving note:", error);
			setError("Failed to save note. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleFormCancel = () => {
		setShowForm(false);
		setEditingNote(null);
	};

	const handleEdit = (note: Note) => {
		setEditingNote(note);
		setShowForm(true);
	};

	const handleDelete = async (id: string) => {
		const note = notes.find((n) => n.id === id);
		const title = note ? note.title : "this note";

		if (
			!window.confirm(
				`Are you sure you want to delete "${title}"?\n\nThis action cannot be undone.`
			)
		) {
			return;
		}

		try {
			await notesApi.delete(id);
			setNotes((prev) => prev.filter((note) => note.id !== id));
		} catch (error: any) {
			console.error("Error deleting note:", error);
			setError("Failed to delete note. Please try again.");
		}
	};

	// Convert editing note to form data
	const getInitialFormData = (): Partial<NoteFormData> | undefined => {
		if (!editingNote) return undefined;
		return {
			title: editingNote.title,
			content: editingNote.content,
			subject: editingNote.subject,
			tags: editingNote.tags,
			assignmentId: editingNote.assignmentId,
		};
	};

	if (showForm) {
		return (
			<div>
				{error && (
					<div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
						<p className="text-red-800">{error}</p>
						<button
							onClick={() => setError(null)}
							className="mt-2 text-sm text-red-600 hover:text-red-800"
						>
							Dismiss
						</button>
					</div>
				)}
				<NoteForm
					onSubmit={handleFormSubmit}
					onCancel={handleFormCancel}
					initialData={getInitialFormData()}
					assignments={assignments}
					isLoading={isLoading}
				/>
			</div>
		);
	}

	return (
		<div>
			<div className="flex-between mb-8">
				<h1 className="text-3xl font-bold text-gray-900">Notes</h1>
				<button
					className="btn btn-success"
					onClick={() => setShowForm(true)}
				>
					Add Note
				</button>
			</div>

			{error && (
				<div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
					<p className="text-red-800">{error}</p>
					<button
						onClick={() => setError(null)}
						className="mt-2 text-sm text-red-600 hover:text-red-800"
					>
						Dismiss
					</button>
				</div>
			)}

			<NoteList
				notes={notes}
				assignments={assignments}
				onEdit={handleEdit}
				onDelete={handleDelete}
				isLoading={isLoading}
			/>
		</div>
	);
};

export default NotesPage;
