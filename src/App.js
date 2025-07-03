// src/App.js - PERBAIKAN

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 1. Import Worker dari @react-pdf-viewer/core
import { Worker } from '@react-pdf-viewer/core';

import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Dashboard from './pages/admin/Dashboard';
import ContentEditor from './pages/admin/ContentEditor';
import ProjectManager from './pages/admin/ProjectManager';
import Settings from './pages/admin/Settings';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import SkillsManager from './pages/admin/SkillsManager';
import CVManager from './pages/admin/CVManager';

function App() {
  return (
      // 2. Bungkus seluruh aplikasi dengan komponen Worker
      // Kita gunakan CDN yang stabil untuk file worker-nya.
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-primary text-white">
              <Header />
              <main className="container mx-auto px-4 py-8">
                <Routes>
                  {/* Rute Halaman Publik */}
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/projects/:id" element={<ProjectDetail />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/login" element={<Login />} />

                  {/* Rute Halaman Admin */}
                  <Route path="/admin" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/content" element={
                    <ProtectedRoute>
                      <ContentEditor />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/projects" element={
                    <ProtectedRoute>
                      <ProjectManager />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/settings" element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  } />
                  <Route
                      path="/admin/skills"
                      element={
                        <ProtectedRoute>
                          <SkillsManager />
                        </ProtectedRoute>
                      }
                  />
                  <Route
                      path="/admin/cv"
                      element={
                        <ProtectedRoute>
                          <CVManager />
                        </ProtectedRoute>
                      }
                  />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </AuthProvider>
      </Worker>
  );
}

export default App;
