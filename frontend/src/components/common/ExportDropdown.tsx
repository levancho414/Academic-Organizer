import React, { useState } from "react";
import { Assignment, Note } from "../../types";
import { ExportUtils } from "../../utils/exportUtils";

interface ExportDropdownProps {
	assignments?: Assignment[];
	notes?: Note[];
	type: "assignments" | "notes";
	disabled?: boolean;
	className?: string;
}

const ExportDropdown: React.FC<ExportDropdownProps> = ({
	assignments = [],
	notes = [],
	type,
	disabled = false,
	className = "",
}) => {
	const [isExporting, setIsExporting] = useState(false);
	const [showDropdown, setShowDropdown] = useState(false);

	const handleExport = async (format: "csv" | "json" | "json-stats") => {
		if (disabled) return;

		setIsExporting(true);
		setShowDropdown(false);

		try {
			let content: string;
			let filename: string;
			let mimeType: string;

			if (type === "assignments") {
				switch (format) {
					case "csv":
						content = ExportUtils.exportAssignmentsToCSV(assignments);
						filename = ExportUtils.generateFilename("assignments", "csv");
						mimeType = "text/csv;charset=utf-8;";
						break;
					case "json":
						content = ExportUtils.exportAssignmentsToJSON(assignments);
						filename = ExportUtils.generateFilename(
							"assignments",
							"json"
						);
						mimeType = "application/json;charset=utf-8;";
						break;
					case "json-stats":
						content = ExportUtils.exportAssignmentsWithStats(assignments);
						filename = ExportUtils.generateFilename(
							"assignments_with_stats",
							"json"
						);
						mimeType = "application/json;charset=utf-8;";
						break;
					default:
						throw new Error("Invalid format");
				}
			} else {
				switch (format) {
					case "json":
						content = ExportUtils.exportNotesToJSON(notes);
						filename = ExportUtils.generateFilename("notes", "json");
						mimeType = "application/json;charset=utf-8;";
						break;
					case "json-stats":
						content = ExportUtils.exportNotesWithMetadata(
							notes,
							assignments
						);
						filename = ExportUtils.generateFilename(
							"notes_with_metadata",
							"json"
						);
						mimeType = "application/json;charset=utf-8;";
						break;
					default:
						throw new Error("Invalid format for notes");
				}
			}

			const fileSize = ExportUtils.getFileSizeString(content);
			ExportUtils.downloadFile(content, filename, mimeType);

			console.log(`Successfully exported ${filename} (${fileSize})`);
		} catch (error) {
			console.error("Export failed:", error);
			alert(
				`Export failed: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		} finally {
			setIsExporting(false);
		}
	};

	const getItemCount = () => {
		return type === "assignments" ? assignments.length : notes.length;
	};

	const getExportOptions = () => {
		if (type === "assignments") {
			return [
				{
					key: "csv",
					icon: "📊",
					label: "CSV Format",
					description: "Spreadsheet compatible",
				},
				{
					key: "json",
					icon: "📋",
					label: "JSON Format",
					description: "Complete data",
				},
				{
					key: "json-stats",
					icon: "📈",
					label: "JSON + Stats",
					description: "With analytics",
				},
			];
		} else {
			return [
				{
					key: "json",
					icon: "📝",
					label: "JSON Format",
					description: "Complete notes",
				},
				{
					key: "json-stats",
					icon: "🔗",
					label: "JSON + Metadata",
					description: "With linked assignments",
				},
			];
		}
	};

	if (getItemCount() === 0) {
		return (
			<button
				disabled
				className="btn btn-secondary opacity-50 cursor-not-allowed"
			>
				📤 Export
			</button>
		);
	}

	return (
		<div className={`export-dropdown-container ${className}`}>
			<button
				onClick={() => setShowDropdown(!showDropdown)}
				disabled={disabled || isExporting}
				className="btn btn-secondary"
			>
				{isExporting ? (
					<>
						<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
						Exporting...
					</>
				) : (
					<>
						📤 Export ({getItemCount()})
						<span
							className={`ml-2 transition-transform ${
								showDropdown ? "rotate-180" : ""
							}`}
						>
							▼
						</span>
					</>
				)}
			</button>

			{showDropdown && !isExporting && (
				<>
					<div className="export-dropdown">
						<div className="export-header">
							<h3>
								Export{" "}
								{type === "assignments" ? "Assignments" : "Notes"}
							</h3>
							<p>Choose your format</p>
						</div>

						<div className="export-options">
							{getExportOptions().map((option) => (
								<button
									key={option.key}
									onClick={() => handleExport(option.key as any)}
									className="export-option"
								>
									<span className="export-icon">{option.icon}</span>
									<div className="export-content">
										<div className="export-title">{option.label}</div>
										<div className="export-desc">
											{option.description}
										</div>
									</div>
								</button>
							))}
						</div>
					</div>

					<div
						className="export-backdrop"
						onClick={() => setShowDropdown(false)}
					></div>
				</>
			)}
		</div>
	);
};

export default ExportDropdown;
