// src/components/common/ImageUpload.jsx
import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ImageUpload = ({
                         label,
                         onImageSelect,
                         currentImage,
                         acceptMultiple = false,
                         maxFiles = 5,
                         className = '',
                         accept = 'image/*'
                     }) => {
    const [preview, setPreview] = useState(currentImage || null);
    const [previews, setPreviews] = useState([]);
    const [dragActive, setDragActive] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);
    const fileInputRef = useRef(null);

    const handleFiles = useCallback((files) => {
        if (!files || files.length === 0) return;

        const fileArray = Array.from(files);

        if (acceptMultiple) {
            // Batasi jumlah file sesuai maxFiles
            const limitedFiles = fileArray.slice(0, maxFiles);
            setSelectedFiles(limitedFiles);

            // Buat preview untuk setiap file
            const previewPromises = limitedFiles.map(file => {
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = (e) => resolve({
                        file,
                        url: e.target.result,
                        name: file.name
                    });
                    reader.readAsDataURL(file);
                });
            });

            Promise.all(previewPromises).then(results => {
                setPreviews(results);
                onImageSelect(limitedFiles);
            });
        } else {
            // Single file
            const file = fileArray[0];
            setSelectedFiles([file]);
            const previewUrl = URL.createObjectURL(file);
            setPreview(previewUrl);
            onImageSelect(file);
        }
    }, [acceptMultiple, maxFiles, onImageSelect]);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const files = e.dataTransfer.files;
        handleFiles(files);
    }, [handleFiles]);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    }, []);

    const handleFileChange = (e) => {
        const files = e.target.files;
        handleFiles(files);
    };

    const openFileDialog = () => {
        fileInputRef.current?.click();
    };

    const removeImage = (index = null) => {
        if (acceptMultiple && index !== null) {
            // Remove specific image from multiple selection
            const newFiles = selectedFiles.filter((_, i) => i !== index);
            const newPreviews = previews.filter((_, i) => i !== index);

            setSelectedFiles(newFiles);
            setPreviews(newPreviews);
            onImageSelect(newFiles);
        } else {
            // Remove single image
            setPreview(null);
            setSelectedFiles([]);
            setPreviews([]);
            onImageSelect(null);
        }
    };

    const openPreviewModal = (index) => {
        setCurrentPreviewIndex(index);
        setShowPreviewModal(true);
    };

    const closePreviewModal = () => {
        setShowPreviewModal(false);
    };

    const nextPreview = () => {
        setCurrentPreviewIndex((prev) =>
            prev === previews.length - 1 ? 0 : prev + 1
        );
    };

    const prevPreview = () => {
        setCurrentPreviewIndex((prev) =>
            prev === 0 ? previews.length - 1 : prev - 1
        );
    };

    return (
        <div className={`space-y-4 ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    {label}
                </label>
            )}

            {/* File Input */}
            <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                multiple={acceptMultiple}
                onChange={handleFileChange}
                className="hidden"
            />

            {/* Upload Area */}
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`
          relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 cursor-pointer
          ${dragActive
                    ? 'border-accent bg-accent/10'
                    : 'border-gray-600 hover:border-accent/50 bg-secondary/30'
                }
        `}
                onClick={openFileDialog}
            >
                {!acceptMultiple && preview ? (
                    // Single image preview
                    <div className="relative">
                        <img
                            src={preview}
                            alt="Preview"
                            className="max-w-full max-h-48 mx-auto rounded-lg object-cover"
                        />
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                removeImage();
                            }}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                            ×
                        </button>
                    </div>
                ) : acceptMultiple && previews.length > 0 ? (
                    // Multiple images preview
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {previews.map((previewItem, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={previewItem.url}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openPreviewModal(index);
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeImage(index);
                                        }}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        ×
                                    </button>
                                    {/* Preview icon overlay */}
                                    <div
                                        className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-lg flex items-center justify-center transition-all cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openPreviewModal(index);
                                        }}
                                    >
                                        <svg
                                            className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Add more images button */}
                        {previews.length < maxFiles && (
                            <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center">
                                <p className="text-gray-400 text-sm">
                                    Click to add more images ({previews.length}/{maxFiles})
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    // Upload prompt
                    <div className="text-center">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="mx-auto w-12 h-12 mb-4 flex items-center justify-center bg-secondary rounded-lg"
                        >
                            <svg
                                className="w-6 h-6 text-accent"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                />
                            </svg>
                        </motion.div>

                        <div className="text-gray-300">
                            <p className="mb-2">
                                <button
                                    type="button"
                                    onClick={openFileDialog}
                                    className="text-accent hover:text-accent/80 font-medium"
                                >
                                    Click to upload
                                </button>
                                {' '}or drag and drop
                            </p>
                            <p className="text-sm text-gray-400">
                                {acceptMultiple
                                    ? `Upload up to ${maxFiles} images (PNG, JPG, GIF)`
                                    : 'PNG, JPG, GIF up to 10MB'
                                }
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Preview Modal */}
            <AnimatePresence>
                {showPreviewModal && previews.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
                        onClick={closePreviewModal}
                    >
                        <div
                            className="relative max-w-4xl max-h-[80vh] bg-secondary rounded-lg overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close button */}
                            <button
                                onClick={closePreviewModal}
                                className="absolute top-4 right-4 z-10 bg-black/50 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/70 transition-colors"
                            >
                                ×
                            </button>

                            {/* Navigation buttons */}
                            {previews.length > 1 && (
                                <>
                                    <button
                                        onClick={prevPreview}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/70 transition-colors"
                                    >
                                        ←
                                    </button>
                                    <button
                                        onClick={nextPreview}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/70 transition-colors"
                                    >
                                        →
                                    </button>
                                </>
                            )}

                            {/* Image */}
                            <img
                                src={previews[currentPreviewIndex]?.url}
                                alt={`Preview ${currentPreviewIndex + 1}`}
                                className="w-full h-full object-contain"
                            />

                            {/* Image info */}
                            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4">
                                <p className="text-sm truncate">
                                    {previews[currentPreviewIndex]?.name}
                                </p>
                                {previews.length > 1 && (
                                    <p className="text-xs text-gray-300">
                                        {currentPreviewIndex + 1} of {previews.length}
                                    </p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ImageUpload;