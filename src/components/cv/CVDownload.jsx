// src/components/cv/CVDownload.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAllCVs, createDownloadLink, fetchCVAsBlob } from '../../services/cvApi';
import PDFPreviewModal from '../common/PDFPreviewModal';

const CVDownload = () => {
    const [cvs, setCvs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [previewPdfUrl, setPreviewPdfUrl] = useState(null);

    useEffect(() => {
        fetchActiveCVs();
    }, []);

    const fetchActiveCVs = async () => {
        try {
            setIsLoading(true);
            const data = await getAllCVs();
            const activeCVs = data.filter(cv => cv.is_active);
            setCvs(activeCVs);
        } catch (error) {
            console.error('Error fetching CVs:', error);
            setError('Failed to load CVs');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePreview = async (id) => {
        try {
            const blob = await fetchCVAsBlob(id);
            const fileURL = URL.createObjectURL(blob);
            setPreviewPdfUrl(fileURL);
        } catch (err) {
            console.error("Error creating preview URL", err);
            setError("Could not load PDF for preview.");
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + ['Bytes', 'KB', 'MB', 'GB'][i];
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (isLoading) {
        return (
            <section className="py-20 relative" id="cv">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
                        <p className="text-gray-400 mt-4">Loading CV...</p>
                    </div>
                </div>
            </section>
        );
    }

    if (error || cvs.length === 0) {
        return null; // Don't show section if no CVs or error
    }

    return (
        <section className="py-20 relative" id="cv">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto text-center"
                >
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="mb-12"
                    >
                        <h2 className="text-accent text-lg font-mono uppercase tracking-wider mb-4">
                            Download
                        </h2>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            <span className="text-gradient">My CV</span>
                        </h1>
                        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                            Download my latest CV to learn more about my experience, skills, and projects
                        </p>
                    </motion.div>

                    {/* CV Cards */}
                    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 max-w-4xl mx-auto">
                        {cvs.map((cv, index) => (
                            <motion.div
                                key={cv.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-secondary/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700 hover:border-accent/50 transition-all duration-300 group"
                            >
                                {/* CV Icon */}
                                <div className="mb-6">
                                    <div className="w-16 h-16 mx-auto bg-accent/20 rounded-lg flex items-center justify-center group-hover:bg-accent/30 transition-colors">
                                        <svg
                                            className="w-8 h-8 text-accent"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                </div>

                                {/* CV Info */}
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold text-white mb-2">{cv.title}</h3>
                                    {cv.description && (
                                        <p className="text-gray-300 mb-4">{cv.description}</p>
                                    )}

                                    <div className="text-sm text-gray-400 space-y-1">
                                        <p>Size: {formatFileSize(cv.file_size)}</p>
                                        <p>Updated: {formatDate(cv.upload_date)}</p>
                                        <p>Downloads: {cv.download_count}</p>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 justify-center">
                                    <button
                                        onClick={() => handlePreview(cv.id)}
                                        className="px-4 py-2 bg-secondary border border-gray-600 text-white rounded-md hover:border-accent hover:text-accent transition-all duration-300 flex items-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        Preview
                                    </button>

                                    <a
                                        href={createDownloadLink(cv.id)}
                                        download
                                        className="px-6 py-2 bg-accent text-primary rounded-md hover:bg-accent/80 transition-all duration-300 flex items-center gap-2 font-medium"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Download CV
                                    </a>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Additional Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        viewport={{ once: true }}
                        className="mt-12 text-center"
                    >
                        <p className="text-gray-400 text-sm">
                            CV is updated regularly with latest experience and projects
                        </p>
                    </motion.div>
                </motion.div>
            </div>
            <PDFPreviewModal pdfUrl={previewPdfUrl} onClose={() => setPreviewPdfUrl(null)} />
        </section>
    );
};

export default CVDownload;