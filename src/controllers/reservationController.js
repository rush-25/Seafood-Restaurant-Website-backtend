import { reservationSchema } from "../schemas/reservation.js";
import { createReservation, sendReservationNotification } from "../services/reservationService.js";

const reservationController = {
  async createReservation(req, res) {
    try {
      const data = reservationSchema.parse(req.body);
      const reservation = await createReservation(data);
      try {
        await sendReservationNotification(data);
      } catch (emailError) {
        console.error("Failed to send reservation email:", emailError);
      }

      res.status(201).json({
        success: true,
        message: "Reservation created successfully",
        reservation,
      });
    } catch (error) {
      console.error("Reservation creation error:", error);
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : "Invalid reservation data",
      });
    }
  },
};

export default reservationController;
