// article-script.js - Fixed version with better error handling

// Global variables
let currentArticleId = null;
let currentPdfUrl = null;

// Get article ID from URL parameter
function getArticleIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    console.log('URL parameters:', Object.fromEntries(urlParams.entries()));
    console.log('Extracted article ID:', id);
    
    if (!id) {
        console.error('No article ID found in URL');
        return null;
    }
    
    // Parse ID - handle both string and number
    const parsedId = parseInt(id);
    return isNaN(parsedId) ? id : parsedId;
}

// Enhanced article loading with better debugging
async function loadArticle(articleId) {
    console.log('Loading article with ID:', articleId);
    console.log('Type of articleId:', typeof articleId);
    
    let article = null;
    
    // Try multiple data sources with fallbacks
    if (typeof sheetsDataManager !== 'undefined') {
        console.log('Using sheetsDataManager...');
        article = await sheetsDataManager.getArticle(articleId);
    } else if (typeof JournalDataManager !== 'undefined') {
        console.log('Using JournalDataManager...');
        article = await JournalDataManager.getArticle(articleId);
    } else if (typeof articlesData !== 'undefined' && articlesData[articleId]) {
        console.log('Using articlesData...');
        article = articlesData[articleId];
    } else if (window.journalData) {
        console.log('Searching in journalData...');
        // Search through all issues
        for (const issueId in window.journalData.issues) {
            const issue = window.journalData.issues[issueId];
            const foundArticle = issue.articles.find(a => a.id == articleId);
            if (foundArticle) {
                article = foundArticle;
                break;
            }
        }
    }
    
    console.log('Found article:', article);
    
    if (!article) {
        showError('Article not found. Please check the article ID.');
        return;
    }

    currentArticleId = articleId;
    currentPdfUrl = article.pdfUrl;
    
    updateArticleDisplay(article);
}

function updateArticleDisplay(article) {
    // Update page title
    document.title = `${article.title} - Islamic Insight Journal`;
    
    // Update article title
    document.getElementById('article-title').textContent = article.title;
    
    // Update modal title
    document.getElementById('modal-pdf-title').textContent = article.title;
    
    // Update authors
    const authorContainer = document.getElementById('author-container');
    authorContainer.innerHTML = '';
    
    // Handle both old and new author format
    const authors = article.authors || (article.author ? [{
        name: article.author,
        position: "Research Scholar",
        email: "author@example.com"
    }] : []);
    
    authors.forEach(author => {
        const authorDiv = document.createElement('div');
        authorDiv.className = 'mb-3';
        authorDiv.innerHTML = `
            <p class="text-gray-700 font-medium">${author.name}</p>
            <p class="text-sm text-gray-600">${author.position || 'Author'}</p>
            <p class="text-sm text-gray-500">Email: ${author.email || 'N/A'}</p>
        `;
        authorContainer.appendChild(authorDiv);
    });
    
    // Update metadata
    document.getElementById('published-date').textContent = article.publishedDate || article.date || 'Not specified';
    document.getElementById('page-range').textContent = article.pages || 'Not specified';
    document.getElementById('volume-info').textContent = article.volume ? `Vol. ${article.volume}, No. ${article.number}` : 'Not specified';
    document.getElementById('issn-number').textContent = article.issn || '2581-3269';
    
    // Update PDF links
    if (currentPdfUrl) {
        document.getElementById('direct-pdf-link').href = currentPdfUrl;
        document.getElementById('modal-download-link').href = currentPdfUrl;
        document.getElementById('fallback-download-link').href = currentPdfUrl;
        
        // Enable PDF button
        const pdfButton = document.querySelector('button[onclick="openPDF()"]');
        if (pdfButton) {
            pdfButton.disabled = false;
            pdfButton.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    } else {
        // Disable PDF button if no PDF available
        const pdfButton = document.querySelector('button[onclick="openPDF()"]');
        if (pdfButton) {
            pdfButton.disabled = true;
            pdfButton.classList.add('opacity-50', 'cursor-not-allowed');
            pdfButton.textContent = 'PDF NOT AVAILABLE';
        }
    }
    
    // Update keywords
    const keywordsContainer = document.getElementById('keywords-container');
    keywordsContainer.innerHTML = '';
    
    if (article.keywords && Array.isArray(article.keywords) && article.keywords.length > 0) {
        article.keywords.forEach(keyword => {
            if (keyword && keyword.trim()) {
                const keywordSpan = document.createElement('span');
                keywordSpan.className = 'keyword-tag';
                keywordSpan.textContent = keyword.trim();
                keywordsContainer.appendChild(keywordSpan);
            }
        });
    } else {
        keywordsContainer.innerHTML = '<span class="text-gray-500">No keywords available</span>';
    }
    
    // Update abstract
    const abstractContent = document.getElementById('abstract-content');
    if (article.abstract && article.abstract.trim()) {
        abstractContent.textContent = article.abstract;
    } else {
        abstractContent.textContent = 'No abstract available for this article.';
        abstractContent.classList.add('text-gray-500', 'italic');
    }
    
    // Show article and hide loading
    document.getElementById('loading-state').style.display = 'none';
    document.getElementById('article-container').style.display = 'block';
    
    console.log('Article display updated successfully');
}
// After updating the content, apply Arabic styling
setTimeout(() => {
    if (window.arabicStyler) {
        window.arabicStyler.styleAllContent();
    }
}, 100);


// Enhanced initialization
async function initializeArticlePage() {
    console.log('Initializing article page...');
    
    const articleId = getArticleIdFromUrl();
    
    if (!articleId) {
        showError('No article ID specified in the URL.');
        return;
    }

    try {
        // Wait for sheets data to load with timeout
        const dataLoaded = await Promise.race([
            initializeJournalData(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Data loading timeout')), 10000))
        ]);
        
        if (!dataLoaded) {
            throw new Error('Failed to load journal data');
        }
        
        // Small delay to ensure data is fully processed
        await new Promise(resolve => setTimeout(resolve, 500));
        
        await loadArticle(articleId);
    } catch (error) {
        console.error('Error initializing article page:', error);
        showError('Failed to load article data. Please try again later.');
    }
}

function showError(message) {
    console.error('Showing error:', message);
    
    const loadingState = document.getElementById('loading-state');
    const errorState = document.getElementById('error-state');
    
    if (loadingState) loadingState.style.display = 'none';
    if (errorState) {
        errorState.style.display = 'block';
        errorState.innerHTML = `
            <h2 class="text-xl font-bold mb-2">Article Loading Error</h2>
            <p class="mb-4">${message}</p>
            <div class="space-x-4">
                <a href="index.html" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors">
                    Return to Homepage
                </a>
                <button onclick="location.reload()" class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors">
                    Retry Loading
                </button>
            </div>
        `;
    }
}

// PDF Modal Functions
function openPDF() {
    if (!currentPdfUrl) {
        alert('PDF is not available for this article.');
        return;
    }
    
    const modal = document.getElementById('pdfModal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    loadPDFInIframe();
}

function loadPDFInIframe() {
    const iframe = document.getElementById('pdfFrame');
    const fallback = document.getElementById('pdfFallback');
    
    iframe.style.display = 'block';
    fallback.classList.remove('active');
    
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        iframe.src = `https://docs.google.com/gview?url=${encodeURIComponent(currentPdfUrl)}&embedded=true`;
    } else {
        iframe.src = currentPdfUrl;
    }
    
    iframe.onload = function() {
        console.log('PDF loaded successfully');
    };
    
    iframe.onerror = function() {
        console.log('Direct embed failed, trying Google Docs viewer');
        iframe.src = `https://docs.google.com/gview?url=${encodeURIComponent(currentPdfUrl)}&embedded=true`;
        
        setTimeout(() => {
            try {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                if (!iframeDoc || iframeDoc.body.innerHTML === '') {
                    showFallback();
                }
            } catch (e) {
                showFallback();
            }
        }, 5000);
    };
}

function showFallback() {
    const iframe = document.getElementById('pdfFrame');
    const fallback = document.getElementById('pdfFallback');
    
    iframe.style.display = 'none';
    fallback.classList.add('active');
}

function refreshPDF() {
    loadPDFInIframe();
}

function openInNewTab() {
    if (currentPdfUrl) {
        window.open(currentPdfUrl, '_blank');
    }
}

function closePDF() {
    const modal = document.getElementById('pdfModal');
    const iframe = document.getElementById('pdfFrame');
    const fallback = document.getElementById('pdfFallback');
    
    modal.style.display = 'none';
    iframe.src = '';
    fallback.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeArticlePage);
} else {
    initializeArticlePage();
}

// Event listeners
window.onclick = function(event) {
    const modal = document.getElementById('pdfModal');
    if (event.target == modal) {
        closePDF();
    }
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closePDF();
    }
});

// Mobile menu toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNav = document.getElementById('mobile-nav');
    
    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileNav.classList.toggle('hidden');
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileMenuBtn.contains(event.target) && !mobileNav.contains(event.target)) {
                mobileNav.classList.add('hidden');
            }
        });
    }
});

// Arabic Language Detection and Styling
class ArabicStyler {
    constructor() {
        this.isArabic = false;
    }

    // Detect if content contains Arabic text
    detectArabic(text) {
        const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
        return arabicPattern.test(text);
    }

    // Apply Arabic styling to elements
    applyArabicStyling() {
        const articleContainer = document.getElementById('article-container');
        if (!articleContainer) return;

        // Check title and abstract for Arabic content
        const title = document.getElementById('article-title')?.textContent || '';
        const abstract = document.getElementById('abstract-content')?.textContent || '';
        
        this.isArabic = this.detectArabic(title) || this.detectArabic(abstract);

        if (this.isArabic) {
            console.log('Arabic content detected, applying RTL styling');
            this.applyRTLLayout();
        }
    }

    applyRTLLayout() {
        const articleContainer = document.getElementById('article-container');
        articleContainer.classList.add('arabic-article');

        // Update metadata alignment
        const metadataElements = [
            '.author-info',
            '.article-metadata',
            '.keywords',
            '#author-container'
        ];

        metadataElements.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                el.style.textAlign = 'right';
                el.style.direction = 'rtl';
            });
        });

        // Update grid layout for metadata
        const metadataGrid = document.querySelector('.article-metadata .grid');
        if (metadataGrid) {
            metadataGrid.style.direction = 'rtl';
        }

        // Update PDF button position
        const pdfButton = document.querySelector('button[onclick="openPDF()"]');
        if (pdfButton) {
            pdfButton.style.marginRight = 'auto';
            pdfButton.style.marginLeft = '0';
        }
    }

    // Style Arabic text in content
    styleArabicText() {
        const contentElements = document.querySelectorAll('.article-content p, .article-content h1, .article-content h2, .article-content h3');
        
        contentElements.forEach(element => {
            if (this.detectArabic(element.textContent)) {
                element.classList.add('arabic-text');
                element.style.direction = 'rtl';
                element.style.textAlign = 'right';
            }
        });
    }

    // Apply styling to all content
    styleAllContent() {
        this.applyArabicStyling();
        setTimeout(() => {
            this.styleArabicText();
        }, 100);
    }
}

// Initialize Arabic styler
window.arabicStyler = new ArabicStyler();
