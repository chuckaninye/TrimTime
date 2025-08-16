const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
		const saltRounds = 10;
		const hashedPassword = await bcrypt.hash(password, saltRounds);

		const newUser = await prisma.user.create({
			data: {
				email,
				passwordHash: hashedPassword,
				name,
				hairType,
				location,
			},
		});

		const token = jwt.sign(
			{ userId: newUser.id, email: newUser.email },
			process.env.JWT_SECRET,
			{ expiresIn: "24h" }
		);

		const { passwordHash, ...userWithoutPassword } = newUser;

		res.status(201).json({
			message: "User registered successfully",
			user: userWithoutPassword,
			token,
		});
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

		const saltRounds = 10;
		const hashedPassword = await bcrypt.hash(password, saltRounds);

		const newBarber = await prisma.barber.create({
			data: {
				email,
				passwordHash: hashedPassword,
				name,
				businessName,
				location,
				specialties: specialties || [],
			},
		});

		const token = jwt.sign(
			{ barberId: newBarber.id, email: newBarber.email },
			process.env.JWT_SECRET,
			{ expiresIn: "24h" }
		);

		const { passwordHash, ...barberWithoutPassword } = newBarber;

		res.status(201).json({
			message: "Barber registered successfully",
			barber: barberWithoutPassword,
			token,
		});
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

		const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

		if (!isPasswordValid) {
			return res.status(401).json({ error: "Invalid credentials" });
		}

		const token = jwt.sign(
			{ userId: user.id, email: user.email },
			process.env.JWT_SECRET,
			{ expiresIn: "24h" }
		);

		const { passwordHash, ...userWithoutPassword } = user;

		res.json({ message: "Login successful", user: userWithoutPassword, token });
	} catch (error) {
		res.status(500).json({ error: "Failed to login" });
	}
});

router.post("/login/barber", async (req, res) => {
	try {
		const { email, password } = req.body;

		const barber = await prisma.barber.findUnique({
			where: { email },
		});

		if (!barber) {
			return res.status(401).json({ error: "Invalid credentials" });
		}

		const isPasswordValid = await bcrypt.compare(password, barber.passwordHash);

		if (!isPasswordValid) {
			return res.status(401).json({ error: "Invalid credentials" });
		}

		const token = jwt.sign(
			{
				barberId: barber.id,
				email: barber.email,
			},
			process.env.JWT_SECRET,
			{ expiresIn: "24h" }
		);

		const { passwordHash, ...barberWithoutPassword } = barber;

		res.json({
			message: "Login successful",
			barber: barberWithoutPassword,
			token,
		});
	} catch (error) {
		res.status(500).json({ error: "Failed to login" });
	}
});

module.exports = router;
