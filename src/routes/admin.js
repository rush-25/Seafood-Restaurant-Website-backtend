import express from "express";
import adminController from "../controllers/adminController.js";
import { adminAuth } from "../middleware/adminMiddleware.js";
import Reservation from "../models/Reservation.js";
import Contact from "../models/Contact.js";
import User from "../models/User.js";
import { sendReplyEmail } from "../services/contactService.js";

const router = express.Router();

// Public — Admin Login
router.post("/login", adminController.login);

// Protected — Get all reservations
router.get("/reservations", adminAuth, async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: reservations });
  } catch (error) {
    console.error("Error fetching reservations:", error);
    res.status(500).json({ success: false, message: "Failed to fetch reservations" });
  }
});

// Protected — Delete a reservation
router.delete("/reservations/:id", adminAuth, async (req, res) => {
  try {
    const deletedReservation = await Reservation.findByIdAndDelete(req.params.id);
    if (!deletedReservation) {
      return res.status(404).json({ success: false, message: "Reservation not found" });
    }
    res.status(200).json({ success: true, message: "Reservation deleted successfully" });
  } catch (error) {
    console.error("Error deleting reservation:", error);
    res.status(500).json({ success: false, message: "Failed to delete reservation" });
  }
});

// Protected — Get all contact submissions
router.get("/contacts", adminAuth, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: contacts });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ success: false, message: "Failed to fetch contacts" });
  }
});

// Protected — Reply to a contact message
router.post("/contacts/:id/reply", adminAuth, async (req, res) => {
  try {
    const { reply } = req.body;

    if (!reply || !reply.trim()) {
      return res.status(400).json({ success: false, message: "Reply message is required" });
    }

    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: "Contact message not found" });
    }

    let emailSent = true;
    try {
      await sendReplyEmail(contact, reply);
    } catch (emailError) {
      console.error("Warning: Failed to send email notification", emailError);
      emailSent = false;
    }

    contact.reply = reply;
    contact.repliedAt = new Date();
    await contact.save();

    res.status(200).json({ 
      success: true, 
      message: emailSent ? "Reply sent successfully" : "Reply saved, but failed to send email", 
      data: contact 
    });
  } catch (error) {
    console.error("Error sending reply:", error);
    res.status(500).json({ success: false, message: "Failed to send reply: " + error.message });
  }
});

// Protected — Get all registered users
router.get("/users", adminAuth, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
});

// Protected — Delete a user
router.delete("/users/:id", adminAuth, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ success: false, message: "Failed to delete user" });
  }
});

// Protected — Dashboard stats
router.get("/stats", adminAuth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const totalReservations = await Reservation.countDocuments();
    const totalContacts = await Contact.countDocuments();
    const totalUsers = await User.countDocuments();
    const todayReservations = await Reservation.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow },
    });
    const todayContacts = await Contact.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow },
    });
    const todayUsers = await User.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow },
    });

    res.status(200).json({
      success: true,
      data: {
        totalReservations,
        totalContacts,
        totalUsers,
        todayReservations,
        todayContacts,
        todayUsers,
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ success: false, message: "Failed to fetch stats" });
  }
});

// Protected — Update a user
router.put("/users/:id", adminAuth, async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    
    // 1. Find the user
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // 2. Update provided fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone !== undefined) user.phone = phone; // allows clearing the phone field
    
    // 3. Update password only if provided
    if (password && password.trim()) {
      user.password = password;
    }

    // 4. Save (this automatically triggers the pre-save bcrypt hash hook in UserSchema!)
    await user.save();
    
    res.status(200).json({ success: true, message: "User updated successfully", data: user });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ success: false, message: "Failed to update user" });
  }
});

export default router;
