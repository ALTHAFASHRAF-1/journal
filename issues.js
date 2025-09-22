// issues-config.js - Fetch data from Google Sheet instead of hardcoding
const sheetURL = "https://opensheet.elk.sh/1qitaJRc0Wo-AKvHcwTq58h8DHTuOshbYUIpJi9YIQFk/Issues";

let journalIssues = {};

async function loadIssues() {
  const response = await fetch(sheetURL);
  const rows = await response.json();

  // Group rows by issueId
  rows.forEach(row => {
    const issueId = row.issueId;
    if (!journalIssues[issueId]) {
      journalIssues[issueId] = {
        volume: parseInt(row.volume),
        number: parseInt(row.number),
        year: parseInt(row.year),
        title: row.title,
        publishedDate: row.publishedDate,
        coverImage: row.coverImage,
        articles: []
      };
    }

    // Add article
    journalIssues[issueId].articles.push({
      id: parseInt(row.articleId),
      title: row.articleTitle,
      author: row.author,
      abstract: row.abstract,
      date: row.date,
      keywords: row.keywords ? row.keywords.split(",").map(k => k.trim()) : [],
      pages: row.pages,
      htmlFile: row.htmlFile,
      doi: row.doi
    });
  });

  console.log("Loaded Issues:", journalIssues);
  return journalIssues;
}

// Navigation helpers
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

// Example usage
loadIssues().then(() => {
  console.log(IssueNavigation.generateIssueSelector());
});
