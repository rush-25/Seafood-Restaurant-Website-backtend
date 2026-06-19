import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().regex(/^(0|\+94)[\s-]*\d{2}[\s-]*\d{3}[\s-]*\d{4}$/, "Please enter a valid phone number (e.g. 0712345678 or +94712345678)"),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
