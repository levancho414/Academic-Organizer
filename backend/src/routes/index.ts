import { Router } from "express";
import assignmentRoutes from "./assignmentRoutes";

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

// API info route
router.get("/", (req, res) => {
	res.json({
		success: true,
		message: "Academic Organizer API",
		version: "1.0.0",
		endpoints: {
			assignments: "/api/assignments",
			health: "/api/health",
		},
	});
});

export default router;
