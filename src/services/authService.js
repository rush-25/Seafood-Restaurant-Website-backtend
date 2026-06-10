import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "restaurant_secret_key_12345";

export async function registerUser(data) {
  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) {
    throw new Error("Email is already registered");
  }

  const newUser = new User(data);
  return await newUser.save();
}

export async function loginUser(data) {
  const user = await User.findOne({ email: data.email });
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const passwordMatch = await user.comparePassword(data.password);
  if (!passwordMatch) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
  return { user, token };
}

export function generateToken(user) {
  return jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
}
