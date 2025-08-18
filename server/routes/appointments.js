/**
 * appointments.js
 *
 * Express router for appointment management endpoints.
 * Features: CRUD operations, conflict prevention, status management, data validation.
 */

const express = require("express");
const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * GET / - Fetch all appointments with user and barber details
 * Returns: Array of appointments with related user and barber information
 */
router.get("/", async (req, res) => {
	try {
		const appointments = await prisma.appointment.findMany({
			include: {
				user: true,
				barber: true,
			},
		});
		res.json(appointments);
	} catch (error) {
		res.status(500).json({ error: "Failed to fetch appointments" });
	}
});

/**
 * GET /user/:userId - Fetch appointments for a specific user
 * @param {string} userId - The user's unique identifier
 * Returns: Array of user's appointments with barber details
 */
router.get("/user/:userId", async (req, res) => {
	try {
		const appointments = await prisma.appointment.findMany({
			where: { userId: req.params.userId },
			include: {
				barber: true,
			},
		});
		res.json(appointments);
	} catch (error) {
		res.status(500).json({ error: "Failed to fetch user appointments" });
	}
});

/**
 * GET /barber/:barberId - Fetch appointments for a specific barber
 * @param {string} barberId - The barber's unique identifier
 * Returns: Array of barber's appointments with user details
 */
router.get("/barber/:barberId", async (req, res) => {
	try {
		const appointments = await prisma.appointment.findMany({
			where: { barberId: req.params.barberId },
			include: {
				user: true,
			},
		});
		res.json(appointments);
	} catch (error) {
		res.status(500).json({ error: "Failed to fetch barber appointments" });
	}
});

/**
 * POST / - Create a new appointment with conflict prevention
 * Body: { userId, barberId, appointmentDate, serviceType?, notes? }
 * Returns: Created appointment with user and barber details
 */
router.post("/", async (req, res) => {
	try {
		const { userId, barberId, appointmentDate, serviceType, notes } = req.body;

		// Validate required fields
		if (!userId || !barberId || !appointmentDate) {
			return res.status(400).json({ error: "Missing required fields" });
		}

		const appointmentDateTime = new Date(appointmentDate);
		const now = new Date();

		// Ensure appointment is in the future
		if (appointmentDateTime <= now) {
			return res
				.status(400)
				.json({ error: "Appointment date must be in the future" });
		}

		// Enhanced conflict check with 30-minute time window
		const startTime = new Date(appointmentDateTime.getTime() - 30 * 60000); // 30 minutes before
		const endTime = new Date(appointmentDateTime.getTime() + 30 * 60000); // 30 minutes after

		const existingAppointment = await prisma.appointment.findFirst({
			where: {
				barberId: barberId,
				appointmentDate: {
					gte: startTime,
					lte: endTime,
				},
				status: { in: ["booked", "confirmed"] },
			},
		});

		// Prevent double-booking
		if (existingAppointment) {
			return res.status(409).json({
				error:
					"Barber is not available at this time. Please choose a different time.",
			});
		}

		// Create new appointment
		const newAppointment = await prisma.appointment.create({
			data: {
				userId,
				barberId,
				appointmentDate: appointmentDateTime,
				serviceType: serviceType || "Haircut",
				notes: notes || "",
				status: "booked",
			},
			include: {
				user: true,
				barber: true,
			},
		});

		res.status(201).json(newAppointment);
	} catch (error) {
		console.error("Appointment creation error:", error);
		res.status(500).json({ error: "Failed to book appointment" });
	}
});

/**
 * PUT /:id - Update appointment status and notes
 * @param {string} id - The appointment's unique identifier
 * Body: { status?, notes? }
 * Returns: Updated appointment with user and barber details
 */
router.put("/:id", async (req, res) => {
	try {
		const { status, notes } = req.body;

		const updatedAppointment = await prisma.appointment.update({
			where: { id: req.params.id },
			data: {
				status: status || "confirmed",
				notes: notes || "",
			},
			include: {
				user: true,
				barber: true,
			},
		});

		res.json(updatedAppointment);
	} catch (error) {
		res.status(500).json({ error: "Failed to update appointment" });
	}
});

/**
 * DELETE /:id - Soft delete appointment by setting status to 'cancelled'
 * @param {string} id - The appointment's unique identifier
 * Returns: Success message
 */
router.delete("/:id", async (req, res) => {
	try {
		await prisma.appointment.update({
			where: { id: req.params.id },
			data: { status: "cancelled" },
		});

		res.json({ message: "Appointment cancelled successfully" });
	} catch (error) {
		res.status(500).json({ error: "Failed to cancel appointment" });
	}
});

module.exports = router;
