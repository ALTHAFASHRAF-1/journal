// journal-dynamic.js - Simplified and fixed version
class JournalIssueLoader {
    constructor() {
        this.currentIssue = null;
        this.articlesData = [];
        this.currentSearchTerm = '';
        this.isDesktopSearchExpanded = false;
        this.isMobileSearchExpanded = false;
        this.currentIssueId = null;
    }

    // Get issue ID from URL parameters
    getCurrentIssueId() {
        const urlParams = new URLSearchParams(window.location.search);
        const issueParam = urlParams.get('issue');
        
        if (issueParam && window.journalIssues && window.journalIssues[issueParam]) {
            return issueParam;
        }

        // Return the latest issue as default
        const issues = IssueNavigation.generateIssueSelector();
        return issues.length > 0 ? issues[0].id : null;
    }

    // Load issue data and update page content
    async loadIssue() {
        this.showLoading(true);

        // Wait for data to be loaded
        if (!window.journalData || !window.journalIssues) {
            console.log('Waiting for journal data to load...');
            await this.waitForData();
        }

        this.currentIssueId = this.getCurrentIssueId();
        
        if (!this.currentIssueId) {
            this.showError('No journal issues found.');
            return;
        }

        this.currentIssue = window.journalIssues[this.currentIssueId];

        if (!this.currentIssue) {
            console.error(`Issue ${this.currentIssueId} not found`);
            this.showError(`Issue ${this.currentIssueId} not found`);
            return;
        }

        this.articlesData = this.currentIssue.articles || [];
        this.updatePageContent();
        this.setupEventListeners();
        this.setupIssueNavigation();

        // Load articles with a slight delay for smooth animation
        setTimeout(() => {
            this.loadArticles();
            this.showLoading(false);
            document.getElementById('main-content').style.display = 'grid';
        }, 300);
    }

    // Wait for data to be loaded
    waitForData() {
        return new Promise((resolve) => {
            const checkData = () => {
                if (window.journalIssues && Object.keys(window.journalIssues).length > 0) {
                    resolve(true);
                } else {
                    setTimeout(checkData, 100);
                }
            };
            checkData();
        });
    }

    // Show/hide loading state
    showLoading(show) {
        const loadingState = document.getElementById('loading-state');
        const mainContent = document.getElementById('main-content');

        if (loadingState) {
            loadingState.style.display = show ? 'block' : 'none';
        }
        if (mainContent && !show) {
            mainContent.style.display = 'grid';
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
                    <button onclick="location.reload()" class="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                        Retry
                    </button>
                </div>
            `;
        }
        this.showLoading(false);
        document.getElementById('main-content').style.display = 'grid';
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
        }

        // Update volume information
        const volumeSpan = document.querySelector('[data-field="volume"]');
        if (volumeSpan) {
            volumeSpan.textContent = `${this.currentIssue.volume}, Number ${this.currentIssue.number}`;
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
        if (!dateString) return 'Not specified';
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

        // Search functionality (simplified)
        this.setupSearch();
    }

    // Setup search functionality
    setupSearch() {
        const searchInputs = [
            document.getElementById('navbar-search-input'),
            document.getElementById('mobile-search-input')
        ];

        searchInputs.forEach(input => {
            if (input) {
                input.addEventListener('input', (e) => {
                    this.handleSearch(e.target.value);
                });
            }
        });
    }

    // Handle search
    handleSearch(query) {
        this.currentSearchTerm = query.toLowerCase().trim();

        if (!query) {
            this.loadArticles();
            return;
        }

        const filteredArticles = this.articlesData.filter(article => {
            return article.title.toLowerCase().includes(this.currentSearchTerm) ||
                   article.author.toLowerCase().includes(this.currentSearchTerm) ||
                   (article.abstract && article.abstract.toLowerCase().includes(this.currentSearchTerm)) ||
                   (article.keywords && article.keywords.some(keyword => 
                       keyword.toLowerCase().includes(this.currentSearchTerm)
                   ));
        });

        this.loadArticles(filteredArticles);
    }

    // Load and display articles
    loadArticles(articlesToShow = null) {
        const articlesGrid = document.getElementById('articlesGrid');
        const articles = articlesToShow || this.articlesData;

        if (articles.length === 0) {
            const searchMessage = this.currentSearchTerm ? 
                `No articles found for "${this.currentSearchTerm}"` : 
                'No articles found in this issue';

            articlesGrid.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <div class="text-gray-400 mb-4">
                        <i class="fas fa-search text-4xl"></i>
                    </div>
                    <h3 class="text-lg font-medium text-gray-600 mb-2">${searchMessage}</h3>
                    <p class="text-gray-500">Try adjusting your search terms or browse other issues.</p>
                    ${this.currentSearchTerm ? `
                        <button onclick="journalLoader.clearSearch()" class="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                            Clear Search
                        </button>
                    ` : ''}
                </div>
            `;
            return;
        }

        const articlesHTML = articles.map((article, index) => `
            <div id="article-${article.id}" class="article-card bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden fade-in" style="animation-delay: ${index * 0.1}s">
                <div class="p-6 article-content">
                    <h3 class="text-xl font-semibold academic-title text-gray-900 mb-3 leading-tight">
                        ${this.highlightSearchTerm(article.title)}
                    </h3>

                    <div class="mb-3">
                        <p class="text-sm font-medium text-blue-600">
                            ${this.highlightSearchTerm(article.author)}
                        </p>
                    </div>

                    <div class="mb-4 text-sm text-gray-600">
                        <i class="far fa-calendar-alt mr-2"></i>
                        <span>${this.formatDate(article.date)}</span>
                        <span class="mx-2">•</span>
                        <span>Pages ${article.pages || 'N/A'}</span>
                        ${article.doi ? `<span class="mx-2">•</span><span>DOI: ${article.doi}</span>` : ''}
                    </div>

                    <div class="article-description">
                        <p class="text-gray-700 text-sm leading-relaxed mb-4">
                            ${this.highlightSearchTerm(article.abstract || 'No abstract available.')}
                        </p>

                        ${article.keywords && article.keywords.length > 0 ? `
                            <div class="mb-4">
                                <div class="flex flex-wrap gap-2">
                                    ${article.keywords.filter(k => k.trim()).map(keyword => 
                                        `<span class="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                                            ${this.highlightSearchTerm(keyword)}
                                        </span>`
                                    ).join('')}
                                </div>
                            </div>
                        ` : ''}
                    </div>

                    <div class="article-footer">
                        <div class="flex justify-between items-center">
                            <a href="${article.htmlFile || 'articles.html?id=' + article.id}" 
                               class="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors text-center">
                                Read Full Article <i class="fas fa-arrow-right ml-2"></i>
                            </a>

                            <div class="flex space-x-2">
                                ${article.pdfUrl ? `
                                    <a href="${article.pdfUrl}" 
                                       class="text-gray-600 hover:text-blue-600 transition-colors p-2" 
                                       title="Download PDF" download>
                                        <i class="fas fa-download"></i>
                                    </a>
                                ` : ''}
                                <button onclick="journalLoader.shareArticle(${article.id})" 
                                        class="text-gray-600 hover:text-blue-600 transition-colors p-2" 
                                        title="Share Article">
                                    <i class="fas fa-share-alt"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        articlesGrid.innerHTML = articlesHTML;
    }

    // Highlight search terms
    highlightSearchTerm(text) {
        if (!this.currentSearchTerm || !text) return this.escapeHtml(text || '');
        
        const escapedText = this.escapeHtml(text);
        const escapedQuery = this.currentSearchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${escapedQuery})`, 'gi');
        return escapedText.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
    }

    // Utility functions
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Clear search
    clearSearch() {
        this.currentSearchTerm = '';
        
        const searchInputs = [
            document.getElementById('navbar-search-input'),
            document.getElementById('mobile-search-input')
        ];

        searchInputs.forEach(input => {
            if (input) input.value = '';
        });

        this.loadArticles();
    }

    // Share article
    shareArticle(articleId) {
        const article = this.articlesData.find(a => a.id === articleId);
        if (!article) return;

        const shareData = {
            title: article.title,
            text: `${article.title} by ${article.author}`,
            url: `${window.location.origin}${window.location.pathname}?issue=${this.currentIssueId}#article-${articleId}`
        };

        if (navigator.share && navigator.canShare(shareData)) {
            navigator.share(shareData);
        } else {
            navigator.clipboard.writeText(shareData.url).then(() => {
                alert('Article link copied to clipboard!');
            }).catch(() => {
                prompt('Copy this link to share:', shareData.url);
            });
        }
    }
}

// Initialize the journal loader
let journalLoader;

// Wait for data to be loaded before initializing
async function initializeJournalLoader() {
    // Wait for journal data to be available
    if (!window.journalIssues || Object.keys(window.journalIssues).length === 0) {
        console.log('Waiting for journal data...');
        await new Promise(resolve => {
            const checkData = () => {
                if (window.journalIssues && Object.keys(window.journalIssues).length > 0) {
                    resolve(true);
                } else {
                    setTimeout(checkData, 100);
                }
            };
            checkData();
        });
    }

    journalLoader = new JournalIssueLoader();
    await journalLoader.loadIssue();
}

// Initialize when DOM is ready and data is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeJournalLoader);
} else {
    initializeJournalLoader();
}
