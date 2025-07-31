const express = require("express");
const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
	try {
		const barbers = await prisma.barber.findMany();
		res.json(barbers);
	} catch (error) {
		res.status(500).json({ error: "Failed to fetch barbers" });
	}
});

router.get("/search", async (req, res) => {
	try {
		const { location, hairType } = req.query;

		const barbers = await prisma.barber.findMany({
			where: {
				location: location
					? { contains: location, mode: "insensitive" }
					: undefined,
				specialties: hairType ? { has: hairType } : undefined,
			},
		});

		res.json(barbers);
	} catch (error) {
		res.status(500).json({ error: "Failed to search barbers" });
	}
});

router.get("/:id", async (req, res) => {
	try {
		const barber = await prisma.barber.findUnique({
			where: { id: req.params.id },
		});

		if (!barber) {
			return res.status(404).json({ error: "Barber not found" });
		}

		res.json(barber);
	} catch (error) {
		res.status(500).json({ error: "Failed to fetch barber details" });
	}
});

module.exports = router;
