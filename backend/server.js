require("dotenv").config();

const express = require("express");
const db=require("./config/db");
const app= express();
const authRoutes = require("./routes/authRoutes");
const PORT = process.env.PORT || 5000;;
const userRoutes = require("./routes/userRoutes");
const companyRoutes = require("./routes/companyRoutes");
const applicationRoutes=require("./routes/applicationRoutes");

app.get("/", (req,res) => {
    res.json({ 
        message: "JOb Tracker API is running",
    });
});

app.get("/api/test-db", async (req,res) => {
    try {
        const [rows] = await db.query("SELECT 1 as result");
        res.json({
            message: "Database connected successfully",
            result: rows[0].result,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Database connection failed",
        });
    }
});
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/applications", applicationRoutes);
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
