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
import {
	validateCreateAssignment,
	validateUpdateAssignment,
	validateAssignmentId,
	validateStatusUpdate,
	validateSearchQuery,
	validatePagination,
	validateDateRange,
} from "../middleware/validation";

const router = Router();

// Special routes first (more specific) with validation
router.get(
	"/search",
	validateSearchQuery,
	validatePagination,
	searchAssignments
);
router.get(
	"/upcoming",
	validatePagination,
	validateDateRange,
	getUpcomingAssignments
);
router.get(
	"/overdue",
	validatePagination,
	validateDateRange,
	getOverdueAssignments
);

// General CRUD routes with validation
router.get("/", validatePagination, validateDateRange, getAllAssignments);
router.get("/:id", validateAssignmentId, getAssignmentById);
router.post("/", validateCreateAssignment, createAssignment);
router.put("/:id", validateUpdateAssignment, updateAssignment);
router.delete("/:id", validateAssignmentId, deleteAssignment);

// Status update route with validation
router.patch("/:id/status", validateStatusUpdate, updateAssignmentStatus);

export default router;
