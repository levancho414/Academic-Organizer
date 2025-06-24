import { Request, Response } from "express";
import { Assignment, CreateAssignmentDTO, UpdateAssignmentDTO } from "../types";
import {
	successResponse,
	errorResponse,
	generateId,
	validateRequiredFields,
} from "../utils";

// In-memory storage for demo (replace with database later)
let assignments: Assignment[] = [];

/**
 * GET /api/assignments
 * Get all assignments
 */
export const getAllAssignments = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		res.json(
			successResponse(assignments, "Assignments retrieved successfully")
		);
	} catch (error) {
		res.status(500).json(errorResponse("Failed to retrieve assignments"));
	}
};

/**
 * GET /api/assignments/:id
 * Get assignment by ID
 */
export const getAssignmentById = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { id } = req.params;
		const assignment = assignments.find((a) => a.id === id);

		if (!assignment) {
			res.status(404).json(errorResponse("Assignment not found"));
			return;
		}

		res.json(
			successResponse(assignment, "Assignment retrieved successfully")
		);
	} catch (error) {
		res.status(500).json(errorResponse("Failed to retrieve assignment"));
	}
};

/**
 * POST /api/assignments
 * Create new assignment
 */
export const createAssignment = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const data: CreateAssignmentDTO = req.body;

		// Validate required fields
		const requiredFields = ["title", "subject", "dueDate", "estimatedHours"];
		const missingFields = validateRequiredFields(data, requiredFields);

		if (missingFields.length > 0) {
			res.status(400).json(
				errorResponse(
					`Missing required fields: ${missingFields.join(", ")}`
				)
			);
			return;
		}

		// Validate estimated hours
		if (data.estimatedHours <= 0) {
			res.status(400).json(
				errorResponse("Estimated hours must be greater than 0")
			);
			return;
		}

		// Create new assignment
		const newAssignment: Assignment = {
			id: generateId(),
			title: data.title.trim(),
			description: data.description?.trim() || "",
			subject: data.subject.trim(),
			dueDate: new Date(data.dueDate),
			priority: data.priority || "medium",
			status: "not-started",
			estimatedHours: data.estimatedHours,
			tags: data.tags || [],
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		assignments.push(newAssignment);

		res.status(201).json(
			successResponse(newAssignment, "Assignment created successfully")
		);
	} catch (error) {
		res.status(500).json(errorResponse("Failed to create assignment"));
	}
};

/**
 * PUT /api/assignments/:id
 * Update assignment
 */
export const updateAssignment = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { id } = req.params;
		const data: UpdateAssignmentDTO = req.body;

		const assignmentIndex = assignments.findIndex((a) => a.id === id);

		if (assignmentIndex === -1) {
			res.status(404).json(errorResponse("Assignment not found"));
			return;
		}

		// Update assignment
		const updatedAssignment: Assignment = {
			...assignments[assignmentIndex],
			...data,
			dueDate: data.dueDate
				? new Date(data.dueDate)
				: assignments[assignmentIndex].dueDate,
			updatedAt: new Date(),
		};

		assignments[assignmentIndex] = updatedAssignment;

		res.json(
			successResponse(updatedAssignment, "Assignment updated successfully")
		);
	} catch (error) {
		res.status(500).json(errorResponse("Failed to update assignment"));
	}
};

/**
 * DELETE /api/assignments/:id
 * Delete assignment
 */
export const deleteAssignment = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { id } = req.params;
		const assignmentIndex = assignments.findIndex((a) => a.id === id);

		if (assignmentIndex === -1) {
			res.status(404).json(errorResponse("Assignment not found"));
			return;
		}

		assignments.splice(assignmentIndex, 1);

		res.json(successResponse(null, "Assignment deleted successfully"));
	} catch (error) {
		res.status(500).json(errorResponse("Failed to delete assignment"));
	}
};

/**
 * PATCH /api/assignments/:id/status
 * Update assignment status
 */
export const updateAssignmentStatus = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { id } = req.params;
		const { status } = req.body;

		const validStatuses = [
			"not-started",
			"in-progress",
			"completed",
			"overdue",
		];

		if (!status || !validStatuses.includes(status)) {
			res.status(400).json(errorResponse("Invalid status"));
			return;
		}

		const assignmentIndex = assignments.findIndex((a) => a.id === id);

		if (assignmentIndex === -1) {
			res.status(404).json(errorResponse("Assignment not found"));
			return;
		}

		assignments[assignmentIndex].status = status;
		assignments[assignmentIndex].updatedAt = new Date();

		res.json(
			successResponse(
				assignments[assignmentIndex],
				"Assignment status updated successfully"
			)
		);
	} catch (error) {
		res.status(500).json(errorResponse("Failed to update assignment status"));
	}
};
