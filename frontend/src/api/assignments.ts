import { api, API_ENDPOINTS } from "./config";
import { Assignment, AssignmentFormData, ApiResponse } from "../types";

export const assignmentsApi = {
	// Get all assignments
	// Get all assignments
	getAll: async (): Promise<Assignment[]> => {
		try {
			const response = await api.get<ApiResponse<Assignment[]>>(
				API_ENDPOINTS.assignments
			);
			// Ensure we always return an array
			return Array.isArray(response.data.data) ? response.data.data : [];
		} catch (error) {
			console.error("API Error in getAll:", error);
			// Return empty array on error to prevent crashes
			return [];
		}
	},

	// Get assignment by ID
	getById: async (id: string): Promise<Assignment> => {
		const response = await api.get<ApiResponse<Assignment>>(
			`${API_ENDPOINTS.assignments}/${id}`
		);
		return response.data.data;
	},

	// Create new assignment
	create: async (data: AssignmentFormData): Promise<Assignment> => {
		const response = await api.post<ApiResponse<Assignment>>(
			API_ENDPOINTS.assignments,
			data
		);
		return response.data.data;
	},

	// Update assignment
	update: async (
		id: string,
		data: Partial<AssignmentFormData>
	): Promise<Assignment> => {
		const response = await api.put<ApiResponse<Assignment>>(
			`${API_ENDPOINTS.assignments}/${id}`,
			data
		);
		return response.data.data;
	},

	// Delete assignment
	delete: async (id: string): Promise<void> => {
		await api.delete(`${API_ENDPOINTS.assignments}/${id}`);
	},

	// Update assignment status
	updateStatus: async (
		id: string,
		status: Assignment["status"]
	): Promise<Assignment> => {
		const response = await api.patch<ApiResponse<Assignment>>(
			`${API_ENDPOINTS.assignments}/${id}/status`,
			{ status }
		);
		return response.data.data;
	},
};

export default assignmentsApi;
