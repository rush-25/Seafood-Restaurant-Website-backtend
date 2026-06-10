import jwt from "jsonwebtoken";
import { loginSchema, registerSchema } from "../schemas/auth.js";
import { generateToken, loginUser, registerUser } from "../services/authService.js";

// Hardcoded admin credentials
const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "admin1234";
const JWT_SECRET = process.env.JWT_SECRET || "restaurant_secret_key_12345";

const authController = {
  async register(req, res) {
    try {
      const data = registerSchema.parse(req.body);
      const user = await registerUser(data);
      const token = generateToken(user);

      res.status(201).json({
        message: "User registered successfully",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(400).json({
        message: error instanceof Error ? error.message : "Server error during registration",
      });
    }
  },

  async login(req, res) {
    try {
      const data = loginSchema.parse(req.body);

      // Check for hardcoded admin credentials first
      if (data.email === ADMIN_EMAIL && data.password === ADMIN_PASSWORD) {
        const token = jwt.sign(
          { email: ADMIN_EMAIL, role: "admin" },
          JWT_SECRET,
          { expiresIn: "24h" }
        );

        return res.status(200).json({
          message: "Logged in successfully",
          token,
          user: {
            id: "admin",
            name: "Administrator",
            email: ADMIN_EMAIL,
            role: "admin",
          },
        });
      }

      // Regular user login via database
      const { user, token } = await loginUser(data);

      res.status(200).json({
        message: "Logged in successfully",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(400).json({
        message: error instanceof Error ? error.message : "Server error during login",
      });
    }
  },
};

export default authController;

