/**
 * users.js
 *
 * Express router for user management endpoints.
 * Features: user retrieval, profile updates, user search.
 */

const express = require("express");
const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * GET / - Fetch all users (for admin purposes)
 * Returns: Array of all users (password hashes excluded)
 */
router.get("/", async (req, res) => {
	try {
		const users = await prisma.user.findMany({
			select: {
				id: true,
				name: true,
				email: true,
				hairType: true,
				location: true,
				createdAt: true,
				// passwordHash is excluded for security
			},
		});
		res.json(users);
	} catch (error) {
		console.error("Fetch users error:", error);
		res.status(500).json({ error: "Failed to fetch users" });
	}
});

/**
 * GET /profile/:id - Fetch specific user profile by ID
 * @param {string} id - The user's unique identifier
 * Returns: User profile data (password hash excluded)
 */
router.get("/profile/:id", async (req, res) => {
	try {
		const user = await prisma.user.findUnique({
			where: { id: req.params.id },
			select: {
				id: true,
				name: true,
				email: true,
				hairType: true,
				location: true,
				createdAt: true,
				// passwordHash is excluded for security
			},
		});

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		res.json(user);
	} catch (error) {
		console.error("Fetch user profile error:", error);
		res.status(500).json({ error: "Failed to fetch user profile" });
	}
});

/**
 * PUT /profile/:id - Update user profile information
 * @param {string} id - The user's unique identifier
 * Body: { name?, email?, hairType?, location? }
 * Returns: Updated user profile (password hash excluded)
 */
router.put("/profile/:id", async (req, res) => {
	try {
		const { name, email, hairType, location } = req.body;

		// Check if user exists
		const existingUser = await prisma.user.findUnique({
			where: { id: req.params.id },
		});

		if (!existingUser) {
			return res.status(404).json({ error: "User not found" });
		}

		// Update user profile
		const updatedUser = await prisma.user.update({
			where: { id: req.params.id },
			data: {
				...(name && { name }),
				...(email && { email }),
				...(hairType && { hairType }),
				...(location !== undefined && { location }),
			},
			select: {
				id: true,
				name: true,
				email: true,
				hairType: true,
				location: true,
				createdAt: true,
				// passwordHash is excluded for security
			},
		});

		res.json(updatedUser);
	} catch (error) {
		console.error("Update user profile error:", error);
		res.status(500).json({ error: "Failed to update user profile" });
	}
});

module.exports = router;
