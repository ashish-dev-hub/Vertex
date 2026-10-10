const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const studentRoutes = require("./routes/student.routes");
const recruiterRoutes = require("./routes/recruiter.routes");
const jobRoutes = require("./routes/job.routes");
const applicationRoutes = require("./routes/application.routes");
const mlRoutes = require("./routes/ml.routes");
const classificationRoutes = require("./routes/classification.routes");
const regressionRoutes = require("./routes/regression.routes");
const recommendationRoutes = require("./routes/recommendation.routes");
const protect = require("./middleware/auth.middleware");

const app = express();

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://frontend-three-alpha-c5u2r52o9u.vercel.app",
    process.env.CORS_ORIGIN,
]
    .filter(Boolean)
    .map((origin) => origin.replace(/\/$/, ""));
    
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        const normalizedOrigin = origin.replace(/\/$/, "");
        if (allowedOrigins.includes(normalizedOrigin)) {
            return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS: " + origin));
    },
    credentials: true,
}));

app.use(express.json());

app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,            // Backend check karne ke liye
        message: "backend is running properly"
    });
});


app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/recruiter", recruiterRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/ml", protect, mlRoutes);
app.use("/api/ml/classification", protect, classificationRoutes);
app.use("/api/ml/regression", protect, regressionRoutes);
app.use("/api/ml/recommendation", protect, recommendationRoutes);


app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

module.exports = app;