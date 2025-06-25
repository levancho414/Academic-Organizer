import { Router } from "express";
import {
    getAllNotes,
    getNoteById,
    createNote,
    updateNote,
    deleteNote,
    searchNotes,
    getNotesByAssignment,
    getNotesStats,
} from "../controllers/noteController";
import {
    validateCreateNote,
    validateUpdateNote,
    validateNoteId,
    validateSearchQuery,
} from "../middleware/noteValidation";

const router = Router();

// Special routes first (more specific)
router.get("/search", validateSearchQuery, searchNotes);
router.get("/stats", getNotesStats);
router.get("/assignment/:assignmentId", getNotesByAssignment);

// General CRUD routes
router.get("/", getAllNotes);
router.get("/:id", validateNoteId, getNoteById);
router.post("/", validateCreateNote, createNote);
router.put("/:id", validateUpdateNote, updateNote);
router.delete("/:id", validateNoteId, deleteNote);

export default router;