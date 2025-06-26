import { Assignment, Note } from "../types";
import { format } from "date-fns";

export class ExportUtils {
	/**
	 * Export assignments to CSV format
	 */
	static exportAssignmentsToCSV(assignments: Assignment[]): string {
		const headers = [
			"Title",
			"Subject",
			"Description",
			"Due Date",
			"Priority",
			"Status",
			"Estimated Hours",
			"Actual Hours",
			"Tags",
			"Created At",
		];

		const rows = assignments.map((assignment) => [
			`"${assignment.title.replace(/"/g, '""')}"`, // Escape quotes
			`"${assignment.subject.replace(/"/g, '""')}"`,
			`"${assignment.description.replace(/"/g, '""')}"`,
			format(new Date(assignment.dueDate), "yyyy-MM-dd HH:mm"),
			assignment.priority,
			assignment.status,
			assignment.estimatedHours.toString(),
			assignment.actualHours?.toString() || "",
			`"${assignment.tags.join(", ")}"`,
			format(new Date(assignment.createdAt), "yyyy-MM-dd HH:mm"),
		]);

		return [headers.join(","), ...rows.map((row) => row.join(","))].join(
			"\n"
		);
	}

	/**
	 * Export notes to JSON format
	 */
	static exportNotesToJSON(notes: Note[]): string {
		const exportData = {
			exportDate: new Date().toISOString(),
			totalNotes: notes.length,
			notes: notes.map((note) => ({
				id: note.id,
				title: note.title,
				content: note.content,
				subject: note.subject,
				tags: note.tags,
				assignmentId: note.assignmentId,
				createdAt: note.createdAt,
				updatedAt: note.updatedAt,
				lastAccessedAt: note.lastAccessedAt,
			})),
		};

		return JSON.stringify(exportData, null, 2);
	}

	/**
	 * Export assignments to JSON format
	 */
	static exportAssignmentsToJSON(assignments: Assignment[]): string {
		const exportData = {
			exportDate: new Date().toISOString(),
			totalAssignments: assignments.length,
			assignments: assignments.map((assignment) => ({
				id: assignment.id,
				title: assignment.title,
				description: assignment.description,
				subject: assignment.subject,
				dueDate: assignment.dueDate,
				priority: assignment.priority,
				status: assignment.status,
				estimatedHours: assignment.estimatedHours,
				actualHours: assignment.actualHours,
				tags: assignment.tags,
				createdAt: assignment.createdAt,
				updatedAt: assignment.updatedAt,
			})),
		};

		return JSON.stringify(exportData, null, 2);
	}

	/**
	 * Download file to user's device
	 */
	static downloadFile(
		content: string,
		filename: string,
		mimeType: string
	): void {
		try {
			const blob = new Blob([content], { type: mimeType });
			const url = URL.createObjectURL(blob);

			const link = document.createElement("a");
			link.href = url;
			link.download = filename;
			link.style.display = "none";

			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);

			// Clean up
			setTimeout(() => URL.revokeObjectURL(url), 100);
		} catch (error) {
			console.error("Error downloading file:", error);
			throw new Error("Failed to download file. Please try again.");
		}
	}

	/**
	 * Generate filename with timestamp
	 */
	static generateFilename(prefix: string, extension: string): string {
		const timestamp = format(new Date(), "yyyy-MM-dd_HH-mm-ss");
		return `${prefix}_${timestamp}.${extension}`;
	}

	/**
	 * Get file size in human readable format
	 */
	static getFileSizeString(content: string): string {
		const bytes = new Blob([content]).size;

		if (bytes === 0) return "0 Bytes";

		const k = 1024;
		const sizes = ["Bytes", "KB", "MB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));

		return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
	}

	/**
	 * Export assignments with statistics
	 */
	static exportAssignmentsWithStats(assignments: Assignment[]): string {
		const stats = {
			total: assignments.length,
			completed: assignments.filter((a) => a.status === "completed").length,
			inProgress: assignments.filter((a) => a.status === "in-progress")
				.length,
			notStarted: assignments.filter((a) => a.status === "not-started")
				.length,
			overdue: assignments.filter((a) => a.status === "overdue").length,
			totalEstimatedHours: assignments.reduce(
				(sum, a) => sum + a.estimatedHours,
				0
			),
			totalActualHours: assignments.reduce(
				(sum, a) => sum + (a.actualHours || 0),
				0
			),
			subjects: assignments
				.map((a) => a.subject)
				.filter((subject, index, arr) => arr.indexOf(subject) === index)
				.sort(),
			priorities: {
				high: assignments.filter((a) => a.priority === "high").length,
				medium: assignments.filter((a) => a.priority === "medium").length,
				low: assignments.filter((a) => a.priority === "low").length,
			},
		};

		const exportData = {
			exportDate: new Date().toISOString(),
			statistics: stats,
			assignments: assignments,
		};

		return JSON.stringify(exportData, null, 2);
	}

	/**
	 * Export notes with metadata
	 */
	static exportNotesWithMetadata(
		notes: Note[],
		assignments: Assignment[]
	): string {
		const notesWithAssignments = notes.map((note) => {
			const linkedAssignment = note.assignmentId
				? assignments.find((a) => a.id === note.assignmentId)
				: null;

			return {
				...note,
				linkedAssignment: linkedAssignment
					? {
							title: linkedAssignment.title,
							subject: linkedAssignment.subject,
							dueDate: linkedAssignment.dueDate,
					  }
					: null,
			};
		});

		const stats = {
			total: notes.length,
			withLinkedAssignments: notes.filter((n) => n.assignmentId).length,
			subjects: notes
				.map((n) => n.subject)
				.filter((subject, index, arr) => arr.indexOf(subject) === index)
				.sort(),
			totalTags: notes
				.flatMap((n) => n.tags)
				.filter((tag, index, arr) => arr.indexOf(tag) === index)
				.sort(),
			averageContentLength: Math.round(
				notes.reduce((sum, n) => sum + n.content.length, 0) / notes.length
			),
		};

		const exportData = {
			exportDate: new Date().toISOString(),
			statistics: stats,
			notes: notesWithAssignments,
		};

		return JSON.stringify(exportData, null, 2);
	}
}
