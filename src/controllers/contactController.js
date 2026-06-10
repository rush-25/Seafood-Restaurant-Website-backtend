import { contactSchema } from "../schemas/contact.js";
import { sendContactEmail } from "../services/contactService.js";
import Contact from "../models/Contact.js";

const contactController = {
  async sendContactForm(req, res) {
    try {
      const data = contactSchema.parse(req.body);

      // Save to database
      try {
        const contact = new Contact(data);
        await contact.save();
      } catch (dbError) {
        console.warn("Could not save contact to DB:", dbError.message);
      }

      // Send email notification
      await sendContactEmail(data);

      res.status(200).json({
        success: true,
        message: "Message received successfully!",
      });
    } catch (error) {
      console.error("Contact submission error:", error);
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : "Invalid data or failed to send message",
      });
    }
  },
};

export default contactController;

