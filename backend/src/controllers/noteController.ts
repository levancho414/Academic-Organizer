import { Request, Response } from "express";
import { CreateNoteDTO } from "../types";
import { successResponse } from "../utils";
import { NoteModel } from "../models/Note";
import { asyncHandler, AppError } from "../middleware/errorHandler";

/**
 * GET /api/notes
 * Get all notes with optional filtering
 */
export const getAllNotes = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		const { subject, assignmentId } = req.query;

		let notes = await NoteModel.getAll();

		// Apply filters
		if (subject) {
			notes = notes.filter((n) => 
				n.subject.toLowerCase().includes((subject as string).toLowerCase())
			);
		}

		if (assignmentId) {
			notes = notes.filter((n) => n.assignmentId === assignmentId);
		}

		// Sort by last updated (most recent first)
		notes.sort((a, b) => 
			new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
		);

		res.json(successResponse(notes, "Notes retrieved successfully"));
	}
);

/**
 * GET /api/notes/:id
 * Get note by ID
 */
export const getNoteById = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		const { id } = req.params;
		const note = await NoteModel.getById(id);

		if (!note) {
			throw new AppError("Note not found", 404);
		}

		res.json(successResponse(note, "Note retrieved successfully"));
	}
);

/**
 * POST /api/notes
 * Create new note
 */
export const createNote = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		const data: CreateNoteDTO = req.body;

		// Additional validation
		if (data.title.length > 200) {
			throw new AppError("Title must be 200 characters or less", 400);
		}

		if (data.content.length > 10000) {
			throw new AppError("Content must be 10,000 characters or less", 400);
		}

		if (data.subject.length > 100) {
			throw new AppError("Subject must be 100 characters or less", 400);
		}

		if (data.tags && data.tags.length > 20) {
			throw new AppError("Cannot have more than 20 tags", 400);
		}

		// Check for duplicate titles in the same subject (optional business rule)
		const existingNotes = await NoteModel.getBySubject(data.subject);
		const duplicateTitle = existingNotes.find(
			(n) => n.title.toLowerCase() === data.title.toLowerCase()
		);

		if (duplicateTitle) {
			console.warn(
				`Note with similar title "${data.title}" already exists in ${data.subject}`
			);
		}

		const newNote = await NoteModel.create(data);
		res.status(201).json(
			successResponse(newNote, "Note created successfully")
		);
	}
);

/**
 * PUT /api/notes/:id
 * Update note
 */
export const updateNote = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		const { id } = req.params;
		const data: Partial<CreateNoteDTO> = req.body;

		// Check if note exists
		const existingNote = await NoteModel.getById(id);
		if (!existingNote) {
			throw new AppError("Note not found", 404);
		}

		// Additional validation
		if (data.title && data.title.length > 200) {
			throw new AppError("Title must be 200 characters or less", 400);
		}

		if (data.content && data.content.length > 10000) {
			throw new AppError("Content must be 10,000 characters or less", 400);
		}

		if (data.subject && data.subject.length > 100) {
			throw new AppError("Subject must be 100 characters or less", 400);
		}

		if (data.tags && data.tags.length > 20) {
			throw new AppError("Cannot have more than 20 tags", 400);
		}

		const updatedNote = await NoteModel.updateById(id, data);

		if (!updatedNote) {
			throw new AppError("Failed to update note", 500);
		}

		res.json(successResponse(updatedNote, "Note updated successfully"));
	}
);

/**
 * DELETE /api/notes/:id
 * Delete note
 */
export const deleteNote = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		const { id } = req.params;

		// Check if note exists
		const existingNote = await NoteModel.getById(id);
		if (!existingNote) {
			throw new AppError("Note not found", 404);
		}

		const deleted = await NoteModel.deleteById(id);

		if (!deleted) {
			throw new AppError("Failed to delete note", 500);
		}

		res.json(successResponse(null, "Note deleted successfully"));
	}
);

/**
 * GET /api/notes/search?q=query
 * Search notes
 */
export const searchNotes = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		const { q } = req.query;

		if (!q || (q as string).trim().length === 0) {
			throw new AppError("Search query cannot be empty", 400);
		}

		const notes = await NoteModel.search(q as string);

		res.json(
			successResponse(notes, `Found ${notes.length} notes matching "${q}"`)
		);
	}
);

/**
 * GET /api/notes/assignment/:assignmentId
 * Get notes by assignment ID
 */
export const getNotesByAssignment = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		const { assignmentId } = req.params;
		const notes = await NoteModel.getByAssignment(assignmentId);

		res.json(
			successResponse(
				notes,
				`Found ${notes.length} notes for assignment`
			)
		);
	}
);

/**
 * GET /api/notes/stats
 * Get notes statistics
 */
export const getNotesStats = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		const stats = await NoteModel.getStats();
		res.json(successResponse(stats, "Notes statistics retrieved successfully"));
	}
);