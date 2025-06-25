import { Request, Response } from "express";

// Assignment interface
export interface Assignment {
	id: string;
	title: string;
	description: string;
	subject: string;
	dueDate: Date;
	priority: "low" | "medium" | "high";
	status: "not-started" | "in-progress" | "completed" | "overdue";
	estimatedHours: number;
	actualHours?: number;
	tags: string[];
	createdAt: Date;
	updatedAt: Date;
}

// Note interface
export interface Note {
	id: string;
	title: string;
	content: string;
	subject: string;
	tags: string[];
	assignmentId?: string;
	createdAt: Date;
	updatedAt: Date;
	lastAccessedAt: Date;
}

// API Response types
export interface ApiResponse<T = any> {
	success: boolean;
	data?: T;
	message?: string;
	error?: string;
}

export interface ApiError {
	message: string;
	status: number;
	timestamp: Date;
}

// Request/Response types (simple, compatible versions)
export interface TypedRequest<T = any> extends Request {
	body: T;
}

export interface TypedResponse<T = any> extends Response {
	json: (body: ApiResponse<T>) => this;
}

// Form data types (using strings for dates from frontend)
export interface CreateAssignmentDTO {
	title: string;
	description?: string;
	subject: string;
	dueDate: string; // ISO string from frontend
	priority: "low" | "medium" | "high";
	estimatedHours: number;
	tags?: string[];
}

export interface UpdateAssignmentDTO {
	title?: string;
	description?: string;
	subject?: string;
	dueDate?: string; // ISO string from frontend
	priority?: "low" | "medium" | "high";
	estimatedHours?: number;
	actualHours?: number;
	status?: "not-started" | "in-progress" | "completed" | "overdue";
	tags?: string[];
}

export interface CreateNoteDTO {
	title: string;
	content: string;
	subject: string;
	tags?: string[];
	assignmentId?: string;
}

// Filter and sort types
export interface AssignmentFilters {
	status?: Assignment["status"];
	priority?: Assignment["priority"];
	subject?: string;
	tags?: string[];
	dueDateFrom?: Date;
	dueDateTo?: Date;
}

export interface SortOptions {
	field: "dueDate" | "priority" | "title" | "createdAt" | "updatedAt";
	direction: "asc" | "desc";
}

// Dashboard stats type
export interface DashboardStats {
	totalAssignments: number;
	completedAssignments: number;
	inProgressAssignments: number;
	overdueAssignments: number;
	totalNotes: number;
	totalHoursEstimated: number;
	totalHoursActual: number;
}
export interface GetAssignmentsRequest extends Request {
	query: {
		page?: string;
		limit?: string;
		status?: Assignment["status"];
		priority?: Assignment["priority"];
		subject?: string;
		tags?: string;
		startDate?: string;
		endDate?: string;
		sortBy?: string;
		sortOrder?: string;
	};
}

export interface SearchAssignmentsRequest extends Request {
	query: {
		q: string;
		page?: string;
		limit?: string;
	};
}