import { Router } from "express";
import {
	getAllAssignments,
	getAssignmentById,
	createAssignment,
	updateAssignment,
	deleteAssignment,
	updateAssignmentStatus,
	searchAssignments,
	getUpcomingAssignments,
	getOverdueAssignments,
} from "../controllers/assignmentController";

const router = Router();

// Special routes first (more specific)
router.get("/search", searchAssignments);
router.get("/upcoming", getUpcomingAssignments);
router.get("/overdue", getOverdueAssignments);

// General CRUD routes
router.get("/", getAllAssignments);
router.get("/:id", getAssignmentById);
router.post("/", createAssignment);
router.put("/:id", updateAssignment);
router.delete("/:id", deleteAssignment);

// Status update route
router.patch("/:id/status", updateAssignmentStatus);

export default router;
