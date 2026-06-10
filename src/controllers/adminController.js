import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "restaurant_secret_key_12345";

// Hardcoded admin credentials
const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "admin1234";

const adminController = {
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required",
        });
      }

      // Check against hardcoded admin credentials
      if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
        return res.status(401).json({
          success: false,
          message: "Invalid admin credentials",
        });
      }

      // Generate JWT token for admin
      const token = jwt.sign(
        { email: ADMIN_EMAIL, role: "admin" },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.status(200).json({
        success: true,
        message: "Admin logged in successfully",
        token,
        user: {
          name: "Administrator",
          email: ADMIN_EMAIL,
          role: "admin",
        },
      });
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({
        success: false,
        message: "Server error during admin login",
      });
    }
  },
};

export default adminController;
