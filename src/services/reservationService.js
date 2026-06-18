import nodemailer from "nodemailer";
import Reservation from "../models/Reservation.js";

export async function createReservation(data) {
  const reservation = new Reservation(data);
  return await reservation.save();
}

export async function sendReservationNotification(data) {
  if (process.env.EMAIL_PASS === 'your-app-password' || !process.env.EMAIL_PASS) {
    console.log("Mock Email Service: New Reservation", data);
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: `New Reservation - ${data.date} ${data.time}`,
    html: `
      <h2>New Table Reservation</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <p><strong>Date:</strong> ${data.date}</p>
      <p><strong>Time:</strong> ${data.time}</p>
      <p><strong>Guests:</strong> ${data.guests}</p>
      ${data.specialRequests ? `<p><strong>Special Requests:</strong> ${data.specialRequests}</p>` : ""}
    `,
  });
}
