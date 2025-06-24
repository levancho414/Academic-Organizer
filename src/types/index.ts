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
	assignmentId?: string; // Optional link to assignment
	createdAt: Date;
	updatedAt: Date;
	lastAccessedAt: Date;
}

// Task interface (for smaller subtasks within assignments)
export interface Task {
	id: string;
	title: string;
	description?: string;
	assignmentId: string; // Required link to parent assignment
	completed: boolean;
	dueDate?: Date;
	priority: "low" | "medium" | "high";
	createdAt: Date;
	updatedAt: Date;
}

// API Response types
export interface ApiResponse<T> {
	success: boolean;
	data: T;
	message?: string;
	error?: string;
}

export interface ApiError {
	message: string;
	status: number;
	timestamp: Date;
}

// Form types for handling form data (using strings for dates)
export interface AssignmentFormData {
	title: string;
	description: string;
	subject: string;
	dueDate: string; // ISO string for form handling
	priority: "low" | "medium" | "high";
	estimatedHours: number;
	tags: string[];
}

export interface NoteFormData {
	title: string;
	content: string;
	subject: string;
	tags: string[];
	assignmentId?: string;
}

export interface TaskFormData {
	title: string;
	description?: string;
	assignmentId: string;
	dueDate?: string; // ISO string for form handling
	priority: "low" | "medium" | "high";
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
