const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const authRoutes = require('./routes/auth.routes');
const projectsRoutes = require('./routes/projects.routes');
const skillsRoutes = require('./routes/skills.routes');
const contentRoutes = require('./routes/content.routes');

// Load environment variables dari root folder
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.SERVER_PORT || 5000;

// Better CORS configuration
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
app.use('/uploads', express.static('uploads'));

// Simple health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/content', contentRoutes);

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../build')));

// Fallback to index.html for any other requests
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
