// src/utils/imageHelper.js

// Get the base URL for assets (not the API URL)
const getAssetBaseURL = () => {
    if (process.env.NODE_ENV === 'production') {
        return 'https://api.vinmedia.my.id';
    }
    return process.env.REACT_APP_API_URL ?
        process.env.REACT_APP_API_URL.replace('/api', '') :
        'http://localhost:5000';
};

const ASSET_BASE_URL = getAssetBaseURL();

/**
 * Get the complete URL for an image path
 * @param {string} path - The image path from the API
 * @returns {string} - Complete image URL
 */
export const getImageUrl = (path) => {
    if (!path) {
        return 'https://via.placeholder.com/600x400/2a2a2a/ffffff?text=No+Image';
    }

    // If it's already a complete URL, return as is
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }

    // If it's a relative path, prepend the asset base URL
    if (path.startsWith('/')) {
        return `${ASSET_BASE_URL}${path}`;
    }

    // If it doesn't start with /, add it
    return `${ASSET_BASE_URL}/${path}`;
};

/**
 * Handle image loading errors
 * @param {Event} event - The error event
 */
export const handleImageError = (event) => {
    const img = event.target;
    if (img.src !== 'https://via.placeholder.com/600x400/2a2a2a/ffffff?text=Error+Loading+Image') {
        img.src = 'https://via.placeholder.com/600x400/2a2a2a/ffffff?text=Error+Loading+Image';
    }
};

/**
 * Preload an image and return a promise
 * @param {string} src - Image source URL
 * @returns {Promise} - Resolves when image is loaded
 */
export const preloadImage = (src) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
};

/**
 * Create a thumbnail URL from an image path
 * @param {string} path - Original image path
 * @param {number} width - Desired width
 * @param {number} height - Desired height
 * @returns {string} - Thumbnail URL
 */
export const getThumbnailUrl = (path, width = 300, height = 200) => {
    const imageUrl = getImageUrl(path);

    // If it's a placeholder URL, return as is
    if (imageUrl.includes('via.placeholder.com')) {
        return imageUrl;
    }

    // For production, you might want to implement server-side image resizing
    // For now, return the original image URL
    return imageUrl;
};

/**
 * Check if an image exists
 * @param {string} path - Image path
 * @returns {Promise<boolean>} - True if image exists
 */
export const imageExists = async (path) => {
    try {
        await preloadImage(getImageUrl(path));
        return true;
    } catch {
        return false;
    }
};

/**
 * Get optimized image URL based on device pixel ratio
 * @param {string} path - Image path
 * @returns {string} - Optimized image URL
 */
export const getOptimizedImageUrl = (path) => {
    const imageUrl = getImageUrl(path);

    // For high DPI displays, you might want to serve higher resolution images
    // This is a placeholder for future optimization
    return imageUrl;
};

export default {
    getImageUrl,
    handleImageError,
    preloadImage,
    getThumbnailUrl,
    imageExists,
    getOptimizedImageUrl
};