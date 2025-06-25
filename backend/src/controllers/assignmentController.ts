import { Request, Response, NextFunction } from "express";
import {
	CreateAssignmentDTO,
	UpdateAssignmentDTO,
	GetAssignmentsRequest,
	SearchAssignmentsRequest,
} from "../types";
import { successResponse, errorResponse } from "../utils";
import { AssignmentModel } from "../models/Assignment";
import { asyncHandler, AppError } from "../middleware/errorHandler";

/**
 * GET /api/assignments
 * Get all assignments with optional filtering and pagination
 */
export const getAllAssignments = asyncHandler(
	async (req: GetAssignmentsRequest, res: Response): Promise<void> => {
		const {
			page = "1",
			limit = "10",
			status,
			priority,
			subject,
			tags,
			startDate,
			endDate,
			sortBy = "dueDate",
			sortOrder = "asc",
		} = req.query;

		// Convert pagination params
		const pageNum = parseInt(page);
		const limitNum = parseInt(limit);
		const offset = (pageNum - 1) * limitNum;

		// Get all assignments
		let assignments = await AssignmentModel.getAll();

		// Apply filters
		if (status) {
			assignments = assignments.filter((a) => a.status === status);
		}
		if (priority) {
			assignments = assignments.filter((a) => a.priority === priority);
		}
		if (subject) {
			assignments = assignments.filter((a) =>
				a.subject.toLowerCase().includes(subject.toLowerCase())
			);
		}
		if (tags) {
			const tagArray = tags.split(",").map((t) => t.trim().toLowerCase());
			assignments = assignments.filter((a) =>
				a.tags.some((tag) => tagArray.includes(tag.toLowerCase()))
			);
		}
		if (startDate) {
			const start = new Date(startDate);
			assignments = assignments.filter((a) => a.dueDate >= start);
		}
		if (endDate) {
			const end = new Date(endDate);
			assignments = assignments.filter((a) => a.dueDate <= end);
		}

		// Apply sorting
		assignments.sort((a, b) => {
			let aValue: any = a[sortBy as keyof typeof a];
			let bValue: any = b[sortBy as keyof typeof b];

			if (
				sortBy === "dueDate" ||
				sortBy === "createdAt" ||
				sortBy === "updatedAt"
			) {
				aValue = new Date(aValue).getTime();
				bValue = new Date(bValue).getTime();
			}

			if (sortOrder === "desc") {
				return bValue > aValue ? 1 : -1;
			}
			return aValue > bValue ? 1 : -1;
		});

		// Apply pagination
		const total = assignments.length;
		const paginatedAssignments = assignments.slice(offset, offset + limitNum);

		const response = {
			data: paginatedAssignments,
			pagination: {
				page: pageNum,
				limit: limitNum,
				total,
				totalPages: Math.ceil(total / limitNum),
				hasNext: offset + limitNum < total,
				hasPrev: pageNum > 1,
			},
		};

		res.json(successResponse(response, "Assignments retrieved successfully"));
	}
);

/**
 * GET /api/assignments/:id
 * Get assignment by ID
 */
export const getAssignmentById = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		const { id } = req.params;
		const assignment = await AssignmentModel.getById(id);

		if (!assignment) {
			throw new AppError("Assignment not found", 404);
		}

		res.json(
			successResponse(assignment, "Assignment retrieved successfully")
		);
	}
);

/**
 * POST /api/assignments
 * Create new assignment
 */
export const createAssignment = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		const data: CreateAssignmentDTO = req.body;

		// Additional business logic validation
		const dueDate = new Date(data.dueDate);
		const now = new Date();

		if (dueDate <= now) {
			throw new AppError("Due date must be in the future", 400);
		}

		// Check for duplicate titles in the same subject (optional business rule)
		const existingAssignments = await AssignmentModel.getBySubject(
			data.subject
		);
		const duplicateTitle = existingAssignments.find(
			(a) => a.title.toLowerCase() === data.title.toLowerCase()
		);

		if (duplicateTitle) {
			throw new AppError(
				`An assignment with the title "${data.title}" already exists in ${data.subject}`,
				409
			);
		}

		const newAssignment = await AssignmentModel.create(data);
		res.status(201).json(
			successResponse(newAssignment, "Assignment created successfully")
		);
	}
);

/**
 * PUT /api/assignments/:id
 * Update assignment
 */
export const updateAssignment = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		const { id } = req.params;
		const data: UpdateAssignmentDTO = req.body;

		// Check if assignment exists
		const existingAssignment = await AssignmentModel.getById(id);
		if (!existingAssignment) {
			throw new AppError("Assignment not found", 404);
		}

		// Additional validation for due date if provided
		if (data.dueDate) {
			const dueDate = new Date(data.dueDate);
			const now = new Date();

			if (dueDate <= now && existingAssignment.status !== "completed") {
				throw new AppError(
					"Due date must be in the future for non-completed assignments",
					400
				);
			}
		}

		// Validate actual hours against estimated hours
		if (
			data.actualHours &&
			data.actualHours >
				(data.estimatedHours || existingAssignment.estimatedHours) * 3
		) {
			console.warn(
				`Actual hours (${
					data.actualHours
				}) significantly exceed estimated hours (${
					data.estimatedHours || existingAssignment.estimatedHours
				})`
			);
		}

		const updatedAssignment = await AssignmentModel.updateById(id, data);

		if (!updatedAssignment) {
			throw new AppError("Failed to update assignment", 500);
		}

		res.json(
			successResponse(updatedAssignment, "Assignment updated successfully")
		);
	}
);

/**
 * DELETE /api/assignments/:id
 * Delete assignment
 */
export const deleteAssignment = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		const { id } = req.params;

		// Check if assignment exists
		const existingAssignment = await AssignmentModel.getById(id);
		if (!existingAssignment) {
			throw new AppError("Assignment not found", 404);
		}

		// Prevent deletion of completed assignments (optional business rule)
		if (existingAssignment.status === "completed") {
			throw new AppError("Cannot delete completed assignments", 403);
		}

		const deleted = await AssignmentModel.deleteById(id);

		if (!deleted) {
			throw new AppError("Failed to delete assignment", 500);
		}

		res.json(successResponse(null, "Assignment deleted successfully"));
	}
);

/**
 * PATCH /api/assignments/:id/status
 * Update assignment status
 */
export const updateAssignmentStatus = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		const { id } = req.params;
		const { status } = req.body;

		// Check if assignment exists
		const existingAssignment = await AssignmentModel.getById(id);
		if (!existingAssignment) {
			throw new AppError("Assignment not found", 404);
		}

		// Business logic for status transitions
		const validTransitions: Record<string, string[]> = {
			"not-started": ["in-progress", "completed"],
			"in-progress": ["completed", "not-started"],
			completed: ["in-progress"], // Allow reopening completed assignments
			overdue: ["in-progress", "completed"],
		};

		if (!validTransitions[existingAssignment.status]?.includes(status)) {
			throw new AppError(
				`Cannot change status from "${existingAssignment.status}" to "${status}"`,
				400
			);
		}

		const updatedAssignment = await AssignmentModel.updateStatus(id, status);

		if (!updatedAssignment) {
			throw new AppError("Failed to update assignment status", 500);
		}

		res.json(
			successResponse(
				updatedAssignment,
				"Assignment status updated successfully"
			)
		);
	}
);

/**
 * GET /api/assignments/search?q=query
 * Search assignments
 */
export const searchAssignments = asyncHandler(
	async (req: SearchAssignmentsRequest, res: Response): Promise<void> => {
		const { q, page = "1", limit = "10" } = req.query;

		if (!q || q.trim().length === 0) {
			throw new AppError("Search query cannot be empty", 400);
		}

		const assignments = await AssignmentModel.search(q);

		// Apply pagination to search results
		const pageNum = parseInt(page);
		const limitNum = parseInt(limit);
		const offset = (pageNum - 1) * limitNum;
		const total = assignments.length;
		const paginatedResults = assignments.slice(offset, offset + limitNum);

		const response = {
			data: paginatedResults,
			pagination: {
				page: pageNum,
				limit: limitNum,
				total,
				totalPages: Math.ceil(total / limitNum),
				hasNext: offset + limitNum < total,
				hasPrev: pageNum > 1,
			},
			query: q,
		};

		res.json(
			successResponse(response, `Found ${total} assignments matching "${q}"`)
		);
	}
);

/**
 * GET /api/assignments/upcoming
 * Get upcoming assignments
 */
export const getUpcomingAssignments = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		const { page = "1", limit = "10" } = req.query;

		const assignments = await AssignmentModel.getUpcoming();

		// Apply pagination
		const pageNum = parseInt(page as string);
		const limitNum = parseInt(limit as string);
		const offset = (pageNum - 1) * limitNum;
		const total = assignments.length;
		const paginatedAssignments = assignments.slice(offset, offset + limitNum);

		const response = {
			data: paginatedAssignments,
			pagination: {
				page: pageNum,
				limit: limitNum,
				total,
				totalPages: Math.ceil(total / limitNum),
				hasNext: offset + limitNum < total,
				hasPrev: pageNum > 1,
			},
		};

		res.json(
			successResponse(
				response,
				"Upcoming assignments retrieved successfully"
			)
		);
	}
);

/**
 * GET /api/assignments/overdue
 * Get overdue assignments
 */
export const getOverdueAssignments = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		const { page = "1", limit = "10" } = req.query;

		const assignments = await AssignmentModel.getOverdue();

		// Apply pagination
		const pageNum = parseInt(page as string);
		const limitNum = parseInt(limit as string);
		const offset = (pageNum - 1) * limitNum;
		const total = assignments.length;
		const paginatedAssignments = assignments.slice(offset, offset + limitNum);

		const response = {
			data: paginatedAssignments,
			pagination: {
				page: pageNum,
				limit: limitNum,
				total,
				totalPages: Math.ceil(total / limitNum),
				hasNext: offset + limitNum < total,
				hasPrev: pageNum > 1,
			},
		};

		res.json(
			successResponse(response, "Overdue assignments retrieved successfully")
		);
	}
);
