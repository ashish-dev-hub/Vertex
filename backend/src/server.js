require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {await connectDB();
        app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
        });
    } 
    catch (error) {console.error("Failed to start Sever:",error.message);
    }
};

startServer();