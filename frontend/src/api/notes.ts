import { api, API_ENDPOINTS } from "./config";
import { Note, NoteFormData, ApiResponse } from "../types";

export const notesApi = {
	// Get all notes
	getAll: async (): Promise<Note[]> => {
		const response = await api.get<ApiResponse<Note[]>>(API_ENDPOINTS.notes);
		return response.data.data || [];
	},

	// Get note by ID
	getById: async (id: string): Promise<Note> => {
		const response = await api.get<ApiResponse<Note>>(
			`${API_ENDPOINTS.notes}/${id}`
		);
		return response.data.data;
	},

	// Create new note
	create: async (data: NoteFormData): Promise<Note> => {
		const response = await api.post<ApiResponse<Note>>(
			API_ENDPOINTS.notes,
			data
		);
		return response.data.data;
	},

	// Update note
	update: async (id: string, data: Partial<NoteFormData>): Promise<Note> => {
		const response = await api.put<ApiResponse<Note>>(
			`${API_ENDPOINTS.notes}/${id}`,
			data
		);
		return response.data.data;
	},

	// Delete note
	delete: async (id: string): Promise<void> => {
		await api.delete(`${API_ENDPOINTS.notes}/${id}`);
	},

	// Get notes by assignment ID
	getByAssignment: async (assignmentId: string): Promise<Note[]> => {
		const response = await api.get<ApiResponse<Note[]>>(
			`${API_ENDPOINTS.notes}?assignmentId=${assignmentId}`
		);
		return response.data.data || [];
	},

	// Search notes
	search: async (query: string): Promise<Note[]> => {
		const response = await api.get<ApiResponse<Note[]>>(
			`${API_ENDPOINTS.notes}/search?q=${encodeURIComponent(query)}`
		);
		return response.data.data || [];
	},
};

export default notesApi;
