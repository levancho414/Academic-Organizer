import React, { useState } from "react";
import { Assignment, Note } from "../../types";
import { ExportUtils } from "../../utils/exportUtils";

interface ExportButtonProps {
	assignments?: Assignment[];
	notes?: Note[];
	type: "assignments" | "notes";
	disabled?: boolean;
	className?: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({
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

			// Show file size info
			const fileSize = ExportUtils.getFileSizeString(content);
			console.log(`Exporting ${filename} (${fileSize})`);

			ExportUtils.downloadFile(content, filename, mimeType);

			// Show success message (you can replace with toast notification)
			alert(`Successfully exported ${type} to ${filename} (${fileSize})`);
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
					label: "CSV Format",
					description: "Spreadsheet compatible",
				},
				{ key: "json", label: "JSON Format", description: "Raw data" },
				{
					key: "json-stats",
					label: "JSON with Statistics",
					description: "Includes analytics",
				},
			];
		} else {
			return [
				{
					key: "json",
					label: "JSON Format",
					description: "Raw notes data",
				},
				{
					key: "json-stats",
					label: "JSON with Metadata",
					description: "Includes linked assignments",
				},
			];
		}
	};

	if (getItemCount() === 0) {
		return null; // Don't show export button if no data
	}

	return (
		<div className={`export-button-container ${className}`}>
			<div className="relative">
				<button
					onClick={() => setShowDropdown(!showDropdown)}
					disabled={disabled || isExporting}
					className="btn btn-secondary export-btn"
					title={`Export ${type}`}
				>
					{isExporting ? (
						<>
							<div className="loading-spinner-small"></div>
							Exporting...
						</>
					) : (
						<>📥 Export ({getItemCount()})</>
					)}
				</button>

				{showDropdown && !isExporting && (
					<div className="export-dropdown">
						<div className="export-dropdown-header">
							<h4>Export {type}</h4>
							<button
								onClick={() => setShowDropdown(false)}
								className="dropdown-close"
							>
								×
							</button>
						</div>
						<div className="export-options">
							{getExportOptions().map((option) => (
								<button
									key={option.key}
									onClick={() => handleExport(option.key as any)}
									className="export-option"
								>
									<div className="export-option-label">
										{option.label}
									</div>
									<div className="export-option-description">
										{option.description}
									</div>
								</button>
							))}
						</div>
						<div className="export-dropdown-footer">
							<small>Files will download to your device</small>
						</div>
					</div>
				)}
			</div>

			{/* Backdrop */}
			{showDropdown && (
				<div
					className="export-backdrop"
					onClick={() => setShowDropdown(false)}
				></div>
			)}
		</div>
	);
};

export default ExportButton;
