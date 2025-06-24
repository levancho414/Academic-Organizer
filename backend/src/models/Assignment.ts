import { Assignment, CreateAssignmentDTO, UpdateAssignmentDTO } from "../types";
import { assignmentsDB } from "../database";
import {
	generateId,
	validateRequiredFields,
	calculateAssignmentStatus,
} from "../utils";

export class AssignmentModel {
	// Create new assignment
	static async create(data: CreateAssignmentDTO): Promise<Assignment> {
		// Validate required fields
		const requiredFields = ["title", "subject", "dueDate", "estimatedHours"];
		const missingFields = validateRequiredFields(data, requiredFields);

		if (missingFields.length > 0) {
			throw new Error(
				`Missing required fields: ${missingFields.join(", ")}`
			);
		}

		// Validate data types
		if (typeof data.estimatedHours !== "number" || data.estimatedHours <= 0) {
			throw new Error("Estimated hours must be a positive number");
		}

		if (!["low", "medium", "high"].includes(data.priority)) {
			throw new Error("Priority must be low, medium, or high");
		}

		// Create assignment object
		const assignment: Assignment = {
			id: generateId(),
			title: data.title.trim(),
			description: data.description?.trim() || "",
			subject: data.subject.trim(),
			dueDate: new Date(data.dueDate),
			priority: data.priority,
			status: "not-started",
			estimatedHours: data.estimatedHours,
			tags: data.tags || [],
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		// Save to database
		return await assignmentsDB.create(assignment);
	}

	// Get all assignments
	static async getAll(): Promise<Assignment[]> {
		const assignments = await assignmentsDB.readAll();

		// Update status based on due dates with proper type handling
		let hasStatusChanges = false;
		const updatedAssignments = assignments.map((assignment) => {
			const newStatus = calculateAssignmentStatus(
				assignment.dueDate,
				assignment.status
			);
			if (newStatus !== assignment.status) {
				hasStatusChanges = true;
				const updatedAssignment: Assignment = {
					...assignment,
					status: newStatus,
					updatedAt: new Date(),
				};
				return updatedAssignment;
			}
			return assignment;
		});

		// Save updated assignments if any status changed
		if (hasStatusChanges) {
			await assignmentsDB.writeAll(updatedAssignments);
		}

		return updatedAssignments;
	}

	// Get assignment by ID
	static async getById(id: string): Promise<Assignment | null> {
		const assignment = await assignmentsDB.findById(id);

		if (!assignment) {
			return null;
		}

		// Update status if needed
		const updatedStatus = calculateAssignmentStatus(
			assignment.dueDate,
			assignment.status
		);
		if (updatedStatus !== assignment.status) {
			const updatedAssignment: Assignment = {
				...assignment,
				status: updatedStatus,
				updatedAt: new Date(),
			};
			await assignmentsDB.updateById(id, {
				status: updatedStatus,
				updatedAt: new Date(),
			});
			return updatedAssignment;
		}

		return assignment;
	}

	// Update assignment
	static async updateById(
		id: string,
		data: UpdateAssignmentDTO
	): Promise<Assignment | null> {
		const existingAssignment = await assignmentsDB.findById(id);

		if (!existingAssignment) {
			return null;
		}

		// Validate updates
		if (
			data.estimatedHours !== undefined &&
			(typeof data.estimatedHours !== "number" || data.estimatedHours <= 0)
		) {
			throw new Error("Estimated hours must be a positive number");
		}

		if (data.priority && !["low", "medium", "high"].includes(data.priority)) {
			throw new Error("Priority must be low, medium, or high");
		}

		if (
			data.status &&
			!["not-started", "in-progress", "completed", "overdue"].includes(
				data.status
			)
		) {
			throw new Error("Invalid status");
		}

		// Prepare updates with proper type handling
		const updates: Partial<Assignment> = {
			updatedAt: new Date(),
		};

		// Copy fields that don't need conversion
		if (data.title !== undefined) updates.title = data.title;
		if (data.description !== undefined)
			updates.description = data.description;
		if (data.subject !== undefined) updates.subject = data.subject;
		if (data.priority !== undefined) updates.priority = data.priority;
		if (data.estimatedHours !== undefined)
			updates.estimatedHours = data.estimatedHours;
		if (data.actualHours !== undefined)
			updates.actualHours = data.actualHours;
		if (data.status !== undefined) updates.status = data.status;
		if (data.tags !== undefined) updates.tags = data.tags;

		// Convert date string to Date object if provided
		if (data.dueDate !== undefined) {
			updates.dueDate = new Date(data.dueDate);
		}

		return await assignmentsDB.updateById(id, updates);
	}

	// Delete assignment
	static async deleteById(id: string): Promise<boolean> {
		return await assignmentsDB.deleteById(id);
	}

	// Update assignment status
	static async updateStatus(
		id: string,
		status: Assignment["status"]
	): Promise<Assignment | null> {
		const validStatuses: Assignment["status"][] = [
			"not-started",
			"in-progress",
			"completed",
			"overdue",
		];

		if (!validStatuses.includes(status)) {
			throw new Error("Invalid status");
		}

		return await assignmentsDB.updateById(id, {
			status,
			updatedAt: new Date(),
		});
	}

	// Get assignments by status
	static async getByStatus(
		status: Assignment["status"]
	): Promise<Assignment[]> {
		return await assignmentsDB.findBy({ status });
	}

	// Get assignments by subject
	static async getBySubject(subject: string): Promise<Assignment[]> {
		return await assignmentsDB.findBy({ subject });
	}

	// Get upcoming assignments (due within next 7 days)
	static async getUpcoming(): Promise<Assignment[]> {
		const allAssignments = await this.getAll();
		const sevenDaysFromNow = new Date();
		sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

		return allAssignments.filter(
			(assignment) =>
				assignment.dueDate <= sevenDaysFromNow &&
				assignment.status !== "completed"
		);
	}

	// Get overdue assignments
	static async getOverdue(): Promise<Assignment[]> {
		const allAssignments = await this.getAll();
		const now = new Date();

		return allAssignments.filter(
			(assignment) =>
				assignment.dueDate < now && assignment.status !== "completed"
		);
	}

	// Search assignments
	static async search(query: string): Promise<Assignment[]> {
		const allAssignments = await this.getAll();
		const searchTerm = query.toLowerCase();

		return allAssignments.filter(
			(assignment) =>
				assignment.title.toLowerCase().includes(searchTerm) ||
				assignment.description.toLowerCase().includes(searchTerm) ||
				assignment.subject.toLowerCase().includes(searchTerm) ||
				assignment.tags.some((tag) =>
					tag.toLowerCase().includes(searchTerm)
				)
		);
	}

	// Get statistics
	static async getStats(): Promise<{
		total: number;
		notStarted: number;
		inProgress: number;
		completed: number;
		overdue: number;
		totalEstimatedHours: number;
		totalActualHours: number;
	}> {
		const assignments = await this.getAll();

		return {
			total: assignments.length,
			notStarted: assignments.filter((a) => a.status === "not-started")
				.length,
			inProgress: assignments.filter((a) => a.status === "in-progress")
				.length,
			completed: assignments.filter((a) => a.status === "completed").length,
			overdue: assignments.filter((a) => a.status === "overdue").length,
			totalEstimatedHours: assignments.reduce(
				(sum, a) => sum + a.estimatedHours,
				0
			),
			totalActualHours: assignments.reduce(
				(sum, a) => sum + (a.actualHours || 0),
				0
			),
		};
	}
}
