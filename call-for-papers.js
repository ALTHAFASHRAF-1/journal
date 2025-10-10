// Configuration - Replace this URL with your actual Google Sheets CSV export URL
const GOOGLE_SHEETS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQyS3WXfgCUn_awTHYX9SgCC_QG2d3n49i_mMFMrHdPKgUbD4IQrBaLyS9mi8W4gwel9AnArlljcyX6/pub?gid=0&single=true&output=csv';

// Alternative configuration for different CSV sources
// const GOOGLE_SHEETS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-YOUR_PUBLISHED_SHEET_ID/pub?output=csv';

// Configuration for Google Doc template
const TEMPLATE_DOC_ID = '1Cu_j4CcNIhh5qez3Xoqf0xCGn7QzaHLrX7rfTozw8Po';

// Global variables to store the data
let pageData = {};

// DOM elements
const loadingState = document.getElementById('loading-state');
const errorState = document.getElementById('error-state');
const mainContent = document.getElementById('main-content');
const errorMessage = document.getElementById('error-message');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    loadDataFromGoogleSheets();
});

/**
 * Load data from Google Sheets CSV
 */
async function loadDataFromGoogleSheets() {
    try {
        showLoading();
        
        // Fetch CSV data
        const response = await fetch(GOOGLE_SHEETS_CSV_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const csvText = await response.text();
        
        // Parse CSV data
        const parsedData = parseCSV(csvText);
        
        // Process the parsed data
        pageData = processData(parsedData);
        
        // Update the page content
        updatePageContent();
        
        // Show the main content
        showMainContent();
        
    } catch (error) {
        console.error('Error loading data:', error);
        showError('Failed to load content from Google Sheets. Please check your internet connection and try again.');
    }
}

/**
 * Parse CSV text into an array of objects
 */
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(header => header.trim().replace(/"/g, ''));
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        const row = {};
        
        headers.forEach((header, index) => {
            row[header] = values[index] || '';
        });
        
        data.push(row);
    }
    
    return data;
}

/**
 * Parse a single CSV line, handling quoted values
 */
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    
    result.push(current.trim());
    return result;
}

/**
 * Process the parsed CSV data into our page structure
 */
function processData(data) {
    const processedData = {};
    
    // Assuming the first row contains our data
    if (data.length > 0) {
        const row = data[0];
        
        // Basic fields
        processedData.heading = row.heading || 'Call for Papers';
        processedData.subHeading = row['sub-heading'] || 'Islamic Insight Journal of Islamic Studies';
        processedData.edition = row.edition || 'Vol. 8, No. 1 (2025)';
        processedData.p1 = row.p1 || '';
        processedData.p2 = row.p2 || '';
        processedData.p3 = row.p3 || '';
        processedData.date = row.date || 'mid-June 2025';
        
        // Submission Guidelines (SG1, SG2, etc.)
        processedData.submissionGuidelines = [];
        for (let i = 1; i <= 20; i++) { // Check up to SG20
            const sgKey = `SG${i}`;
            if (row[sgKey] && row[sgKey].trim()) {
                processedData.submissionGuidelines.push(row[sgKey].trim());
            }
        }
        
        // Research Areas (RA1, RA2, etc.)
        processedData.researchAreas = [];
        for (let i = 1; i <= 20; i++) { // Check up to RA20
            const raKey = `RA${i}`;
            if (row[raKey] && row[raKey].trim()) {
                processedData.researchAreas.push(row[raKey].trim());
            }
        }
    }
    
    return processedData;
}

/**
 * Update the page content with loaded data
 */
function updatePageContent() {
    // Update basic fields
    updateElementText('main-heading', pageData.heading);
    updateElementText('sub-heading', pageData.subHeading);
    updateElementText('edition', pageData.edition);
    updateElementText('paragraph-1', pageData.p1);
    updateElementText('paragraph-2', pageData.p2);
    
    // Update paragraph 3 with proper date formatting
    updateParagraph3();
    
    // Update submission guidelines
    updateSubmissionGuidelines();
    
    // Update research areas
    updateResearchAreas();
    
    // Update edition reference in paragraph 3
    updateElementText('edition-ref', pageData.edition);
}

/**
 * Update paragraph 3 with formatted date
 */
function updateParagraph3() {
    const paragraph3Element = document.getElementById('paragraph-3');
    const submissionDateElement = document.getElementById('submission-date');
    
    if (paragraph3Element && pageData.p3) {
        paragraph3Element.innerHTML = pageData.p3;
    }
    
    if (submissionDateElement && pageData.date) {
        submissionDateElement.innerHTML = `<strong>${pageData.date}</strong>`;
    }
}

/**
 * Update submission guidelines list
 */
function updateSubmissionGuidelines() {
    const container = document.getElementById('submission-guidelines');
    if (!container) return;
    
    container.innerHTML = '';
    
    pageData.submissionGuidelines.forEach(guideline => {
        const li = document.createElement('li');
        li.className = 'text-justify';
        li.innerHTML = `• ${guideline}`;
        container.appendChild(li);
    });
}

/**
 * Update research areas list
 */
function updateResearchAreas() {
    const container = document.getElementById('research-areas');
    if (!container) return;
    
    container.innerHTML = '';
    
    pageData.researchAreas.forEach(area => {
        const li = document.createElement('li');
        li.innerHTML = `• ${area}`;
        container.appendChild(li);
    });
}

/**
 * Update text content of an element
 */
function updateElementText(elementId, text) {
    const element = document.getElementById(elementId);
    if (element && text) {
        element.textContent = text;
    }
}

/**
 * Show loading state
 */
function showLoading() {
    loadingState.style.display = 'block';
    errorState.style.display = 'none';
    mainContent.style.display = 'none';
}

/**
 * Show error state
 */
function showError(message) {
    loadingState.style.display = 'none';
    errorState.style.display = 'block';
    mainContent.style.display = 'none';
    errorMessage.textContent = message;
}

/**
 * Show main content
 */
function showMainContent() {
    loadingState.style.display = 'none';
    errorState.style.display = 'none';
    mainContent.style.display = 'block';
}

/**
 * Create a copy of the Google Doc template
 */
function createGoogleDocCopy() {
    try {
        // Generate a unique name for the copy
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        const copyName = `Islamic Insight Article Template - ${timestamp}`;
        
        // Create the copy URL that will prompt user to sign in and create a copy
        const copyUrl = `https://docs.google.com/document/d/${TEMPLATE_DOC_ID}/copy?title=${encodeURIComponent(copyName)}`;
        
        // Open in new tab
        window.open(copyUrl, '_blank');
        
        return true;
    } catch (error) {
        console.error('Error creating Google Doc copy:', error);
        return false;
    }
}

/**
 * Handle the create paper button click
 */
function handleCreatePaper() {
    const btn = document.getElementById('create-paper-btn');
    const btnText = document.getElementById('btn-text');
    const originalText = btnText.textContent;
    
    // Disable button and show loading state
    btn.disabled = true;
    btnText.innerHTML = '<span class="button-loading"></span> Creating copy...';
    
    try {
        // Create the copy
        const success = createGoogleDocCopy();
        
        if (success) {
            // Show success message
            showNotification('Your copy is being created! A new tab will open with your personal copy of the article template.', 'success');
        } else {
            throw new Error('Failed to create copy');
        }
        
    } catch (error) {
        console.error('Error:', error);
        showNotification('Unable to create copy automatically. Please try again or contact support.', 'error');
    } finally {
        // Reset button after a short delay
        setTimeout(() => {
            btn.disabled = false;
            btnText.textContent = originalText;
        }, 2000);
    }
}

/**
 * Show notification message
 */
function showNotification(message, type) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification-popup');
    existingNotifications.forEach(notification => notification.remove());
    
    const notificationDiv = document.createElement('div');
    notificationDiv.className = `notification-popup ${type === 'success' ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700'} border px-4 py-3 rounded fixed top-4 right-4 z-50 max-w-md shadow-lg`;
    notificationDiv.innerHTML = `
        <div class="flex">
            <div class="flex-1">
                <p class="text-sm">${message}</p>
            </div>
            <div class="ml-4">
                <button onclick="this.parentElement.parentElement.parentElement.remove()" class="text-lg font-bold leading-none hover:text-gray-600">&times;</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(notificationDiv);
    
    // Auto remove after 8 seconds
    setTimeout(() => {
        if (notificationDiv.parentElement) {
            notificationDiv.remove();
        }
    }, 8000);
}

/**
 * Refresh data (can be called manually)
 */
function refreshData() {
    loadDataFromGoogleSheets();
}

// Export functions for potential external use
window.CallForPapersLoader = {
    refresh: refreshData,
    getData: () => pageData,
    createPaper: handleCreatePaper
};

// Global function for the onclick handler
window.createPaperCopy = handleCreatePaper;
