// src/components/home/Contact.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../common/Button';
import axios from 'axios';

const Contact = ({ content = [] }) => {
  const contactContent = content[0] || {
    title: 'Get in Touch',
    subtitle: 'Let\'s collaborate on your next project',
    content: 'I am open to freelance opportunities, collaborations, and full-time positions. Feel free to reach out if you have any inquiries or just want to say hello!'
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [formStatus, setFormStatus] = useState({
    submitting: false,
    success: false,
    error: false,
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormStatus({
      submitting: true,
      success: false,
      error: false,
      message: ''
    });

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/contact/send`, formData);

      setFormStatus({
        submitting: false,
        success: true,
        error: false,
        message: response.data.message || 'Message sent successfully!'
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });

    } catch (error) {
      console.error('Contact form error:', error);
      setFormStatus({
        submitting: false,
        success: false,
        error: true,
        message: error.response?.data?.message || 'Failed to send message. Please try again.'
      });
    }
  };

  return (
      <section id="contact" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
          >
            <h2 className="text-accent text-lg font-mono uppercase tracking-wider mb-4">
              {contactContent.subtitle}
            </h2>
            <h1 className="text-4xl font-bold mb-6">
              <span className="text-gradient">{contactContent.title}</span>
            </h1>
            <p className="text-gray-300 max-w-2xl mx-auto">
              {contactContent.content}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="lg:col-span-2 space-y-8"
            >
              <div className="bg-secondary bg-opacity-30 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-accent bg-opacity-20 flex items-center justify-center mr-4">
                    <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold">Email</h3>
                    <a href="mailto:Lisvindanu015@gmail.com" className="text-accent hover:underline">
                      Lisvindanu015@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-secondary bg-opacity-30 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-accent bg-opacity-20 flex items-center justify-center mr-4">
                    <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold">Location</h3>
                    <p className="text-gray-300">Bandung, Indonesia</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="lg:col-span-3"
            >
              <div className="bg-secondary bg-opacity-30 p-8 rounded-lg">
                <h3 className="text-xl font-bold mb-6">Send me a message</h3>

                {formStatus.success && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-green-500 bg-opacity-10 border border-green-500 text-green-500 p-4 rounded-lg mb-6"
                    >
                      {formStatus.message}
                    </motion.div>
                )}

                {formStatus.error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 p-4 rounded-lg mb-6"
                    >
                      {formStatus.message}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                        Your Name *
                      </label>
                      <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-primary border border-gray-700 rounded-lg focus:outline-none focus:border-accent transition-colors"
                          placeholder="John Doe"
                          disabled={formStatus.submitting}
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                        Your Email *
                      </label>
                      <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-primary border border-gray-700 rounded-lg focus:outline-none focus:border-accent transition-colors"
                          placeholder="john@example.com"
                          disabled={formStatus.submitting}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">
                      Subject
                    </label>
                    <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-primary border border-gray-700 rounded-lg focus:outline-none focus:border-accent transition-colors"
                        placeholder="Project Inquiry"
                        disabled={formStatus.submitting}
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                      Message *
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        rows="5"
                        required
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-primary border border-gray-700 rounded-lg focus:outline-none focus:border-accent transition-colors"
                        placeholder="Tell me about your project..."
                        disabled={formStatus.submitting}
                    ></textarea>
                  </div>

                  <div>
                    <Button
                        type="submit"
                        variant="gradient"
                        fullWidth
                        disabled={formStatus.submitting}
                    >
                      {formStatus.submitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
  );
};

export default Contact;