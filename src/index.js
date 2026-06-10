import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import reservationRouter from "./routes/reservation.js";
import authRouter from "./routes/auth.js";
import contactRouter from "./routes/contact.js";
import adminRouter from "./routes/admin.js";

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from Backend/.env (one level up from src/)
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect Database
connectDB().catch((error) => {
  console.warn("Database connection failed; continuing without DB:", error?.message || error);
});

// Default Route
app.get("/", (req, res) => {
  res.send("Luxury Seafood Restaurant Backend Running...");
});

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/contact", contactRouter);
app.use("/api/reservations", reservationRouter);
app.use("/api/admin", adminRouter);

// Start Server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use. Please stop the process using this port or set a different PORT in .env.`);
  } else {
    console.error("Server error:", error);
  }
  process.exit(1);
});
