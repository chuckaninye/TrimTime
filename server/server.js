const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const authRoutes = require("./routes/auth");
const appointmentRoutes = require("./routes/appointments");
const barberRoutes = require("./routes/barbers");
const userRoutes = require("./routes/users");

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/barbers", barberRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
	res.send("TrimTime backend is running");
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
