const express = require("express");
const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.post("/register", async (req, res) => {
	try {
		const { email, password, name, hairType, location } = req.body;

		const existingUser = await prisma.user.findUnique({
			where: { email },
		});

		if (existingUser) {
			return res.status(400).json({ error: "User already exists" });
		}

		const newUser = await prisma.user.create({
			data: {
				email,
				passwordHash: password,
				name,
				hairType,
				location,
			},
		});

		res
			.status(201)
			.json({ message: "User registered successfully", user: newUser });
	} catch (error) {
		res.status(500).json({ error: "Failed to register user" });
	}
});

router.post("/register-barber", async (req, res) => {
	try {
		const { email, password, name, businessName, location, specialties } =
			req.body;

		const existingBarber = await prisma.barber.findUnique({
			where: { email },
		});

		if (existingBarber) {
			return res.status(400).json({ error: "Barber already exists" });
		}

		const newBarber = await prisma.barber.create({
			data: {
				email,
				passwordHash: password,
				name,
				businessName,
				location,
				specialties: specialties || [],
			},
		});

		res
			.status(201)
			.json({ message: "Barber registered successfully", barber: newBarber });
	} catch (error) {
		res.status(500).json({ error: "Failed to register barber" });
	}
});

router.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await prisma.user.findUnique({
			where: { email },
		});

		if (!user) {
			return res.status(401).json({ error: "Invalid credentials" });
		}

		if (user.passwordHash !== password) {
			return res.status(401).json({ error: "Invalid credentials" });
		}

		res.json({ message: "Login successful", user });
	} catch (error) {
		res.status(500).json({ error: "Failed to login" });
	}
});

module.exports = router;
