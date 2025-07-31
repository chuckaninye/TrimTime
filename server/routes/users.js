const express = require("express");
const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
	try {
		const users = await prisma.user.findMany();
		res.json(users);
	} catch (error) {
		res.status(500).json({ error: "Failed to fetch users" });
	}
});

router.get("/profile/:id", async (req, res) => {
	try {
		const user = await prisma.user.findUnique({ where: { id: req.params.id } });

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		res.json(user);
	} catch (error) {
		res.status(500).json({ error: "Failed to fetch user profile" });
	}
});

router.put("/profile/:id", async (req, res) => {
	try {
		const updatedUser = await prisma.user.update({
			where: { id: req.params.id },
			data: req.body,
		});
		res.json(updatedUser);
	} catch (error) {
		res.status(500).json({ error: "Failed to update user profile" });
	}
});

module.exports = router;
