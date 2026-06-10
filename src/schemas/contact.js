import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().regex(/^\+94\s?\d{2}\s?\d{3}\s?\d{4}$/),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  subject: z.enum(["Reservation", "Private Event", "Menu Inquiry", "Feedback", "Other"]),
  message: z.string().min(20),
});
