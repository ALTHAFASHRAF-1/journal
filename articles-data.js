// Articles Database
const articlesData = {
    1: {
        title: "WESTERN SĪRAH LITERATURE FROM INCEPTION TO CONTEMPORARY DEVELOPMENTS: A HISTORICAL ANALYSIS",
        authors: [
            {
                name: "Irshad EV",
                position: "Research Scholar, Mohammed VI Institute for the Training of Imams, Morchidines and Morchidates, Rabat, Morocco",
                email: "irshadev@gmail.com"
            }
        ],
        publishedDate: "November 15, 2024",
        pages: "11-33",
        volume: "Vol. 7 No. 2 (2024)",
        issn: "2581-3269",
        pdfUrl: "https://dqdhiu.netlify.app/file/55-Article%20Text-141-1-10-20250108.pdf",
        keywords: [
            "Western Sīrah",
            "Classical and modern Sīrah Literature",
            "Orientalism",
            "Western Perspectives towards Prophet"
        ],
        abstract: "This study investigates the varied approaches of Western scholars and writers toward the life and character of Prophet Muhammad (PBUH) under the title, \" Western Sīrah Literature from its Inception to Contemporary Developments: A Historical Analysis\". It addresses the deep-rooted stereotypes and polemical narratives in Western discourse, which often depicted the Prophet negatively, framing him as a figure of opposition and \"the Other.\" These portrayals persisted from medieval times through the European Renaissance, as seen in works by figures like Dante, Chaucer, and Milton. The research highlights the shift in these perspectives over time. Early Western polemics against Islam and the Prophet influenced Islamic discourse significantly, but by the 18th and 19th centuries, voices like George Sale challenged these entrenched biases. Sale's translation of the Qurʾān marked a significant break from medieval depictions of the Prophet as the \"anti-Christ\". In modern times, many Western academics have adopted more nuanced approaches, critiqued Orientalism and contributed to a better understanding of Islamic culture and history. This article emphasizes the work of contemporary non-Muslim scholars such as Karen Armstrong, John Esposito, and Martin Lings, whose independently researched portrayals aim to present a balanced view of the Prophet Muhammad."
    },
    
    2: {
        title: "ISLAMIC JURISPRUDENCE IN THE MODERN ERA: CHALLENGES AND ADAPTATIONS",
        authors: [
            {
                name: "Dr. Ahmad Hassan",
                position: "Professor of Islamic Law, Al-Azhar University, Cairo, Egypt",
                email: "ahmad.hassan@azhar.edu.eg"
            },
            {
                name: "Fatima Al-Zahra",
                position: "Assistant Professor, Islamic Studies Department, University of Medina, Saudi Arabia",
                email: "f.alzahra@medina.edu.sa"
            }
        ],
        publishedDate: "November 15, 2024",
        pages: "34-58",
        volume: "Vol. 7 No. 2 (2024)",
        issn: "2581-3269",
        pdfUrl: "https://example.com/pdf/article2.pdf",
        keywords: [
            "Islamic Jurisprudence",
            "Modern Era",
            "Fiqh",
            "Contemporary Issues",
            "Legal Adaptations"
        ],
        abstract: "This research examines the evolution of Islamic jurisprudence (Fiqh) in response to contemporary challenges and modernization efforts. The study analyzes how traditional Islamic legal frameworks have adapted to address modern issues such as technology, bioethics, financial systems, and social changes. Through a comprehensive review of scholarly works and legal pronouncements from major Islamic institutions, this paper identifies key trends in contemporary Islamic legal thought and discusses the methodologies employed by modern jurists in deriving legal rulings for unprecedented situations."
    },

    3: {
        title: "THE CONCEPT OF TAWHID IN CONTEMPORARY ISLAMIC THOUGHT",
        authors: [
            {
                name: "Dr. Yusuf Al-Mansouri",
                position: "Dean of Islamic Studies, Qatar University, Doha, Qatar",
                email: "y.mansouri@qu.edu.qa"
            }
        ],
        publishedDate: "November 15, 2024",
        pages: "59-78",
        volume: "Vol. 7 No. 2 (2024)",
        issn: "2581-3269",
        pdfUrl: "https://example.com/pdf/article3.pdf",
        keywords: [
            "Tawhid",
            "Islamic Theology",
            "Contemporary Thought",
            "Monotheism",
            "Divine Unity"
        ],
        abstract: "This study explores the concept of Tawhid (Divine Unity) as understood and interpreted by contemporary Islamic thinkers and scholars. The research traces the development of Tawhid discourse from classical Islamic theology to modern interpretations, examining how this fundamental Islamic concept has been articulated in response to contemporary philosophical, scientific, and social challenges. The paper analyzes various scholarly perspectives on Tawhid and its implications for Muslim identity, spirituality, and practice in the modern world."
    },

    4: {
        title: "WOMEN'S RIGHTS IN ISLAM: A COMPREHENSIVE ANALYSIS OF QURANIC TEACHINGS",
        authors: [
            {
                name: "Dr. Aisha Rahman",
                position: "Professor of Islamic Studies and Gender Studies, International Islamic University, Islamabad, Pakistan",
                email: "aisha.rahman@iiu.edu.pk"
            }
        ],
        publishedDate: "November 15, 2024",
        pages: "79-102",
        volume: "Vol. 7 No. 2 (2024)",
        issn: "2581-3269",
        pdfUrl: "https://example.com/pdf/article4.pdf",
        keywords: [
            "Women's Rights",
            "Islam",
            "Quranic Teachings",
            "Gender Studies",
            "Islamic Feminism"
        ],
        abstract: "This comprehensive analysis examines the rights accorded to women in Islamic scripture, particularly the Quran, and their implementation in various Muslim societies throughout history and in contemporary times. The study addresses common misconceptions about women's status in Islam while providing a detailed examination of Quranic verses related to women's rights, roles, and responsibilities. The research also explores how cultural practices have sometimes diverged from Islamic teachings and discusses ongoing debates about women's rights within Islamic legal and social frameworks."
    },

    5: {
        title: "ECONOMIC PRINCIPLES IN ISLAM: THEORY AND PRACTICE",
        authors: [
            {
                name: "Prof. Muhammad Al-Kindi",
                position: "Director, Islamic Economics Institute, King Abdulaziz University, Jeddah, Saudi Arabia",
                email: "m.alkindi@kau.edu.sa"
            },
            {
                name: "Dr. Nadia Farouk",
                position: "Research Fellow, Islamic Finance Research Center, Dubai, UAE",
                email: "n.farouk@ifrc.ae"
            }
        ],
        publishedDate: "November 15, 2024",
        pages: "103-125",
        volume: "Vol. 7 No. 2 (2024)",
        issn: "2581-3269",
        pdfUrl: "https://example.com/pdf/article5.pdf",
        keywords: [
            "Islamic Economics",
            "Sharia Finance",
            "Economic Justice",
            "Riba",
            "Zakat System"
        ],
        abstract: "This study presents a comprehensive examination of economic principles as outlined in Islamic teachings and their practical applications in contemporary financial systems. The research explores fundamental concepts such as the prohibition of interest (Riba), the obligation of wealth redistribution through Zakat, and the principles of risk-sharing in Islamic finance. The paper analyzes the implementation of these principles in modern Islamic banking and financial institutions, discussing both successes and challenges in creating ethical economic systems based on Islamic values."
    }

    // Add more articles as needed...
    // You can continue adding articles with IDs 6, 7, 8, etc.
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = articlesData;
}
