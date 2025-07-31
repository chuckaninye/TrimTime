const express = require("express");
const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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

router.post("/", async (req, res) => {
	try {
		const { userId, barberId, appointmentDate } = req.body;

		const newAppointment = await prisma.appointment.create({
			data: {
				userId,
				barberId,
				appointmentDate: new Date(appointmentDate),
			},
			include: {
				user: true,
				barber: true,
			},
		});

		res.status(201).json(newAppointment);
	} catch (error) {
		res.status(500).json({ error: "Failed to book appointment" });
	}
});

router.put("/:id", async (req, res) => {
	try {
		const { status } = req.body;

		const updatedAppointment = await prisma.appointment.update({
			where: { id: req.params.id },
			data: { status },
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

module.exports = router;
