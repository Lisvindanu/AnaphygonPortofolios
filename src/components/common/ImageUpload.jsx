// src/components/common/ImageUpload.jsx
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

const ImageUpload = ({
                         onImageSelect,
                         currentImage = null,
                         acceptMultiple = false,
                         maxFiles = 5,
                         maxSize = 5 * 1024 * 1024, // 5MB default
                         className = "",
                         label = "Upload Image"
                     }) => {
    const [preview, setPreview] = useState(currentImage);
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const validateFile = (file) => {
        // Check file type
        if (!file.type.startsWith('image/')) {
            return 'Only image files are allowed';
        }

        // Check file size
        if (file.size > maxSize) {
            const maxSizeMB = maxSize / (1024 * 1024);
            return `File size should not exceed ${maxSizeMB}MB`;
        }

        return null;
    };

    const handleFiles = (files) => {
        const fileArray = Array.from(files);

        if (!acceptMultiple && fileArray.length > 1) {
            setError('Please select only one image');
            return;
        }

        if (acceptMultiple && fileArray.length > maxFiles) {
            setError(`Maximum ${maxFiles} files allowed`);
            return;
        }

        // Validate each file
        for (let file of fileArray) {
            const validationError = validateFile(file);
            if (validationError) {
                setError(validationError);
                return;
            }
        }

        setError(null);

        if (!acceptMultiple && fileArray.length === 1) {
            // Single file upload
            const file = fileArray[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreview(e.target.result);
            };
            reader.readAsDataURL(file);
            onImageSelect(file);
        } else {
            // Multiple file upload
            onImageSelect(fileArray);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleInputChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFiles(e.target.files);
        }
    };

    const removeImage = () => {
        setPreview(null);
        onImageSelect(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const openFileDialog = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className={`space-y-4 ${className}`}>
            <label className="block text-sm font-medium text-gray-300 mb-2">
                {label}
            </label>

            {/* Upload Area */}
            <div
                className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
                    dragActive
                        ? 'border-accent bg-accent/10'
                        : 'border-gray-600 hover:border-gray-500'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple={acceptMultiple}
                    accept="image/*"
                    onChange={handleInputChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                {preview && !acceptMultiple ? (
                    // Single image preview
                    <div className="relative">
                        <img
                            src={preview}
                            alt="Preview"
                            className="max-w-full max-h-48 mx-auto rounded-lg object-cover"
                        />
                        <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                            ×
                        </button>
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
                                    ? `Up to ${maxFiles} images (PNG, JPG, GIF up to ${Math.round(maxSize / (1024 * 1024))}MB each)`
                                    : `PNG, JPG, GIF up to ${Math.round(maxSize / (1024 * 1024))}MB`
                                }
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm bg-red-500/20 p-2 rounded border border-red-500/30"
                >
                    {error}
                </motion.div>
            )}

            {/* Upload Tips */}
            <div className="text-xs text-gray-500">
                <p>💡 Tips: Use high-quality images for better results. Recommended resolution: 1920x1080 or higher.</p>
            </div>
        </div>
    );
};

export default ImageUpload;