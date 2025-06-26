# 🎓 Academic Organizer

A modern, full-stack web application for students to manage assignments, notes, and track academic progress. Built with React, TypeScript, and Node.js.

## ✨ Features

### 📚 Assignment Management
- Create and edit assignments with detailed information
- Priority levels (High, Medium, Low) with visual indicators
- Status tracking (Not Started, In Progress, Completed, Overdue)
- Due date management with automatic overdue detection
- Time estimation and actual time tracking
- Subject categorization and tagging system
- Advanced filtering and sorting options

### 📝 Note Taking
- Rich text notes with subject categorization
- Assignment linking to connect notes with specific assignments
- Tag system for better organization
- Search functionality across all notes
- Last accessed tracking for recent notes

### 📊 Dashboard & Analytics
- Overview statistics showing completion rates and progress
- Upcoming assignments with urgency indicators
- Overdue assignment alerts and warnings
- Recent notes for quick access
- Progress visualization with completion percentages

### 🎨 User Experience
- Dark/Light mode with system preference detection
- Fully responsive design for all device sizes
- Real-time updates and seamless interactions
- Error handling with retry mechanisms
- Loading states and skeleton screens
- Export functionality for data portability

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v16.0.0 or higher)
- npm (v7.0.0 or higher)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/levancho414/Academic-Organizer/
   cd academic-organizer
   ```

2. **Install dependencies for both frontend and backend**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   cp backend/.env.example backend/.env
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

   This starts:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## 📁 Project Structure

```
academic-organizer/
├── frontend/                 # React TypeScript application
│   ├── src/
│   │   ├── api/             # API configuration and endpoints
│   │   ├── components/      # Reusable React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page-level components
│   │   ├── styles/         # CSS modules and styling
│   │   ├── types/          # TypeScript type definitions
│   │   └── utils/          # Utility functions
│   └── package.json        # Frontend dependencies
├── backend/                 # Node.js Express API
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Data models
│   │   ├── routes/         # API route definitions
│   │   ├── types/          # TypeScript interfaces
│   │   └── utils/          # Utility functions
│   ├── data/               # JSON file storage
│   └── package.json        # Backend dependencies
└── package.json            # Workspace configuration
```

## 🛠️ Available Scripts

**Root level:**
- `npm run dev` - Start both development servers
- `npm run build` - Build both applications for production
- `npm run install:all` - Install dependencies for all workspaces
- `npm test` - Run tests for both applications

**Frontend specific:**
- `npm run dev:frontend` - Start only the frontend development server
- `npm run build:frontend` - Build frontend for production

**Backend specific:**
- `npm run dev:backend` - Start only the backend development server
- `npm run build:backend` - Build backend for production

## 🔧 Configuration

### Environment Variables

**Backend (.env):**
```bash
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔒 Security Features

- Input validation on both frontend and backend
- CORS configuration for production
- Rate limiting to prevent API abuse
- Helmet.js for security headers
- Comprehensive error handling

## 📊 API Documentation

The backend includes comprehensive API documentation. See `backend/API_DOCUMENTATION.md` for detailed endpoint information.

## 🧪 Testing

The backend includes API testing utilities:

```bash
cd backend
node api-testing.js
```