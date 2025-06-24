import React, { useState } from "react";
import { AssignmentFormData } from "../types";

interface AssignmentFormProps {
	onSubmit: (data: AssignmentFormData) => void;
	onCancel: () => void;
	initialData?: Partial<AssignmentFormData>;
	isLoading?: boolean;
}

// Define error types as strings
interface FormErrors {
	title?: string;
	description?: string;
	subject?: string;
	dueDate?: string;
	priority?: string;
	estimatedHours?: string;
	tags?: string;
}

const AssignmentForm: React.FC<AssignmentFormProps> = ({
	onSubmit,
	onCancel,
	initialData,
	isLoading = false,
}) => {
	const [formData, setFormData] = useState<AssignmentFormData>({
		title: initialData?.title || "",
		description: initialData?.description || "",
		subject: initialData?.subject || "",
		dueDate: initialData?.dueDate || "",
		priority: initialData?.priority || "medium",
		estimatedHours: initialData?.estimatedHours || 1,
		tags: initialData?.tags || [],
	});

	const [errors, setErrors] = useState<FormErrors>({});
	const [tagInput, setTagInput] = useState("");

	const validateForm = (): boolean => {
		const newErrors: FormErrors = {};

		if (!formData.title.trim()) {
			newErrors.title = "Title is required";
		}

		if (!formData.subject.trim()) {
			newErrors.subject = "Subject is required";
		}

		if (!formData.dueDate) {
			newErrors.dueDate = "Due date is required";
		} else {
			const dueDate = new Date(formData.dueDate);
			const today = new Date();
			today.setHours(0, 0, 0, 0);

			if (dueDate < today) {
				newErrors.dueDate = "Due date cannot be in the past";
			}
		}

		if (formData.estimatedHours <= 0) {
			newErrors.estimatedHours = "Estimated hours must be greater than 0";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (validateForm()) {
			onSubmit(formData);
		}
	};

	const handleInputChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: name === "estimatedHours" ? Number(value) : value,
		}));

		// Clear error when user starts typing
		if (errors[name as keyof FormErrors]) {
			setErrors((prev) => ({
				...prev,
				[name]: undefined,
			}));
		}
	};

	const handleAddTag = () => {
		const tag = tagInput.trim();
		if (tag && !formData.tags.includes(tag)) {
			setFormData((prev) => ({
				...prev,
				tags: [...prev.tags, tag],
			}));
			setTagInput("");
		}
	};

	const handleRemoveTag = (tagToRemove: string) => {
		setFormData((prev) => ({
			...prev,
			tags: prev.tags.filter((tag) => tag !== tagToRemove),
		}));
	};

	const handleTagKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			e.preventDefault();
			handleAddTag();
		}
	};

	return (
		<form onSubmit={handleSubmit} className="card">
			<h2 className="text-2xl font-bold mb-6">
				{initialData ? "Edit Assignment" : "Create New Assignment"}
			</h2>

			<div className="form-group">
				<label htmlFor="title" className="form-label">
					Title *
				</label>
				<input
					type="text"
					id="title"
					name="title"
					value={formData.title}
					onChange={handleInputChange}
					className={`form-input ${errors.title ? "border-red-500" : ""}`}
					placeholder="Enter assignment title"
				/>
				{errors.title && (
					<p className="text-red-600 text-sm mt-1">{errors.title}</p>
				)}
			</div>

			<div className="form-group">
				<label htmlFor="subject" className="form-label">
					Subject *
				</label>
				<input
					type="text"
					id="subject"
					name="subject"
					value={formData.subject}
					onChange={handleInputChange}
					className={`form-input ${
						errors.subject ? "border-red-500" : ""
					}`}
					placeholder="e.g., Mathematics, History, Computer Science"
				/>
				{errors.subject && (
					<p className="text-red-600 text-sm mt-1">{errors.subject}</p>
				)}
			</div>

			<div className="form-group">
				<label htmlFor="description" className="form-label">
					Description
				</label>
				<textarea
					id="description"
					name="description"
					value={formData.description}
					onChange={handleInputChange}
					className="form-textarea"
					placeholder="Assignment details, requirements, notes..."
					rows={4}
				/>
			</div>

			<div className="flex gap-4">
				<div className="form-group flex-1">
					<label htmlFor="dueDate" className="form-label">
						Due Date *
					</label>
					<input
						type="datetime-local"
						id="dueDate"
						name="dueDate"
						value={formData.dueDate}
						onChange={handleInputChange}
						className={`form-input ${
							errors.dueDate ? "border-red-500" : ""
						}`}
					/>
					{errors.dueDate && (
						<p className="text-red-600 text-sm mt-1">{errors.dueDate}</p>
					)}
				</div>

				<div className="form-group flex-1">
					<label htmlFor="priority" className="form-label">
						Priority
					</label>
					<select
						id="priority"
						name="priority"
						value={formData.priority}
						onChange={handleInputChange}
						className="form-select"
					>
						<option value="low">Low</option>
						<option value="medium">Medium</option>
						<option value="high">High</option>
					</select>
				</div>
			</div>

			<div className="form-group">
				<label htmlFor="estimatedHours" className="form-label">
					Estimated Hours *
				</label>
				<input
					type="number"
					id="estimatedHours"
					name="estimatedHours"
					value={formData.estimatedHours}
					onChange={handleInputChange}
					className={`form-input ${
						errors.estimatedHours ? "border-red-500" : ""
					}`}
					min="0.5"
					step="0.5"
					placeholder="How many hours do you estimate this will take?"
				/>
				{errors.estimatedHours && (
					<p className="text-red-600 text-sm mt-1">
						{errors.estimatedHours}
					</p>
				)}
			</div>

			<div className="form-group">
				<label htmlFor="tags" className="form-label">
					Tags
				</label>
				<div className="flex gap-2 mb-2">
					<input
						type="text"
						id="tags"
						value={tagInput}
						onChange={(e) => setTagInput(e.target.value)}
						onKeyPress={handleTagKeyPress}
						className="form-input flex-1"
						placeholder="Add tags (press Enter)"
					/>
					<button
						type="button"
						onClick={handleAddTag}
						className="btn btn-primary"
						disabled={!tagInput.trim()}
					>
						Add
					</button>
				</div>
				{formData.tags.length > 0 && (
					<div className="flex flex-wrap gap-2">
						{formData.tags.map((tag, index) => (
							<span
								key={index}
								className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded"
							>
								{tag}
								<button
									type="button"
									onClick={() => handleRemoveTag(tag)}
									className="ml-1 text-blue-600 hover:text-blue-800"
								>
									×
								</button>
							</span>
						))}
					</div>
				)}
			</div>

			<div className="flex gap-4 mt-6">
				<button
					type="submit"
					disabled={isLoading}
					className="btn btn-primary flex-1"
				>
					{isLoading
						? "Saving..."
						: initialData
						? "Update Assignment"
						: "Create Assignment"}
				</button>
				<button
					type="button"
					onClick={onCancel}
					disabled={isLoading}
					className="btn btn-secondary flex-1"
				>
					Cancel
				</button>
			</div>
		</form>
	);
};

export default AssignmentForm;
