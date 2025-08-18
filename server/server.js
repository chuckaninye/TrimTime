/**
 * server.js
 *
 * Main Express server entry point for TrimTime application.
 * Features: middleware setup, route configuration, database connection, server initialization.
 */

const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Initialize Prisma client for database operations
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Import route modules
const authRoutes = require("./routes/auth");
const appointmentRoutes = require("./routes/appointments");
const barberRoutes = require("./routes/barbers");
const userRoutes = require("./routes/users");

// Initialize Express application
const app = express();
const port = process.env.PORT || 8000;

// ===== MIDDLEWARE CONFIGURATION =====

// Enable CORS for frontend communication
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// ===== ROUTE CONFIGURATION =====

// Mount API routes with /api prefix
app.use("/api/auth", authRoutes); // Authentication endpoints
app.use("/api/appointments", appointmentRoutes); // Appointment management
app.use("/api/barbers", barberRoutes); // Barber management
app.use("/api/users", userRoutes); // User management

// ===== ROOT ENDPOINT =====

// Health check endpoint
app.get("/", (req, res) => {
	res.send("TrimTime backend is running");
});

// ===== SERVER INITIALIZATION =====

// Start server and listen on specified port
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});

// ===== ERROR HANDLING =====

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
	console.error("Unhandled Promise Rejection:", err);
	process.exit(1);
});

// Graceful shutdown handling
process.on("SIGTERM", async () => {
	console.log("SIGTERM received, shutting down gracefully");
	await prisma.$disconnect();
	process.exit(0);
});
