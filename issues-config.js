// issues-config.js - Configuration for all journal issues
const journalIssues = {
    "issue1": {
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
                abstract: "This study investigates the varied approaches of Western scholars and writers toward the life and character of Prophet Muhammad (PBUH)...",
                date: "2024-11-15",
                keywords: ["Western Sīrah", "Classical and modern Sīrah Literature", "Orientalism", "Western Perspectives towards Prophet"],
                pages: "1-24",
                htmlFile: "article1.html"
            },
            {
                id: 2,
                title: "ḤADĪTH OF SELF-KNOWING BETWEEN SUFIS AND ḤADĪTH SCHOLARS",
                author: "Muhammad Gufran-ul-Haque",
                abstract: "This paper examines the Ḥadīth of Self-knowing, often quoted as \"Whoever knows himself, knows his Lord,...\"",
                date: "2024-11-10",
                keywords: ["Self-knowing", "Ḥadīth authenticity", "Sufi mysticism", "kashf", "ilhām", "Takhrīj", "form of Ḥadīth"],
                pages: "25-48",
                htmlFile: "article2.html"
            },
            {
                id: 3,
                title: "FACTORS OF CIVILISATIONAL ADVANCEMENT IN THE QURʾĀN: INSIGHTS FROM AL-BŪṬĪ",
                author: "Muhammed Rashid AT",
                abstract: "This study investigates the factors underlying civilizational advancement as outlined in the Qurʾān, focusing on the interpretations...",
                date: "2024-11-05",
                keywords: ["Civilizational advancement", "Qurʾān and Civilisation", "Saʿīd Ramaḍān al-Būṭī", "Ethical Conduct", "Spiritual Awareness", "Sustainable Growth"],
                pages: "49-68",
                htmlFile: "article3.html"
            },
            {
                id: 4,
                title: "PRICE ANALYSIS OF ḤAJJ: COSTS, SUBSIDIES, INFLATION, AND SOCIAL INFLUENCES IN INDIA",
                author: "Dr. Shujaat Ahmad Qureshi",
                abstract: "The cost of the Ḥajj pilgrimage from India has seen a substantial rise from 2002 to 2024, primarily driven by economic factors like...",
                date: "2024-10-28",
                keywords: ["Ḥajj Price", "Inflation in India", "Exchange Rate", "Gold Rate and Ḥajj Subsidy"],
                pages: "69-92",
                htmlFile: "article4.html"
            },
            {
                id: 5,
                title: "Behind The Story: Ethical Readings of Qur'ānic Narratives",
                author: "Mohammed Niyas P",
                abstract: "Book Review",
                date: "2024-10-20",
                keywords: [""],
                pages: "93-116",
                htmlFile: "article5.html"
            }
        ]
    },
    
    "issue2": {
        volume: 7,
        number: 1,
        year: 2024,
        title: "Vol. 7 No. 1 (2024)",
        publishedDate: "2024-06-01",
        coverImage: "https://dqdhiu.netlify.app/vol7no1.jpg",
        articles: [
            {
                id: 1,
                title: "ISLAMIC BANKING AND MODERN ECONOMICS: A COMPARATIVE STUDY",
                author: "Dr. Ahmed Hassan",
                abstract: "This research examines the principles of Islamic banking and its integration with modern economic systems...",
                date: "2024-05-15",
                keywords: ["Islamic Banking", "Economics", "Sharia Compliance", "Modern Finance"],
                pages: "1-22",
                htmlFile: "vol7no1-article1.html"
            },
            {
                id: 2,
                title: "WOMEN'S EDUCATION IN EARLY ISLAMIC HISTORY",
                author: "Dr. Fatima Al-Zahra",
                abstract: "An exploration of women's educational roles and contributions in the early Islamic period...",
                date: "2024-05-10",
                keywords: ["Women's Education", "Islamic History", "Gender Studies", "Early Islam"],
                pages: "23-45",
                htmlFile: "vol7no1-article2.html"
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
                id: 1,
                title: "SUFISM AND CONTEMPORARY SPIRITUALITY",
                author: "Prof. Muhammad Ali",
                abstract: "This study analyzes the relevance of Sufi teachings in contemporary spiritual practices...",
                date: "2023-11-15",
                keywords: ["Sufism", "Spirituality", "Contemporary Islam", "Mysticism"],
                pages: "1-28",
                htmlFile: "vol6no4-article1.html"
            }
        ]
    }
    
    // Add more issues here following the same pattern...
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = journalIssues;
}
