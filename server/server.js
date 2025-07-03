// server/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const authRoutes = require('./routes/auth.routes');
const projectsRoutes = require('./routes/projects.routes');
const skillsRoutes = require('./routes/skills.routes');
const contentRoutes = require('./routes/content.routes');
const cvRoutes = require('./routes/cv.routes');
const uploadRoutes = require('./routes/upload.routes');
const contactRoutes = require('./routes/contact.routes');

// Muat environment variables dari root folder
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.SERVER_PORT || 5000;

// Konfigurasi CORS
app.use(cors({
  origin: ['https://portofolio.vinmedia.my.id', 'http://portofolio.vinmedia.my.id', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Handle preflight requests
app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sajikan file statis dari direktori uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Endpoint Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/cv', cvRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/contact', contactRoutes);

// Sajikan file statis dari React build
app.use(express.static(path.join(__dirname, '../build')));

// Fallback ke index.html untuk routing SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

// Global Error Handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Mulai server
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di port ${PORT}`);
});