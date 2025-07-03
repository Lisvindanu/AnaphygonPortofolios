// server/routes/contact.routes.js
const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

// Setup SMTP transporter
const createTransporter = () => {
    return nodemailer.createTransporter({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER, // Your email
            pass: process.env.SMTP_PASS  // Your app password
        }
    });
};

// Send contact form
router.post('/send', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validation
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and message are required'
            });
        }

        const transporter = createTransporter();

        // Email to you (notification)
        const mailToOwner = {
            from: `"${name}" <${process.env.SMTP_USER}>`,
            to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
            subject: `Portfolio Contact: ${subject || 'New Message'}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">New Contact Form Submission</h2>
          <div style="background: #F8FAFC; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject || 'No subject'}</p>
          </div>
          <div style="background: #FFFFFF; padding: 20px; border: 1px solid #E2E8F0; border-radius: 8px;">
            <h3>Message:</h3>
            <p style="line-height: 1.6;">${message}</p>
          </div>
          <div style="margin-top: 20px; padding: 15px; background: #EFF6FF; border-radius: 8px;">
            <p style="margin: 0; font-size: 14px; color: #1E40AF;">
              Reply directly to this email to respond to ${name}
            </p>
          </div>
        </div>
      `
        };

        // Auto-reply to sender
        const autoReply = {
            from: `"Anaphygon" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Thank you for contacting me!',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">Thank you for reaching out!</h2>
          <p>Hi ${name},</p>
          <p>Thank you for your message. I've received your inquiry and will get back to you within 24-48 hours.</p>
          
          <div style="background: #F8FAFC; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Your message:</strong></p>
            <p style="font-style: italic;">"${message}"</p>
          </div>
          
          <p>Best regards,<br/>
          <strong>Anaphygon</strong><br/>
          Full Stack Developer</p>
          
          <div style="margin-top: 30px; padding: 15px; background: #EFF6FF; border-radius: 8px; font-size: 14px;">
            <p style="margin: 0;">
              📧 Email: Anaphygon@protonmail.com<br/>
              🌐 Portfolio: <a href="http://localhost:3000" style="color: #4F46E5;">Portfolio Website</a>
            </p>
          </div>
        </div>
      `
        };

        // Send both emails
        await transporter.sendMail(mailToOwner);
        await transporter.sendMail(autoReply);

        res.json({
            success: true,
            message: 'Message sent successfully! Thank you for reaching out.'
        });

    } catch (error) {
        console.error('Email sending error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send message. Please try again later.'
        });
    }
});

// Test email configuration
router.get('/test', async (req, res) => {
    try {
        const transporter = createTransporter();
        await transporter.verify();
        res.json({
            success: true,
            message: 'SMTP configuration is working!'
        });
    } catch (error) {
        console.error('SMTP test failed:', error);
        res.status(500).json({
            success: false,
            message: 'SMTP configuration failed',
            error: error.message
        });
    }
});

module.exports = router;