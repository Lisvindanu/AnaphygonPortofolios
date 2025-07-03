// src/components/common/PDFPreviewModal.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Document, Page, pdfjs } from 'react-pdf';


// Konfigurasi worker untuk react-pdf

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const PDFPreviewModal = ({ pdfUrl, onClose }) => {
    const [numPages, setNumPages] = useState(null);

    function onDocumentLoadSuccess({ numPages: nextNumPages }) {
        setNumPages(nextNumPages);
    }

    if (!pdfUrl) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="bg-gray-800 w-full h-full max-w-4xl max-h-[90vh] rounded-lg overflow-hidden flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex justify-between items-center p-4 border-b border-gray-700 bg-secondary">
                        <h3 className="text-lg font-bold text-white">CV Preview</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                        <Document
                            file={pdfUrl}
                            onLoadSuccess={onDocumentLoadSuccess}
                            loading={<div className="text-white text-center p-4">Loading PDF...</div>}
                            error={<div className="text-red-400 text-center p-4">Failed to load PDF file.</div>}
                        >
                            {Array.from(new Array(numPages || 0), (el, index) => (
                                <Page
                                    key={`page_${index + 1}`}
                                    pageNumber={index + 1}
                                    renderTextLayer={false}      // Layer ini sudah dinonaktifkan
                                    renderAnnotationLayer={false} // Layer ini juga sudah dinonaktifkan
                                    width={800}
                                    className="mb-4"
                                />
                            ))}
                        </Document>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default PDFPreviewModal;