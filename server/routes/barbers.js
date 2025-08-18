/**
 * barbers.js
 *
 * Express router for barber management and search endpoints.
 * Features: barber retrieval, search functionality, profile management.
 */

const express = require("express");
const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * GET / - Fetch all barbers (for admin purposes)
 * Returns: Array of all barbers (password hashes excluded)
 */
router.get("/", async (req, res) => {
	try {
		const barbers = await prisma.barber.findMany({
			select: {
				id: true,
				name: true,
				email: true,
				businessName: true,
				location: true,
				specialties: true,
				rating: true,
				createdAt: true,
				// passwordHash is excluded for security
			},
		});
		res.json(barbers);
	} catch (error) {
		console.error("Fetch barbers error:", error);
		res.status(500).json({ error: "Failed to fetch barbers" });
	}
});

/**
 * GET /search - Search barbers by location and hair type specialties
 * Query params: { location?, hairType? }
 * Returns: Array of matching barbers (password hashes excluded)
 */
router.get("/search", async (req, res) => {
	try {
		const { location, hairType } = req.query;

		// Build search criteria
		const whereClause = {};

		// Location search (case-insensitive, partial match)
		if (location) {
			whereClause.location = {
				contains: location,
				mode: "insensitive",
			};
		}

		// Hair type specialty search
		if (hairType) {
			whereClause.specialties = {
				has: hairType,
			};
		}

		// Execute search query
		const barbers = await prisma.barber.findMany({
			where: whereClause,
			select: {
				id: true,
				name: true,
				email: true,
				businessName: true,
				location: true,
				specialties: true,
				rating: true,
				createdAt: true,
				// passwordHash is excluded for security
			},
			orderBy: {
				rating: "desc", // Sort by rating (highest first)
			},
		});

		res.json(barbers);
	} catch (error) {
		console.error("Search barbers error:", error);
		res.status(500).json({ error: "Failed to search barbers" });
	}
});

/**
 * GET /:id - Fetch specific barber profile by ID
 * @param {string} id - The barber's unique identifier
 * Returns: Barber profile data (password hash excluded)
 */
router.get("/:id", async (req, res) => {
	try {
		const barber = await prisma.barber.findUnique({
			where: { id: req.params.id },
			select: {
				id: true,
				name: true,
				email: true,
				businessName: true,
				location: true,
				specialties: true,
				rating: true,
				createdAt: true,
				// passwordHash is excluded for security
			},
		});

		if (!barber) {
			return res.status(404).json({ error: "Barber not found" });
		}

		res.json(barber);
	} catch (error) {
		console.error("Fetch barber profile error:", error);
		res.status(500).json({ error: "Failed to fetch barber profile" });
	}
});

module.exports = router;
