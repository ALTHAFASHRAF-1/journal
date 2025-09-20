// Global variables
let currentArticleId = null;
let currentPdfUrl = null;

// Get article ID from URL parameter
function getArticleIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    return id ? parseInt(id) : null;
}

// Load article data
function loadArticle(articleId) {
    const article = articlesData[articleId];
    
    if (!article) {
        showError();
        return;
    }

    currentArticleId = articleId;
    currentPdfUrl = article.pdfUrl;
    
    // Update page title
    document.getElementById('page-title').textContent = `${article.title} - Islamic Insight Journal`;
    
    // Update article title
    document.getElementById('article-title').textContent = article.title;
    
    // Update modal title
    document.getElementById('modal-pdf-title').textContent = article.title;
    
    // Update authors
    const authorContainer = document.getElementById('author-container');
    authorContainer.innerHTML = '';
    
    article.authors.forEach(author => {
        const authorDiv = document.createElement('div');
        authorDiv.innerHTML = `
            <p class="text-gray-700 font-medium">${author.name}</p>
            <p class="text-sm text-gray-600">${author.position}</p>
            <p class="text-sm text-gray-500">Email: ${author.email}</p>
        `;
        authorContainer.appendChild(authorDiv);
    });
    
    // Update metadata
    document.getElementById('published-date').textContent = article.publishedDate;
    document.getElementById('page-range').textContent = article.pages;
    document.getElementById('volume-info').textContent = article.volume;
    document.getElementById('issn-number').textContent = article.issn;
    
    // Update PDF links
    document.getElementById('direct-pdf-link').href = article.pdfUrl;
    document.getElementById('modal-download-link').href = article.pdfUrl;
    document.getElementById('fallback-download-link').href = article.pdfUrl;
    
    // Update keywords
    const keywordsContainer = document.getElementById('keywords-container');
    keywordsContainer.innerHTML = '';
    
    article.keywords.forEach(keyword => {
        const keywordSpan = document.createElement('span');
        keywordSpan.className = 'keyword-tag';
        keywordSpan.textContent = keyword;
        keywordsContainer.appendChild(keywordSpan);
    });
    
    // Update abstract
    document.getElementById('abstract-content').textContent = article.abstract;
    
    // Show article and hide loading
    document.getElementById('loading-state').style.display = 'none';
    document.getElementById('article-container').style.display = 'block';
}

// Show error state
function showError() {
    document.getElementById('loading-state').style.display = 'none';
    document.getElementById('error-state').style.display = 'block';
}

// PDF Modal Functions
function openPDF() {
    if (!currentPdfUrl) return;
    
    const modal = document.getElementById('pdfModal');
    const iframe = document.getElementById('pdfFrame');
    const fallback = document.getElementById('pdfFallback');
    
    // Show modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Try to load PDF in iframe
    loadPDFInIframe();
}

function loadPDFInIframe() {
    const iframe = document.getElementById('pdfFrame');
    const fallback = document.getElementById('pdfFallback');
    
    // Show loading state
    iframe.style.display = 'block';
    fallback.classList.remove('active');
    
    // For better mobile support, use Google Docs viewer as primary method
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        // Use Google Docs viewer for mobile devices
        iframe.src = `https://docs.google.com/gview?url=${encodeURIComponent(currentPdfUrl)}&embedded=true`;
    } else {
        // For desktop, try direct embed first, fallback to Google Docs viewer
        iframe.src = currentPdfUrl;
    }
    
    // Handle iframe load errors
    iframe.onload = function() {
        // PDF loaded successfully
        console.log('PDF loaded successfully');
    };
    
    iframe.onerror = function() {
        // If direct embed fails, try Google Docs viewer
        console.log('Direct embed failed, trying Google Docs viewer');
        iframe.src = `https://docs.google.com/gview?url=${encodeURIComponent(currentPdfUrl)}&embedded=true`;
        
        // If Google Docs viewer also fails, show fallback
        setTimeout(() => {
            if (!iframe.contentDocument && !iframe.contentWindow.document) {
                showFallback();
            }
        }, 5000);
    };
    
    // Fallback for browsers that don't support PDF viewing
    setTimeout(() => {
        try {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            if (!iframeDoc || iframeDoc.body.innerHTML === '') {
                console.log('PDF viewer not supported, showing fallback');
                showFallback();
            }
        } catch (e) {
            // Cross-origin error means the PDF is loading (which is good)
            console.log('Cross-origin restriction (PDF loading)');
        }
    }, 3000);
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

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    const articleId = getArticleIdFromUrl();
    
    if (articleId && articlesData[articleId]) {
        loadArticle(articleId);
    } else {
        showError();
    }
});

// Close modal when clicking outside of it
window.onclick = function(event) {
    const modal = document.getElementById('pdfModal');
    if (event.target == modal) {
        closePDF();
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closePDF();
    }
});

// Smooth scrolling for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Detect if device supports PDF viewing
function detectPDFSupport() {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    const isIOS = /ipad|iphone|ipod/.test(userAgent);
    
    // iOS devices typically don't support embedded PDFs well
    if (isIOS) {
        return false;
    }
    
    // Check for PDF plugin support
    if (navigator.plugins && navigator.plugins.length) {
        for (let i = 0; i < navigator.plugins.length; i++) {
            if (navigator.plugins[i].name.toLowerCase().indexOf('pdf') > -1) {
                return true;
            }
        }
    }
    
    // Modern browsers usually support PDF viewing
    return !isMobile;
}

// Initialize PDF support detection
const supportsPDF = detectPDFSupport();
console.log('PDF Support:', supportsPDF);
