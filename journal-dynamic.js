// journal-dynamic.js - Dynamic content loader for journal issues
// journal-dynamic.js - Enhanced dynamic content loader for journal issues

class JournalIssueLoader {
constructor() {
this.currentIssue = null;
this.articlesData = [];
this.currentSearchTerm = '';
this.isDesktopSearchExpanded = false;
this.isMobileSearchExpanded = false;
        this.currentIssueId = null;
}

    // Get issue ID from URL parameters or filename
    // Get issue ID from URL parameters or default to latest
getCurrentIssueId() {
// Method 1: From URL parameters (?issue=issue1)
const urlParams = new URLSearchParams(window.location.search);
const issueParam = urlParams.get('issue');
if (issueParam && journalIssues[issueParam]) {
return issueParam;
}

        // Method 2: From filename (issue1.html -> issue1)
        const filename = window.location.pathname.split('/').pop();
        const issueId = filename.replace('.html', '');
        if (journalIssues[issueId]) {
            return issueId;
        }

        // Method 3: From data attribute or default
        // Method 2: From data attribute
const bodyIssue = document.body.getAttribute('data-issue');
if (bodyIssue && journalIssues[bodyIssue]) {
return bodyIssue;
}

        // Default fallback
        return 'issue1';
        // Default to the latest issue (first in the sorted list)
        const issues = IssueNavigation.generateIssueSelector();
        return issues.length > 0 ? issues[0].id : 'issue1';
}

// Load issue data and update page content
loadIssue() {
        const issueId = this.getCurrentIssueId();
        this.currentIssue = journalIssues[issueId];
        this.showLoading(true);
        
        this.currentIssueId = this.getCurrentIssueId();
        this.currentIssue = journalIssues[this.currentIssueId];

if (!this.currentIssue) {
            console.error(`Issue ${issueId} not found`);
            console.error(`Issue ${this.currentIssueId} not found`);
            this.showError(`Issue ${this.currentIssueId} not found`);
return;
}

this.articlesData = this.currentIssue.articles;
this.updatePageContent();
this.setupEventListeners();
        this.loadArticles();
        this.setupIssueSelector();
        this.setupIssueNavigation();
        
        // Load articles with a slight delay for smooth animation
        setTimeout(() => {
            this.loadArticles();
            this.showLoading(false);
        }, 300);
    }

    // Show/hide loading state
    showLoading(show) {
        const loadingState = document.getElementById('loading-state');
        const articlesGrid = document.getElementById('articlesGrid');
        
        if (loadingState) {
            loadingState.style.display = show ? 'block' : 'none';
        }
        if (articlesGrid && !show) {
            articlesGrid.style.display = 'grid';
        }
    }

    // Show error message
    showError(message) {
        const articlesGrid = document.getElementById('articlesGrid');
        if (articlesGrid) {
            articlesGrid.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <div class="text-red-500 mb-4">
                        <i class="fas fa-exclamation-triangle text-4xl"></i>
                    </div>
                    <h3 class="text-lg font-medium text-gray-900 mb-2">Error Loading Content</h3>
                    <p class="text-gray-600">${message}</p>
                </div>
            `;
        }
        this.showLoading(false);
}

// Update dynamic content on the page
updatePageContent() {
// Update page title
document.title = `${this.currentIssue.title} - Islamic Insight Journal`;

// Update main header
const mainHeader = document.querySelector('.text-3xl.sm\\:text-4xl.lg\\:text-5xl');
if (mainHeader) {
mainHeader.textContent = this.currentIssue.title;
}

// Update journal cover image
const coverImage = document.querySelector('.journal-cover');
if (coverImage) {
coverImage.src = this.currentIssue.coverImage;
coverImage.alt = `${this.currentIssue.title} Cover`;
            coverImage.onerror = () => {
                coverImage.src = 'https://via.placeholder.com/300x400/4f46e5/ffffff?text=Journal+Cover';
            };
}

// Update published date
const publishedSpan = document.querySelector('[data-field="published"]');
if (publishedSpan) {
publishedSpan.textContent = this.formatDate(this.currentIssue.publishedDate);
        } else {
            // Fallback: find by content
            const publishedElements = document.querySelectorAll('span');
            publishedElements.forEach(el => {
                if (el.innerHTML.includes('<strong>Published:</strong>')) {
                    el.innerHTML = `<strong>Published:</strong> ${this.formatDate(this.currentIssue.publishedDate)}`;
                }
            });
}

// Update volume information
const volumeSpan = document.querySelector('[data-field="volume"]');
if (volumeSpan) {
volumeSpan.textContent = `${this.currentIssue.volume}, Number ${this.currentIssue.number}`;
        } else {
            // Fallback: find by content
            const volumeElements = document.querySelectorAll('span');
            volumeElements.forEach(el => {
                if (el.innerHTML.includes('<strong>Volume:</strong>')) {
                    el.innerHTML = `<strong>Volume:</strong> ${this.currentIssue.volume}, Number ${this.currentIssue.number}`;
                }
            });
}

        // Update article count
        const articleCountSpan = document.getElementById('article-count');
        if (articleCountSpan) {
            const count = this.articlesData.length;
            articleCountSpan.textContent = `${count} article${count !== 1 ? 's' : ''} in this issue`;
        }

        // Update URL without page reload
        const newUrl = `${window.location.pathname}?issue=${this.currentIssueId}`;
        window.history.replaceState({}, '', newUrl);

// Update meta tags
this.updateMetaTags();
}

// Update meta tags for SEO
updateMetaTags() {
// Update meta description
let metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.content = `${this.currentIssue.title} - Islamic Insight Journal of Islamic Studies - Published ${this.formatDate(this.currentIssue.publishedDate)}`;
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.name = 'description';
            document.head.appendChild(metaDesc);
}
        metaDesc.content = `${this.currentIssue.title} - Islamic Insight Journal of Islamic Studies - Published ${this.formatDate(this.currentIssue.publishedDate)}`;

// Update meta keywords
let metaKeywords = document.querySelector('meta[name="keywords"]');
        if (metaKeywords) {
            const allKeywords = this.articlesData.flatMap(article => article.keywords);
            metaKeywords.content = [...new Set(allKeywords)].join(', ');
        if (!metaKeywords) {
            metaKeywords = document.createElement('meta');
            metaKeywords.name = 'keywords';
            document.head.appendChild(metaKeywords);
        }
        const allKeywords = this.articlesData.flatMap(article => article.keywords);
        metaKeywords.content = [...new Set(allKeywords)].join(', ');
    }

    // Setup issue selector dropdown
    setupIssueSelector() {
        const issueSelector = document.getElementById('issue-selector');
        const mobileIssueSelector = document.getElementById('mobile-issue-selector');
        const issues = IssueNavigation.generateIssueSelector();
        
        const options = issues.map(issue => 
            `<option value="${issue.id}" ${issue.id === this.currentIssueId ? 'selected' : ''}>
                ${issue.title}
            </option>`
        ).join('');

        if (issueSelector) {
            issueSelector.innerHTML = '<option value="">Select Issue</option>' + options;
            issueSelector.addEventListener('change', (e) => {
                if (e.target.value) {
                    window.location.href = IssueNavigation.getIssueUrl(e.target.value);
                }
            });
        }

        if (mobileIssueSelector) {
            mobileIssueSelector.innerHTML = '<option value="">Select Issue</option>' + options;
            mobileIssueSelector.addEventListener('change', (e) => {
                if (e.target.value) {
                    window.location.href = IssueNavigation.getIssueUrl(e.target.value);
                }
            });
        }
    }

    // Setup issue navigation (Previous/Next buttons)
    setupIssueNavigation() {
        const prevButton = document.getElementById('prev-issue-btn');
        const nextButton = document.getElementById('next-issue-btn');
        
        const prevIssue = IssueNavigation.getPreviousIssue(this.currentIssueId);
        const nextIssue = IssueNavigation.getNextIssue(this.currentIssueId);

        if (prevButton) {
            if (prevIssue) {
                prevButton.disabled = false;
                prevButton.classList.remove('opacity-50', 'cursor-not-allowed');
                prevButton.onclick = () => window.location.href = prevIssue.url;
                prevButton.title = `Go to ${prevIssue.title}`;
            } else {
                prevButton.disabled = true;
                prevButton.classList.add('opacity-50', 'cursor-not-allowed');
                prevButton.onclick = null;
                prevButton.title = 'No previous issue';
            }
        }

        if (nextButton) {
            if (nextIssue) {
                nextButton.disabled = false;
                nextButton.classList.remove('opacity-50', 'cursor-not-allowed');
                nextButton.onclick = () => window.location.href = nextIssue.url;
                nextButton.title = `Go to ${nextIssue.title}`;
            } else {
                nextButton.disabled = true;
                nextButton.classList.add('opacity-50', 'cursor-not-allowed');
                nextButton.onclick = null;
                nextButton.title = 'No next issue';
            }
}
}

// Format date for display
formatDate(dateString) {
const date = new Date(dateString);
const options = { year: 'numeric', month: 'long', day: 'numeric' };
return date.toLocaleDateString('en-US', options);
}

// Setup all event listeners
setupEventListeners() {
// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
if (mobileMenuBtn && mobileMenu) {
mobileMenuBtn.addEventListener('click', () => {
mobileMenu.classList.toggle('hidden');
});
}

// Desktop search
const searchToggleBtn = document.getElementById('search-toggle-btn');
if (searchToggleBtn) {
searchToggleBtn.addEventListener('click', () => this.toggleNavbarSearch());
}

const navbarSearchInput = document.getElementById('navbar-search-input');
if (navbarSearchInput) {
navbarSearchInput.addEventListener('input', () => this.handleNavbarSearch());
navbarSearchInput.addEventListener('keydown', (e) => {
if (e.key === 'Escape') {
this.toggleNavbarSearch();
}
                if (e.key === 'Enter') {
                    this.handleSearchEnter();
                }
});
}

// Mobile search
const mobileSearchToggleBtn = document.getElementById('mobile-search-toggle-btn');
if (mobileSearchToggleBtn) {
mobileSearchToggleBtn.addEventListener('click', () => this.toggleMobileSearch());
}

const mobileSearchInput = document.getElementById('mobile-search-input');
if (mobileSearchInput) {
mobileSearchInput.addEventListener('input', () => this.handleMobileSearch());
mobileSearchInput.addEventListener('keydown', (e) => {
if (e.key === 'Escape') {
this.toggleMobileSearch();
}
                if (e.key === 'Enter') {
                    this.handleSearchEnter();
                }
});
}

// Close search on outside click
document.addEventListener('click', (e) => this.handleOutsideClick(e));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
anchor.addEventListener('click', (e) => {
e.preventDefault();
const target = document.querySelector(anchor.getAttribute('href'));
if (target) {
target.scrollIntoView({ behavior: 'smooth', block: 'start' });
if (mobileMenu) {
mobileMenu.classList.add('hidden');
}
}
});
});

        // Handle browser back/forward buttons
        window.addEventListener('popstate', () => {
            this.loadIssue();
        });
    }

    // Handle search enter key
    handleSearchEnter() {
        const navbarSearchResults = document.getElementById('navbar-search-results');
        const mobileSearchResults = document.getElementById('mobile-search-results');
        const firstResult = navbarSearchResults?.querySelector('.search-result-item') || 
                           mobileSearchResults?.querySelector('.search-result-item');
        
        if (firstResult) {
            firstResult.click();
        }
}

// Toggle navbar search
toggleNavbarSearch() {
const navbarSearchInput = document.getElementById('navbar-search-input');
const navbarSearchResults = document.getElementById('navbar-search-results');
const searchIcon = document.getElementById('search-icon');
const navItems = document.getElementById('nav-items');

this.isDesktopSearchExpanded = !this.isDesktopSearchExpanded;

if (this.isDesktopSearchExpanded) {
navbarSearchInput.classList.add('expanded');
navItems.classList.add('hidden-for-search');
searchIcon.className = 'fas fa-times text-lg';
navbarSearchInput.focus();
} else {
navbarSearchInput.classList.remove('expanded');
navItems.classList.remove('hidden-for-search');
searchIcon.className = 'fas fa-search text-lg';
navbarSearchResults.classList.add('hidden');
navbarSearchInput.value = '';
this.currentSearchTerm = '';
this.loadArticles();
}
}

// Toggle mobile search
toggleMobileSearch() {
const mobileSearchInput = document.getElementById('mobile-search-input');
const mobileSearchResults = document.getElementById('mobile-search-results');
const mobileSearchIcon = document.getElementById('mobile-search-icon');

this.isMobileSearchExpanded = !this.isMobileSearchExpanded;

if (this.isMobileSearchExpanded) {
mobileSearchInput.classList.add('expanded');
mobileSearchIcon.className = 'fas fa-times text-lg';
mobileSearchInput.focus();
} else {
mobileSearchInput.classList.remove('expanded');
mobileSearchIcon.className = 'fas fa-search text-lg';
mobileSearchResults.classList.add('hidden');
mobileSearchInput.value = '';
this.currentSearchTerm = '';
this.loadArticles();
}
}

// Handle navbar search
handleNavbarSearch() {
const navbarSearchInput = document.getElementById('navbar-search-input');
const query = navbarSearchInput.value.toLowerCase().trim();
this.currentSearchTerm = query;

if (!query) {
document.getElementById('navbar-search-results').classList.add('hidden');
this.loadArticles();
return;
}

const filteredArticles = this.articlesData.filter(article => {
return article.title.toLowerCase().includes(query) ||
article.author.toLowerCase().includes(query) ||
article.abstract.toLowerCase().includes(query) ||
article.keywords.some(keyword => keyword.toLowerCase().includes(query));
});

this.displayNavbarSearchResults(filteredArticles, query);
this.loadArticles(filteredArticles);
}

// Handle mobile search
handleMobileSearch() {
const mobileSearchInput = document.getElementById('mobile-search-input');
const query = mobileSearchInput.value.toLowerCase().trim();
this.currentSearchTerm = query;

if (!query) {
document.getElementById('mobile-search-results').classList.add('hidden');
this.loadArticles();
return;
}

const filteredArticles = this.articlesData.filter(article => {
return article.title.toLowerCase().includes(query) ||
article.author.toLowerCase().includes(query) ||
article.abstract.toLowerCase().includes(query) ||
article.keywords.some(keyword => keyword.toLowerCase().includes(query));
});

this.displayMobileSearchResults(filteredArticles, query);
this.loadArticles(filteredArticles);
}

// Display navbar search results
displayNavbarSearchResults(results, query) {
const navbarSearchResults = document.getElementById('navbar-search-results');

if (results.length === 0) {
navbarSearchResults.innerHTML = `
               <div class="p-4 text-center text-gray-500">
                   <i class="fas fa-search text-2xl mb-2 text-gray-400"></i>
                    <p>No articles found for "<strong>${query}</strong>"</p>
                    <p>No articles found for "<strong>${this.escapeHtml(query)}</strong>"</p>
               </div>
           `;
} else {
navbarSearchResults.innerHTML = results.slice(0, 5).map(article => `
               <div class="search-result-item" onclick="journalLoader.scrollToArticle(${article.id});">
                   <h4 class="font-semibold text-gray-900 mb-1 text-sm">${this.highlightSearchTerm(article.title, query)}</h4>
                   <p class="text-sm text-gray-600 mb-2">${this.highlightSearchTerm(article.author, query)}</p>
                    <p class="text-xs text-gray-500">${this.highlightSearchTerm(article.abstract.substring(0, 120), query)}...</p>
                    <p class="text-xs text-gray-500">${this.highlightSearchTerm(this.truncateText(article.abstract, 120), query)}...</p>
               </div>
           `).join('');
}

navbarSearchResults.classList.remove('hidden');
}

// Display mobile search results
displayMobileSearchResults(results, query) {
const mobileSearchResults = document.getElementById('mobile-search-results');

if (results.length === 0) {
mobileSearchResults.innerHTML = `
               <div class="p-3 text-center text-gray-500 text-sm">
                   <i class="fas fa-search text-lg mb-1 text-gray-400"></i>
                    <p>No articles found for "<strong>${query}</strong>"</p>
                    <p>No articles found for "<strong>${this.escapeHtml(query)}</strong>"</p>
               </div>
           `;
} else {
mobileSearchResults.innerHTML = results.slice(0, 5).map(article => `
               <div class="search-result-item text-sm" onclick="journalLoader.scrollToArticle(${article.id});">
                   <h4 class="font-semibold text-gray-900 mb-1">${this.highlightSearchTerm(article.title, query)}</h4>
                   <p class="text-xs text-gray-600 mb-1">${this.highlightSearchTerm(article.author, query)}</p>
                    <p class="text-xs text-gray-500">${this.highlightSearchTerm(article.abstract.substring(0, 100), query)}...</p>
                    <p class="text-xs text-gray-500">${this.highlightSearchTerm(this.truncateText(article.abstract, 100), query)}...</p>
               </div>
           `).join('');
}

mobileSearchResults.classList.remove('hidden');
}

    // Utility functions
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength).replace(/\s+\S*$/, '');
    }

// Highlight search terms
highlightSearchTerm(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
        if (!query) return this.escapeHtml(text);
        const escapedText = this.escapeHtml(text);
        const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${escapedQuery})`, 'gi');
        return escapedText.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
}

// Handle outside clicks to close search
handleOutsideClick(e) {
const navbarSearchInput = document.getElementById('navbar-search-input');
const navbarSearchResults = document.getElementById('navbar-search-results');
const searchToggleBtn = document.getElementById('search-toggle-btn');
const mobileSearchInput = document.getElementById('mobile-search-input');
const mobileSearchResults = document.getElementById('mobile-search-results');
const mobileSearchToggleBtn = document.getElementById('mobile-search-toggle-btn');

// Desktop search
if (navbarSearchInput && navbarSearchResults && searchToggleBtn) {
if (!navbarSearchInput.contains(e.target) && 
!navbarSearchResults.contains(e.target) && 
!searchToggleBtn.contains(e.target)) {
navbarSearchResults.classList.add('hidden');
}
}

// Mobile search
if (mobileSearchInput && mobileSearchResults && mobileSearchToggleBtn) {
if (!mobileSearchInput.contains(e.target) && 
!mobileSearchResults.contains(e.target) && 
!mobileSearchToggleBtn.contains(e.target)) {
mobileSearchResults.classList.add('hidden');
}
}
}

// Scroll to specific article
scrollToArticle(articleId) {
const navbarSearchResults = document.getElementById('navbar-search-results');
const mobileSearchResults = document.getElementById('mobile-search-results');

if (navbarSearchResults) navbarSearchResults.classList.add('hidden');
if (mobileSearchResults) mobileSearchResults.classList.add('hidden');

const articleElement = document.getElementById(`article-${articleId}`);
if (articleElement) {
articleElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
articleElement.classList.add('ring-2', 'ring-blue-500');
setTimeout(() => {
articleElement.classList.remove('ring-2', 'ring-blue-500');
}, 2000);
}
}

// Load and display articles
loadArticles(articlesToShow = null) {
const articlesGrid = document.getElementById('articlesGrid');
const articles = articlesToShow || this.articlesData;

if (articles.length === 0) {
articlesGrid.innerHTML = `
               <div class="col-span-full text-center py-12">
                   <div class="text-gray-400 mb-4">
                       <i class="fas fa-search text-4xl"></i>
                   </div>
                   <h3 class="text-lg font-medium text-gray-600 mb-2">No articles found</h3>
                   <p class="text-gray-500">Try adjusting your search terms or browse all articles.</p>
                   <button onclick="journalLoader.clearSearch()" class="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                       Clear Search
                   </button>
               </div>
           `;
return;
}

const articlesHTML = articles.map((article, index) => `
           <div id="article-${article.id}" class="article-card bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden fade-in" style="animation-delay: ${index * 0.1}s">
               <div class="p-6 article-content">
                   <h3 class="text-xl font-semibold academic-title text-gray-900 mb-3 leading-tight">
                        ${this.currentSearchTerm ? this.highlightSearchTerm(article.title, this.currentSearchTerm) : article.title}
                        ${this.currentSearchTerm ? this.highlightSearchTerm(article.title, this.currentSearchTerm) : this.escapeHtml(article.title)}
                   </h3>

                   <div class="mb-3">
                       <p class="text-sm font-medium text-blue-600">
                            ${this.currentSearchTerm ? this.highlightSearchTerm(article.author, this.currentSearchTerm) : article.author}
                            ${this.currentSearchTerm ? this.highlightSearchTerm(article.author, this.currentSearchTerm) : this.escapeHtml(article.author)}
                       </p>
                   </div>

                   <div class="mb-4 text-sm text-gray-600">
                       <i class="far fa-calendar-alt mr-2"></i>
                       <span>${this.formatDate(article.date)}</span>
                       <span class="mx-2">•</span>
                       <span>Pages ${article.pages}</span>
                        ${article.doi ? `<span class="mx-2">•</span><span>DOI: ${article.doi}</span>` : ''}
                   </div>

                   <div class="article-description">
                       <p class="text-gray-700 text-sm leading-relaxed mb-4">
                            ${this.currentSearchTerm ? this.highlightSearchTerm(article.abstract, this.currentSearchTerm) : article.abstract}
                            ${this.currentSearchTerm ? this.highlightSearchTerm(article.abstract, this.currentSearchTerm) : this.escapeHtml(article.abstract)}
                       </p>

                       <div class="mb-4">
                           <div class="flex flex-wrap gap-2">
                                ${article.keywords.map(keyword => 
                                ${article.keywords.filter(k => k.trim()).map(keyword => 
                                   `<span class="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                                        ${this.currentSearchTerm ? this.highlightSearchTerm(keyword, this.currentSearchTerm) : keyword}
                                        ${this.currentSearchTerm ? this.highlightSearchTerm(keyword, this.currentSearchTerm) : this.escapeHtml(keyword)}
                                   </span>`
                               ).join('')}
                           </div>
                       </div>
                   </div>

                   <div class="article-footer">
                       <div class="flex justify-between items-center">
                           <a href="${article.htmlFile}" 
                              class="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors text-center">
                                Read More <i class="fas fa-arrow-right ml-2"></i>
                                Read Full Article <i class="fas fa-arrow-right ml-2"></i>
                           </a>

                           <div class="flex space-x-2">
                               <button onclick="journalLoader.downloadPDF(${article.id})" 
                                        class="text-gray-600 hover:text-blue-600 transition-colors" 
                                        class="text-gray-600 hover:text-blue-600 transition-colors p-2" 
                                       title="Download PDF">
                                   <i class="fas fa-download"></i>
                               </button>
                               <button onclick="journalLoader.shareArticle(${article.id})" 
                                        class="text-gray-600 hover:text-blue-600 transition-colors" 
                                        class="text-gray-600 hover:text-blue-600 transition-colors p-2" 
                                       title="Share Article">
                                   <i class="fas fa-share-alt"></i>
                               </button>
                                <button onclick="journalLoader.citeArticle(${article.id})" 
                                        class="text-gray-600 hover:text-blue-600 transition-colors p-2" 
                                        title="Citation">
                                    <i class="fas fa-quote-right"></i>
                                </button>
                           </div>
                       </div>
                   </div>
               </div>
           </div>
       `).join('');

articlesGrid.innerHTML = articlesHTML;
}

// Clear search
clearSearch() {
const navbarSearchInput = document.getElementById('navbar-search-input');
const mobileSearchInput = document.getElementById('mobile-search-input');
const navItems = document.getElementById('nav-items');
const searchIcon = document.getElementById('search-icon');
const mobileSearchIcon = document.getElementById('mobile-search-icon');
const navbarSearchResults = document.getElementById('navbar-search-results');
const mobileSearchResults = document.getElementById('mobile-search-results');

if (navbarSearchInput) {
navbarSearchInput.value = '';
navbarSearchInput.classList.remove('expanded');
}
if (mobileSearchInput) {
mobileSearchInput.value = '';
mobileSearchInput.classList.remove('expanded');
}
if (navItems) navItems.classList.remove('hidden-for-search');
if (searchIcon) searchIcon.className = 'fas fa-search text-lg';
if (mobileSearchIcon) mobileSearchIcon.className = 'fas fa-search text-lg';
if (navbarSearchResults) navbarSearchResults.classList.add('hidden');
if (mobileSearchResults) mobileSearchResults.classList.add('hidden');

this.currentSearchTerm = '';
this.isDesktopSearchExpanded = false;
this.isMobileSearchExpanded = false;
this.loadArticles();
}

// Download PDF placeholder
downloadPDF(articleId) {
        console.log(`Downloading PDF for article ${articleId}`);
        alert(`Downloading PDF for article ${articleId}. In a real implementation, this would trigger a PDF download.`);
        const article = this.articlesData.find(a => a.id === articleId);
        if (article) {
            // In a real implementation, this would trigger actual PDF download
            console.log(`Downloading PDF for article: ${article.title}`);
            // You can implement actual PDF download logic here
            alert(`PDF download for "${article.title}" would start here.\n\nIn a real implementation, this would link to the actual PDF file.`);
        }
}

// Share article
shareArticle(articleId) {
const article = this.articlesData.find(a => a.id === articleId);
        if (article && navigator.share) {
            navigator.share({
                title: article.title,
                text: article.abstract.substring(0, 200) + '...',
                url: window.location.href + '#article-' + articleId
            });
        if (!article) return;

        const shareData = {
            title: article.title,
            text: `${article.title} by ${article.author}`,
            url: `${window.location.origin}${window.location.pathname}?issue=${this.currentIssueId}#article-${articleId}`
        };

        if (navigator.share && navigator.canShare(shareData)) {
            navigator.share(shareData);
} else {
            const url = window.location.href + '#article-' + articleId;
            navigator.clipboard.writeText(url).then(() => {
            // Fallback to clipboard
            const shareText = `${shareData.title}\nBy ${article.author}\n${shareData.url}`;
            navigator.clipboard.writeText(shareText).then(() => {
alert('Article link copied to clipboard!');
}).catch(() => {
                alert('Could not copy link. Please manually copy the URL.');
                // Final fallback
                prompt('Copy this link to share:', shareData.url);
            });
        }
    }

    // Generate citation for article
    citeArticle(articleId) {
        const article = this.articlesData.find(a => a.id === articleId);
        if (!article) return;

        const citation = this.generateCitation(article);
        
        // Show citation in a modal-like alert
        const citationText = `APA Style Citation:\n\n${citation.apa}\n\n` +
                            `MLA Style Citation:\n\n${citation.mla}\n\n` +
                            `Chicago Style Citation:\n\n${citation.chicago}`;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(citation.apa).then(() => {
                alert(`${citationText}\n\nAPA citation copied to clipboard!`);
});
        } else {
            alert(citationText);
}
}

    // Generate different citation formats
    generateCitation(article) {
        const year = new Date(article.date).getFullYear();
        const issue = this.currentIssue;
        
        return {
            apa: `${article.author} (${year}). ${article.title}. Islamic Insight Journal, ${issue.volume}(${issue.number}), ${article.pages}. ${article.doi ? `https://doi.org/${article.doi}` : ''}`,
            
            mla: `${article.author}. "${article.title}." Islamic Insight Journal, vol. ${issue.volume}, no. ${issue.number}, ${year}, pp. ${article.pages}.`,
            
            chicago: `${article.author}. "${article.title}." Islamic Insight Journal ${issue.volume}, no. ${issue.number} (${year}): ${article.pages}. ${article.doi ? `https://doi.org/${article.doi}.` : ''}`
        };
    }
}

// Initialize the journal loader
let journalLoader;
document.addEventListener('DOMContentLoaded', function() {
journalLoader = new JournalIssueLoader();
journalLoader.loadIssue();
});

// Handle page visibility change to reload if needed
document.addEventListener('visibilitychange', function() {
    if (!document.hidden && journalLoader) {
        // Optionally refresh data when page becomes visible
        // journalLoader.loadIssue();
    }
});
