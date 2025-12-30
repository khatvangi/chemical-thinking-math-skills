/**
 * Chemical Thinking - Configuration
 * Update API_URL for your deployment
 */

const CONFIG = {
    // For local development
    // API_URL: 'http://localhost:8000',

    // For nitrogen server (students connect here)
    API_URL: 'http://nitrogen:8000',

    // Alternative: use IP directly
    // API_URL: 'http://10.2.16.245:8000',

    // Mastery settings
    MASTERY_TARGET: 3,  // Correct answers needed for mastery

    // Model preferences (passed to backend)
    PREFER_FAST_MODEL: true,  // Use 8B model for speed
};

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
