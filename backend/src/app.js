const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const studentRoutes = require("./routes/student.routes");
const recruiterRoutes = require("./routes/recruiter.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health",(req,res)=>{res.status(200).json({
        success: true,            // Backend check karne ke liye
        message: "backend is running properly"});
});

app.use("/api/auth",authRoutes);

app.use("/api/student", studentRoutes);

app.use("/api/recruiter", recruiterRoutes);

app.use((req,res)=>{res.status(404).json({
     success: false,
     message: "Route not found"});
});

module.exports = app;