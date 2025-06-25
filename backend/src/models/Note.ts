import { Note, CreateNoteDTO } from "../types";
import { notesDB } from "../database";
import { generateId, validateRequiredFields } from "../utils";

export class NoteModel {
	// Create new note
	static async create(data: CreateNoteDTO): Promise<Note> {
		// Validate required fields
		const requiredFields = ["title", "content", "subject"];
		const missingFields = validateRequiredFields(data, requiredFields);

		if (missingFields.length > 0) {
			throw new Error(
				`Missing required fields: ${missingFields.join(", ")}`
			);
		}

		// Create note object
		const note: Note = {
			id: generateId(),
			title: data.title.trim(),
			content: data.content.trim(),
			subject: data.subject.trim(),
			tags: data.tags || [],
			assignmentId: data.assignmentId,
			createdAt: new Date(),
			updatedAt: new Date(),
			lastAccessedAt: new Date(),
		};

		// Save to database
		return await notesDB.create(note);
	}

	// Get all notes
	static async getAll(): Promise<Note[]> {
		return await notesDB.readAll();
	}

	// Get note by ID
	static async getById(id: string): Promise<Note | null> {
		const note = await notesDB.findById(id);
		
		if (note) {
			// Update last accessed time
			await notesDB.updateById(id, {
				lastAccessedAt: new Date(),
			});
			return {
				...note,
				lastAccessedAt: new Date(),
			};
		}
		
		return null;
	}

	// Update note
	static async updateById(
		id: string,
		data: Partial<CreateNoteDTO>
	): Promise<Note | null> {
		const existingNote = await notesDB.findById(id);

		if (!existingNote) {
			return null;
		}

		// Prepare updates
		const updates: Partial<Note> = {
			updatedAt: new Date(),
			lastAccessedAt: new Date(),
		};

		// Copy fields that don't need conversion
		if (data.title !== undefined) updates.title = data.title.trim();
		if (data.content !== undefined) updates.content = data.content.trim();
		if (data.subject !== undefined) updates.subject = data.subject.trim();
		if (data.tags !== undefined) updates.tags = data.tags;
		if (data.assignmentId !== undefined) updates.assignmentId = data.assignmentId;

		return await notesDB.updateById(id, updates);
	}

	// Delete note
	static async deleteById(id: string): Promise<boolean> {
		return await notesDB.deleteById(id);
	}

	// Get notes by assignment ID
	static async getByAssignment(assignmentId: string): Promise<Note[]> {
		return await notesDB.findBy({ assignmentId });
	}

	// Get notes by subject
	static async getBySubject(subject: string): Promise<Note[]> {
		return await notesDB.findBy({ subject });
	}

	// Search notes
	static async search(query: string): Promise<Note[]> {
		const allNotes = await this.getAll();
		const searchTerm = query.toLowerCase();

		return allNotes.filter(
			(note) =>
				note.title.toLowerCase().includes(searchTerm) ||
				note.content.toLowerCase().includes(searchTerm) ||
				note.subject.toLowerCase().includes(searchTerm) ||
				note.tags.some((tag) =>
					tag.toLowerCase().includes(searchTerm)
				)
		);
	}

	// Get statistics
	static async getStats(): Promise<{
		total: number;
		bySubject: Record<string, number>;
		totalTags: number;
		uniqueTags: number;
		averageContentLength: number;
	}> {
		const notes = await this.getAll();
		
		// Group by subject
		const bySubject: Record<string, number> = {};
		const allTags: string[] = [];
		let totalContentLength = 0;

		notes.forEach(note => {
			bySubject[note.subject] = (bySubject[note.subject] || 0) + 1;
			allTags.push(...note.tags);
			totalContentLength += note.content.length;
		});

		const uniqueTags = new Set(allTags).size;

		return {
			total: notes.length,
			bySubject,
			totalTags: allTags.length,
			uniqueTags,
			averageContentLength: notes.length > 0 ? Math.round(totalContentLength / notes.length) : 0,
		};
	}
}