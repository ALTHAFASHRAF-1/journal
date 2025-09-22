// article-script.js - Enhanced version with new data structure support

// Global variables
let currentArticleId = null;
let currentPdfUrl = null;

// Get article ID from URL parameter
function getArticleIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    return id ? parseInt(id) : null;
}

// Load article data using new data manager
function loadArticle(articleId) {
    // Try new data structure first, then fallback to legacy
    let article = null;
    
    if (typeof JournalDataManager !== 'undefined') {
        article = JournalDataManager.getArticle(articleId);
    } else if (typeof articlesData !== 'undefined') {
        article = articlesData[articleId];
    }
    
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
    
    // Handle both old and new author format
    const authors = article.authors || (article.author ? [{
        name: article.author,
        position: "Author",
        email: "author@example.com"
    }] : []);
    
    authors.forEach(author => {
        const authorDiv = document.createElement('div');
        authorDiv.innerHTML = `
            <p class="text-gray-700 font-medium">${author.name}</p>
            <p class="text-sm text-gray-600">${author.position || 'Author'}</p>
            <p class="text-sm text-gray-500">Email: ${author.email || 'N/A'}</p>
        `;
        authorContainer.appendChild(authorDiv);
    });
    
    // Update metadata
    document.getElementById('published-date').textContent = article.publishedDate || article.date;
    document.getElementById('page-range').textContent = article.pages;
    document.getElementById('volume-info').textContent = article.volume || 'N/A';
    document.getElementById('issn-number').textContent = article.issn || '2581-3269';
    
    // Update PDF links
    if (currentPdfUrl) {
        document.getElementById('direct-pdf-link').href = currentPdfUrl;
        document.getElementById('modal-download-link').href = currentPdfUrl;
        document.getElementById('fallback-download-link').href = currentPdfUrl;
    }
    
    // Update keywords
    const keywordsContainer = document.getElementById('keywords-container');
    keywordsContainer.innerHTML = '';
    
    if (article.keywords && Array.isArray(article.keywords)) {
        article.keywords.forEach(keyword => {
            const keywordSpan = document.createElement('span');
            keywordSpan.className = 'keyword-tag';
            keywordSpan.textContent = keyword;
            keywordsContainer.appendChild(keywordSpan);
        });
    }
    
    // Update abstract
    document.getElementById('abstract-content').textContent = article.abstract;
    
    // Show article and hide loading
    document.getElementById('loading-state').style.display = 'none';
    document.getElementById('article-container').style.display = 'block';
}

// Enhanced initialization with better error handling
// Replace the initializeArticlePage function:
async function initializeArticlePage() {
    const articleId = getArticleIdFromUrl();
    
    if (!articleId) {
        showError();
        return;
    }

    // Wait for sheets data to load
    await initializeJournalData();

    loadArticle(articleId);
}

// Update the initialization calls:
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeArticlePage);
} else {
    initializeArticlePage();
}

// Rest of the functions remain the same...
function showError() {
    document.getElementById('loading-state').style.display = 'none';
    document.getElementById('error-state').style.display = 'block';
}

// PDF Modal Functions (unchanged)
function openPDF() {
    if (!currentPdfUrl) return;
    
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
            if (!iframe.contentDocument && !iframe.contentWindow.document) {
                showFallback();
            }
        }, 5000);
    };
    
    setTimeout(() => {
        try {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            if (!iframeDoc || iframeDoc.body.innerHTML === '') {
                console.log('PDF viewer not supported, showing fallback');
                showFallback();
            }
        } catch (e) {
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

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeArticlePage);
} else {
    initializeArticlePage();
}

// Event listeners (unchanged)
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

const supportsPDF = detectPDFSupport();
console.log('PDF Support:', supportsPDF);

function detectPDFSupport() {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    const isIOS = /ipad|iphone|ipod/.test(userAgent);
    
    if (isIOS) {
        return false;
    }
    
    if (navigator.plugins && navigator.plugins.length) {
        for (let i = 0; i < navigator.plugins.length; i++) {
            if (navigator.plugins[i].name.toLowerCase().indexOf('pdf') > -1) {
                return true;
            }
        }
    }
    
    return !isMobile;
}
