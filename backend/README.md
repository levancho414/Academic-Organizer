# Academic Organizer API

A RESTful API for managing academic assignments and notes built with Node.js, Express, and TypeScript.

## 🚀 Quick Start

### Prerequisites

-  Node.js 16+
-  npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/levancho414/Academic-Organizer/
cd academic-organizer/backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

The API will be available at `http://localhost:5000/api`

## 📚 Documentation

-  **[Full API Documentation](./API_DOCUMENTATION.md)** - Complete endpoint reference
-  **[Testing Guide](./api-testing.js)** - Example requests and testing utilities

## 🛠 Available Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Build TypeScript to JavaScript
npm start           # Start production server
npm test            # Run tests
npm run test:db     # Test database operations
npm run lint        # Check code style
npm run lint:fix    # Fix code style issues
```

## 🔧 Environment Variables

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

## 📊 API Overview

### Base URL

```
http://localhost:5000/api
```

### Quick Reference

| Method          | Endpoint                  | Description              |
| --------------- | ------------------------- | ------------------------ |
| GET             | `/health`                 | Health check             |
| GET             | `/stats`                  | System statistics        |
| **Assignments** |                           |                          |
| POST            | `/assignments`            | Create assignment        |
| GET             | `/assignments`            | List all assignments     |
| GET             | `/assignments/:id`        | Get assignment by ID     |
| PUT             | `/assignments/:id`        | Update assignment        |
| DELETE          | `/assignments/:id`        | Delete assignment        |
| PATCH           | `/assignments/:id/status` | Update assignment status |
| GET             | `/assignments/search`     | Search assignments       |
| GET             | `/assignments/upcoming`   | Get upcoming assignments |
| GET             | `/assignments/overdue`    | Get overdue assignments  |
| **Notes**       |                           |                          |
| POST            | `/notes`                  | Create note              |
| GET             | `/notes`                  | List all notes           |
| GET             | `/notes/:id`              | Get note by ID           |
| PUT             | `/notes/:id`              | Update note              |
| DELETE          | `/notes/:id`              | Delete note              |
| GET             | `/notes/search`           | Search notes             |
| GET             | `/notes/assignment/:id`   | Get notes by assignment  |
| GET             | `/notes/stats`            | Get notes statistics     |

## 🧪 Testing

### Using the Test Suite

```javascript
// Import the testing utilities
const { runComprehensiveTests } = require("./api-testing.js");

// Run all tests
await runComprehensiveTests();
```

### Manual Testing with cURL

```bash
# Health check
curl -X GET http://localhost:5000/api/health

# Create assignment
curl -X POST http://localhost:5000/api/assignments \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Assignment",
    "subject": "Testing",
    "dueDate": "2025-12-31T23:59:59.000Z",
    "priority": "medium",
    "estimatedHours": 2
  }'
```

## 📋 Data Models

### Assignment

```typescript
interface Assignment {
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
```

### Note

```typescript
interface Note {
	id: string;
	title: string;
	content: string;
	subject: string;
	tags: string[];
	assignmentId?: string;
	createdAt: Date;
	updatedAt: Date;
	lastAccessedAt: Date;
}
```

## 🔒 Security Features

-  **Rate Limiting**: 100 requests per 15 minutes per IP
-  **CORS**: Configured for frontend domain
-  **Helmet**: Security headers
-  **Input Validation**: Comprehensive validation with express-validator
-  **Error Handling**: Sanitized error responses

## 🗄️ Database

Currently uses JSON file storage for simplicity:

-  `backend/data/assignments.json`
-  `backend/data/notes.json`

The architecture is designed to easily migrate to a proper database (PostgreSQL, MongoDB, etc.) in the future.

## 📈 Performance

-  **Compression**: Response compression enabled
-  **Caching**: Appropriate cache headers
-  **Pagination**: Built-in pagination for large datasets
-  **Indexing**: Optimized queries for JSON storage

## 🐛 Error Handling

All endpoints return consistent error responses:

```json
{
	"success": false,
	"error": "Error message",
	"message": "Additional context"
}
```

Common HTTP status codes:

-  `400` - Bad Request (validation errors)
-  `401` - Unauthorized
-  `403` - Forbidden
-  `404` - Not Found
-  `409` - Conflict
-  `429` - Too Many Requests
-  `500` - Internal Server Error

## 📦 Dependencies

### Production

-  **express**: Web framework
-  **cors**: Cross-origin resource sharing
-  **helmet**: Security middleware
-  **morgan**: HTTP request logger
-  **express-validator**: Input validation
-  **express-rate-limit**: Rate limiting
-  **compression**: Response compression

### Development

-  **typescript**: Type safety
-  **ts-node-dev**: Development server with hot reload
-  **@types/\***: TypeScript definitions

## 🔄 API Versioning

Current version: `v1` (implicit)
Future versions will be explicitly versioned: `/api/v2/...`

## 📞 Support

For issues and questions:

1. Check the [API Documentation](./API_DOCUMENTATION.md)
2. Run the test suite to verify setup
3. Check server logs for detailed error information
