const express = require("express");
const router = express.Router();

router.get("/search", (req, res) => {
	res.json({ message: "Search barbers" });
});

router.get("/:id", (req, res) => {
	res.json({ message: "Get barber details" });
});

module.exports = router;
