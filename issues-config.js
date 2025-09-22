// issues-config.js - Configuration for all journal issues
const journalIssues = {
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
abstract: "This study investigates the varied approaches of Western scholars and writers toward the life and character of Prophet Muhammad (PBUH).",
date: "2024-11-15",
keywords: ["Western Sīrah", "Classical and modern Sīrah Literature", "Orientalism", "Western Perspectives towards Prophet"],
pages: "1-24",
htmlFile: "https://dqdhiu.netlify.app/articles.html?id=1"
               
},
{
id: 2,
title: "ḤADĪTH OF SELF-KNOWING BETWEEN SUFIS AND ḤADĪTH SCHOLARS",
author: "Muhammad Gufran-ul-Haque",
abstract: "This paper examines the Ḥadīth of Self-knowing, often quoted as \"Whoever knows himself, knows his Lord,\" investigating its authenticity... ",
date: "2024-11-10",
keywords: ["Self-knowing", "Ḥadīth authenticity", "Sufi mysticism", "kashf", "ilhām", "Takhrīj", "form of Ḥadīth"],
pages: "25-48",
htmlFile: "https://dqdhiu.netlify.app/articles.html?id=2"
},
{
id: 3,
title: "FACTORS OF CIVILISATIONAL ADVANCEMENT IN THE QURʾĀN: INSIGHTS FROM AL-BŪṬĪ",
author: "Muhammed Rashid AT",
abstract: "This study investigates the factors underlying civilizational advancement as outlined in the Qurʾān, focusing on the interpretations and...",
date: "2024-11-05",
keywords: ["Civilizational advancement", "Qurʾān and Civilisation", "Saʿīd Ramaḍān al-Būṭī", "Ethical Conduct", "Spiritual Awareness", "Sustainable Growth"],
pages: "49-68",
htmlFile: "https://dqdhiu.netlify.app/articles.html?id=3"
},
{
id: 4,
title: "PRICE ANALYSIS OF ḤAJJ: COSTS, SUBSIDIES, INFLATION, AND SOCIAL INFLUENCES IN INDIA",
author: "Dr. Shujaat Ahmad Qureshi",
abstract: "The cost of the Ḥajj pilgrimage from India has seen a substantial rise from 2002 to 2024, primarily driven by economic factors...",
date: "2024-10-28",
keywords: ["Ḥajj Price", "Inflation in India", "Exchange Rate", "Gold Rate and Ḥajj Subsidy"],
pages: "69-92",
htmlFile: "https://dqdhiu.netlify.app/articles.html?id=4"
},
{
id: 5,
title: "Behind The Story: Ethical Readings of Qur'ānic Narratives",
author: "Mohammed Niyas P",
abstract: "Book Review: This comprehensive review examines the scholarly work 'Behind The Story: Ethical Readings of Qur'ānic Narratives...",
date: "2024-10-20",
keywords: ["Book Review", "Qurʾānic Narratives", "Islamic Ethics", "Moral Philosophy", "Exegesis"],
pages: "93-116",
htmlFile: "https://dqdhiu.netlify.app/articles.html?id=5"
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
id: 1,
title: "THE KHUFF IN MUSLIM RITUAL THOUGHT: THE CURIOUS CASE OF A BOOT’S RELIGIOUS IDENTITY",
author: "Doctoral student at Emory University's Islamic Civilizations Studies (ICIVS) program, Georgia, United States",
abstract: "Typically, Islamic footwear is not casual conversation that one might have in the elevator, even amongst Islamic Studies academics...",
date: "2024-05-15",
keywords: ["Khuffayn", "Ritual Studies", "Islamic Law", "Fiqh", "Shia Studies", "Ibadi Studies", "Islamic Theology", "Islamic Footwear"],
pages: "1-22",
htmlFile: "https://dqdhiu.netlify.app/articles.html?id=6"
},
{
id: 2,
title: "WOMEN'S EDUCATION IN EARLY ISLAMIC HISTORY",
author: "Dr. Fatima Al-Zahra",
abstract: "An exploration of women's educational roles and contributions in the early Islamic period, this study challenges conventional narratives about gender and education in Islamic history. Through examination of historical sources, biographical literature, and educational treatises from the first three centuries of Islam, the research demonstrates the active participation of women in various fields of knowledge including theology, law, medicine, and literature. The paper analyzes the institutional frameworks that supported women's education, the notable female scholars and their contributions, and the social factors that influenced educational opportunities for women. This comprehensive study provides insights into the rich tradition of female scholarship in early Islamic civilization and its implications for contemporary discussions on women's education in Muslim societies.",
date: "2024-05-10",
keywords: ["Women's Education", "Islamic History", "Gender Studies", "Early Islam", "Female Scholars"],
pages: "23-45",
htmlFile: "https://dqdhiu.netlify.app/articles.html?id=1"
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
abstract: "This study analyzes the relevance of Sufi teachings in contemporary spiritual practices, examining how traditional Islamic mysticism addresses modern spiritual needs and psychological well-being. The research investigates the adaptation of Sufi practices in contemporary contexts, including meditation techniques, spiritual counseling, and community building. Through interviews with contemporary Sufi practitioners and analysis of modern Sufi literature, the paper explores how ancient wisdom traditions continue to provide meaningful spiritual guidance in the modern world. The study also examines the challenges facing contemporary Sufism, including authenticity concerns, commercialization, and cultural adaptation, while highlighting its potential contributions to interfaith dialogue and global spiritual discourse.",
date: "2023-11-15",
keywords: ["Sufism", "Spirituality", "Contemporary Islam", "Mysticism", "Modern Spirituality"],
pages: "1-28",
htmlFile: "https://dqdhiu.netlify.app/articles.html?id=1"
}
]
}
};

// Helper functions for navigation
const IssueNavigation = {
getAllIssues: () => Object.keys(journalIssues),

getIssueUrl: (issueId) => `?issue=${issueId}`,

generateIssueSelector: () => {
return Object.entries(journalIssues).map(([key, issue]) => ({
id: key,
title: issue.title,
url: IssueNavigation.getIssueUrl(key),
year: issue.year,
volume: issue.volume,
number: issue.number
})).sort((a, b) => {
if (b.year !== a.year) return b.year - a.year;
if (b.volume !== a.volume) return b.volume - a.volume;
return b.number - a.number;
});
},

getPreviousIssue: (currentIssueId) => {
const issues = IssueNavigation.generateIssueSelector();
const currentIndex = issues.findIndex(issue => issue.id === currentIssueId);
return currentIndex < issues.length - 1 ? issues[currentIndex + 1] : null;
},

getNextIssue: (currentIssueId) => {
const issues = IssueNavigation.generateIssueSelector();
const currentIndex = issues.findIndex(issue => issue.id === currentIssueId);
return currentIndex > 0 ? issues[currentIndex - 1] : null;
}
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
module.exports = { journalIssues, IssueNavigation };
}
