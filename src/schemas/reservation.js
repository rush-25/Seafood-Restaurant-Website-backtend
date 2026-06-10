import { z } from "zod";

export const reservationSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().regex(/^\+94\s?\d{2}\s?\d{3}\s?\d{4}$/),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string(),
  guests: z.number().min(1).max(20),
  specialRequests: z.string().optional(),
});
