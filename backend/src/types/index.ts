// Express types
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

// Request/Response types
export interface TypedRequest<T = any> extends Request {
	body: T;
}

export interface TypedResponse<T = any> extends Response {
	json: (body: ApiResponse<T>) => this;
}

// Form data types for validation
export interface CreateAssignmentDTO {
	title: string;
	description?: string;
	subject: string;
	dueDate: string; // ISO string
	priority: "low" | "medium" | "high";
	estimatedHours: number;
	tags?: string[];
}

export interface UpdateAssignmentDTO {
	title?: string;
	description?: string;
	subject?: string;
	dueDate?: string;
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
