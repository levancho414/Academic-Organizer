# Academic Organizer API Documentation

## Base URL

```
Development: http://localhost:5000/api
```

## Authentication

Currently, the API does not require authentication. All endpoints are publicly accessible.

## Common Response Format

### Success Response

```json
{
  "success": true,
  "data": {...},
  "message": "Success message"
}
```

### Error Response

```json
{
	"success": false,
	"error": "Error message",
	"message": "Additional context"
}
```

## Error Codes

-  `400` - Bad Request (validation errors)
-  `401` - Unauthorized
-  `403` - Forbidden
-  `404` - Not Found
-  `409` - Conflict (duplicate resource)
-  `429` - Too Many Requests
-  `500` - Internal Server Error

---

# 📚 Assignment Endpoints

## Create Assignment

**POST** `/assignments`

Creates a new assignment.

### Request Body

```json
{
	"title": "Final Project",
	"description": "Complete the final project for Software Engineering course",
	"subject": "Software Engineering",
	"dueDate": "2025-06-30T23:59:59.000Z",
	"priority": "high",
	"estimatedHours": 12,
	"tags": ["project", "coding", "final"]
}
```

### Response (201 Created)

```json
{
	"success": true,
	"data": {
		"id": "xvbno5a11mccewvbo",
		"title": "Final Project",
		"description": "Complete the final project for Software Engineering course",
		"subject": "Software Engineering",
		"dueDate": "2025-06-30T23:59:59.000Z",
		"priority": "high",
		"status": "not-started",
		"estimatedHours": 12,
		"actualHours": null,
		"tags": ["project", "coding", "final"],
		"createdAt": "2025-06-25T20:34:00.468Z",
		"updatedAt": "2025-06-25T20:34:00.468Z"
	},
	"message": "Assignment created successfully"
}
```

### Validation Rules

-  `title`: Required, 1-200 characters
-  `subject`: Required, 1-100 characters
-  `description`: Optional, max 1000 characters
-  `dueDate`: Required, must be in the future
-  `priority`: Required, one of: "low", "medium", "high"
-  `estimatedHours`: Required, 0.1-1000
-  `tags`: Optional array, max 20 tags, each max 50 characters

## Get All Assignments

**GET** `/assignments`

Retrieves all assignments with optional filtering, sorting, and pagination.

### Query Parameters

-  `page` (optional): Page number (default: 1)
-  `limit` (optional): Items per page (default: 10, max: 100)
-  `status` (optional): Filter by status ("not-started", "in-progress", "completed", "overdue")
-  `priority` (optional): Filter by priority ("low", "medium", "high")
-  `subject` (optional): Filter by subject (partial match)
-  `tags` (optional): Comma-separated list of tags
-  `startDate` (optional): Filter assignments due after this date
-  `endDate` (optional): Filter assignments due before this date
-  `sortBy` (optional): Sort field ("dueDate", "priority", "title", "createdAt", "updatedAt")
-  `sortOrder` (optional): Sort direction ("asc", "desc")

### Example Request

```
GET /assignments?status=in-progress&priority=high&page=1&limit=5&sortBy=dueDate&sortOrder=asc
```

### Response (200 OK)

```json
{
	"success": true,
	"data": {
		"data": [
			{
				"id": "xvbno5a11mccewvbo",
				"title": "Final Project",
				"description": "Complete the final project for Software Engineering course",
				"subject": "Software Engineering",
				"dueDate": "2025-06-30T23:59:59.000Z",
				"priority": "high",
				"status": "in-progress",
				"estimatedHours": 12,
				"actualHours": 8,
				"tags": ["project", "coding", "final"],
				"createdAt": "2025-06-25T20:34:00.468Z",
				"updatedAt": "2025-06-25T21:15:30.123Z"
			}
		],
		"pagination": {
			"page": 1,
			"limit": 5,
			"total": 1,
			"totalPages": 1,
			"hasNext": false,
			"hasPrev": false
		}
	},
	"message": "Assignments retrieved successfully"
}
```

## Get Assignment by ID

**GET** `/assignments/:id`

Retrieves a specific assignment by ID.

### Response (200 OK)

```json
{
	"success": true,
	"data": {
		"id": "xvbno5a11mccewvbo",
		"title": "Final Project",
		"description": "Complete the final project for Software Engineering course",
		"subject": "Software Engineering",
		"dueDate": "2025-06-30T23:59:59.000Z",
		"priority": "high",
		"status": "in-progress",
		"estimatedHours": 12,
		"actualHours": 8,
		"tags": ["project", "coding", "final"],
		"createdAt": "2025-06-25T20:34:00.468Z",
		"updatedAt": "2025-06-25T21:15:30.123Z"
	},
	"message": "Assignment retrieved successfully"
}
```

### Response (404 Not Found)

```json
{
	"success": false,
	"error": "Assignment not found"
}
```

## Update Assignment

**PUT** `/assignments/:id`

Updates an existing assignment.

### Request Body (Partial Update)

```json
{
	"title": "Updated Final Project",
	"status": "in-progress",
	"actualHours": 8,
	"tags": ["project", "coding", "final", "updated"]
}
```

### Response (200 OK)

```json
{
	"success": true,
	"data": {
		"id": "xvbno5a11mccewvbo",
		"title": "Updated Final Project",
		"description": "Complete the final project for Software Engineering course",
		"subject": "Software Engineering",
		"dueDate": "2025-06-30T23:59:59.000Z",
		"priority": "high",
		"status": "in-progress",
		"estimatedHours": 12,
		"actualHours": 8,
		"tags": ["project", "coding", "final", "updated"],
		"createdAt": "2025-06-25T20:34:00.468Z",
		"updatedAt": "2025-06-25T21:30:45.789Z"
	},
	"message": "Assignment updated successfully"
}
```

## Update Assignment Status

**PATCH** `/assignments/:id/status`

Updates only the status of an assignment with business logic validation.

### Request Body

```json
{
	"status": "completed"
}
```

### Valid Status Transitions

-  `not-started` → `in-progress`, `completed`
-  `in-progress` → `completed`, `not-started`
-  `completed` → `in-progress`
-  `overdue` → `in-progress`, `completed`

### Response (200 OK)

```json
{
	"success": true,
	"data": {
		"id": "xvbno5a11mccewvbo",
		"title": "Updated Final Project",
		"status": "completed",
		"updatedAt": "2025-06-25T21:35:20.456Z"
	},
	"message": "Assignment status updated successfully"
}
```

## Delete Assignment

**DELETE** `/assignments/:id`

Deletes an assignment. Completed assignments cannot be deleted.

### Response (200 OK)

```json
{
	"success": true,
	"data": null,
	"message": "Assignment deleted successfully"
}
```

### Response (403 Forbidden)

```json
{
	"success": false,
	"error": "Cannot delete completed assignments"
}
```

## Search Assignments

**GET** `/assignments/search`

Searches assignments across title, description, subject, and tags.

### Query Parameters

-  `q` (required): Search query (1-100 characters)
-  `page` (optional): Page number
-  `limit` (optional): Items per page

### Example Request

```
GET /assignments/search?q=final%20project&page=1&limit=10
```

### Response (200 OK)

```json
{
	"success": true,
	"data": {
		"data": [
			{
				"id": "xvbno5a11mccewvbo",
				"title": "Final Project",
				"subject": "Software Engineering",
				"priority": "high",
				"status": "completed"
			}
		],
		"pagination": {
			"page": 1,
			"limit": 10,
			"total": 1,
			"totalPages": 1,
			"hasNext": false,
			"hasPrev": false
		},
		"query": "final project"
	},
	"message": "Found 1 assignments matching \"final project\""
}
```

## Get Upcoming Assignments

**GET** `/assignments/upcoming`

Retrieves assignments due within the next 7 days.

### Query Parameters

-  `page` (optional): Page number
-  `limit` (optional): Items per page

### Response (200 OK)

```json
{
	"success": true,
	"data": {
		"data": [
			{
				"id": "abc123",
				"title": "Math Homework",
				"subject": "Mathematics",
				"dueDate": "2025-06-28T23:59:59.000Z",
				"priority": "medium",
				"status": "not-started"
			}
		],
		"pagination": {
			"page": 1,
			"limit": 10,
			"total": 1,
			"totalPages": 1,
			"hasNext": false,
			"hasPrev": false
		}
	},
	"message": "Upcoming assignments retrieved successfully"
}
```

## Get Overdue Assignments

**GET** `/assignments/overdue`

Retrieves assignments that are past their due date and not completed.

### Response (200 OK)

```json
{
	"success": true,
	"data": {
		"data": [
			{
				"id": "def456",
				"title": "History Essay",
				"subject": "History",
				"dueDate": "2025-06-20T23:59:59.000Z",
				"priority": "high",
				"status": "overdue"
			}
		],
		"pagination": {
			"page": 1,
			"limit": 10,
			"total": 1,
			"totalPages": 1,
			"hasNext": false,
			"hasPrev": false
		}
	},
	"message": "Overdue assignments retrieved successfully"
}
```

---

# 📝 Note Endpoints

## Create Note

**POST** `/notes`

Creates a new note.

### Request Body

```json
{
	"title": "Final Project Notes",
	"content": "Key points for the final project:1. Use TypeScript 2. Implement proper error handling 3. Add comprehensive tests",
	"subject": "Software Engineering",
	"tags": ["notes", "project", "important"],
	"assignmentId": "xvbno5a11mccewvbo"
}
```

### Response (201 Created)

```json
{
	"success": true,
	"data": {
		"id": "rp91z106fmccexn0x",
		"title": "Final Project Notes",
		"content": "Key points for the final project:\n1. Use TypeScript\n2. Implement proper error handling 3. Add comprehensive tests",
		"subject": "Software Engineering",
		"tags": ["notes", "project", "important"],
		"assignmentId": "xvbno5a11mccewvbo",
		"createdAt": "2025-06-25T20:34:36.369Z",
		"updatedAt": "2025-06-25T20:34:36.369Z",
		"lastAccessedAt": "2025-06-25T20:34:36.369Z"
	},
	"message": "Note created successfully"
}
```

### Validation Rules

-  `title`: Required, 1-200 characters
-  `content`: Required, 1-10,000 characters
-  `subject`: Required, 1-100 characters
-  `tags`: Optional array, max 20 tags, each max 50 characters
-  `assignmentId`: Optional, must be valid assignment ID

## Get All Notes

**GET** `/notes`

Retrieves all notes with optional filtering.

### Query Parameters

-  `subject` (optional): Filter by subject (partial match)
-  `assignmentId` (optional): Filter by linked assignment

### Example Request

```
GET /notes?subject=Software%20Engineering&assignmentId=xvbno5a11mccewvbo
```

### Response (200 OK)

```json
{
	"success": true,
	"data": [
		{
			"id": "rp91z106fmccexn0x",
			"title": "Final Project Notes",
			"content": "Key points for the final project...",
			"subject": "Software Engineering",
			"tags": ["notes", "project", "important"],
			"assignmentId": "xvbno5a11mccewvbo",
			"createdAt": "2025-06-25T20:34:36.369Z",
			"updatedAt": "2025-06-25T20:34:36.369Z",
			"lastAccessedAt": "2025-06-25T20:34:36.369Z"
		}
	],
	"message": "Notes retrieved successfully"
}
```

## Get Note by ID

**GET** `/notes/:id`

Retrieves a specific note by ID. Automatically updates `lastAccessedAt`.

### Response (200 OK)

```json
{
	"success": true,
	"data": {
		"id": "rp91z106fmccexn0x",
		"title": "Final Project Notes",
		"content": "Key points for the final project...",
		"subject": "Software Engineering",
		"tags": ["notes", "project", "important"],
		"assignmentId": "xvbno5a11mccewvbo",
		"createdAt": "2025-06-25T20:34:36.369Z",
		"updatedAt": "2025-06-25T20:34:36.369Z",
		"lastAccessedAt": "2025-06-25T21:45:12.789Z"
	},
	"message": "Note retrieved successfully"
}
```

## Update Note

**PUT** `/notes/:id`

Updates an existing note.

### Request Body (Partial Update)

```json
{
	"title": "Updated Final Project Notes",
	"content": "Updated content with new information...",
	"tags": ["notes", "project", "important", "updated"]
}
```

### Response (200 OK)

```json
{
	"success": true,
	"data": {
		"id": "rp91z106fmccexn0x",
		"title": "Updated Final Project Notes",
		"content": "Updated content with new information...",
		"subject": "Software Engineering",
		"tags": ["notes", "project", "important", "updated"],
		"assignmentId": "xvbno5a11mccewvbo",
		"createdAt": "2025-06-25T20:34:36.369Z",
		"updatedAt": "2025-06-25T21:50:30.456Z",
		"lastAccessedAt": "2025-06-25T21:50:30.456Z"
	},
	"message": "Note updated successfully"
}
```

## Delete Note

**DELETE** `/notes/:id`

Deletes a note.

### Response (200 OK)

```json
{
	"success": true,
	"data": null,
	"message": "Note deleted successfully"
}
```

## Search Notes

**GET** `/notes/search`

Searches notes across title, content, subject, and tags.

### Query Parameters

-  `q` (required): Search query (1-100 characters)

### Example Request

```
GET /notes/search?q=typescript
```

### Response (200 OK)

```json
{
	"success": true,
	"data": [
		{
			"id": "rp91z106fmccexn0x",
			"title": "Final Project Notes",
			"content": "Key points: Use TypeScript...",
			"subject": "Software Engineering",
			"tags": ["notes", "project", "important"]
		}
	],
	"message": "Found 1 notes matching \"typescript\""
}
```

## Get Notes by Assignment

**GET** `/notes/assignment/:assignmentId`

Retrieves all notes linked to a specific assignment.

### Response (200 OK)

```json
{
	"success": true,
	"data": [
		{
			"id": "rp91z106fmccexn0x",
			"title": "Final Project Notes",
			"content": "Key points for the final project...",
			"subject": "Software Engineering",
			"assignmentId": "xvbno5a11mccewvbo"
		}
	],
	"message": "Found 1 notes for assignment"
}
```

## Get Notes Statistics

**GET** `/notes/stats`

Retrieves statistics about notes.

### Response (200 OK)

```json
{
	"success": true,
	"data": {
		"total": 5,
		"bySubject": {
			"Software Engineering": 3,
			"Mathematics": 1,
			"History": 1
		},
		"totalTags": 15,
		"uniqueTags": 8,
		"averageContentLength": 245
	},
	"message": "Notes statistics retrieved successfully"
}
```

---

# 🔧 System Endpoints

## Health Check

**GET** `/health`

Checks if the API is running.

### Response (200 OK)

```json
{
	"success": true,
	"message": "API is healthy",
	"timestamp": "2025-06-25T21:55:00.123Z",
	"environment": "development"
}
```

## Get Statistics

**GET** `/stats`

Retrieves overall system statistics.

### Response (200 OK)

```json
{
	"success": true,
	"data": {
		"assignments": {
			"total": 10,
			"notStarted": 3,
			"inProgress": 4,
			"completed": 2,
			"overdue": 1,
			"totalEstimatedHours": 45,
			"totalActualHours": 32
		},
		"notes": {
			"total": 5,
			"bySubject": {
				"Software Engineering": 3,
				"Mathematics": 1,
				"History": 1
			},
			"totalTags": 15,
			"uniqueTags": 8,
			"averageContentLength": 245
		},
		"database": {
			"assignments": 10,
			"notes": 5
		}
	}
}
```

## API Information

**GET** `/`

Retrieves API information and available endpoints.

### Response (200 OK)

```json
{
	"success": true,
	"message": "Academic Organizer API",
	"version": "1.0.0",
	"endpoints": {
		"assignments": "/api/assignments",
		"notes": "/api/notes",
		"health": "/api/health",
		"stats": "/api/stats"
	}
}
```

---

# 📋 Rate Limiting

The API implements rate limiting to prevent abuse:

-  **Limit**: 100 requests per 15-minute window per IP
-  **Response when exceeded**:

```json
{
	"success": false,
	"error": "Too many requests from this IP, please try again later."
}
```

# 🔐 CORS Policy

CORS is configured to allow requests from:

-  Development: `http://localhost:3000`, `http://127.0.0.1:3000`

# 📦 Request/Response Headers

### Common Request Headers

-  `Content-Type: application/json`
-  `Accept: application/json`

### Common Response Headers

-  `Content-Type: application/json`
-  `X-Content-Type-Options: nosniff`
-  `X-Frame-Options: DENY`
-  `X-XSS-Protection: 1; mode=block`

# 🐛 Error Handling

All endpoints return consistent error responses with appropriate HTTP status codes and descriptive messages. Validation errors include field-specific details.

### Validation Error Example

```json
{
	"success": false,
	"error": "Validation failed",
	"data": {
		"errors": [
			{
				"field": "title",
				"message": "Title is required",
				"value": ""
			},
			{
				"field": "dueDate",
				"message": "Due date cannot be in the past",
				"value": "2025-06-20T10:00:00.000Z"
			}
		]
	}
}
```
