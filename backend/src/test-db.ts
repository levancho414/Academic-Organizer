import { AssignmentModel } from "./models/Assignment";
import { initializeDatabase, dbUtils } from "./database";

async function testDatabase() {
	try {
		console.log("🧪 Testing database setup...");

		// Initialize database
		await initializeDatabase();

		// Test creating an assignment
		const testAssignment = await AssignmentModel.create({
			title: "Test Assignment",
			subject: "Computer Science",
			dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
			priority: "high",
			estimatedHours: 3,
			description: "This is a test assignment",
			tags: ["test", "database"],
		});

		console.log("✅ Created test assignment:", testAssignment.id);

		// Test getting all assignments
		const allAssignments = await AssignmentModel.getAll();
		console.log("✅ Retrieved assignments count:", allAssignments.length);

		// Test getting by ID
		const foundAssignment = await AssignmentModel.getById(testAssignment.id);
		console.log("✅ Found assignment by ID:", foundAssignment ? "Yes" : "No");

		// Test updating assignment
		const updatedAssignment = await AssignmentModel.updateById(
			testAssignment.id,
			{
				status: "in-progress",
				actualHours: 1.5,
			}
		);
		console.log("✅ Updated assignment status:", updatedAssignment?.status);

		// Test getting statistics
		const stats = await AssignmentModel.getStats();
		console.log("✅ Assignment statistics:", stats);

		// Test search
		const searchResults = await AssignmentModel.search("test");
		console.log("✅ Search results count:", searchResults.length);

		// Test upcoming assignments
		const upcoming = await AssignmentModel.getUpcoming();
		console.log("✅ Upcoming assignments count:", upcoming.length);

		// Test database stats
		const dbStats = await dbUtils.getStats();
		console.log("✅ Database stats:", dbStats);

		// Test deleting assignment
		const deleted = await AssignmentModel.deleteById(testAssignment.id);
		console.log("✅ Deleted assignment:", deleted ? "Yes" : "No");

		console.log("🎉 All database tests passed!");
	} catch (error) {
		console.error("❌ Database test failed:", error);
		process.exit(1);
	}
}

// Run the test
testDatabase();
