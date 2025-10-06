// Arabic Content Detection and Auto-Styling

class ArabicStyler {
    constructor() {
        this.arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
        this.init();
    }

    init() {
        // Auto-detect and style Arabic content when DOM loads
        document.addEventListener('DOMContentLoaded', () => {
            this.styleAllContent();
        });

        // Observer for dynamically loaded content
        this.setupMutationObserver();
    }

    // Check if text contains Arabic characters
    isArabic(text) {
        if (!text) return false;
        const arabicChars = text.match(this.arabicRegex);
        return arabicChars && arabicChars.length > text.length * 0.3; // 30% threshold
    }

    // Style a single element based on its content
    styleElement(element) {
        const text = element.textContent || element.innerText || '';
        
        if (this.isArabic(text)) {
            element.classList.add('arabic-content');
            
            // Add specific classes based on element type
            if (element.tagName.match(/^H[1-6]$/)) {
                element.classList.add('arabic-title');
            }
            
            if (element.tagName === 'P') {
                element.classList.add('arabic-paragraph');
            }

            // Set language attribute
            element.setAttribute('lang', 'ar');
            element.setAttribute('dir', 'rtl');
        } else {
            element.classList.add('auto-english');
            element.setAttribute('lang', 'en');
            element.setAttribute('dir', 'ltr');
        }
    }

    // Style all text content in the document
    styleAllContent() {
        // Target specific selectors for article content
        const selectors = [
            '#article-title',
            '.article-content h1',
            '.article-content h2', 
            '.article-content h3',
            '.article-content p',
            '#abstract-content',
            '.article-card h3',
            '.article-card .article-description p',
            '.quranic-verse',
            '.hadith-quote',
            '.citation-box',
            '[data-field]'
        ];

        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                this.styleElement(element);
            });
        });

        // Handle article cards separately for mixed content
        this.handleArticleCards();
        
        // Handle keywords
        this.handleKeywords();
    }

    // Handle article cards with potentially mixed content
    handleArticleCards() {
        document.querySelectorAll('.article-card').forEach(card => {
            const title = card.querySelector('h3');
            const description = card.querySelector('.article-description p');
            
            if (title) this.styleElement(title);
            if (description) this.styleElement(description);
        });
    }

    // Handle keywords styling
    handleKeywords() {
        document.querySelectorAll('.keyword-tag').forEach(keyword => {
            if (this.isArabic(keyword.textContent)) {
                keyword.classList.add('arabic-keyword');
                keyword.setAttribute('dir', 'rtl');
            }
        });
    }

    // Setup mutation observer for dynamic content
    setupMutationObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        // Style the new element and its children
                        this.styleElement(node);
                        node.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div').forEach(child => {
                            this.styleElement(child);
                        });
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Method to manually apply Arabic styling to specific elements
    applyArabicStyle(selector) {
        document.querySelectorAll(selector).forEach(element => {
            element.classList.add('arabic-content');
            if (element.tagName.match(/^H[1-6]$/)) {
                element.classList.add('arabic-title');
            }
            element.setAttribute('lang', 'ar');
            element.setAttribute('dir', 'rtl');
        });
    }

    // Method to manually apply English styling to specific elements
    applyEnglishStyle(selector) {
        document.querySelectorAll(selector).forEach(element => {
            element.classList.add('auto-english');
            element.setAttribute('lang', 'en');
            element.setAttribute('dir', 'ltr');
        });
    }
}

// Initialize Arabic Styler
const arabicStyler = new ArabicStyler();

// Export for global use
window.ArabicStyler = ArabicStyler;
window.arabicStyler = arabicStyler;
