import { api, API_ENDPOINTS } from "./config";
import { Assignment, AssignmentFormData, ApiResponse } from "../types";
import { ApiError } from "./errors";

export const assignmentsApi = {
	// Get all assignments with error handling
	getAll: async (): Promise<Assignment[]> => {
		try {
			const response = await api.get<ApiResponse<any>>(
				API_ENDPOINTS.assignments
			);
			const data = response.data.data?.data || response.data.data || [];
			return Array.isArray(data) ? data : [];
		} catch (error) {
			if (error instanceof ApiError) {
				throw error;
			}
			throw new ApiError("Failed to load assignments", 500, error);
		}
	},

	// Get assignment by ID
	getById: async (id: string): Promise<Assignment> => {
		try {
			const response = await api.get<ApiResponse<Assignment>>(
				`${API_ENDPOINTS.assignments}/${id}`
			);
			return response.data.data;
		} catch (error) {
			if (error instanceof ApiError) {
				throw error;
			}
			throw new ApiError("Failed to load assignment", 500, error);
		}
	},

	// Create new assignment
	create: async (data: AssignmentFormData): Promise<Assignment> => {
		try {
			const response = await api.post<ApiResponse<Assignment>>(
				API_ENDPOINTS.assignments,
				data
			);
			return response.data.data;
		} catch (error) {
			if (error instanceof ApiError) {
				throw error;
			}
			throw new ApiError("Failed to create assignment", 500, error);
		}
	},

	// Update assignment
	update: async (
		id: string,
		data: Partial<AssignmentFormData>
	): Promise<Assignment> => {
		try {
			const response = await api.put<ApiResponse<Assignment>>(
				`${API_ENDPOINTS.assignments}/${id}`,
				data
			);
			return response.data.data;
		} catch (error) {
			if (error instanceof ApiError) {
				throw error;
			}
			throw new ApiError("Failed to update assignment", 500, error);
		}
	},

	// Delete assignment
	delete: async (id: string): Promise<void> => {
		try {
			await api.delete(`${API_ENDPOINTS.assignments}/${id}`);
		} catch (error) {
			if (error instanceof ApiError) {
				throw error;
			}
			throw new ApiError("Failed to delete assignment", 500, error);
		}
	},

	// Update assignment status
	updateStatus: async (
		id: string,
		status: Assignment["status"]
	): Promise<Assignment> => {
		try {
			const response = await api.patch<ApiResponse<Assignment>>(
				`${API_ENDPOINTS.assignments}/${id}/status`,
				{ status }
			);
			return response.data.data;
		} catch (error) {
			if (error instanceof ApiError) {
				throw error;
			}
			throw new ApiError("Failed to update assignment status", 500, error);
		}
	},
};

export default assignmentsApi;
