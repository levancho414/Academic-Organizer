import React, { useState, useEffect } from "react";
import { NoteFormData, Assignment } from "../types";

interface NoteFormProps {
	onSubmit: (data: NoteFormData) => void;
	onCancel: () => void;
	initialData?: Partial<NoteFormData>;
	assignments?: Assignment[];
	isLoading?: boolean;
}

interface FormErrors {
	title?: string;
	content?: string;
	subject?: string;
	tags?: string;
}

const NoteForm: React.FC<NoteFormProps> = ({
	onSubmit,
	onCancel,
	initialData,
	assignments = [],
	isLoading = false,
}) => {
	const [formData, setFormData] = useState<NoteFormData>({
		title: "",
		content: "",
		subject: "",
		tags: [],
		assignmentId: "",
	});

	const [errors, setErrors] = useState<FormErrors>({});
	const [tagInput, setTagInput] = useState("");

	const isEditMode = Boolean(initialData);

	// Load initial data when provided
	useEffect(() => {
		if (initialData) {
			setFormData({
				title: initialData.title || "",
				content: initialData.content || "",
				subject: initialData.subject || "",
				tags: initialData.tags || [],
				assignmentId: initialData.assignmentId || "",
			});
		}
	}, [initialData]);

	const validateForm = (): boolean => {
		const newErrors: FormErrors = {};

		if (!formData.title.trim()) {
			newErrors.title = "Title is required";
		} else if (formData.title.length > 200) {
			newErrors.title = "Title must be 200 characters or less";
		}

		if (!formData.content.trim()) {
			newErrors.content = "Content is required";
		} else if (formData.content.length > 10000) {
			newErrors.content = "Content must be 10,000 characters or less";
		}

		if (!formData.subject.trim()) {
			newErrors.subject = "Subject is required";
		} else if (formData.subject.length > 100) {
			newErrors.subject = "Subject must be 100 characters or less";
		}

		if (formData.tags.length > 20) {
			newErrors.tags = "Cannot have more than 20 tags";
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
			[name]: value,
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
		if (tag && !formData.tags.includes(tag) && formData.tags.length < 20) {
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

	// Get linked assignment details
	const linkedAssignment = assignments.find(
		(a) => a.id === formData.assignmentId
	);

	return (
		<form onSubmit={handleSubmit} className="card note-form">
			<h2 className="text-2xl font-bold mb-6">
				{isEditMode ? "Edit Note" : "Create New Note"}
			</h2>

			{/* Title */}
			<div className="form-group">
				<label htmlFor="title" className="form-label required">
					Title
				</label>
				<input
					type="text"
					id="title"
					name="title"
					value={formData.title}
					onChange={handleInputChange}
					className={`form-input ${errors.title ? "error" : ""}`}
					placeholder="Enter note title"
					maxLength={200}
				/>
				{errors.title && (
					<p className="text-red-600 text-sm mt-1">{errors.title}</p>
				)}
				<div className="character-count">{formData.title.length}/200</div>
			</div>

			{/* Subject and Assignment Link Row */}
			<div className="flex gap-4">
				<div className="form-group flex-1">
					<label htmlFor="subject" className="form-label required">
						Subject
					</label>
					<input
						type="text"
						id="subject"
						name="subject"
						value={formData.subject}
						onChange={handleInputChange}
						className={`form-input ${errors.subject ? "error" : ""}`}
						placeholder="e.g., Mathematics, History, Computer Science"
						maxLength={100}
					/>
					{errors.subject && (
						<p className="text-red-600 text-sm mt-1">{errors.subject}</p>
					)}
					<div className="character-count">
						{formData.subject.length}/100
					</div>
				</div>

				<div className="form-group flex-1">
					<label htmlFor="assignmentId" className="form-label">
						Link to Assignment (Optional)
					</label>
					<select
						id="assignmentId"
						name="assignmentId"
						value={formData.assignmentId}
						onChange={handleInputChange}
						className="form-select"
					>
						<option value="">No assignment linked</option>
						{assignments.map((assignment) => (
							<option key={assignment.id} value={assignment.id}>
								{assignment.title} ({assignment.subject})
							</option>
						))}
					</select>
					{linkedAssignment && (
						<p className="text-sm text-blue-600 mt-1">
							📎 Linked to: {linkedAssignment.title}
						</p>
					)}
				</div>
			</div>

			{/* Content */}
			<div className="form-group">
				<label htmlFor="content" className="form-label required">
					Content
				</label>
				<textarea
					id="content"
					name="content"
					value={formData.content}
					onChange={handleInputChange}
					className={`form-textarea ${errors.content ? "error" : ""}`}
					placeholder="Write your note content here..."
					rows={12}
					maxLength={10000}
				/>
				{errors.content && (
					<p className="text-red-600 text-sm mt-1">{errors.content}</p>
				)}
				<div className="character-count">
					{formData.content.length}/10,000
				</div>
			</div>

			{/* Tags */}
			<div className="form-group">
				<label htmlFor="tags" className="form-label">
					Tags ({formData.tags.length}/20)
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
						maxLength={50}
						disabled={formData.tags.length >= 20}
					/>
					<button
						type="button"
						onClick={handleAddTag}
						className="btn btn-primary"
						disabled={!tagInput.trim() || formData.tags.length >= 20}
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
				{errors.tags && (
					<p className="text-red-600 text-sm mt-1">{errors.tags}</p>
				)}
			</div>

			{/* Form Actions */}
			<div className="flex gap-4 mt-6">
				<button
					type="submit"
					disabled={isLoading}
					className="btn btn-primary flex-1"
				>
					{isLoading
						? "Saving..."
						: isEditMode
						? "Update Note"
						: "Create Note"}
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

export default NoteForm;
