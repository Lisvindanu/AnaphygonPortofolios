// src/utils/imageHelper.js

/**
 * Get the base URL for assets (not the API URL).
 * This determines where to fetch images from.
 * @returns {string} The base URL for assets.
 */
const getAssetBaseURL = () => {
    // In a production environment, use the specified production URL.
    if (process.env.NODE_ENV === 'production') {
        return 'https://api.vinmedia.my.id';
    }
    // In development, use the React App API URL or fallback to localhost.
    return process.env.REACT_APP_API_URL ?
        process.env.REACT_APP_API_URL.replace('/api', '') :
        'http://localhost:5000';
};

// Define constants for repeated values to improve readability and maintenance.
const ASSET_BASE_URL = getAssetBaseURL();
const NO_IMAGE_FALLBACK = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMmEyYTJhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZmlsbD0iI2ZmZmZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
const ERROR_IMAGE_FALLBACK = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGMzNTQ1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZmlsbD0iI2ZmZmZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkVycm9yIExvYWRpbmc8L3RleHQ+PC9zdmc+';


/**
 * Get the complete URL for an image path.
 * @param {string} path - The image path from the API (can be relative or absolute).
 * @returns {string} - Complete and valid image URL or a fallback data URL.
 */
export const getImageUrl = (path) => {
    // If the path is null, undefined, or empty, return the "No Image" fallback.
    if (!path) {
        return NO_IMAGE_FALLBACK;
    }

    // If it's already a complete HTTP/HTTPS URL, return it as is.
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }

    // If it's a relative path starting with '/', prepend the asset base URL.
    if (path.startsWith('/')) {
        return `${ASSET_BASE_URL}${path}`;
    }

    // If it's a relative path without a leading '/', add it before prepending.
    return `${ASSET_BASE_URL}/${path}`;
};

/**
 * Handles image loading errors by replacing the broken image source with a fallback.
 * This should be used with the onError attribute of an <img> tag.
 * @param {Event} event - The error event from the <img> element.
 */
export const handleImageError = (event) => {
    const img = event.target;
    // To prevent an infinite loop if the fallback image itself fails to load,
    // we check if the src is already set to the error fallback.
    if (img.src !== ERROR_IMAGE_FALLBACK) {
        img.src = ERROR_IMAGE_FALLBACK;
    }
};

/**
 * Preloads an image by creating an Image object and waiting for it to load.
 * @param {string} src - The source URL of the image to preload.
 * @returns {Promise<HTMLImageElement>} - A promise that resolves with the loaded image element or rejects on error.
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
 * Creates a thumbnail URL from an image path.
 * In a real-world scenario, this might point to a server-side resizing service.
 * @param {string} path - Original image path.
 * @param {number} [width=300] - Desired width (for potential future use).
 * @param {number} [height=200] - Desired height (for potential future use).
 * @returns {string} - The thumbnail URL.
 */
export const getThumbnailUrl = (path, width = 300, height = 200) => {
    const imageUrl = getImageUrl(path);

    // If the URL is a fallback data URL, return it directly without modification.
    if (imageUrl.startsWith('data:image')) {
        return imageUrl;
    }

    // For production, you might implement a server-side image resizing service.
    // Example: return `${imageUrl}?width=${width}&height=${height}`;
    // For now, we return the original image URL.
    return imageUrl;
};

/**
 * Checks if an image exists and is loadable by preloading it.
 * @param {string} path - The path of the image to check.
 * @returns {Promise<boolean>} - A promise that resolves to true if the image loads, false otherwise.
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
 * Gets an optimized image URL, potentially based on device pixel ratio.
 * This is a placeholder for future performance optimizations.
 * @param {string} path - The image path.
 * @returns {string} - The potentially optimized image URL.
 */
export const getOptimizedImageUrl = (path) => {
    const imageUrl = getImageUrl(path);

    // For high DPI displays (e.g., Retina), you might serve higher resolution images.
    // Example: if (window.devicePixelRatio > 1) { return get2xImageUrl(path); }
    // This is a placeholder for now.
    return imageUrl;
};

// Export all helper functions as a single default object for easy importing.
export default {
    getImageUrl,
    handleImageError,
    preloadImage,
    getThumbnailUrl,
    imageExists,
    getOptimizedImageUrl
};
