// Article Generator JavaScript with Precise Islamic Insight Formatting
class ArticleGenerator {
    constructor() {
        this.currentView = 'form';
        this.sectionCount = 1;
        this.initializeEventListeners();
        this.loadFromLocalStorage();
        this.setupFormDefaults();
    }

    setupFormDefaults() {
        // Set default values matching Islamic Insight standards
        if (!document.getElementById('volume').value) {
            document.getElementById('volume').value = 'Vol. 8';
        }
        if (!document.getElementById('issue').value) {
            document.getElementById('issue').value = 'No. 1, 2025';
        }
        if (!document.getElementById('page-start').value) {
            document.getElementById('page-start').value = '59';
        }
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
                    <label>Section Content (Will be justified, 12pt font)</label>
                    <textarea class="form-control section-content" rows="8" placeholder="Enter your section content here. Use proper academic writing style with in-text citations in format (Author, Year, p. X). For Islamic terms, use proper transliteration with diacritics where appropriate."></textarea>
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
                    this.saveToLocalStorage();
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
        // Format sections with proper academic structure
        let sectionsHTML = '';
        data.sections.forEach(section => {
            if (section.title || section.content) {
                sectionsHTML += `
                    <h2>${this.escapeHtml(section.title)}</h2>
                    ${this.formatAcademicContent(section.content)}
                `;
            }
        });

        // Format references with hanging indent
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

        // Format footnotes with proper numbering
        let footnotesHTML = '';
        if (data.footnotes) {
            const footnoteList = data.footnotes.split('\n').filter(note => note.trim());
            footnotesHTML = `
                <div class="footnote">
                    ${footnoteList.map(note => `<div class="footnote-item">${this.escapeHtml(note.trim())}</div>`).join('')}
                </div>
            `;
        }

        // Generate header exactly as in the Word document
        const headerHTML = `
            <div class="article-header">
                ${this.escapeHtml(data.headerTitle)} / ${this.escapeHtml(data.author)}
                <span class="header-right">${data.pageStart}</span>
                <div class="header-clear"></div>
                <br>
                Islamic Insight ${data.volume}, ${data.issue}
            </div>
        `;

        return `
            ${headerHTML}

            <h1 class="article-title">${this.escapeHtml(data.title.toUpperCase())}</h1>
            
            <div class="article-author">${this.escapeHtml(data.author)}</div>

            ${data.abstract ? `
                <div class="article-abstract">
                    <h4>Abstract:</h4>
                    <p>${this.formatAcademicContent(data.abstract)}</p>
                </div>
            ` : ''}

            ${data.keywords ? `
                <div class="article-keywords">
                    <h4>Keywords:</h4> <p>${this.escapeHtml(data.keywords)}</p>
                </div>
            ` : ''}

            <div class="article-content">
                ${sectionsHTML}
            </div>

            ${referencesHTML}
            ${footnotesHTML}
        `;
    }

    formatAcademicContent(content) {
        if (!content) return '';
        
        return content
            .split('\n\n')
            .filter(para => para.trim())
            .map(para => {
                // Handle in-text citations and Islamic terms
                let formatted = this.escapeHtml(para.trim());
                
                // Format citations (Author, Year, p. X)
                formatted = formatted.replace(/\(([^)]+,\s*\d{4}[^)]*)\)/g, '<span class="citation">($1)</span>');
                
                // Handle Islamic terms (basic detection for common patterns)
                formatted = formatted.replace(/\b(Ḥadīth|ḥadīth|Qurʾān|Sunnah|isnād|kashf|ilhām|sharīʿa|ṣaḥābī|tābiʿ)\b/g, '<em>$1</em>');
                
                return `<p>${formatted}</p>`;
            })
            .join('');
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    setupAutoSave() {
        const inputs = document.querySelectorAll('.form-control');
        inputs.forEach(input => {
            // Remove existing listeners to prevent duplicates
            input.removeEventListener('input', this.saveToLocalStorage);
            input.addEventListener('input', () => this.saveToLocalStorage());
        });
    }

    saveToLocalStorage() {
        try {
            const data = this.collectFormData();
            localStorage.setItem('islamicInsightArticle', JSON.stringify(data));
        } catch (e) {
            console.error('Error saving to localStorage:', e);
        }
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
        if (data.volume) document.getElementById('volume').value = data.volume;
        if (data.issue) document.getElementById('issue').value = data.issue;
        if (data.pageStart) document.getElementById('page-start').value = data.pageStart;
        if (data.headerTitle) document.getElementById('header-title').value = data.headerTitle;
        if (data.title) document.getElementById('article-title').value = data.title;
        if (data.author) document.getElementById('author-name').value = data.author;
        if (data.abstract) document.getElementById('abstract').value = data.abstract;
        if (data.keywords) document.getElementById('keywords').value = data.keywords;
        if (data.references) document.getElementById('references').value = data.references;
        if (data.footnotes) document.getElementById('footnotes').value = data.footnotes;

        // Clear existing sections and add saved ones
        const container = document.getElementById('sections-container');
        container.innerHTML = '';
        this.sectionCount = 0;

        if (data.sections && data.sections.length > 0) {
            data.sections.forEach(section => {
                this.addSection();
                const lastSection = container.lastElementChild;
                if (section.title) lastSection.querySelector('.section-title').value = section.title;
                if (section.content) lastSection.querySelector('.section-content').value = section.content;
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
            <div style="font-family: 'Times New Roman', serif; line-height: 1.5; font-size: 11pt;">
                <div style="font-size: 10pt; margin-bottom: 15pt; border-bottom: 1pt solid #000; padding-bottom: 8pt;">
                    ${title} / ${author}
                    <span style="float: right;">59</span>
                    <div style="clear: both;"></div>
                    <br>
                    Islamic Insight Vol. 8, No. 1, 2025
                </div>
                
                <h1 style="font-size: 14pt; font-weight: bold; text-align: center; margin: 25pt 0 12pt 0; text-transform: uppercase;">${title}</h1>
                <div style="font-size: 12pt; text-align: center; margin-bottom: 20pt; font-weight: bold;">${author}</div>
                
                <div style="text-align: justify; font-size: 12pt; line-height: 1.5;">
                    ${this.formatAcademicContent(content)}
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
        downloadBtn.innerHTML = '';
        downloadBtn.appendChild(spinner);
        downloadBtn.appendChild(document.createTextNode(' Generating Word Document...'));

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
        const { Document, Packer, Paragraph, TextRun, Header, Footer, AlignmentType, HeadingLevel, TabStopPosition, TabStopType, BorderStyle, UnderlineType } = docx;

        // Create sections content with proper Islamic Insight formatting
        const sections = [];
        
        // Add abstract section if exists
        if (data.abstract) {
            sections.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: "Abstract:",
                            bold: true,
                            size: 24, // 12pt
                            font: "Times New Roman"
                        })
                    ],
                    spacing: { after: 160, before: 400 }
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

        // Add keywords if exists
        if (data.keywords) {
            sections.push(
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

        // Add article sections
        data.sections.forEach(section => {
            if (section.title) {
                sections.push(
                    new Paragraph({
                        children: [new TextRun({ 
                            text: section.title, 
                            bold: true, 
                            size: 24, // 12pt
                            font: "Times New Roman"
                        })],
                        spacing: { before: 500, after: 240 },
                        alignment: AlignmentType.LEFT
                    })
                );
            }
            if (section.content) {
                const paragraphs = section.content.split('\n\n').filter(para => para.trim());
                paragraphs.forEach((para) => {
                    sections.push(
                        new Paragraph({
                            children: [new TextRun({ 
                                text: para.trim(), 
                                size: 24, // 12pt
                                font: "Times New Roman"
                            })],
                            alignment: AlignmentType.JUSTIFIED,
                            spacing: { after: 240 },
                            indent: { firstLine: 0 }
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
                    children: [new TextRun({ 
                        text: "REFERENCES", 
                        bold: true, 
                        size: 24, // 12pt
                        font: "Times New Roman"
                    })],
                    spacing: { before: 600, after: 300 },
                    alignment: AlignmentType.CENTER
                })
            );
            
            refList.forEach(ref => {
                sections.push(
                    new Paragraph({
                        children: [new TextRun({ 
                            text: ref.trim(), 
                            size: 22, // 11pt
                            font: "Times New Roman"
                        })],
                        spacing: { after: 160 },
                        indent: { hanging: 720 }, // Hanging indent
                        alignment: AlignmentType.JUSTIFIED
                    })
                );
            });
        }

        // Add footnotes if exists
        if (data.footnotes) {
            const footnoteList = data.footnotes.split('\n').filter(note => note.trim());
            sections.push(
                new Paragraph({
                    children: [new TextRun({ text: "", size: 20 })],
                    spacing: { before: 400 },
                    border: { top: { style: BorderStyle.SINGLE, size: 1, color: "000000" } }
                })
            );
            
            footnoteList.forEach(note => {
                sections.push(
                    new Paragraph({
                        children: [new TextRun({ 
                            text: note.trim(), 
                            size: 20, // 10pt
                            font: "Times New Roman"
                        })],
                        spacing: { after: 100 },
                        indent: { hanging: 360 }
                    })
                );
            });
        }

        // Create the document with Islamic Insight formatting
        const doc = new Document({
            sections: [{
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
                headers: {
                    default: new Header({
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: `${data.headerTitle} / ${data.author}`,
                                        size: 20, // 10pt
                                        font: "Times New Roman"
                                    }),
                                    new TextRun({
                                        text: `\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t${data.pageStart}`,
                                        size: 20 // 10pt
                                    })
                                ],
                                alignment: AlignmentType.LEFT,
                                border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: "000000" } },
                                spacing: { after: 240 }
                            }),
                            new Paragraph({
                                children: [new TextRun({ text: "", size: 20 })],
                                spacing: { after: 160 }
                            }),
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: `Islamic Insight ${data.volume}, ${data.issue}`,
                                        size: 20, // 10pt
                                        font: "Times New Roman"
                                    })
                                ],
                                alignment: AlignmentType.LEFT
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
                                        size: 20, // 10pt
                                        font: "Times New Roman"
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
                        children: [new TextRun({ 
                            text: data.title.toUpperCase(), 
                            bold: true, 
                            size: 28, // 14pt
                            font: "Times New Roman"
                        })],
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 600, after: 300 }
                    }),
                    
                    // Author Name
                    new Paragraph({
                        children: [new TextRun({ 
                            text: data.author, 
                            size: 24, // 12pt
                            bold: true,
                            font: "Times New Roman"
                        })],
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 500 }
                    }),
                    
                    // Add all sections
                    ...sections
                ]
            }]
        });

        // Generate and download the document
        const blob = await Packer.toBlob(doc);
        const fileName = `${(data.title || 'Islamic_Insight_Article').replace(/[^a-z0-9]/gi, '_').toLowerCase()}.docx`;
        
        // Use FileSaver to download
        saveAs(blob, fileName);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    const generator = new ArticleGenerator();
    
    // Add additional functionality for Islamic terms handling
    generator.formatIslamicTerms = function(text) {
        // Common Islamic terms that should be italicized
        const islamicTerms = [
            'Ḥadīth', 'ḥadīth', 'Qurʾān', 'Sunnah', 'isnād', 'kashf', 'ilhām', 
            'sharīʿa', 'ṣaḥābī', 'tābiʿ', 'Takhrīj', 'mawḍūʿ', 'ṣaḥīḥ',
            'ḥasan', 'ḍaʿīf', 'mursal', 'musnad', 'mutawātir', 'āḥād',
            'riwāya', 'dirāya', 'matn', 'sanad', 'jarḥ', 'taʿdīl'
        ];
        
        let formatted = text;
        islamicTerms.forEach(term => {
            const regex = new RegExp(`\\b${term}\\b`, 'g');
            formatted = formatted.replace(regex, `<em>${term}</em>`);
        });
        
        return formatted;
    };
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

// Add print functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add print button functionality
    const printBtn = document.createElement('button');
    printBtn.innerHTML = '<i class="fas fa-print mr-2"></i>Print Article';
    printBtn.className = 'btn btn-secondary ml-2';
    printBtn.addEventListener('click', function() {
        window.print();
    });
    
    // Insert print button after download button
    const downloadBtn = document.getElementById('download-btn');
    if (downloadBtn && downloadBtn.parentNode) {
        downloadBtn.parentNode.insertBefore(printBtn, downloadBtn.nextSibling);
    }
});
