import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().regex(/^(?:\+94|0)\s?\d{2}\s?\d{3}\s?\d{4}$/),
  date: z.string().optional().or(z.literal("")),
  time: z.string().optional().or(z.literal("")),
  subject: z.enum(["Reservation", "Private Event", "Menu Inquiry", "Feedback", "Other"]),
  message: z.string().min(5),
});
