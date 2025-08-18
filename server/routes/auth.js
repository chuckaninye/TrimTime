/**
 * auth.js
 *
 * Express router for user and barber authentication endpoints.
 * Features: registration, login, password hashing, JWT token generation.
 */

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * POST /register - Register a new user account
 * Body: { name, email, password, hairType, location? }
 * Returns: User object with JWT token (password hash excluded)
 */
router.post("/register", async (req, res) => {
	try {
		const { name, email, password, hairType, location } = req.body;

		// Check if user already exists
		const existingUser = await prisma.user.findUnique({
			where: { email },
		});

		if (existingUser) {
			return res.status(400).json({ error: "User already exists" });
		}

		// Hash password for security
		const saltRounds = 10;
		const hashedPassword = await bcrypt.hash(password, saltRounds);

		// Create new user
		const user = await prisma.user.create({
			data: {
				name,
				email,
				passwordHash: hashedPassword,
				hairType,
				location: location || "",
			},
		});

		// Generate JWT token
		const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
			expiresIn: "24h",
		});

		// Return user data (excluding password hash) and token
		const { passwordHash, ...userWithoutPassword } = user;
		res.status(201).json({
			user: userWithoutPassword,
			token,
		});
	} catch (error) {
		console.error("User registration error:", error);
		res.status(500).json({ error: "Failed to register user" });
	}
});

/**
 * POST /register-barber - Register a new barber account
 * Body: { name, email, password, phone?, businessName, location, specialties }
 * Returns: Barber object with JWT token (password hash excluded)
 */
router.post("/register-barber", async (req, res) => {
	try {
		const {
			name,
			email,
			password,
			phone,
			businessName,
			location,
			specialties,
		} = req.body;

		// Check if barber already exists
		const existingBarber = await prisma.barber.findUnique({
			where: { email },
		});

		if (existingBarber) {
			return res.status(400).json({ error: "Barber already exists" });
		}

		// Hash password for security
		const saltRounds = 10;
		const hashedPassword = await bcrypt.hash(password, saltRounds);

		// Create new barber
		const barber = await prisma.barber.create({
			data: {
				name,
				email,
				passwordHash: hashedPassword,
				phone: phone || "",
				businessName,
				location,
				specialties,
				rating: 0,
			},
		});

		// Generate JWT token
		const token = jwt.sign({ barberId: barber.id }, process.env.JWT_SECRET, {
			expiresIn: "24h",
		});

		// Return barber data (excluding password hash) and token
		const { passwordHash, ...barberWithoutPassword } = barber;
		res.status(201).json({
			barber: barberWithoutPassword,
			token,
		});
	} catch (error) {
		console.error("Barber registration error:", error);
		res.status(500).json({ error: "Failed to register barber" });
	}
});

/**
 * POST /login - Authenticate existing user
 * Body: { email, password }
 * Returns: User object with JWT token (password hash excluded)
 */
router.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;

		// Find user by email
		const user = await prisma.user.findUnique({
			where: { email },
		});

		if (!user) {
			return res.status(400).json({ error: "Invalid credentials" });
		}

		// Verify password
		const isValidPassword = await bcrypt.compare(password, user.passwordHash);
		if (!isValidPassword) {
			return res.status(400).json({ error: "Invalid credentials" });
		}

		// Generate JWT token
		const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
			expiresIn: "24h",
		});

		// Return user data (excluding password hash) and token
		const { passwordHash, ...userWithoutPassword } = user;
		res.json({
			user: userWithoutPassword,
			token,
		});
	} catch (error) {
		console.error("User login error:", error);
		res.status(500).json({ error: "Failed to login" });
	}
});

/**
 * POST /login-barber - Authenticate existing barber
 * Body: { email, password }
 * Returns: Barber object with JWT token (password hash excluded)
 */
router.post("/login-barber", async (req, res) => {
	try {
		const { email, password } = req.body;

		// Find barber by email
		const barber = await prisma.barber.findUnique({
			where: { email },
		});

		if (!barber) {
			return res.status(400).json({ error: "Invalid credentials" });
		}

		// Verify password
		const isValidPassword = await bcrypt.compare(password, barber.passwordHash);
		if (!isValidPassword) {
			return res.status(400).json({ error: "Invalid credentials" });
		}

		// Generate JWT token
		const token = jwt.sign({ barberId: barber.id }, process.env.JWT_SECRET, {
			expiresIn: "24h",
		});

		// Return barber data (excluding password hash) and token
		const { passwordHash, ...barberWithoutPassword } = barber;
		res.json({
			barber: barberWithoutPassword,
			token,
		});
	} catch (error) {
		console.error("Barber login error:", error);
		res.status(500).json({ error: "Failed to login" });
	}
});

module.exports = router;
