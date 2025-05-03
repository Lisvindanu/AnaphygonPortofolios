import React from 'react';
import { motion } from 'framer-motion';
import { getContentBySection } from '../services/api';
import ContactSection from '../components/home/Contact';
import Background from '../components/three/Background';
import ModelViewer from '../components/three/ModelViewer';

const Contact = () => {
  const [contactContent, setContactContent] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getContentBySection('contact');
        setContactContent(data);
      } catch (error) {
        console.error('Error fetching contact page data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-glow h-24 w-24 rounded-full bg-accent mb-4 mx-auto"></div>
          <p className="text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Background />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Let's <span className="text-gradient">Connect</span>
            </h1>
            <p className="text-gray-300 max-w-3xl mx-auto">
              Have a project in mind or just want to say hello? I'd love to hear from you.
            </p>
          </motion.div>
          
          <div className="mb-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="w-full max-w-3xl h-64 md:h-96 mx-auto rounded-xl overflow-hidden"
            >
              {/* Interactive map using OpenStreetMap with the provided coordinates */}
              <iframe 
                title="Location Map"
                className="w-full h-full border-0"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${107.585548 - 0.005},${-6.862197 - 0.005},${107.585548 + 0.005},${-6.862197 + 0.005}&layer=mapnik&marker=${-6.862197},${107.585548}`}
                style={{ border: "none" }}
                loading="lazy"
                allowFullScreen
              />
            </motion.div>
            <div className="text-center mt-3">
              <a 
                href={`https://www.openstreetmap.org/?mlat=${-6.862197}&mlon=${107.585548}&zoom=15`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-accent hover:underline"
              >
                View Larger Map (Bandung, Indonesia)
              </a>
            </div>
          </div>
        </div>
        
        <ContactSection content={contactContent} />
      </div>
    </>
  );
};

export default Contact;