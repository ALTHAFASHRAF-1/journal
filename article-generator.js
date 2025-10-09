// Article Generator JavaScript with Word Document Export
class ArticleGenerator {
    constructor() {
        this.currentView = 'form';
        this.sectionCount = 1;
        this.initializeEventListeners();
        this.loadFromLocalStorage();
    }

    initializeEventListeners() {
        // View switching
        document.getElementById('form-view-btn').addEventListener('click', () => this.switchView('form'));
        document.getElementById('split-view-btn').addEventListener('click', () => this.switchView('split'));
        document.getElementById('preview-btn').addEventListener('click', () => this.generatePreview());
        document.getElementById('download-btn').addEventListener('click', () => this.downloadWord());

        // Section management
        document.getElementById('add-section').addEventListener('click', () => this.addSection());
        
        // Auto-save functionality
        this.setupAutoSave();

        // Live preview in split view
        this.setupLivePreview();

        // Remove section functionality
        this.setupRemoveSectionListeners();
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

    addSection() {
        this.sectionCount++;
        const container = document.getElementById('sections-container');
        
        const sectionHTML = `
            <div class="section-item bg-gray-50 p-4 rounded mb-4">
                <div class="flex justify-between items-center mb-2">
                    <h4 class="font-semibold">Section ${this.sectionCount}</h4>
                    <button class="remove-section btn" style="background: #ef4444; color: white; padding: 0.25rem 0.5rem; font-size: 0.75rem;">Remove</button>
                </div>
                <div class="form-group">
                    <label>Section Title</label>
                    <input type="text" class="form-control section-title" placeholder="Section Title">
                </div>
                <div class="form-group">
                    <label>Section Content</label>
                    <textarea class="form-control section-content" rows="6" placeholder="Enter your section content here..."></textarea>
                </div>
            </div>
        `;

        container.insertAdjacentHTML('beforeend', sectionHTML);
        this.setupRemoveSectionListeners();
        this.setupAutoSave();
    }

    setupRemoveSectionListeners() {
        document.querySelectorAll('.remove-section').forEach(btn => {
            btn.replaceWith(btn.cloneNode(true)); // Remove existing listeners
        });

        document.querySelectorAll('.remove-section').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (document.querySelectorAll('.section-item').length > 1) {
                    e.target.closest('.section-item').remove();
                    this.renumberSections();
                } else {
                    alert('At least one section is required.');
                }
            });
        });
    }

    renumberSections() {
        document.querySelectorAll('.section-item').forEach((section, index) => {
            section.querySelector('h4').textContent = `Section ${index + 1}`;
        });
        this.sectionCount = document.querySelectorAll('.section-item').length;
    }

    generatePreview() {
        const data = this.collectFormData();
        const html = this.generateArticleHTML(data);
        
        document.getElementById('preview-content').innerHTML = html;
        document.getElementById('page-number').textContent = data.pageStart || '59';
        
        this.switchView('preview');
    }

    collectFormData() {
        const sections = [];
        document.querySelectorAll('.section-item').forEach(section => {
            const title = section.querySelector('.section-title').value;
            const content = section.querySelector('.section-content').value;
            if (title || content) {
                sections.push({ title, content });
            }
        });

        return {
            volume: document.getElementById('volume').value || 'Vol. 8',
            issue: document.getElementById('issue').value || 'No. 1, 2025',
            pageStart: document.getElementById('page-start').value || '59',
            headerTitle: document.getElementById('header-title').value || 'Article Title',
            title: document.getElementById('article-title').value || 'Article Title',
            author: document.getElementById('author-name').value || 'Author Name',
            abstract: document.getElementById('abstract').value || '',
            keywords: document.getElementById('keywords').value || '',
            sections: sections,
            references: document.getElementById('references').value || '',
            footnotes: document.getElementById('footnotes').value || ''
        };
    }

    generateArticleHTML(data) {
        let sectionsHTML = '';
        data.sections.forEach(section => {
            if (section.title || section.content) {
                sectionsHTML += `
                    <h2>${this.escapeHtml(section.title)}</h2>
                    ${this.formatContent(section.content)}
                `;
            }
        });

        let referencesHTML = '';
        if (data.references) {
            const refList = data.references.split('\n').filter(ref => ref.trim());
            referencesHTML = `
                <div class="references">
                    <h3>References</h3>
                    ${refList.map(ref => `<div class="reference-item">${this.escapeHtml(ref.trim())}</div>`).join('')}
                </div>
            `;
        }

        let footnotesHTML = '';
        if (data.footnotes) {
            const footnoteList = data.footnotes.split('\n').filter(note => note.trim());
            footnotesHTML = `
                <div class="footnote">
                    ${footnoteList.map(note => `<div>${this.escapeHtml(note.trim())}</div>`).join('')}
                </div>
            `;
        }

        return `
            <div class="article-header">
                ${this.escapeHtml(data.headerTitle)} / ${this.escapeHtml(data.author)} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${data.pageStart}
                <br><br>
                Islamic Insight ${data.volume}, ${data.issue}
            </div>

            <h1 class="article-title">${this.escapeHtml(data.title)}</h1>
            
            <div class="article-author">${this.escapeHtml(data.author)}</div>

            ${data.abstract ? `
                <div class="article-abstract">
                    <h4>Abstract:</h4>
                    <p>${this.formatContent(data.abstract)}</p>
                </div>
            ` : ''}

            ${data.keywords ? `
                <div class="article-keywords">
                    <h4>Keywords:</h4>
                    <p>${this.escapeHtml(data.keywords)}</p>
                </div>
            ` : ''}

            <div class="article-content">
                ${sectionsHTML}
            </div>

            ${referencesHTML}
            ${footnotesHTML}
        `;
    }

    formatContent(content) {
        if (!content) return '';
        
        return content
            .split('\n\n')
            .filter(para => para.trim())
            .map(para => `<p>${this.escapeHtml(para.trim())}</p>`)
            .join('');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    setupAutoSave() {
        const inputs = document.querySelectorAll('.form-control');
        inputs.forEach(input => {
            input.addEventListener('input', () => this.saveToLocalStorage());
        });
    }

    saveToLocalStorage() {
        const data = this.collectFormData();
        localStorage.setItem('islamicInsightArticle', JSON.stringify(data));
    }

    loadFromLocalStorage() {
        const saved = localStorage.getItem('islamicInsightArticle');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.populateForm(data);
            } catch (e) {
                console.error('Error loading saved data:', e);
            }
        }
    }

    populateForm(data) {
        // Basic fields
        document.getElementById('volume').value = data.volume || '';
        document.getElementById('issue').value = data.issue || '';
        document.getElementById('page-start').value = data.pageStart || '';
        document.getElementById('header-title').value = data.headerTitle || '';
        document.getElementById('article-title').value = data.title || '';
        document.getElementById('author-name').value = data.author || '';
        document.getElementById('abstract').value = data.abstract || '';
        document.getElementById('keywords').value = data.keywords || '';
        document.getElementById('references').value = data.references || '';
        document.getElementById('footnotes').value = data.footnotes || '';

        // Clear existing sections and add saved ones
        const container = document.getElementById('sections-container');
        container.innerHTML = '';
        this.sectionCount = 0;

        if (data.sections && data.sections.length > 0) {
            data.sections.forEach(section => {
                this.addSection();
                const lastSection = container.lastElementChild;
                lastSection.querySelector('.section-title').value = section.title || '';
                lastSection.querySelector('.section-content').value = section.content || '';
            });
        } else {
            this.addSection(); // Ensure at least one section
        }
    }

    syncToSplitView() {
        const data = this.collectFormData();
        document.getElementById('quick-title').value = data.title;
        document.getElementById('quick-author').value = data.author;
        
        // Combine all sections into quick content
        let combinedContent = '';
        if (data.abstract) {
            combinedContent += `Abstract:\n${data.abstract}\n\n`;
        }
        
        data.sections.forEach(section => {
            if (section.title) {
                combinedContent += `${section.title}\n\n`;
            }
            if (section.content) {
                combinedContent += `${section.content}\n\n`;
            }
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
            <div style="font-family: 'Crimson Text', serif; max-width: 800px; margin: 0 auto; padding: 2rem; line-height: 1.6;">
                <div style="text-align: right; font-size: 10pt; margin-bottom: 2rem; border-bottom: 1px solid #000; padding-bottom: 0.5rem;">
                    ${title} / ${author} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 59
                    <br><br>
                    Islamic Insight Vol. 8, No. 1, 2025
                </div>
                
                <h1 style="font-size: 14pt; font-weight: bold; text-align: center; margin: 2rem 0 1rem 0;">${title}</h1>
                <div style="font-size: 12pt; text-align: center; margin-bottom: 2rem; font-weight: 500;">${author}</div>
                
                <div style="text-align: justify; font-size: 10pt;">
                    ${this.formatContent(content)}
                </div>
            </div>
        `;

        document.getElementById('live-preview').innerHTML = previewHTML;
    }

    async downloadWord() {
        const downloadBtn = document.getElementById('download-btn');
        const spinner = downloadBtn.querySelector('.download-spinner');
        const icon = downloadBtn.querySelector('.fas');
        
        // Show loading state
        spinner.style.display = 'inline-block';
        icon.style.display = 'none';
        downloadBtn.disabled = true;
        downloadBtn.textContent = '';
        downloadBtn.appendChild(spinner);
        downloadBtn.appendChild(document.createTextNode(' Generating...'));

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
        const { Document, Packer, Paragraph, TextRun, Header, Footer, AlignmentType, HeadingLevel, TabStopPosition, TabStopType, BorderStyle } = docx;

        // Create sections content
        const sections = [];
        
        // Add abstract section if exists
        if (data.abstract) {
            sections.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: "Abstract:",
                            bold: true,
                            size: 20
                        })
                    ],
                    spacing: { after: 200 }
                }),
                new Paragraph({
                    children: [new TextRun({ text: data.abstract, size: 20 })],
                    alignment: AlignmentType.JUSTIFIED,
                    spacing: { after: 400 }
                })
            );
        }

        // Add keywords if exists
        if (data.keywords) {
            sections.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: "Keywords: ",
                            bold: true,
                            size: 20
                        }),
                        new TextRun({
                            text: data.keywords,
                            size: 20
                        })
                    ],
                    spacing: { after: 400 }
                })
            );
        }

        // Add article sections
        data.sections.forEach(section => {
            if (section.title) {
                sections.push(
                    new Paragraph({
                        children: [new TextRun({ text: section.title, bold: true, size: 24 })],
                        heading: HeadingLevel.HEADING_2,
                        spacing: { before: 400, after: 200 }
                    })
                );
            }
            if (section.content) {
                const paragraphs = section.content.split('\n\n').filter(para => para.trim());
                paragraphs.forEach((para, index) => {
                    sections.push(
                        new Paragraph({
                            children: [new TextRun({ text: para.trim(), size: 20 })],
                            alignment: AlignmentType.JUSTIFIED,
                            spacing: { after: 200 },
                            indent: index === 0 ? undefined : { firstLine: 720 } // 0.5 inch first line indent for continuing paragraphs
                        })
                    );
                });
            }
        });

        // Add references if exists
        if (data.references) {
            const refList = data.references.split('\n').filter(ref => ref.trim());
            sections.push(
                new Paragraph({
                    children: [new TextRun({ text: "References", bold: true, size: 24 })],
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 600, after: 200 },
                    border: { top: { style: BorderStyle.SINGLE, size: 1, color: "000000" } }
                })
            );
            
            refList.forEach(ref => {
                sections.push(
                    new Paragraph({
                        children: [new TextRun({ text: ref.trim(), size: 18 })],
                        spacing: { after: 100 },
                        indent: { hanging: 720 } // Hanging indent for references
                    })
                );
            });
        }

        // Add footnotes if exists
        if (data.footnotes) {
            const footnoteList = data.footnotes.split('\n').filter(note => note.trim());
            sections.push(
                new Paragraph({
                    children: [new TextRun({ text: "", size: 16 })],
                    spacing: { before: 400 },
                    border: { top: { style: BorderStyle.SINGLE, size: 1, color: "000000" } }
                })
            );
            
            footnoteList.forEach(note => {
                sections.push(
                    new Paragraph({
                        children: [new TextRun({ text: note.trim(), size: 16 })],
                        spacing: { after: 100 }
                    })
                );
            });
        }

        // Create the document
        const doc = new Document({
            sections: [{
                headers: {
                    default: new Header({
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: `${data.headerTitle} / ${data.author}`,
                                        size: 20
                                    }),
                                    new TextRun({
                                        text: `\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t${data.pageStart}`,
                                        size: 20
                                    })
                                ],
                                alignment: AlignmentType.RIGHT,
                                border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" } },
                                spacing: { after: 200 }
                            }),
                            new Paragraph({
                                children: [new TextRun({ text: "", size: 20 })],
                                spacing: { after: 200 }
                            }),
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: `Islamic Insight ${data.volume}, ${data.issue}`,
                                        size: 20
                                    })
                                ],
                                alignment: AlignmentType.RIGHT
                            })
                        ]
                    })
                },
                footers: {
                    default: new Footer({
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: data.pageStart || "59",
                                        size: 20
                                    })
                                ],
                                alignment: AlignmentType.RIGHT
                            })
                        ]
                    })
                },
                children: [
                    // Article Title
                    new Paragraph({
                        children: [new TextRun({ text: data.title, bold: true, size: 28 })],
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 600, after: 200 }
                    }),
                    
                    // Author Name
                    new Paragraph({
                        children: [new TextRun({ text: data.author, size: 24 })],
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 600 }
                    }),
                    
                    // Add all sections
                    ...sections
                ]
            }]
        });

        // Generate and download the document
        const blob = await Packer.toBlob(doc);
        const fileName = `${(data.title || 'article').replace(/[^a-z0-9]/gi, '_').toLowerCase()}.docx`;
        
        // Use FileSaver to download
        saveAs(blob, fileName);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    new ArticleGenerator();
});

// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
});
