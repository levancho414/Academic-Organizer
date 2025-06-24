import { Router } from "express";
import {
	getAllAssignments,
	getAssignmentById,
	createAssignment,
	updateAssignment,
	deleteAssignment,
	updateAssignmentStatus,
} from "../controllers/assignmentController";

const router = Router();


router.get("/", getAllAssignments);


router.get("/:id", getAssignmentById);


router.post("/", createAssignment);


router.put("/:id", updateAssignment);


router.delete("/:id", deleteAssignment);


router.patch("/:id/status", updateAssignmentStatus);

export default router;
