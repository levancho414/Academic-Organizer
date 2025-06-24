import { Router } from "express";
import assignmentRoutes from "./assignmentRoutes";
import { AssignmentModel } from "../models/Assignment";
import { dbUtils } from "../database";

const router = Router();

// Mount assignment routes
router.use("/assignments", assignmentRoutes);

// Health check route
router.get("/health", (req, res) => {
	res.json({
		success: true,
		message: "API is healthy",
		timestamp: new Date().toISOString(),
		environment: process.env.NODE_ENV || "development",
	});
});

// Database stats route
router.get("/stats", async (req, res) => {
	try {
		const [assignmentStats, dbStats] = await Promise.all([
			AssignmentModel.getStats(),
			dbUtils.getStats(),
		]);

		res.json({
			success: true,
			data: {
				assignments: assignmentStats,
				database: dbStats,
			},
		});
	} catch (error) {
		console.error("Error getting stats:", error);
		res.status(500).json({
			success: false,
			error: "Failed to get statistics",
		});
	}
});

// API info route
router.get("/", (req, res) => {
	res.json({
		success: true,
		message: "Academic Organizer API",
		version: "1.0.0",
		endpoints: {
			assignments: "/api/assignments",
			health: "/api/health",
			stats: "/api/stats",
		},
	});
});

export default router;
