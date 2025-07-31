const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
	res.json({ message: "Appointment route" });
});

router.get("/", (req, res) => {
	res.json({ message: "Get appointments" });
});
module.exports = router;
