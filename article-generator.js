// Professional Article Generator with Multi-Page Support and Exact Document Formatting
class ProfessionalArticleGenerator {
    constructor() {
        this.currentView = 'form';
        this.pageCount = 0;
        this.initializeEventListeners();
        this.loadFromLocalStorage();
        this.setupDefaults();
        this.addInitialPage();
    }

    setupDefaults() {
        // Set default values
        document.getElementById('journal-name').value = 'Islamic Insight';
        document.getElementById('volume-issue').value = 'Vol. 8, No. 1, 2025';
        document.getElementById('starting-page').value = '33';
    }

    initializeEventListeners() {
        // View switching
        document.getElementById('form-view-btn').addEventListener('click', () => this.switchView('form'));
        document.getElementById('split-view-btn').addEventListener('click', () => this.switchView('split'));
        document.getElementById('preview-btn').addEventListener('click', () => this.generatePreview());
        document.getElementById('download-btn').addEventListener('click', () => this.downloadWord());
        document.getElementById('print-btn').addEventListener('click', () => this.printArticle());

        // Page management
        document.getElementById('add-page').addEventListener('click', () => this.addPage());
        document.getElementById('auto-paginate').addEventListener('click', () => this.autoPaginate());

        // Auto-save functionality
        this.setupAutoSave();

        // Live preview in split view
        this.setupLivePreview();
    }

    switchView(view) {
        const formView = document.getElementById('form-view');
        const splitView = document.getElementById('split-view');
        const preview = document.getElementById('article-preview');

        // Hide all views
        formView.classList.add('hidden');
        splitView.classList.add('hidden');
        preview.style.display = 'none';

        // Show selected view
        switch(view) {
            case 'form':
                formView.classList.remove('hidden');
                break;
            case 'split':
                splitView.classList.remove('hidden');
                this.syncToSplitView();
                break;
            case 'preview':
                preview.style.display = 'block';
                this.generatePreview();
                break;
        }

        this.currentView = view;
        this.updateButtonStates();
    }

    updateButtonStates() {
        const buttons = {
            'form-view-btn': 'form',
            'split-view-btn': 'split',
            'preview-btn': 'preview'
        };

        Object.keys(buttons).forEach(btnId => {
            const btn = document.getElementById(btnId);
            if (buttons[btnId] === this.currentView) {
                btn.classList.remove('btn-secondary');
                btn.classList.add('btn-primary');
            } else {
                btn.classList.remove('btn-primary');
                btn.classList.add('btn-secondary');
            }
        });
    }

    addInitialPage() {
        if (this.pageCount === 0) {
            this.addPage();
        }
    }

    addPage() {
        this.pageCount++;
        const container = document.getElementById('pages-container');
        
        const pageHTML = `
            <div class="page-item" data-page="${this.pageCount}">
                <div class="page-header">
                    <div class="flex justify-between items-center w-full">
                        <div class="flex items-center gap-4">
                            <span class="page-number">Page ${this.pageCount}</span>
                            <button class="btn btn-secondary btn-sm toggle-page" data-page="${this.pageCount}">
                                <i class="fas fa-chevron-up mr-1"></i>Collapse
                            </button>
                        </div>
                        <button class="remove-page" data-page="${this.pageCount}">
                            <i class="fas fa-times mr-1"></i>Remove
                        </button>
                    </div>
                </div>
                
                <div class="page-content" id="page-content-${this.pageCount}">
                    <div class="content-sections" id="content-sections-${this.pageCount}">
                        <!-- Content sections will be added here -->
                    </div>
                    
                    <div class="flex gap-2 mt-4">
                        <button class="add-content" data-page="${this.pageCount}" data-type="heading">
                            <i class="fas fa-heading mr-1"></i>Add Main Heading
                        </button>
                        <button class="add-content" data-page="${this.pageCount}" data-type="subheading">
                            <i class="fas fa-h-square mr-1"></i>Add Sub Heading
                        </button>
                        <button class="add-content" data-page="${this.pageCount}" data-type="paragraph">
                            <i class="fas fa-paragraph mr-1"></i>Add Paragraph
                        </button>
                        <button class="add-content" data-page="${this.pageCount}" data-type="list">
                            <i class="fas fa-list mr-1"></i>Add List
                        </button>
                    </div>
                </div>
            </div>
        `;

        container.insertAdjacentHTML('beforeend', pageHTML);
        this.setupPageEventListeners();
        this.setupAutoSave();
    }

    setupPageEventListeners() {
        // Remove page functionality
        document.querySelectorAll('.remove-page').forEach(btn => {
            btn.replaceWith(btn.cloneNode(true));
        });

        document.querySelectorAll('.remove-page').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const pageNum = e.target.getAttribute('data-page') || e.target.closest('.remove-page').getAttribute('data-page');
                if (document.querySelectorAll('.page-item').length > 1) {
                    document.querySelector(`[data-page="${pageNum}"]`).remove();
                    this.renumberPages();
                    this.saveToLocalStorage();
                } else {
                    alert('At least one page is required.');
                }
            });
        });

        // Toggle page functionality
        document.querySelectorAll('.toggle-page').forEach(btn => {
            btn.replaceWith(btn.cloneNode(true));
        });

        document.querySelectorAll('.toggle-page').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const pageNum = e.target.getAttribute('data-page') || e.target.closest('.toggle-page').getAttribute('data-page');
                const pageContent = document.getElementById(`page-content-${pageNum}`);
                const icon = btn.querySelector('i');
                
                if (pageContent.style.display === 'none') {
                    pageContent.style.display = 'block';
                    icon.className = 'fas fa-chevron-up mr-1';
                    btn.innerHTML = '<i class="fas fa-chevron-up mr-1"></i>Collapse';
                } else {
                    pageContent.style.display = 'none';
                    icon.className = 'fas fa-chevron-down mr-1';
                    btn.innerHTML = '<i class="fas fa-chevron-down mr-1"></i>Expand';
                }
            });
        });

        // Add content functionality
        document.querySelectorAll('.add-content').forEach(btn => {
            btn.replaceWith(btn.cloneNode(true));
        });

        document.querySelectorAll('.add-content').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const pageNum = e.target.getAttribute('data-page') || e.target.closest('.add-content').getAttribute('data-page');
                const contentType = e.target.getAttribute('data-type') || e.target.closest('.add-content').getAttribute('data-type');
                this.addContentSection(pageNum, contentType);
            });
        });
    }

    addContentSection(pageNum, contentType) {
        const container = document.getElementById(`content-sections-${pageNum}`);
        const sectionId = `section-${pageNum}-${Date.now()}`;
        
        let sectionHTML = '';
        let placeholder = '';
        let labelText = '';
        let badgeClass = '';

        switch(contentType) {
            case 'heading':
                placeholder = 'Introduction';
                labelText = 'Main Heading (12pt bold)';
                badgeClass = 'heading';
                sectionHTML = `
                    <div class="content-section" id="${sectionId}">
                        <div class="flex justify-between items-center mb-3">
                            <span class="content-type-badge ${badgeClass}">Main Heading</span>
                            <button class="remove-content" data-section="${sectionId}">
                                <i class="fas fa-times mr-1"></i>Remove
                            </button>
                        </div>
                        <div class="form-group">
                            <label>${labelText}</label>
                            <input type="text" class="form-control content-input" data-type="heading" placeholder="${placeholder}">
                        </div>
                    </div>
                `;
                break;
            case 'subheading':
                placeholder = 'Sub heading 1';
                labelText = 'Sub Heading (12pt bold)';
                badgeClass = 'heading';
                sectionHTML = `
                    <div class="content-section" id="${sectionId}">
                        <div class="flex justify-between items-center mb-3">
                            <span class="content-type-badge ${badgeClass}">Sub Heading</span>
                            <button class="remove-content" data-section="${sectionId}">
                                <i class="fas fa-times mr-1"></i>Remove
                            </button>
                        </div>
                        <div class="form-group">
                            <label>${labelText}</label>
                            <input type="text" class="form-control content-input" data-type="subheading" placeholder="${placeholder}">
                        </div>
                    </div>
                `;
                break;
            case 'paragraph':
                placeholder = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed gravida, elit ac sodales sodales...';
                labelText = 'Paragraph Content (11pt justified)';
                badgeClass = 'paragraph';
                sectionHTML = `
                    <div class="content-section" id="${sectionId}">
                        <div class="flex justify-between items-center mb-3">
                            <span class="content-type-badge ${badgeClass}">Paragraph</span>
                            <button class="remove-content" data-section="${sectionId}">
                                <i class="fas fa-times mr-1"></i>Remove
                            </button>
                        </div>
                        <div class="form-group">
                            <label>${labelText}</label>
                            <textarea class="form-control content-input" data-type="paragraph" rows="6" placeholder="${placeholder}"></textarea>
                        </div>
                        <div class="form-group">
                            <label class="flex items-center">
                                <input type="checkbox" class="mr-2 first-paragraph-check" data-section="${sectionId}">
                                First paragraph under heading (no tab indent)
                            </label>
                        </div>
                    </div>
                `;
                break;
            case 'list':
                placeholder = '- Class1: Lorem ipsum dolor sit amet...\n- Class2: Lorem ipsum dolor sit amet...\n- Class3: Lorem ipsum dolor sit amet...';
                labelText = 'List Items (11pt justified)';
                badgeClass = 'list';
                sectionHTML = `
                    <div class="content-section" id="${sectionId}">
                        <div class="flex justify-between items-center mb-3">
                            <span class="content-type-badge ${badgeClass}">List</span>
                            <button class="remove-content" data-section="${sectionId}">
                                <i class="fas fa-times mr-1"></i>Remove
                            </button>
                        </div>
                        <div class="form-group">
                            <label>${labelText}</label>
                            <textarea class="form-control content-input" data-type="list" rows="6" placeholder="${placeholder}"></textarea>
                        </div>
                    </div>
                `;
                break;
        }

        container.insertAdjacentHTML('beforeend', sectionHTML);
        this.setupContentEventListeners();
        this.setupAutoSave();
    }

    setupContentEventListeners() {
        // Remove content functionality
        document.querySelectorAll('.remove-content').forEach(btn => {
            btn.replaceWith(btn.cloneNode(true));
        });

        document.querySelectorAll('.remove-content').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const sectionId = e.target.getAttribute('data-section') || e.target.closest('.remove-content').getAttribute('data-section');
                document.getElementById(sectionId).remove();
                this.saveToLocalStorage();
            });
        });
    }

    renumberPages() {
        const pages = document.querySelectorAll('.page-item');
        this.pageCount = 0;
        
        pages.forEach((page, index) => {
            this.pageCount++;
            const newPageNum = index + 1;
            
            // Update data attributes
            page.setAttribute('data-page', newPageNum);
            
            // Update page number display
            page.querySelector('.page-number').textContent = `Page ${newPageNum}`;
            
            // Update button data attributes
            page.querySelector('.remove-page').setAttribute('data-page', newPageNum);
            page.querySelector('.toggle-page').setAttribute('data-page', newPageNum);
            
            // Update content section IDs
            const contentSections = page.querySelector('.content-sections');
            contentSections.id = `content-sections-${newPageNum}`;
            
            const pageContent = page.querySelector('.page-content');
            pageContent.id = `page-content-${newPageNum}`;
            
            // Update add content buttons
            page.querySelectorAll('.add-content').forEach(btn => {
                btn.setAttribute('data-page', newPageNum);
            });
        });
    }

    autoPaginate() {
        // This is a placeholder for auto-pagination logic
        // You can implement intelligent content distribution here
        alert('Auto-pagination feature coming soon! For now, please manually organize your content across pages.');
    }

    collectFormData() {
        const pages = [];
        
        document.querySelectorAll('.page-item').forEach((page, pageIndex) => {
            const pageNum = pageIndex + 1;
            const contentSections = [];
            
            page.querySelectorAll('.content-section').forEach(section => {
                const input = section.querySelector('.content-input');
                const type = input.getAttribute('data-type');
                const content = input.value;
                const isFirstParagraph = section.querySelector('.first-paragraph-check')?.checked || false;
                
                if (content.trim()) {
                    contentSections.push({
                        type: type,
                        content: content,
                        isFirstParagraph: isFirstParagraph
                    });
                }
            });
            
            if (contentSections.length > 0) {
                pages.push({
                    pageNumber: pageNum,
                    sections: contentSections
                });
            }
        });

        return {
            journalName: document.getElementById('journal-name').value || 'Islamic Insight',
            volumeIssue: document.getElementById('volume-issue').value || 'Vol. 8, No. 1, 2025',
            startingPage: parseInt(document.getElementById('starting-page').value) || 33,
            headerTitle: document.getElementById('header-title').value || '',
            headerAuthor: document.getElementById('header-author').value || '',
            title: document.getElementById('article-title').value || '',
            author: document.getElementById('author-name').value || '',
            abstract: document.getElementById('abstract').value || '',
            keywords: document.getElementById('keywords').value || '',
            pages: pages,
            references: document.getElementById('references').value || '',
            footnotes: document.getElementById('footnotes').value || ''
        };
    }

    generatePreview() {
        const data = this.collectFormData();
        const html = this.generateArticleHTML(data);
        
        document.getElementById('preview-content').innerHTML = html;
        document.getElementById('page-number-display').textContent = data.startingPage.toString();
        
        this.switchView('preview');
    }

    generateArticleHTML(data) {
        let html = '';
        
        // First page with special header
        if (data.pages.length > 0) {
            html += this.generateFirstPageHTML(data);
        }
        
        // Additional pages with regular headers
        for (let i = 1; i < data.pages.length; i++) {
            html += this.generateRegularPageHTML(data, i);
        }
        
        // References section
        if (data.references) {
            html += this.generateReferencesHTML(data.references);
        }
        
        // Footnotes section
        if (data.footnotes) {
            html += this.generateFootnotesHTML(data.footnotes);
        }
        
        return html;
    }

    generateFirstPageHTML(data) {
        const firstPage = data.pages[0];
        
        let html = `
            <div class="page-header-first">
                ${this.escapeHtml(data.headerTitle)} / ${this.escapeHtml(data.headerAuthor)}
                <span style="float: right;">${data.startingPage}</span>
                <div style="clear: both;"></div>
            </div>
        `;
        
        // Article title and author (only on first page)
        if (data.title) {
            html += `<h1 class="article-title">${this.escapeHtml(data.title.toUpperCase())}</h1>`;
        }
        
        if (data.author) {
            html += `<div class="article-author">${this.escapeHtml(data.author)}</div>`;
        }
        
        // Abstract (only on first page)
        if (data.abstract) {
            html += `
                <div class="article-abstract">
                    <h4>Abstract:</h4>
                    <p>${this.escapeHtml(data.abstract)}</p>
                </div>
            `;
        }
        
        // Keywords (only on first page)
        if (data.keywords) {
            html += `
                <div class="article-keywords">
                    <h4>Keywords:</h4> <p>${this.escapeHtml(data.keywords)}</p>
                </div>
            `;
        }
        
        // First page content
        html += this.generatePageContentHTML(firstPage);
        
        return html;
    }

    generateRegularPageHTML(data, pageIndex) {
        const page = data.pages[pageIndex];
        const pageNumber = data.startingPage + pageIndex;
        
        let html = `
            <div style="page-break-before: always;">
                <div class="page-header-other">
                    Page ${pageNumber}
                </div>
                ${this.generatePageContentHTML(page)}
            </div>
        `;
        
        return html;
    }

    generatePageContentHTML(page) {
        let html = '';
        let lastWasHeading = false;
        
        page.sections.forEach((section, index) => {
            switch(section.type) {
                case 'heading':
                    html += `<h2 class="main-heading">${this.escapeHtml(section.content)}</h2>`;
                    lastWasHeading = true;
                    break;
                case 'subheading':
                    html += `<h3 class="sub-heading">${this.escapeHtml(section.content)}</h3>`;
                    lastWasHeading = true;
                    break;
                case 'paragraph':
                    const paragraphClass = section.isFirstParagraph || lastWasHeading ? 'article-paragraph first-paragraph' : 'article-paragraph';
                    html += `<p class="${paragraphClass}">${this.escapeHtml(section.content)}</p>`;
                    lastWasHeading = false;
                    break;
                case 'list':
                    html += '<ul class="article-list">';
                    const listItems = section.content.split('\n').filter(item => item.trim());
                    listItems.forEach(item => {
                        const cleanItem = item.replace(/^[-•*]\s*/, '');
                        html += `<li>${this.escapeHtml(cleanItem)}</li>`;
                    });
                    html += '</ul>';
                    lastWasHeading = false;
                    break;
            }
        });
        
        return html;
    }

    generateReferencesHTML(references) {
        const refList = references.split('\n').filter(ref => ref.trim());
        
        let html = `
            <div class="references" style="page-break-before: auto; margin-top: 30pt;">
                <h3>References</h3>
        `;
        
        refList.forEach(ref => {
            html += `<div class="reference-item">${this.escapeHtml(ref.trim())}</div>`;
        });
        
        html += '</div>';
        return html;
    }

    generateFootnotesHTML(footnotes) {
        const footnoteList = footnotes.split('\n').filter(note => note.trim());
        
        let html = `<div class="footnotes">`;
        
        footnoteList.forEach(note => {
            html += `<div class="footnote-item">${this.escapeHtml(note.trim())}</div>`;
        });
        
        html += '</div>';
        return html;
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    setupAutoSave() {
        const inputs = document.querySelectorAll('.form-control, .content-input, .first-paragraph-check');
        inputs.forEach(input => {
            input.removeEventListener('input', this.saveToLocalStorage);
            input.removeEventListener('change', this.saveToLocalStorage);
            input.addEventListener('input', () => this.saveToLocalStorage());
            input.addEventListener('change', () => this.saveToLocalStorage());
        });
    }

    saveToLocalStorage() {
        try {
            const data = this.collectFormData();
            const formStructure = this.saveFormStructure();
            localStorage.setItem('professionalArticleData', JSON.stringify(data));
            localStorage.setItem('professionalArticleStructure', JSON.stringify(formStructure));
        } catch (e) {
            console.error('Error saving to localStorage:', e);
        }
    }

    saveFormStructure() {
        const pages = [];
        document.querySelectorAll('.page-item').forEach((page, index) => {
            const pageNum = index + 1;
            const sections = [];
            
            page.querySelectorAll('.content-section').forEach(section => {
                const input = section.querySelector('.content-input');
                const type = input.getAttribute('data-type');
                const content = input.value;
                const isFirstParagraph = section.querySelector('.first-paragraph-check')?.checked || false;
                
                sections.push({
                    type: type,
                    content: content,
                    isFirstParagraph: isFirstParagraph
                });
            });
            
            pages.push({
                pageNumber: pageNum,
                sections: sections
            });
        });
        
        return { pages: pages };
    }

    loadFromLocalStorage() {
        const savedData = localStorage.getItem('professionalArticleData');
        const savedStructure = localStorage.getItem('professionalArticleStructure');
        
        if (savedData && savedStructure) {
            try {
                const data = JSON.parse(savedData);
                const structure = JSON.parse(savedStructure);
                this.populateForm(data, structure);
            } catch (e) {
                console.error('Error loading saved data:', e);
            }
        }
    }

    populateForm(data, structure) {
        // Basic fields
        if (data.journalName) document.getElementById('journal-name').value = data.journalName;
        if (data.volumeIssue) document.getElementById('volume-issue').value = data.volumeIssue;
        if (data.startingPage) document.getElementById('starting-page').value = data.startingPage;
        if (data.headerTitle) document.getElementById('header-title').value = data.headerTitle;
        if (data.headerAuthor) document.getElementById('header-author').value = data.headerAuthor;
        if (data.title) document.getElementById('article-title').value = data.title;
        if (data.author) document.getElementById('author-name').value = data.author;
        if (data.abstract) document.getElementById('abstract').value = data.abstract;
        if (data.keywords) document.getElementById('keywords').value = data.keywords;
        if (data.references) document.getElementById('references').value = data.references;
        if (data.footnotes) document.getElementById('footnotes').value = data.footnotes;

        // Clear existing pages
        document.getElementById('pages-container').innerHTML = '';
        this.pageCount = 0;

        // Recreate pages from structure
        if (structure.pages && structure.pages.length > 0) {
            structure.pages.forEach(pageData => {
                this.addPage();
                const pageContainer = document.querySelector(`[data-page="${this.pageCount}"] .content-sections`);
                
                pageData.sections.forEach(sectionData => {
                    this.addContentSection(this.pageCount, sectionData.type);
                    
                    // Find the last added section and populate it
                    const sections = pageContainer.querySelectorAll('.content-section');
                    const lastSection = sections[sections.length - 1];
                    const input = lastSection.querySelector('.content-input');
                    input.value = sectionData.content;
                    
                    const firstParagraphCheck = lastSection.querySelector('.first-paragraph-check');
                    if (firstParagraphCheck) {
                        firstParagraphCheck.checked = sectionData.isFirstParagraph;
                    }
                });
            });
        } else {
            this.addPage(); // Ensure at least one page
        }
    }

    syncToSplitView() {
        const data = this.collectFormData();
        document.getElementById('quick-title').value = data.title;
        document.getElementById('quick-author').value = data.author;
        
        // Combine all content
        let combinedContent = '';
        if (data.abstract) {
            combinedContent += `Abstract:\n${data.abstract}\n\n`;
        }
        
        data.pages.forEach((page, pageIndex) => {
            combinedContent += `--- Page ${pageIndex + 1} ---\n\n`;
            page.sections.forEach(section => {
                switch(section.type) {
                    case 'heading':
                        combinedContent += `# ${section.content}\n\n`;
                        break;
                    case 'subheading':
                        combinedContent += `## ${section.content}\n\n`;
                        break;
                    case 'paragraph':
                        combinedContent += `${section.content}\n\n`;
                        break;
                    case 'list':
                        combinedContent += `${section.content}\n\n`;
                        break;
                }
            });
        });
        
        document.getElementById('quick-content').value = combinedContent;
    }

    setupLivePreview() {
        const quickInputs = ['quick-title', 'quick-author', 'quick-content'];
        quickInputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', () => this.updateLivePreview());
            }
        });
    }

    updateLivePreview() {
        const title = document.getElementById('quick-title').value || 'Article Title';
        const author = document.getElementById('quick-author').value || 'Author Name';
        const content = document.getElementById('quick-content').value || '';

        const previewHTML = `
            <div style="font-family: 'Times New Roman', serif; line-height: 1.15; font-size: 11pt;">
                <div class="page-header-first">
                    ${title} / ${author}
                    <span style="float: right;">33</span>
                    <div style="clear: both;"></div>
                </div>
                
                <h1 class="article-title">${title.toUpperCase()}</h1>
                <div class="article-author">${author}</div>
                
                <div style="text-align: justify; font-size: 11pt; line-height: 1.15;">
                    ${this.formatQuickContent(content)}
                </div>
            </div>
        `;

        document.getElementById('live-preview').innerHTML = previewHTML;
    }

    formatQuickContent(content) {
        return content
            .split('\n\n')
            .filter(para => para.trim())
            .map(para => {
                if (para.startsWith('# ')) {
                    return `<h2 class="main-heading">${this.escapeHtml(para.substring(2))}</h2>`;
                } else if (para.startsWith('## ')) {
                    return `<h3 class="sub-heading">${this.escapeHtml(para.substring(3))}</h3>`;
                } else if (para.startsWith('---')) {
                    return `<div style="border-top: 1px solid #ccc; margin: 20pt 0; padding-top: 10pt; color: #666; font-size: 10pt;">${this.escapeHtml(para)}</div>`;
                } else {
                    return `<p class="article-paragraph">${this.escapeHtml(para.trim())}</p>`;
                }
            })
            .join('');
    }

    async downloadWord() {
        const downloadBtn = document.getElementById('download-btn');
        const spinner = downloadBtn.querySelector('.download-spinner');
        const icon = downloadBtn.querySelector('.fas');
        
        // Show loading state
        spinner.style.display = 'inline-block';
        icon.style.display = 'none';
        downloadBtn.disabled = true;
        downloadBtn.innerHTML = '<div class="download-spinner" style="display: inline-block;"></div> Generating Word Document...';

        try {
            const data = this.collectFormData();
            await this.generateWordDocument(data);
        } catch (error) {
            console.error('Error generating Word document:', error);
            alert('Error generating Word document. Please try again.');
        } finally {
            // Reset button state
            spinner.style.display = 'none';
            icon.style.display = 'inline';
            downloadBtn.disabled = false;
            downloadBtn.innerHTML = '<i class="fas fa-file-word mr-2"></i>Download Word';
        }
    }

    async generateWordDocument(data) {
        const { Document, Packer, Paragraph, TextRun, Header, Footer, AlignmentType, HeadingLevel, TabStopPosition, TabStopType, BorderStyle, UnderlineType, SectionType } = docx;

        const sections = [];
        let currentPageNumber = data.startingPage;

        // Create sections for each page
        data.pages.forEach((page, pageIndex) => {
            const children = [];
            
            // First page gets title, author, abstract, keywords
            if (pageIndex === 0) {
                // Article Title
                if (data.title) {
                    children.push(
                        new Paragraph({
                            children: [new TextRun({ 
                                text: data.title.toUpperCase(), 
                                bold: true, 
                                size: 26, // 13pt
                                font: "Times New Roman"
                            })],
                            alignment: AlignmentType.CENTER,
                            spacing: { before: 400, after: 300 }
                        })
                    );
                }
                
                // Author Name
                if (data.author) {
                    children.push(
                        new Paragraph({
                            children: [new TextRun({ 
                                text: data.author, 
                                size: 22, // 11pt
                                bold: true,
                                font: "Times New Roman"
                            })],
                            alignment: AlignmentType.CENTER,
                            spacing: { after: 400 }
                        })
                    );
                }
                
                // Abstract
                if (data.abstract) {
                    children.push(
                        new Paragraph({
                            children: [new TextRun({
                                text: "Abstract:",
                                bold: true,
                                size: 24, // 12pt
                                font: "Times New Roman"
                            })],
                            spacing: { after: 160, before: 300 }
                        }),
                        new Paragraph({
                            children: [new TextRun({ 
                                text: data.abstract, 
                                size: 22, // 11pt
                                font: "Times New Roman"
                            })],
                            alignment: AlignmentType.JUSTIFIED,
                            spacing: { after: 300 },
                            indent: { firstLine: 0 }
                        })
                    );
                }
                
                // Keywords
                if (data.keywords) {
                    children.push(
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: "Keywords: ",
                                    bold: true,
                                    size: 24, // 12pt
                                    font: "Times New Roman"
                                }),
                                new TextRun({
                                    text: data.keywords,
                                    size: 22, // 11pt
                                    font: "Times New Roman"
                                })
                            ],
                            spacing: { after: 500, before: 200 },
                            alignment: AlignmentType.JUSTIFIED
                        })
                    );
                }
            }
            
            // Add page content
            let lastWasHeading = false;
            page.sections.forEach(section => {
                switch(section.type) {
                    case 'heading':
                        children.push(
                            new Paragraph({
                                children: [new TextRun({ 
                                    text: section.content, 
                                    bold: true, 
                                    size: 24, // 12pt
                                    font: "Times New Roman"
                                })],
                                spacing: { before: 400, after: 240 },
                                alignment: AlignmentType.LEFT
                            })
                        );
                        lastWasHeading = true;
                        break;
                    case 'subheading':
                        children.push(
                            new Paragraph({
                                children: [new TextRun({ 
                                    text: section.content, 
                                    bold: true, 
                                    size: 24, // 12pt
                                    font: "Times New Roman"
                                })],
                                spacing: { before: 300, after: 160 },
                                alignment: AlignmentType.LEFT
                            })
                        );
                        lastWasHeading = true;
                        break;
                    case 'paragraph':
                        const paragraph = new Paragraph({
                            children: [new TextRun({ 
                                text: section.content, 
                                size: 22, // 11pt
                                font: "Times New Roman"
                            })],
                            alignment: AlignmentType.JUSTIFIED,
                            spacing: { after: 0 }
                        });
                        
                        // Apply tab indent if not first paragraph under heading
                        if (!section.isFirstParagraph && !lastWasHeading) {
                            paragraph.indent = { firstLine: 280 }; // 14pt tab indent
                        } else {
                            paragraph.indent = { firstLine: 0 };
                        }
                        
                        children.push(paragraph);
                        lastWasHeading = false;
                        break;
                    case 'list':
                        const listItems = section.content.split('\n').filter(item => item.trim());
                        listItems.forEach(item => {
                            const cleanItem = item.replace(/^[-•*]\s*/, '');
                            children.push(
                                new Paragraph({
                                    children: [new TextRun({ 
                                        text: `• ${cleanItem}`, 
                                        size: 22, // 11pt
                                        font: "Times New Roman"
                                    })],
                                    spacing: { after: 80 },
                                    indent: { left: 400 },
                                    alignment: AlignmentType.JUSTIFIED
                                })
                            );
                        });
                        lastWasHeading = false;
                        break;
                }
            });
            
            // Create section with appropriate header
            const sectionProps = {
                properties: {
                    page: {
                        margin: {
                            top: "25mm",
                            right: "25mm",
                            bottom: "20mm",
                            left: "25mm"
                        }
                    }
                },
                children: children
            };
            
            // Add headers based on page
            if (pageIndex === 0) {
                // First page header (right-aligned)
                sectionProps.headers = {
                    default: new Header({
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: `${data.headerTitle} / ${data.headerAuthor}`,
                                        size: 20, // 10pt
                                        font: "Times New Roman"
                                    })
                                ],
                                alignment: AlignmentType.RIGHT,
                                spacing: { after: 240 }
                            })
                        ]
                    })
                };
            } else {
                // Other pages header (center-aligned)
                sectionProps.headers = {
                    default: new Header({
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: `Page ${currentPageNumber + pageIndex}`,
                                        size: 20, // 10pt
                                        font: "Times New Roman"
                                    })
                                ],
                                alignment: AlignmentType.CENTER,
                                spacing: { after: 200 }
                            })
                        ]
                    })
                };
            }
            
            // Add footers with page numbers
            sectionProps.footers = {
                default: new Footer({
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: (currentPageNumber + pageIndex).toString(),
                                    size: 20, // 10pt
                                    font: "Times New Roman"
                                })
                            ],
                            alignment: AlignmentType.RIGHT
                        })
                    ]
                })
            };
            
            sections.push(sectionProps);
        });
        
        // Add references section if exists
        if (data.references) {
            const refList = data.references.split('\n').filter(ref => ref.trim());
            const refChildren = [
                new Paragraph({
                    children: [new TextRun({ 
                        text: "References", 
                        bold: true, 
                        size: 24, // 12pt
                        font: "Times New Roman"
                    })],
                    spacing: { before: 600, after: 300 },
                    alignment: AlignmentType.LEFT
                })
            ];
            
            refList.forEach(ref => {
                refChildren.push(
                    new Paragraph({
                        children: [new TextRun({ 
                            text: ref.trim(), 
                            size: 22, // 11pt
                            font: "Times New Roman"
                        })],
                        spacing: { after: 0 },
                        indent: { hanging: 720 }, // Hanging indent
                        alignment: AlignmentType.JUSTIFIED
                    })
                );
            });
            
            sections.push({
                children: refChildren
            });
        }
        
        // Add footnotes section if exists
        if (data.footnotes) {
            const footnoteList = data.footnotes.split('\n').filter(note => note.trim());
            const footnoteChildren = [
                new Paragraph({
                    children: [new TextRun({ text: "", size: 18 })],
                    spacing: { before: 400 },
                    border: { top: { style: BorderStyle.SINGLE, size: 1, color: "000000" } }
                })
            ];
            
            footnoteList.forEach(note => {
                footnoteChildren.push(
                    new Paragraph({
                        children: [new TextRun({ 
                            text: note.trim(), 
                            size: 18, // 9pt
                            font: "Times New Roman"
                        })],
                        spacing: { after: 60 },
                        indent: { hanging: 360 }
                    })
                );
            });
            
            sections.push({
                children: footnoteChildren
            });
        }

        // Create the document
        const doc = new Document({
            sections: sections
        });

        // Generate and download
        const blob = await Packer.toBlob(doc);
        const fileName = `${(data.title || 'Professional_Article').replace(/[^a-z0-9]/gi, '_').toLowerCase()}.docx`;
        
        saveAs(blob, fileName);
    }

    printArticle() {
        window.print();
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    const generator = new ProfessionalArticleGenerator();
    
    // Mobile menu functionality
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            // Mobile menu toggle logic here
            console.log('Mobile menu clicked');
        });
    }
});

// Print functionality
window.addEventListener('beforeprint', function() {
    // Show preview for printing
    const previewContainer = document.getElementById('article-preview');
    if (previewContainer.style.display === 'none') {
        previewContainer.style.display = 'block';
    }
});

// Additional utility functions
function formatArabicText(text) {
    // Handle Arabic/Islamic text formatting
    const arabicPattern = /[\u0600-\u06FF]/;
    if (arabicPattern.test(text)) {
        return `<span style="direction: rtl; font-style: italic;">${text}</span>`;
    }
    return text;
}

function validateFormData(data) {
    // Validate required fields
    const errors = [];
    
    if (!data.title || data.title.trim() === '') {
        errors.push('Article title is required');
    }
    
    if (!data.author || data.author.trim() === '') {
        errors.push('Author name is required');
    }
    
    if (data.pages.length === 0) {
        errors.push('At least one page with content is required');
    }
    
    return errors;
}

// Export functionality for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProfessionalArticleGenerator;
}
