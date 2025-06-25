
const BASE_URL = 'http://localhost:5000/api';

// Helper function for making requests (if using in a JavaScript environment)
async function apiRequest(method, endpoint, data = null) {
  const url = `${BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };
  
  if (data) {
    options.body = JSON.stringify(data);
  }
  
  try {
    const response = await fetch(url, options);
    const result = await response.json();
    
    console.log(`${method} ${endpoint}:`, {
      status: response.status,
      data: result
    });
    
    return result;
  } catch (error) {
    console.error(`Error ${method} ${endpoint}:`, error);
    throw error;
  }
}

// =============================================================================
// SYSTEM ENDPOINTS
// =============================================================================

// Health Check
async function testHealthCheck() {
  return await apiRequest('GET', '/health');
}

// Get API Information
async function testApiInfo() {
  return await apiRequest('GET', '/');
}

// Get System Statistics
async function testSystemStats() {
  return await apiRequest('GET', '/stats');
}

// =============================================================================
// ASSIGNMENT ENDPOINTS
// =============================================================================

// Create Assignment
async function testCreateAssignment() {
  const assignmentData = {
    title: "Complete API Documentation",
    description: "Create comprehensive API documentation with examples and testing files",
    subject: "Software Engineering",
    dueDate: "2025-06-27T23:59:59.000Z",
    priority: "high",
    estimatedHours: 3,
    tags: ["documentation", "api", "testing"]
  };
  
  return await apiRequest('POST', '/assignments', assignmentData);
}

// Get All Assignments (with filtering and pagination)
async function testGetAllAssignments() {
  // Basic request
  await apiRequest('GET', '/assignments');
  
  // With filtering and pagination
  await apiRequest('GET', '/assignments?status=in-progress&priority=high&page=1&limit=5&sortBy=dueDate&sortOrder=asc');
  
  // With date filtering
  await apiRequest('GET', '/assignments?startDate=2025-06-25T00:00:00.000Z&endDate=2025-06-30T23:59:59.000Z');
  
  // With subject and tags filtering
  await apiRequest('GET', '/assignments?subject=Software&tags=documentation,api');
}

// Get Assignment by ID
async function testGetAssignmentById(assignmentId) {
  return await apiRequest('GET', `/assignments/${assignmentId}`);
}

// Update Assignment
async function testUpdateAssignment(assignmentId) {
  const updateData = {
    title: "Complete API Documentation - Updated",
    status: "in-progress",
    actualHours: 1.5,
    tags: ["documentation", "api", "testing", "updated"]
  };
  
  return await apiRequest('PUT', `/assignments/${assignmentId}`, updateData);
}

// Update Assignment Status
async function testUpdateAssignmentStatus(assignmentId) {
  const statusData = {
    status: "completed"
  };
  
  return await apiRequest('PATCH', `/assignments/${assignmentId}/status`, statusData);
}

// Search Assignments
async function testSearchAssignments() {
  await apiRequest('GET', '/assignments/search?q=documentation&page=1&limit=10');
  await apiRequest('GET', '/assignments/search?q=API');
}

// Get Upcoming Assignments
async function testGetUpcomingAssignments() {
  return await apiRequest('GET', '/assignments/upcoming?page=1&limit=10');
}

// Get Overdue Assignments
async function testGetOverdueAssignments() {
  return await apiRequest('GET', '/assignments/overdue?page=1&limit=10');
}

// Delete Assignment
async function testDeleteAssignment(assignmentId) {
  return await apiRequest('DELETE', `/assignments/${assignmentId}`);
}

// =============================================================================
// NOTE ENDPOINTS
// =============================================================================

// Create Note
async function testCreateNote(assignmentId = null) {
  const noteData = {
    title: "API Documentation Notes",
    content: "Important points for API documentation:\n\n1. Include all endpoints\n2. Provide request/response examples\n3. Document error codes\n4. Add authentication details\n5. Include rate limiting information",
    subject: "Software Engineering",
    tags: ["notes", "api", "documentation", "important"],
    assignmentId: assignmentId // Optional - link to assignment
  };
  
  return await apiRequest('POST', '/notes', noteData);
}

// Get All Notes
async function testGetAllNotes() {
  // Basic request
  await apiRequest('GET', '/notes');
  
  // With filtering
  await apiRequest('GET', '/notes?subject=Software Engineering');
  
  // Filter by assignment
  // await apiRequest('GET', '/notes?assignmentId=ASSIGNMENT_ID_HERE');
}

// Get Note by ID
async function testGetNoteById(noteId) {
  return await apiRequest('GET', `/notes/${noteId}`);
}

// Update Note
async function testUpdateNote(noteId) {
  const updateData = {
    title: "API Documentation Notes - Updated",
    content: "Updated content with additional information:\n\n1. Include all endpoints ✓\n2. Provide request/response examples ✓\n3. Document error codes ✓\n4. Add authentication details ✓\n5. Include rate limiting information ✓\n6. Add testing examples ✓",
    tags: ["notes", "api", "documentation", "important", "updated"]
  };
  
  return await apiRequest('PUT', `/notes/${noteId}`, updateData);
}

// Search Notes
async function testSearchNotes() {
  await apiRequest('GET', '/notes/search?q=documentation');
  await apiRequest('GET', '/notes/search?q=API');
}

// Get Notes by Assignment
async function testGetNotesByAssignment(assignmentId) {
  return await apiRequest('GET', `/notes/assignment/${assignmentId}`);
}

// Get Notes Statistics
async function testGetNotesStats() {
  return await apiRequest('GET', '/notes/stats');
}

// Delete Note
async function testDeleteNote(noteId) {
  return await apiRequest('DELETE', `/notes/${noteId}`);
}

// =============================================================================
// COMPREHENSIVE TEST SUITE
// =============================================================================

async function runComprehensiveTests() {
  console.log('🧪 Starting Comprehensive API Tests...\n');
  
  try {
    // 1. System Health Check
    console.log('1️⃣ Testing System Endpoints...');
    await testHealthCheck();
    await testApiInfo();
    await testSystemStats();
    
    // 2. Create and Test Assignment
    console.log('\n2️⃣ Testing Assignment Creation...');
    const assignmentResult = await testCreateAssignment();
    const assignmentId = assignmentResult.data.id;
    console.log(`Created assignment with ID: ${assignmentId}`);
    
    // 3. Test Assignment Retrieval
    console.log('\n3️⃣ Testing Assignment Retrieval...');
    await testGetAllAssignments();
    await testGetAssignmentById(assignmentId);
    await testSearchAssignments();
    await testGetUpcomingAssignments();
    await testGetOverdueAssignments();
    
    // 4. Test Assignment Updates
    console.log('\n4️⃣ Testing Assignment Updates...');
    await testUpdateAssignment(assignmentId);
    await testUpdateAssignmentStatus(assignmentId);
    
    // 5. Create and Test Note
    console.log('\n5️⃣ Testing Note Creation...');
    const noteResult = await testCreateNote(assignmentId);
    const noteId = noteResult.data.id;
    console.log(`Created note with ID: ${noteId}`);
    
    // 6. Test Note Retrieval
    console.log('\n6️⃣ Testing Note Retrieval...');
    await testGetAllNotes();
    await testGetNoteById(noteId);
    await testSearchNotes();
    await testGetNotesByAssignment(assignmentId);
    await testGetNotesStats();
    
    // 7. Test Note Updates
    console.log('\n7️⃣ Testing Note Updates...');
    await testUpdateNote(noteId);
    
    // 8. Final System Stats
    console.log('\n8️⃣ Final System Statistics...');
    await testSystemStats();
    
    // 9. Cleanup (optional - uncomment to delete test data)
    // console.log('\n9️⃣ Cleaning up test data...');
    // await testDeleteNote(noteId);
    // await testDeleteAssignment(assignmentId);
    
        console.log('\n✅ All tests completed successfully!');
      } catch (error) {
        console.error('❌ Error during comprehensive tests:', error);
      }
    }
    
    // Uncomment the following line to run the comprehensive tests automatically
    // runComprehensiveTests();
        
