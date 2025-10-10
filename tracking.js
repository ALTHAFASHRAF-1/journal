// tracking.js - Client-side tracking functionality

/**
 * Configuration
 */
const TRACKING_CONFIG = {
    // Replace with your deployed Google Apps Script web app URL
    API_URL: 'https://script.google.com/macros/s/AKfycbxwY9P5yJnCKLqzJVJnRR4muBeJ8R2DuPb2QbcIXBfH7f-53GjrmDvCPlWQDobSBNSUxQ/exec',
    
    // Enable/disable tracking
    ENABLED: true,
    
    // Session duration (24 hours)
    SESSION_DURATION: 24 * 60 * 60 * 1000
};

/**
 * Tracking utility class
 */
class UserTracker {
    constructor() {
        this.sessionId = this.getOrCreateSessionId();
        this.userIdHash = this.getOrCreateUserIdHash();
        this.initializeTracking();
    }

    /**
     * Initialize tracking when page loads
     */
    initializeTracking() {
        if (!TRACKING_CONFIG.ENABLED) return;

        // Track page view
        this.trackPageView();

        // Set up button click tracking
        this.setupButtonTracking();
    }

    /**
     * Generate or retrieve session ID
     */
    getOrCreateSessionId() {
        const SESSION_KEY = 'ii_session_id';
        const SESSION_TIME_KEY = 'ii_session_time';
        
        let sessionId = localStorage.getItem(SESSION_KEY);
        let sessionTime = localStorage.getItem(SESSION_TIME_KEY);
        
        const now = Date.now();
        
        // Check if session has expired
        if (!sessionId || !sessionTime || (now - parseInt(sessionTime)) > TRACKING_CONFIG.SESSION_DURATION) {
            sessionId = 'ii_' + now + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem(SESSION_KEY, sessionId);
            localStorage.setItem(SESSION_TIME_KEY, now.toString());
        }
        
        return sessionId;
    }

    /**
     * Generate or retrieve user ID hash
     */
    getOrCreateUserIdHash() {
        const USER_KEY = 'ii_user_hash';
        let userHash = localStorage.getItem(USER_KEY);
        
        if (!userHash) {
            // Create a pseudo-anonymous hash based on browser characteristics
            const fingerprint = [
                navigator.userAgent,
                navigator.language,
                screen.width + 'x' + screen.height,
                Intl.DateTimeFormat().resolvedOptions().timeZone,
                new Date().getTimezoneOffset()
            ].join('|');
            
            userHash = this.simpleHash(fingerprint);
            localStorage.setItem(USER_KEY, userHash);
        }
        
        return userHash;
    }

    /**
     * Simple hash function
     */
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash &= hash; // Convert to 32bit integer
        }
        return 'hash_' + Math.abs(hash).toString(36);
    }

    /**
     * Get user environment data
     */
    getUserEnvironment() {
        return {
            userAgent: navigator.userAgent,
            pageUrl: window.location.href,
            referrer: document.referrer,
            screenResolution: screen.width + 'x' + screen.height,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            language: navigator.language,
            platform: navigator.platform,
            sessionId: this.sessionId,
            userIdHash: this.userIdHash
        };
    }

    /**
     * Send tracking data to server
     */
    async sendTrackingData(action, additionalData = {}) {
        if (!TRACKING_CONFIG.ENABLED) return;

        try {
            const trackingData = {
                action: action,
                timestamp: new Date().toISOString(),
                ...this.getUserEnvironment(),
                ...additionalData
            };

            const response = await fetch(TRACKING_CONFIG.API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(trackingData),
                mode: 'cors'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Tracking data sent successfully:', result);
            return result;

        } catch (error) {
            console.error('Error sending tracking data:', error);
            // Don't throw error to avoid breaking user experience
        }
    }

    /**
     * Track page view
     */
    trackPageView() {
        this.sendTrackingData('page_view');
    }

    /**
     * Track button click
     */
    trackButtonClick(buttonId, buttonText) {
        this.sendTrackingData('button_click', {
            buttonId: buttonId,
            buttonText: buttonText
        });
    }

    /**
     * Track copy creation
     */
    trackCopyCreated() {
        this.sendTrackingData('copy_created');
    }

    /**
     * Set up button click tracking
     */
    setupButtonTracking() {
        // Track the Create Full Paper button
        const createPaperBtn = document.getElementById('create-paper-btn');
        if (createPaperBtn) {
            createPaperBtn.addEventListener('click', (e) => {
                this.trackButtonClick('create-paper-btn', 'Create Full Paper');
                
                // Track copy creation after a short delay
                setTimeout(() => {
                    this.trackCopyCreated();
                }, 1000);
            });
        }

        // Track other important buttons
        document.addEventListener('click', (e) => {
            const target = e.target;
            
            // Track navigation links
            if (target.tagName === 'A' && target.href) {
                const linkText = target.textContent.trim();
                const linkHref = target.href;
                
                this.sendTrackingData('link_click', {
                    linkText: linkText,
                    linkHref: linkHref
                });
            }
        });
    }
}

/**
 * Initialize tracking when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize tracker
    window.userTracker = new UserTracker();
});

/**
 * Export for global use
 */
window.UserTracker = UserTracker;
