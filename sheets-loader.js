// sheets-loader.js - Google Sheets integration for Islamic Insight Journal

const SHEETS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSzMD29jfzF44OLt8iT0sR3hmL7Zharsg-jJ374yM5yQREypAolg2nQ_gazCdXFLXfNmZPDfK2eNkpK/pub?gid=0&single=true&output=csv'; // Replace with your published CSV URL

class SheetsDataManager {
    constructor() {
        this.isLoaded = false;
        this.journalData = null;
        this.loadingPromise = null;
    }

    async loadFromSheets() {
        if (this.loadingPromise) {
            return this.loadingPromise;
        }

        this.loadingPromise = new Promise(async (resolve, reject) => {
            try {
                console.log('Loading data from Google Sheets...');
                const response = await fetch(SHEETS_CSV_URL);
                const csvText = await response.text();
                this.journalData = this.parseCSVToJournalData(csvText);
                this.isLoaded = true;
                console.log('Data loaded successfully from Google Sheets');
                resolve(this.journalData);
            } catch (error) {
                console.error('Error loading data from Google Sheets:', error);
                reject(error);
            }
        });

        return this.loadingPromise;
    }

    parseCSVToJournalData(csvText) {
        const lines = csvText.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',').map(h => h.trim());
        
        const journalData = {
            config: {
                journalName: "Islamic Insight Journal",
                subtitle: "Journal of Islamic Studies",
                issn: "2581-3269",
                publisher: "Darul Huda Islamic University",
                baseUrl: "https://dqdhiu.netlify.app/",
                defaultCoverImage: "https://via.placeholder.com/300x400/4f46e5/ffffff?text=Journal+Cover"
            },
            issues: {}
        };

        // Skip header row
        for (let i = 1; i < lines.length; i++) {
            const values = this.parseCSVLine(lines[i]);
            const row = {};
            
            headers.forEach((header, index) => {
                row[header] = values[index] ? values[index].trim() : '';
            });

            this.processCSVRow(row, journalData);
        }

        return journalData;
    }

    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        
        result.push(current);
        return result;
    }

    processCSVRow(row, journalData) {
        const issueId = row.issue_id;
        if (!issueId) return;

        // Create issue if it doesn't exist
        if (!journalData.issues[issueId]) {
            journalData.issues[issueId] = {
                volume: parseInt(row.volume) || 1,
                number: parseInt(row.number) || 1,
                year: parseInt(row.year) || new Date().getFullYear(),
                title: row.issue_title || `Vol. ${row.volume} No. ${row.number} (${row.year})`,
                publishedDate: row.issue_published_date || new Date().toISOString().split('T')[0],
                coverImage: row.issue_cover_image || journalData.config.defaultCoverImage,
                articles: []
            };
        }

        // Add article to issue
        const article = {
            id: parseInt(row.article_id) || Date.now(),
            title: row.article_title || 'Untitled Article',
            author: row.author || 'Unknown Author',
            authors: this.parseAuthors(row.authors) || [{
                name: row.author || 'Unknown Author',
                position: "Author",
                email: "author@example.com"
            }],
            abstract: row.abstract || 'No abstract available.',
            date: row.date || new Date().toISOString().split('T')[0],
            publishedDate: row.published_date || row.date || new Date().toISOString().split('T')[0],
            keywords: row.keywords ? row.keywords.split(',').map(k => k.trim()).filter(k => k) : [],
            pages: row.pages || '1-1',
            htmlFile: row.html_file || `${journalData.config.baseUrl}articles.html?id=${row.article_id}`,
            pdfUrl: row.pdf_url || '',
            doi: row.doi || null
        };

        journalData.issues[issueId].articles.push(article);
    }

    parseAuthors(authorsString) {
        if (!authorsString) return null;
        
        try {
            // Handle both JSON format and simple string format
            if (authorsString.startsWith('[')) {
                return JSON.parse(authorsString.replace(/'/g, '"'));
            } else {
                return authorsString.split(';').map(author => ({
                    name: author.trim(),
                    position: "Author",
                    email: "author@example.com"
                }));
            }
        } catch (error) {
            console.warn('Error parsing authors:', error);
            return null;
        }
    }

    // Same methods as original JournalDataManager but with async support
    async getAllIssues() {
        await this.ensureLoaded();
        return Object.entries(this.journalData.issues).map(([key, issue]) => ({
            id: key,
            ...issue
        })).sort((a, b) => {
            if (b.year !== a.year) return b.year - a.year;
            if (b.volume !== a.volume) return b.volume - a.volume;
            return b.number - a.number;
        });
    }

    async getIssue(issueId) {
        await this.ensureLoaded();
        return this.journalData.issues[issueId] || null;
    }

    async getAllArticles() {
        await this.ensureLoaded();
        const articles = [];
        Object.entries(this.journalData.issues).forEach(([issueId, issue]) => {
            issue.articles.forEach(article => {
                articles.push({
                    ...article,
                    issueId: issueId,
                    issueTitle: issue.title,
                    issueYear: issue.year,
                    issueVolume: issue.volume,
                    issueNumber: issue.number,
                    volume: issue.title,
                    issn: this.journalData.config.issn
                });
            });
        });
        return articles;
    }

    async getArticle(articleId) {
        await this.ensureLoaded();
        const allArticles = await this.getAllArticles();
        return allArticles.find(article => article.id === parseInt(articleId)) || null;
    }

    async getArticlesByIssue(issueId) {
        await this.ensureLoaded();
        const issue = this.journalData.issues[issueId];
        if (!issue) return [];
        
        return issue.articles.map(article => ({
            ...article,
            issueId: issueId,
            issueTitle: issue.title,
            volume: issue.title,
            issn: this.journalData.config.issn
        }));
    }

    async searchArticles(query) {
        await this.ensureLoaded();
        if (!query) return [];
        
        const allArticles = await this.getAllArticles();
        const searchTerm = query.toLowerCase().trim();
        
        return allArticles.filter(article => {
            return article.title.toLowerCase().includes(searchTerm) ||
                   article.author.toLowerCase().includes(searchTerm) ||
                   article.abstract.toLowerCase().includes(searchTerm) ||
                   article.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm)) ||
                   article.issueTitle.toLowerCase().includes(searchTerm);
        });
    }

    async ensureLoaded() {
        if (!this.isLoaded) {
            await this.loadFromSheets();
        }
    }
}

// Initialize global data manager
const sheetsDataManager = new SheetsDataManager();

// Backward compatibility functions
async function initializeJournalData() {
    try {
        await sheetsDataManager.loadFromSheets();
        
        // Set global variables for backward compatibility
        window.journalData = sheetsDataManager.journalData;
        window.journalIssues = sheetsDataManager.journalData.issues;
        
        // Populate articlesData for legacy support
        window.articlesData = {};
        const allArticles = await sheetsDataManager.getAllArticles();
        allArticles.forEach(article => {
            window.articlesData[article.id] = article;
        });

        // Set up legacy navigation
        window.IssueNavigation = {
            getAllIssues: () => Object.keys(window.journalIssues),
            getIssueUrl: (issueId) => `?issue=${issueId}`,
            generateIssueSelector: () => {
                const issues = Object.entries(window.journalIssues).map(([key, issue]) => ({
                    id: key,
                    title: issue.title,
                    url: `?issue=${key}`,
                    year: issue.year,
                    volume: issue.volume,
                    number: issue.number
                })).sort((a, b) => {
                    if (b.year !== a.year) return b.year - a.year;
                    if (b.volume !== a.volume) return b.volume - a.volume;
                    return b.number - a.number;
                });
                return issues;
            },
            getPreviousIssue: (currentIssueId) => {
                const issues = window.IssueNavigation.generateIssueSelector();
                const currentIndex = issues.findIndex(issue => issue.id === currentIssueId);
                if (currentIndex < issues.length - 1) {
                    return issues[currentIndex + 1];
                }
                return null;
            },
            getNextIssue: (currentIssueId) => {
                const issues = window.IssueNavigation.generateIssueSelector();
                const currentIndex = issues.findIndex(issue => issue.id === currentIssueId);
                if (currentIndex > 0) {
                    return issues[currentIndex - 1];
                }
                return null;
            }
        };

        window.JournalDataManager = sheetsDataManager;
        
        console.log('Journal data initialized from Google Sheets');
        return true;
    } catch (error) {
        console.error('Failed to initialize journal data:', error);
        return false;
    }
}

// Auto-initialize when loaded
document.addEventListener('DOMContentLoaded', async function() {
    await initializeJournalData();
    
    // Trigger custom event when data is ready
    window.dispatchEvent(new CustomEvent('journalDataLoaded'));
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SheetsDataManager, initializeJournalData };
}
