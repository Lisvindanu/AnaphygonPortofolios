// src/utils/imageHelper.js

// Base URL untuk aset (tanpa /api path)
const ASSET_URL = process.env.REACT_APP_API_URL
    ? process.env.REACT_APP_API_URL.replace('/api', '')
    : 'http://localhost:5000';

/**
 * Helper function untuk menentukan URL gambar yang benar
 * @param {string} imagePath - Path gambar dari database atau input
 * @returns {string} - URL gambar yang valid
 */
export const getImageUrl = (imagePath) => {
    // Return placeholder jika tidak ada path
    if (!imagePath) {
        return 'https://via.placeholder.com/600x400/1a1a1a/00fff0?text=No+Image';
    }

    // Return as-is jika sudah URL lengkap atau blob URL
    if (imagePath.startsWith('http://') ||
        imagePath.startsWith('https://') ||
        imagePath.startsWith('blob:')) {
        return imagePath;
    }

    // Jika path dimulai dengan /uploads, gabungkan dengan ASSET_URL
    if (imagePath.startsWith('/uploads')) {
        return `${ASSET_URL}${imagePath}`;
    }

    // Jika path tidak dimulai dengan /, tambahkan /uploads/ prefix
    return `${ASSET_URL}/uploads/${imagePath}`;
};

/**
 * Helper function untuk mendapatkan multiple image URLs
 * @param {string} imagesString - String gambar yang dipisah koma
 * @returns {string[]} - Array URL gambar
 */
export const getImageUrls = (imagesString) => {
    if (!imagesString) return [];

    return imagesString
        .split(',')
        .map(img => img.trim())
        .filter(img => img.length > 0)
        .map(img => getImageUrl(img));
};

/**
 * Error handler untuk gambar yang gagal load
 * @param {Event} e - Event error dari img tag
 */
export const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/600x400/1a1a1a/00fff0?text=Image+Not+Found';
    e.target.onerror = null; // Prevent infinite loop
};