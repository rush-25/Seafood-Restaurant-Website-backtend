import express from "express";
import authController from "../controllers/authController.js";

const router = express.Router();

// REGISTER USER
router.post("/register", authController.register);

// LOGIN USER
router.post("/login", authController.login);

export default router;

