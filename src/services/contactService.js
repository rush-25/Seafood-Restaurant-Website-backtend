import nodemailer from "nodemailer";

export async function sendContactEmail(data) {
  if (process.env.EMAIL_PASS === 'your-app-password' || !process.env.EMAIL_PASS) {
    console.log("-----------------------------------------");
    console.log("Mock Email Service (Credentials not set)");
    console.log(`New Contact Form Submission from: ${data.name} (${data.email})`);
    console.log(`Subject: ${data.subject}`);
    console.log(`Message: ${data.message}`);
    console.log("-----------------------------------------");
    return; // Resolve successfully without sending email
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // 1. Send notification to the restaurant (Admin)
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: `New Contact: ${data.subject} from ${data.name}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <p><strong>Preferred Date:</strong> ${data.date}</p>
      <p><strong>Preferred Time:</strong> ${data.time}</p>
      <p><strong>Subject:</strong> ${data.subject}</p>
      <p><strong>Message:</strong></p>
      <p>${data.message}</p>
    `,
  });

  // 2. Send auto-reply confirmation to the User
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: data.email,
    subject: `Thank you for contacting Ocean Fresh - ${data.subject}`,
    html: `
      <h2>Hello ${data.name},</h2>
      <p>Thank you for reaching out to Ocean Fresh Restaurant. We have successfully received your message regarding <strong>${data.subject}</strong>.</p>
      <p>Our team will review your inquiry and get back to you shortly (usually within 2-4 hours during business hours).</p>
      <br/>
      <p>Here is a copy of your message:</p>
      <blockquote style="border-left: 4px solid #ccc; padding-left: 10px; color: #555;">
        ${data.message}
      </blockquote>
      <br/>
      <p>Best Regards,</p>
      <p><strong>The Ocean Fresh Team</strong></p>
    `,
  });
}

export async function sendReplyEmail(contact, replyMessage) {
  if (process.env.EMAIL_PASS === 'your-app-password' || !process.env.EMAIL_PASS) {
    console.log("-----------------------------------------");
    console.log("Mock Email Service (Credentials not set)");
    console.log(`Reply to: ${contact.name} (${contact.email})`);
    console.log(`Subject: Re: ${contact.subject}`);
    console.log(`Reply: ${replyMessage}`);
    console.log("-----------------------------------------");
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
    to: contact.email,
    subject: `Re: ${contact.subject} - Ocean Fresh Restaurant`,
    html: `
      <h2>Hello ${contact.name},</h2>
      <p>Thank you for contacting Ocean Fresh Restaurant. Here is our reply to your message:</p>
      <blockquote style="border-left: 4px solid #f59e0b; padding-left: 10px; color: #333;">
        ${replyMessage.replace(/\n/g, "<br/>")}
      </blockquote>
      <br/>
      <p>Your original message:</p>
      <blockquote style="border-left: 4px solid #ccc; padding-left: 10px; color: #777;">
        ${contact.message}
      </blockquote>
      <br/>
      <p>Best Regards,</p>
      <p><strong>The Ocean Fresh Team</strong></p>
    `,
  });
}
