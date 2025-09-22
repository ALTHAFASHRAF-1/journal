// data.js - Unified data structure for Islamic Insight Journal
// This file combines both journal issues and individual articles data

const journalData = {
    // Journal Configuration
    config: {
        journalName: "Islamic Insight Journal",
        subtitle: "Journal of Islamic Studies",
        issn: "2581-3269",
        publisher: "Darul Huda Islamic University",
        baseUrl: "https://dqdhiu.netlify.app/",
        defaultCoverImage: "https://via.placeholder.com/300x400/4f46e5/ffffff?text=Journal+Cover"
    },

    // Issues Data with embedded articles
    issues: {
        "issue5": {
            volume: 7,
            number: 2,
            year: 2024,
            title: "Vol. 7 No. 2 (2024)",
            publishedDate: "2024-12-01",
            coverImage: "https://dqdhiu.netlify.app/vol7no2.jpg",
            articles: [
                {
                    id: 1,
                    title: "WESTERN SĪRAH LITERATURE FROM INCEPTION TO CONTEMPORARY DEVELOPMENTS: A HISTORICAL ANALYSIS",
                    author: "Irshad EV",
                    authors: [
                        {
                            name: "Irshad EV",
                            position: "Research Scholar, Mohammed VI Institute for the Training of Imams, Morchidines and Morchidates, Rabat, Morocco",
                            email: "irshadev@gmail.com"
                        }
                    ],
                    abstract: "This study investigates the varied approaches of Western scholars and writers toward the life and character of Prophet Muhammad (PBUH) under the title, \"Western Sīrah Literature from its Inception to Contemporary Developments: A Historical Analysis\". It addresses the deep-rooted stereotypes and polemical narratives in Western discourse, which often depicted the Prophet negatively, framing him as a figure of opposition and \"the Other.\" These portrayals persisted from medieval times through the European Renaissance, as seen in works by figures like Dante, Chaucer, and Milton. The research highlights the shift in these perspectives over time. Early Western polemics against Islam and the Prophet influenced Islamic discourse significantly, but by the 18th and 19th centuries, voices like George Sale challenged these entrenched biases. Sale's translation of the Qurʾān marked a significant break from medieval depictions of the Prophet as the \"anti-Christ\". In modern times, many Western academics have adopted more nuanced approaches, critiqued Orientalism and contributed to a better understanding of Islamic culture and history. This article emphasizes the work of contemporary non-Muslim scholars such as Karen Armstrong, John Esposito, and Martin Lings, whose independently researched portrayals aim to present a balanced view of the Prophet Muhammad.",
                    date: "2024-11-15",
                    publishedDate: "November 15, 2024",
                    keywords: ["Western Sīrah", "Classical and modern Sīrah Literature", "Orientalism", "Western Perspectives towards Prophet"],
                    pages: "1-24",
                    htmlFile: "https://dqdhiu.netlify.app/articles.html?id=1",
                    pdfUrl: "https://dqdhiu.netlify.app/file/55-Article%20Text-141-1-10-20250108.pdf",
                    doi: null
                },
                {
                    id: 2,
                    title: "ḤADĪTH OF SELF-KNOWING BETWEEN SUFIS AND ḤADĪTH SCHOLARS",
                    author: "Muhammad Gufran-ul-Haque",
                    authors: [
                        {
                            name: "Muhammad Gufran-ul-Haque",
                            position: "Islamic Studies Scholar",
                            email: "gufran@example.com"
                        }
                    ],
                    abstract: "This paper examines the Ḥadīth of Self-knowing, often quoted as \"Whoever knows himself, knows his Lord,\" investigating its authenticity and interpretation between Sufi mystics and traditional Ḥadīth scholars. The study explores the various chains of transmission, textual variations, and scholarly debates surrounding this influential saying.",
                    date: "2024-11-10",
                    publishedDate: "November 10, 2024",
                    keywords: ["Self-knowing", "Ḥadīth authenticity", "Sufi mysticism", "kashf", "ilhām", "Takhrīj", "form of Ḥadīth"],
                    pages: "25-48",
                    htmlFile: "https://dqdhiu.netlify.app/articles.html?id=2",
                    pdfUrl: "https://dqdhiu.netlify.app/file/56-Article Text-147-1-10-20250108.pdf",
                    doi: null
                },
                {
                    id: 3,
                    title: "FACTORS OF CIVILISATIONAL ADVANCEMENT IN THE QURʾĀN: INSIGHTS FROM AL-BŪṬĪ",
                    author: "Muhammed Rashid AT",
                    authors: [
                        {
                            name: "Muhammed Rashid AT",
                            position: "Islamic Studies Researcher",
                            email: "rashid@example.com"
                        }
                    ],
                    abstract: "This study investigates the factors underlying civilizational advancement as outlined in the Qurʾān, focusing on the interpretations and insights provided by the renowned scholar Saʿīd Ramaḍān al-Būṭī. The research examines how Qurʾānic principles can guide sustainable societal development.",
                    date: "2024-11-05",
                    publishedDate: "November 5, 2024",
                    keywords: ["Civilizational advancement", "Qurʾān and Civilisation", "Saʿīd Ramaḍān al-Būṭī", "Ethical Conduct", "Spiritual Awareness", "Sustainable Growth"],
                    pages: "49-68",
                    htmlFile: "https://dqdhiu.netlify.app/articles.html?id=3",
                    pdfUrl: "https://dqdhiu.netlify.app/file/57-Article Text-152-1-10-20250108.pdf",
                    doi: null
                },
                {
                    id: 4,
                    title: "PRICE ANALYSIS OF ḤAJJ: COSTS, SUBSIDIES, INFLATION, AND SOCIAL INFLUENCES IN INDIA",
                    author: "Dr. Shujaat Ahmad Qureshi",
                    authors: [
                        {
                            name: "Dr. Shujaat Ahmad Qureshi",
                            position: "Professor of Economics and Islamic Studies",
                            email: "qureshi@example.com"
                        }
                    ],
                    abstract: "The cost of the Ḥajj pilgrimage from India has seen a substantial rise from 2002 to 2024, primarily driven by economic factors including inflation, exchange rate fluctuations, and policy changes. This study analyzes the various components affecting Ḥajj pricing and their social implications.",
                    date: "2024-10-28",
                    publishedDate: "October 28, 2024",
                    keywords: ["Ḥajj Price", "Inflation in India", "Exchange Rate", "Gold Rate and Ḥajj Subsidy"],
                    pages: "69-92",
                    htmlFile: "https://dqdhiu.netlify.app/articles.html?id=4",
                    pdfUrl: "https://dqdhiu.netlify.app/file/58-Article Text-157-1-10-20250108.pdf",
                    doi: null
                },
                {
                    id: 5,
                    title: "Behind The Story: Ethical Readings of Qur'ānic Narratives",
                    author: "Mohammed Niyas P",
                    authors: [
                        {
                            name: "Mohammed Niyas P",
                            position: "Book Reviewer and Islamic Studies Scholar",
                            email: "niyas@example.com"
                        }
                    ],
                    abstract: "Book Review: This comprehensive review examines the scholarly work 'Behind The Story: Ethical Readings of Qur'ānic Narratives', analyzing its contribution to contemporary Islamic hermeneutics and moral philosophy. The review discusses the author's methodology in extracting ethical principles from Qurʾānic stories.",
                    date: "2024-10-20",
                    publishedDate: "October 20, 2024",
                    keywords: ["Book Review", "Qurʾānic Narratives", "Islamic Ethics", "Moral Philosophy", "Exegesis"],
                    pages: "93-116",
                    htmlFile: "https://dqdhiu.netlify.app/articles.html?id=5",
                    pdfUrl: "https://dqdhiu.netlify.app/file/61-Other-170-2-10-20250108.pdf",
                    doi: null
                }
            ]
        },

        "issue4": {
            volume: 7,
            number: 1,
            year: 2024,
            title: "Vol. 7 No. 1 (2024)",
            publishedDate: "2024-06-01",
            coverImage: "https://dqdhiu.netlify.app/vol7no1.jpg",
            articles: [
                {
                    id: 6,
                    title: "THE KHUFF IN MUSLIM RITUAL THOUGHT: THE CURIOUS CASE OF A BOOT'S RELIGIOUS IDENTITY",
                    author: "Doctoral student at Emory University's Islamic Civilizations Studies (ICIVS) program, Georgia, United States",
                    authors: [
                        {
                            name: "Anonymous Doctoral Student",
                            position: "Doctoral student at Emory University's Islamic Civilizations Studies (ICIVS) program, Georgia, United States",
                            email: "student@emory.edu"
                        }
                    ],
                    abstract: "Typically, Islamic footwear is not casual conversation that one might have in the elevator, even amongst Islamic Studies academics. This study explores the religious and ritual significance of the khuff (leather socks/boots) in Islamic jurisprudence and practice.",
                    date: "2024-05-15",
                    publishedDate: "May 15, 2024",
                    keywords: ["Khuffayn", "Ritual Studies", "Islamic Law", "Fiqh", "Shia Studies", "Ibadi Studies", "Islamic Theology", "Islamic Footwear"],
                    pages: "1-22",
                    htmlFile: "https://dqdhiu.netlify.app/articles.html?id=6",
                    pdfUrl: "https://example.com/pdf/article6.pdf",
                    doi: null
                },
                {
                    id: 7,
                    title: "WOMEN'S EDUCATION IN EARLY ISLAMIC HISTORY",
                    author: "Dr. Fatima Al-Zahra",
                    authors: [
                        {
                            name: "Dr. Fatima Al-Zahra",
                            position: "Professor of Islamic History and Gender Studies",
                            email: "alzahra@example.com"
                        }
                    ],
                    abstract: "An exploration of women's educational roles and contributions in the early Islamic period, this study challenges conventional narratives about gender and education in Islamic history. Through examination of historical sources, biographical literature, and educational treatises from the first three centuries of Islam, the research demonstrates the active participation of women in various fields of knowledge including theology, law, medicine, and literature.",
                    date: "2024-05-10",
                    publishedDate: "May 10, 2024",
                    keywords: ["Women's Education", "Islamic History", "Gender Studies", "Early Islam", "Female Scholars"],
                    pages: "23-45",
                    htmlFile: "https://dqdhiu.netlify.app/articles.html?id=7",
                    pdfUrl: "https://example.com/pdf/article7.pdf",
                    doi: null
                }
            ]
        },

        "issue3": {
            volume: 6,
            number: 4,
            year: 2023,
            title: "Vol. 6 No. 4 (2023)",
            publishedDate: "2023-12-01",
            coverImage: "https://dqdhiu.netlify.app/vol6no4.jpg",
            articles: [
                {
                    id: 8,
                    title: "SUFISM AND CONTEMPORARY SPIRITUALITY",
                    author: "Prof. Muhammad Ali",
                    authors: [
                        {
                            name: "Prof. Muhammad Ali",
                            position: "Professor of Islamic Mysticism and Spirituality",
                            email: "mali@example.com"
                        }
                    ],
                    abstract: "This study analyzes the relevance of Sufi teachings in contemporary spiritual practices, examining how traditional Islamic mysticism addresses modern spiritual needs and psychological well-being. The research investigates the adaptation of Sufi practices in contemporary contexts, including meditation techniques, spiritual counseling, and community building.",
                    date: "2023-11-15",
                    publishedDate: "November 15, 2023",
                    keywords: ["Sufism", "Spirituality", "Contemporary Islam", "Mysticism", "Modern Spirituality"],
                    pages: "1-28",
                    htmlFile: "https://dqdhiu.netlify.app/articles.html?id=8",
                    pdfUrl: "https://example.com/pdf/article8.pdf",
                    doi: null
                }
            ]
        }
    }
};

// Helper Functions and Utilities
const JournalDataManager = {
    
    // Get all issues sorted by date (newest first)
    getAllIssues: () => {
        return Object.entries(journalData.issues).map(([key, issue]) => ({
            id: key,
            ...issue
        })).sort((a, b) => {
            if (b.year !== a.year) return b.year - a.year;
            if (b.volume !== a.volume) return b.volume - a.volume;
            return b.number - a.number;
        });
    },

    // Get specific issue by ID
    getIssue: (issueId) => {
        return journalData.issues[issueId] || null;
    },

    // Get all articles across all issues
    getAllArticles: () => {
        const articles = [];
        Object.entries(journalData.issues).forEach(([issueId, issue]) => {
            issue.articles.forEach(article => {
                articles.push({
                    ...article,
                    issueId: issueId,
                    issueTitle: issue.title,
                    issueYear: issue.year,
                    issueVolume: issue.volume,
                    issueNumber: issue.number,
                    volume: issue.title,
                    issn: journalData.config.issn
                });
            });
        });
        return articles;
    },

    // Get specific article by ID
    getArticle: (articleId) => {
        const allArticles = JournalDataManager.getAllArticles();
        return allArticles.find(article => article.id === parseInt(articleId)) || null;
    },

    // Get articles from specific issue
    getArticlesByIssue: (issueId) => {
        const issue = journalData.issues[issueId];
        if (!issue) return [];
        
        return issue.articles.map(article => ({
            ...article,
            issueId: issueId,
            issueTitle: issue.title,
            volume: issue.title,
            issn: journalData.config.issn
        }));
    },

    // Search articles across all issues
    searchArticles: (query) => {
        if (!query) return [];
        
        const allArticles = JournalDataManager.getAllArticles();
        const searchTerm = query.toLowerCase().trim();
        
        return allArticles.filter(article => {
            return article.title.toLowerCase().includes(searchTerm) ||
                   article.author.toLowerCase().includes(searchTerm) ||
                   article.abstract.toLowerCase().includes(searchTerm) ||
                   article.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm)) ||
                   article.issueTitle.toLowerCase().includes(searchTerm);
        });
    },

    // Get issue navigation (previous/next)
    getIssueNavigation: (currentIssueId) => {
        const issues = JournalDataManager.getAllIssues();
        const currentIndex = issues.findIndex(issue => issue.id === currentIssueId);
        
        return {
            previous: currentIndex < issues.length - 1 ? issues[currentIndex + 1] : null,
            next: currentIndex > 0 ? issues[currentIndex - 1] : null,
            current: issues[currentIndex] || null
        };
    },

    // Generate issue selector options
    generateIssueSelector: () => {
        return JournalDataManager.getAllIssues().map(issue => ({
            id: issue.id,
            title: issue.title,
            url: `?issue=${issue.id}`,
            year: issue.year,
            volume: issue.volume,
            number: issue.number
        }));
    },

    // Validate article data structure
    validateArticle: (article) => {
        const required = ['id', 'title', 'author', 'abstract', 'date', 'keywords', 'pages'];
        const missing = required.filter(field => !article[field]);
        return {
            isValid: missing.length === 0,
            missingFields: missing
        };
    },

    // Add new article to issue
    addArticleToIssue: (issueId, articleData) => {
        const issue = journalData.issues[issueId];
        if (!issue) {
            throw new Error(`Issue ${issueId} not found`);
        }

        const validation = JournalDataManager.validateArticle(articleData);
        if (!validation.isValid) {
            throw new Error(`Invalid article data. Missing fields: ${validation.missingFields.join(', ')}`);
        }

        // Auto-generate ID if not provided
        if (!articleData.id) {
            const maxId = Math.max(...Object.values(journalData.issues)
                .flatMap(issue => issue.articles)
                .map(article => article.id));
            articleData.id = maxId + 1;
        }

        // Set default values
        articleData.htmlFile = articleData.htmlFile || `${journalData.config.baseUrl}articles.html?id=${articleData.id}`;
        articleData.publishedDate = articleData.publishedDate || articleData.date;
        
        // Ensure authors array exists
        if (!articleData.authors && articleData.author) {
            articleData.authors = [{
                name: articleData.author,
                position: "Author",
                email: "author@example.com"
            }];
        }

        issue.articles.push(articleData);
        return articleData;
    },

    // Add new issue
    addIssue: (issueId, issueData) => {
        if (journalData.issues[issueId]) {
            throw new Error(`Issue ${issueId} already exists`);
        }

        const defaultIssue = {
            volume: 1,
            number: 1,
            year: new Date().getFullYear(),
            title: `Vol. ${issueData.volume} No. ${issueData.number} (${issueData.year})`,
            publishedDate: new Date().toISOString().split('T')[0],
            coverImage: journalData.config.defaultCoverImage,
            articles: []
        };

        journalData.issues[issueId] = { ...defaultIssue, ...issueData };
        return journalData.issues[issueId];
    },

    // Export data for backup
    exportData: () => {
        return JSON.stringify(journalData, null, 2);
    },

    // Import data from backup
    importData: (jsonData) => {
        try {
            const importedData = JSON.parse(jsonData);
            Object.assign(journalData, importedData);
            return true;
        } catch (error) {
            console.error('Import failed:', error);
            return false;
        }
    }
};

// Backward compatibility - Legacy variable names
const journalIssues = journalData.issues;
const articlesData = {};

// Populate legacy articlesData structure
JournalDataManager.getAllArticles().forEach(article => {
    articlesData[article.id] = article;
});

// Legacy navigation helper (backward compatibility)
const IssueNavigation = {
    getAllIssues: () => Object.keys(journalIssues),
    getIssueUrl: (issueId) => `?issue=${issueId}`,
    generateIssueSelector: () => JournalDataManager.generateIssueSelector(),
    getPreviousIssue: (currentIssueId) => {
        const nav = JournalDataManager.getIssueNavigation(currentIssueId);
        return nav.previous ? {
            id: nav.previous.id,
            title: nav.previous.title,
            url: `?issue=${nav.previous.id}`,
            year: nav.previous.year,
            volume: nav.previous.volume,
            number: nav.previous.number
        } : null;
    },
    getNextIssue: (currentIssueId) => {
        const nav = JournalDataManager.getIssueNavigation(currentIssueId);
        return nav.next ? {
            id: nav.next.id,
            title: nav.next.title,
            url: `?issue=${nav.next.id}`,
            year: nav.next.year,
            volume: nav.next.volume,
            number: nav.next.number
        } : null;
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        journalData, 
        JournalDataManager, 
        journalIssues, 
        articlesData, 
        IssueNavigation 
    };
}

// Global access for browser
if (typeof window !== 'undefined') {
    window.journalData = journalData;
    window.JournalDataManager = JournalDataManager;
    window.journalIssues = journalIssues;
    window.articlesData = articlesData;
    window.IssueNavigation = IssueNavigation;
}
