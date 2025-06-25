import { Router } from "express";
import assignmentRoutes from "./assignmentRoutes";
import noteRoutes from "./noteRoutes";
import { AssignmentModel } from "../models/Assignment";
import { NoteModel } from "../models/Note";
import { dbUtils } from "../database";

const router = Router();

// Mount assignment routes
router.use("/assignments", assignmentRoutes);

// Mount note routes
router.use("/notes", noteRoutes);

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
        const [assignmentStats, noteStats, dbStats] = await Promise.all([
            AssignmentModel.getStats(),
            NoteModel.getStats(),
            dbUtils.getStats(),
        ]);

        res.json({
            success: true,
            data: {
                assignments: assignmentStats,
                notes: noteStats,
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
            notes: "/api/notes",
            health: "/api/health",
            stats: "/api/stats",
        },
    });
});

export default router;