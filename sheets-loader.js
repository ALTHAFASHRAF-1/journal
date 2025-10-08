// sheets-loader.js - Fixed Google Sheets integration

const SHEETS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSkzubKLpyPWDjAWl5XS83-4huOcBJDZeeLRKVbntV2sDo-uG5Tzw5aFA6PQw3rNNv4-L-_44asHfTr/pub?gid=0&single=true&output=csv';

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
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const csvText = await response.text();
                this.journalData = this.parseCSVToJournalData(csvText);
                this.isLoaded = true;
                console.log('Data loaded successfully from Google Sheets:', this.journalData);
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
        if (lines.length < 2) {
            throw new Error('CSV file is empty or has only headers');
        }
        
        const headers = this.parseCSVLine(lines[0]).map(h => h.trim().toLowerCase());
        
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
        let quoteChar = '';
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if ((char === '"' || char === "'") && !inQuotes) {
                inQuotes = true;
                quoteChar = char;
            } else if (char === quoteChar && inQuotes) {
                inQuotes = false;
            } else if (char === ',' && !inQuotes) {
                result.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        
        result.push(current);
        return result.map(field => field.trim());
    }

    processCSVRow(row, journalData) {
    const issueId = row.issue_id;
    if (!issueId) {
        console.warn('Skipping row without issue_id');
        return;
    }

    // Convert Google Drive link to direct download if needed
    let coverImage = row.issue_cover_image || journalData.config.defaultCoverImage;
    if (coverImage.includes('drive.google.com/file/d/')) {
        const fileId = coverImage.match(/\/d\/([^\/]+)/)[1];
        coverImage = `https://drive.google.com/uc?export=view&id=${fileId}`;
    }

    // Create issue if it doesn't exist
    if (!journalData.issues[issueId]) {
        journalData.issues[issueId] = {
            volume: parseInt(row.volume) || 1,
            number: parseInt(row.number) || 1,
            year: parseInt(row.year) || new Date().getFullYear(),
            title: row.issue_title || `Vol. ${row.volume} No. ${row.number} (${row.year})`,
            publishedDate: row.issue_published_date || new Date().toISOString().split('T')[0],
            coverImage: coverImage,
            articles: []
        };
    }

    // Parse article ID properly - handle both string and number
    const articleId = this.parseArticleId(row.article_id);
    if (!articleId) {
        console.warn('Skipping row without valid article_id:', row.article_id);
        return;
    }

    // Parse authors from separate columns
    const authors = this.parseSeparateAuthorColumns(row);

    // Add article to issue
    const article = {
        id: articleId,
        title: row.article_title || 'Untitled Article',
        author: row.author || 'Unknown Author', // Legacy support
        authors: authors,
        abstract: row.abstract || 'No abstract available.',
        date: row.date || new Date().toISOString().split('T')[0],
        publishedDate: row.published_date || row.date || new Date().toISOString().split('T')[0],
        keywords: this.parseKeywords(row.keywords),
        pages: row.pages || '1-1',
        htmlFile: row.html_file || `articles.html?id=${articleId}`,
        pdfUrl: row.pdf_url || '',
        doi: row.doi || null,
        volume: parseInt(row.volume) || 1,
        number: parseInt(row.number) || 1
    };

    journalData.issues[issueId].articles.push(article);
}

// New function to parse separate author columns
parseSeparateAuthorColumns(row) {
    const authors = [];
    let authorIndex = 1;
    
    // Keep checking for author columns until we don't find any more
    while (row[`author_${authorIndex}_name`] || 
           row[`author_${authorIndex}_position`] || 
           row[`author_${authorIndex}_email`]) {
        
        const authorName = row[`author_${authorIndex}_name`];
        
        // Only add author if we have at least a name
        if (authorName && authorName.trim()) {
            authors.push({
                name: authorName.trim(),
                position: row[`author_${authorIndex}_position`]?.trim() || 'Author',
                email: row[`author_${authorIndex}_email`]?.trim() || `${authorName.toLowerCase().replace(/\s+/g, '.')}@example.com`
            });
        }
        
        authorIndex++;
    }
    
    // If no separate author columns found, fall back to the old authors field
    if (authors.length === 0 && row.authors) {
        return this.parseAuthors(row.authors);
    }
    
    // If still no authors, use the legacy author field
    if (authors.length === 0 && row.author) {
        return [{
            name: row.author,
            position: "Author",
            email: `${row.author.toLowerCase().replace(/\s+/g, '.')}@example.com`
        }];
    }
    
    return authors;
}
    // Data retrieval methods
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
                    issueNumber: issue.number
                });
            });
        });
        return articles;
    }

    async getArticle(articleId) {
        await this.ensureLoaded();
        const allArticles = await this.getAllArticles();
        
        // Try to find article by ID (handle both string and number)
        const article = allArticles.find(article => 
            article.id == articleId || // Loose comparison to handle string/number
            article.id === parseInt(articleId)
        );
        
        console.log('Searching for article ID:', articleId);
        console.log('Available articles:', allArticles.map(a => ({ id: a.id, title: a.title })));
        console.log('Found article:', article);
        
        return article || null;
    }

    async getArticlesByIssue(issueId) {
        await this.ensureLoaded();
        const issue = this.journalData.issues[issueId];
        if (!issue) return [];
        
        return issue.articles.map(article => ({
            ...article,
            issueId: issueId,
            issueTitle: issue.title
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
                   (article.issueTitle && article.issueTitle.toLowerCase().includes(searchTerm));
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
        console.log('Initializing journal data...');
        await sheetsDataManager.loadFromSheets();
        
        if (!sheetsDataManager.journalData) {
            throw new Error('Failed to load journal data');
        }
        
        // Set global variables for backward compatibility
        window.journalData = sheetsDataManager.journalData;
        window.journalIssues = sheetsDataManager.journalData.issues;
        
        // Populate articlesData for legacy support
        window.articlesData = {};
        const allArticles = await sheetsDataManager.getAllArticles();
        allArticles.forEach(article => {
            window.articlesData[article.id] = article;
        });

        console.log('Journal data initialized successfully');
        console.log('Available issues:', Object.keys(window.journalIssues));
        console.log('Available articles:', Object.keys(window.articlesData));
        
        return true;
    } catch (error) {
        console.error('Failed to initialize journal data:', error);
        
        // Create fallback data structure
        window.journalData = {
            config: {
                journalName: "Islamic Insight Journal",
                issn: "2581-3269"
            },
            issues: {}
        };
        window.journalIssues = {};
        window.articlesData = {};
        
        return false;
    }
}

// Auto-initialize when loaded
document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOM loaded, initializing journal data...');
    await initializeJournalData();
    
    // Trigger custom event when data is ready
    window.dispatchEvent(new CustomEvent('journalDataLoaded'));
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SheetsDataManager, initializeJournalData };
}
