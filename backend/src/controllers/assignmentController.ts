import { Request, Response } from "express";
import { CreateAssignmentDTO, UpdateAssignmentDTO } from "../types";
import { successResponse, errorResponse } from "../utils";
import { AssignmentModel } from "../models/Assignment";

/**
 * GET /api/assignments
 * Get all assignments
 */
export const getAllAssignments = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const assignments = await AssignmentModel.getAll();
		res.json(
			successResponse(assignments, "Assignments retrieved successfully")
		);
	} catch (error) {
		console.error("Error getting assignments:", error);
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
		const assignment = await AssignmentModel.getById(id);

		if (!assignment) {
			res.status(404).json(errorResponse("Assignment not found"));
			return;
		}

		res.json(
			successResponse(assignment, "Assignment retrieved successfully")
		);
	} catch (error) {
		console.error("Error getting assignment:", error);
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
		const newAssignment = await AssignmentModel.create(data);
		res.status(201).json(
			successResponse(newAssignment, "Assignment created successfully")
		);
	} catch (error) {
		console.error("Error creating assignment:", error);
		const message =
			error instanceof Error ? error.message : "Failed to create assignment";
		res.status(400).json(errorResponse(message));
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

		const updatedAssignment = await AssignmentModel.updateById(id, data);

		if (!updatedAssignment) {
			res.status(404).json(errorResponse("Assignment not found"));
			return;
		}

		res.json(
			successResponse(updatedAssignment, "Assignment updated successfully")
		);
	} catch (error) {
		console.error("Error updating assignment:", error);
		const message =
			error instanceof Error ? error.message : "Failed to update assignment";
		res.status(400).json(errorResponse(message));
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
		const deleted = await AssignmentModel.deleteById(id);

		if (!deleted) {
			res.status(404).json(errorResponse("Assignment not found"));
			return;
		}

		res.json(successResponse(null, "Assignment deleted successfully"));
	} catch (error) {
		console.error("Error deleting assignment:", error);
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

		const updatedAssignment = await AssignmentModel.updateStatus(id, status);

		if (!updatedAssignment) {
			res.status(404).json(errorResponse("Assignment not found"));
			return;
		}

		res.json(
			successResponse(
				updatedAssignment,
				"Assignment status updated successfully"
			)
		);
	} catch (error) {
		console.error("Error updating assignment status:", error);
		const message =
			error instanceof Error
				? error.message
				: "Failed to update assignment status";
		res.status(400).json(errorResponse(message));
	}
};

/**
 * GET /api/assignments/search?q=query
 * Search assignments
 */
export const searchAssignments = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { q } = req.query;

		if (!q || typeof q !== "string") {
			res.status(400).json(errorResponse("Search query is required"));
			return;
		}

		const assignments = await AssignmentModel.search(q);
		res.json(
			successResponse(assignments, `Found ${assignments.length} assignments`)
		);
	} catch (error) {
		console.error("Error searching assignments:", error);
		res.status(500).json(errorResponse("Failed to search assignments"));
	}
};

/**
 * GET /api/assignments/upcoming
 * Get upcoming assignments
 */
export const getUpcomingAssignments = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const assignments = await AssignmentModel.getUpcoming();
		res.json(
			successResponse(
				assignments,
				"Upcoming assignments retrieved successfully"
			)
		);
	} catch (error) {
		console.error("Error getting upcoming assignments:", error);
		res.status(500).json(
			errorResponse("Failed to retrieve upcoming assignments")
		);
	}
};

/**
 * GET /api/assignments/overdue
 * Get overdue assignments
 */
export const getOverdueAssignments = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const assignments = await AssignmentModel.getOverdue();
		res.json(
			successResponse(
				assignments,
				"Overdue assignments retrieved successfully"
			)
		);
	} catch (error) {
		console.error("Error getting overdue assignments:", error);
		res.status(500).json(
			errorResponse("Failed to retrieve overdue assignments")
		);
	}
};
