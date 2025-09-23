// issue-navigation.js - Navigation utilities for journal issues
class IssueNavigation {
    static generateIssueSelector() {
        if (!window.journalIssues || Object.keys(window.journalIssues).length === 0) {
            console.warn('No journal issues found');
            return [];
        }

        return Object.entries(window.journalIssues)
            .map(([id, issue]) => ({
                id: id,
                title: issue.title || `Vol. ${issue.volume} No. ${issue.number} (${issue.year})`,
                volume: issue.volume,
                number: issue.number,
                year: issue.year
            }))
            .sort((a, b) => {
                // Sort by year, volume, number (newest first)
                if (b.year !== a.year) return b.year - a.year;
                if (b.volume !== a.volume) return b.volume - a.volume;
                return b.number - a.number;
            });
    }

    static getPreviousIssue(currentIssueId) {
        const issues = this.generateIssueSelector();
        const currentIndex = issues.findIndex(issue => issue.id === currentIssueId);
        
        if (currentIndex === -1 || currentIndex === issues.length - 1) {
            return null;
        }
        
        const prevIssue = issues[currentIndex + 1];
        return {
            ...prevIssue,
            url: this.getIssueUrl(prevIssue.id)
        };
    }

    static getNextIssue(currentIssueId) {
        const issues = this.generateIssueSelector();
        const currentIndex = issues.findIndex(issue => issue.id === currentIssueId);
        
        if (currentIndex === -1 || currentIndex === 0) {
            return null;
        }
        
        const nextIssue = issues[currentIndex - 1];
        return {
            ...nextIssue,
            url: this.getIssueUrl(nextIssue.id)
        };
    }

    static getIssueUrl(issueId) {
        return `issues.html?issue=${issueId}`;
    }

    static getCurrentIssue() {
        const urlParams = new URLSearchParams(window.location.search);
        const issueParam = urlParams.get('issue');
        
        if (issueParam && window.journalIssues && window.journalIssues[issueParam]) {
            return window.journalIssues[issueParam];
        }
        
        // Return the latest issue as default
        const issues = this.generateIssueSelector();
        if (issues.length > 0) {
            return window.journalIssues[issues[0].id];
        }
        
        return null;
    }
}
