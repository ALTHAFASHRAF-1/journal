// Article Generator JavaScript
class ArticleGenerator {
    constructor() {
        this.sections = [];
        this.footnotes = [];
        this.currentFootnoteId = 1;
        this.init();
    }

    init() {
        this.bindEvents();
        this.addInitialSection();
    }

    bindEvents() {
        // Section management
        document.getElementById('add-paragraph').addEventListener('click', () => this.addSection('paragraph'));
        document.getElementById('add-heading').addEventListener('click', () => this.addSection('heading'));
        document.getElementById('add-subheading').addEventListener('click', () => this.addSection('subheading'));
        document.getElementById('add-footnote').addEventListener('click', () => this.addFootnote());

        // Form actions
        document.getElementById('preview-btn').addEventListener('click', () => this.previewArticle());
        document.getElementById('generate-btn').addEventListener('click', () => this.generateDocument());
        document.getElementById('reset-btn').addEventListener('click', () => this.resetForm());

        // Preview modal
        document.getElementById('close-preview').addEventListener('click', () => this.closePreview());
        document.getElementById('close-preview-btn').addEventListener('click', () => this.closePreview());
        document.getElementById('download-preview-btn').addEventListener('click', () => this.downloadAsPDF());
    }

    addInitialSection() {
        this.addSection('heading', 'Introduction');
        this.addSection('paragraph', '');
    }

    addSection(type, content = '') {
        const sectionId = `section-${Date.now()}`;
        const section = {
            id: sectionId,
            type: type,
            content: content
        };

        this.sections.push(section);
        this.renderSection(section);
    }

    renderSection(section) {
        const container = document.getElementById('content-sections');
        const sectionElement = document.createElement('div');
        sectionElement.className = 'content-section';
        sectionElement.id = section.id;

        let inputElement;
        switch (section.type) {
            case 'heading':
                inputElement = `<input type="text" class="form-input font-bold" value="${section.content}" placeholder="Enter heading text">`;
                break;
            case 'subheading':
                inputElement = `<input type="text" class="form-input font-semibold" value="${section.content}" placeholder="Enter subheading text">`;
                break;
            case 'paragraph':
                inputElement = `<textarea class="form-textarea" placeholder="Enter paragraph text" rows="4">${section.content}</textarea>`;
                break;
        }

        sectionElement.innerHTML = `
            <div class="flex justify-between items-center mb-2">
                <span class="text-sm font-medium text-gray-600 capitalize">${section.type}</span>
                <div class="flex gap-2">
                    <button type="button" class="text-blue-600 hover:text-blue-800 text-sm" onclick="articleGenerator.moveSectionUp('${section.id}')">
                        <i class="fas fa-arrow-up"></i>
                    </button>
                    <button type="button" class="text-blue-600 hover:text-blue-800 text-sm" onclick="articleGenerator.moveSectionDown('${section.id}')">
                        <i class="fas fa-arrow-down"></i>
                    </button>
                    <button type="button" class="text-red-600 hover:text-red-800 text-sm" onclick="articleGenerator.removeSection('${section.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            ${inputElement}
        `;

        container.appendChild(sectionElement);

        // Add event listener for content changes
        const input = sectionElement.querySelector('input, textarea');
        input.addEventListener('input', (e) => {
            section.content = e.target.value;
        });
    }

    removeSection(sectionId) {
        this.sections = this.sections.filter(section => section.id !== sectionId);
        document.getElementById(sectionId).remove();
    }

    moveSectionUp(sectionId) {
        const index = this.sections.findIndex(section => section.id === sectionId);
        if (index > 0) {
            [this.sections[index], this.sections[index - 1]] = [this.sections[index - 1], this.sections[index]];
            this.reorderSections();
        }
    }

    moveSectionDown(sectionId) {
        const index = this.sections.findIndex(section => section.id === sectionId);
        if (index < this.sections.length - 1) {
            [this.sections[index], this.sections[index + 1]] = [this.sections[index + 1], this.sections[index]];
            this.reorderSections();
        }
    }

    reorderSections() {
        const container = document.getElementById('content-sections');
        container.innerHTML = '';
        this.sections.forEach(section => this.renderSection(section));
    }

    addFootnote() {
        const footnoteId = this.currentFootnoteId++;
        const footnote = {
            id: footnoteId,
            content: ''
        };

        this.footnotes.push(footnote);
        this.renderFootnote(footnote);
    }

    renderFootnote(footnote) {
        const container = document.getElementById('footnotes-container');
        const footnoteElement = document.createElement('div');
        footnoteElement.className = 'footnote-item';
        footnoteElement.innerHTML = `
            <div class="flex justify-between items-center mb-2">
                <span class="text-sm font-medium text-gray-600">Footnote [^${footnote.id}]</span>
                <button type="button" class="text-red-600 hover:text-red-800 text-sm" onclick="articleGenerator.removeFootnote(${footnote.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <textarea class="form-textarea" placeholder="Enter footnote content" rows="2" oninput="articleGenerator.updateFootnote(${footnote.id}, this.value)">${footnote.content}</textarea>
        `;

        container.appendChild(footnoteElement);
    }

    updateFootnote(id, content) {
        const footnote = this.footnotes.find(fn => fn.id === id);
        if (footnote) {
            footnote.content = content;
        }
    }

    removeFootnote(id) {
        this.footnotes = this.footnotes.filter(fn => fn.id !== id);
        this.renderFootnotes();
    }

    renderFootnotes() {
        const container = document.getElementById('footnotes-container');
        container.innerHTML = '';
        this.footnotes.forEach(footnote => this.renderFootnote(footnote));
    }

    previewArticle() {
        this.updateSectionContents();
        this.generatePreview();
        document.getElementById('preview-modal').classList.remove('hidden');
    }

    closePreview() {
        document.getElementById('preview-modal').classList.add('hidden');
    }

    updateSectionContents() {
        this.sections.forEach(section => {
            const element = document.getElementById(section.id);
            if (element) {
                const input = element.querySelector('input, textarea');
                if (input) {
                    section.content = input.value;
                }
            }
        });
    }

    generatePreview() {
        const preview = document.getElementById('article-preview');
        preview.innerHTML = '';

        // Title and Author
        const title = document.getElementById('article-title').value || 'Article Title';
        const author = document.getElementById('author-name').value || 'Author Name';
        const email = document.getElementById('author-email').value;
        const affiliation = document.getElementById('author-affiliation').value;

        preview.innerHTML += `
            <div class="text-center mb-8">
                <h1 class="article-title">${this.escapeHtml(title)}</h1>
                <p class="article-author">${this.escapeHtml(author)}${affiliation ? `<br>${this.escapeHtml(affiliation)}` : ''}${email ? `<br>${this.escapeHtml(email)}` : ''}</p>
            </div>
        `;

        // Abstract
        const abstract = document.getElementById('abstract').value;
        if (abstract) {
            preview.innerHTML += `
                <div class="article-section">
                    <h2 class="article-heading">Abstract</h2>
                    <p class="article-paragraph">${this.escapeHtml(abstract)}</p>
                </div>
            `;
        }

        // Keywords
        const keywords = document.getElementById('keywords').value;
        if (keywords) {
            preview.innerHTML += `
                <div class="article-section">
                    <p class="article-keywords"><strong>Keywords:</strong> ${this.escapeHtml(keywords)}</p>
                </div>
            `;
        }

        // Content Sections
        this.sections.forEach(section => {
            if (section.content.trim()) {
                let html = '';
                switch (section.type) {
                    case 'heading':
                        html = `<h2 class="article-heading">${this.processContent(section.content)}</h2>`;
                        break;
                    case 'subheading':
                        html = `<h3 class="article-subheading">${this.processContent(section.content)}</h3>`;
                        break;
                    case 'paragraph':
                        html = `<p class="article-paragraph">${this.processContent(section.content)}</p>`;
                        break;
                }
                preview.innerHTML += html;
            }
        });

        // Footnotes
        if (this.footnotes.some(fn => fn.content.trim())) {
            preview.innerHTML += `<div class="article-footnotes">`;
            this.footnotes.forEach(footnote => {
                if (footnote.content.trim()) {
                    preview.innerHTML += `
                        <p><sup>[^${footnote.id}]</sup> ${this.escapeHtml(footnote.content)}</p>
                    `;
                }
            });
            preview.innerHTML += `</div>`;
        }

        // References
        const references = document.getElementById('references').value;
        if (references) {
            preview.innerHTML += `
                <div class="article-references">
                    <h2 class="article-heading">References</h2>
                    ${references.split('\n').filter(ref => ref.trim()).map(ref => 
                        `<p class="article-paragraph" style="text-indent: -1.5rem; margin-left: 1.5rem;">${this.escapeHtml(ref)}</p>`
                    ).join('')}
                </div>
            `;
        }
    }

    processContent(content) {
        // Process footnotes in content
        let processedContent = this.escapeHtml(content);
        
        // Replace [^n] with superscript footnote references
        processedContent = processedContent.replace(/\[\^(\d+)\]/g, '<sup class="footnote-ref">[$1]</sup>');
        
        return processedContent;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    generateDocument() {
        this.updateSectionContents();
        
        // Create HTML document for printing/download
        const htmlContent = this.generateHTMLDocument();
        
        // Create blob and download
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'islamic-insight-article.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    generateHTMLDocument() {
        const title = document.getElementById('article-title').value || 'Article Title';
        const author = document.getElementById('author-name').value || 'Author Name';
        
        return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${title} - Islamic Insight</title>
    <style>
        body {
            font-family: 'Times New Roman', serif;
            line-height: 1.6;
            margin: 0;
            padding: 20mm;
            font-size: 12pt;
            max-width: 210mm;
            margin: 0 auto;
        }
        .article-title {
            font-size: 16pt;
            font-weight: bold;
            text-align: center;
            margin-bottom: 1rem;
        }
        .article-author {
            font-size: 12pt;
            text-align: center;
            font-weight: bold;
            margin-bottom: 2rem;
        }
        .article-heading {
            font-size: 14pt;
            font-weight: bold;
            margin: 1.5rem 0 0.5rem 0;
        }
        .article-subheading {
            font-size: 12pt;
            font-weight: bold;
            margin: 1rem 0 0.5rem 0;
        }
        .article-paragraph {
            text-align: justify;
            margin-bottom: 0.75rem;
            text-indent: 1.5rem;
        }
        .article-keywords {
            font-style: italic;
            margin: 1rem 0;
        }
        .article-footnotes {
            font-size: 10pt;
            margin-top: 2rem;
            border-top: 1px solid #ccc;
            padding-top: 1rem;
        }
        .article-references {
            font-size: 11pt;
            margin-top: 2rem;
        }
        .footnote-ref {
            vertical-align: super;
            font-size: 0.7em;
        }
        @media print {
            body {
                padding: 25mm;
            }
        }
    </style>
</head>
<body>
    ${document.getElementById('article-preview').innerHTML}
</body>
</html>`;
    }

    downloadAsPDF() {
        alert('PDF generation would typically require a server-side component. The HTML document has been optimized for printing. You can use "Print to PDF" from your browser.');
        
        // Alternative: Open print dialog
        window.print();
    }

    resetForm() {
        if (confirm('Are you sure you want to reset the form? All data will be lost.')) {
            document.getElementById('article-form').reset();
            this.sections = [];
            this.footnotes = [];
            this.currentFootnoteId = 1;
            document.getElementById('content-sections').innerHTML = '';
            document.getElementById('footnotes-container').innerHTML = '';
            this.addInitialSection();
        }
    }
}

// Initialize the article generator when the page loads
let articleGenerator;
document.addEventListener('DOMContentLoaded', function() {
    articleGenerator = new ArticleGenerator();
});
