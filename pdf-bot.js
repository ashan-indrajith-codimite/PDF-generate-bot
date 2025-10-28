const fs = require('fs');
const puppeteer = require('puppeteer');
const PDFDocument = require('pdfkit');
const path = require('path');

class PDFBot {
    constructor(config = {}) {
        this.config = {
            outputDir: config.outputDir || './generated-pdfs',
            defaultFormat: config.defaultFormat || 'A4',
            quality: config.quality || 'high',
            ...config
        };
        
        // Ensure output directory exists
        if (!fs.existsSync(this.config.outputDir)) {
            fs.mkdirSync(this.config.outputDir, { recursive: true });
        }
    }

    /**
     * Generate PDF from HTML content
     * @param {string} htmlContent - HTML content to convert
     * @param {string} outputPath - Output file path
     * @param {object} options - PDF generation options
     */
    async generateFromHTML(htmlContent, outputPath, options = {}) {
        try {
            const browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            
            const page = await browser.newPage();
            await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
            
            const pdfOptions = {
                format: options.format || this.config.defaultFormat,
                path: path.join(this.config.outputDir, outputPath),
                printBackground: true,
                margin: {
                    top: '20px',
                    bottom: '20px',
                    left: '20px',
                    right: '20px'
                },
                ...options
            };
            
            await page.pdf(pdfOptions);
            await browser.close();
            
            console.log(`PDF generated successfully: ${outputPath}`);
            return { success: true, path: pdfOptions.path };
        } catch (error) {
            console.error('Error generating PDF from HTML:', error);
            throw error;
        }
    }

    /**
     * Generate PDF from plain text
     * @param {string} text - Text content
     * @param {string} outputPath - Output file path
     * @param {object} options - PDF generation options
     */
    generateFromText(text, outputPath, options = {}) {
        return new Promise((resolve, reject) => {
            try {
                const doc = new PDFDocument({
                    size: options.size || this.config.defaultFormat,
                    margins: {
                        top: 50,
                        bottom: 50,
                        left: 50,
                        right: 50
                    }
                });
                
                const fullPath = path.join(this.config.outputDir, outputPath);
                const stream = fs.createWriteStream(fullPath);
                doc.pipe(stream);
                
                // Add title if provided
                if (options.title) {
                    doc.fontSize(20).text(options.title, {
                        align: 'center'
                    });
                    doc.moveDown(2);
                }
                
                // Add main text
                doc.fontSize(12).text(text, {
                    align: 'left',
                    lineGap: 5
                });
                
                doc.end();
                
                stream.on('finish', () => {
                    console.log(`Text PDF generated successfully: ${outputPath}`);
                    resolve({ success: true, path: fullPath });
                });
                
                stream.on('error', reject);
            } catch (error) {
                console.error('Error generating PDF from text:', error);
                reject(error);
            }
        });
    }

    /**
     * Merge multiple PDF files
     * @param {string[]} pdfPaths - Array of PDF file paths
     * @param {string} outputPath - Output merged PDF path
     */
    async mergePDFs(pdfPaths, outputPath) {
        try {
            const PDFMerger = require('pdf-merger-js');
            const merger = new PDFMerger();
            
            for (const pdfPath of pdfPaths) {
                if (fs.existsSync(pdfPath)) {
                    await merger.add(pdfPath);
                } else {
                    console.warn(`PDF file not found: ${pdfPath}`);
                }
            }
            
            const fullPath = path.join(this.config.outputDir, outputPath);
            await merger.save(fullPath);
            
            console.log(`PDFs merged successfully: ${outputPath}`);
            return { success: true, path: fullPath };
        } catch (error) {
            console.error('Error merging PDFs:', error);
            throw error;
        }
    }

    /**
     * Extract text from PDF
     * @param {string} pdfPath - Path to PDF file
     */
    async extractText(pdfPath) {
        try {
            const pdfParse = require('pdf-parse');
            const dataBuffer = fs.readFileSync(pdfPath);
            const data = await pdfParse(dataBuffer);
            
            console.log(`Text extracted from: ${pdfPath}`);
            return {
                success: true,
                text: data.text,
                pages: data.numpages,
                info: data.info
            };
        } catch (error) {
            console.error('Error extracting text from PDF:', error);
            throw error;
        }
    }

    /**
     * Add watermark to PDF
     * @param {string} pdfPath - Input PDF path
     * @param {string} watermarkText - Watermark text
     * @param {string} outputPath - Output PDF path
     */
    async addWatermark(pdfPath, watermarkText, outputPath, options = {}) {
        try {
            const { PDFDocument: PDFLib, rgb, StandardFonts } = require('pdf-lib');
            
            const existingPdfBytes = fs.readFileSync(pdfPath);
            const pdfDoc = await PDFLib.load(existingPdfBytes);
            const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
            
            const pages = pdfDoc.getPages();
            
            pages.forEach(page => {
                const { width, height } = page.getSize();
                
                page.drawText(watermarkText, {
                    x: width / 2 - (watermarkText.length * 10),
                    y: height / 2,
                    size: options.fontSize || 50,
                    font: helveticaFont,
                    color: rgb(0.7, 0.7, 0.7),
                    opacity: options.opacity || 0.3,
                    rotate: options.rotate || { type: 'degrees', angle: 45 }
                });
            });
            
            const pdfBytes = await pdfDoc.save();
            const fullPath = path.join(this.config.outputDir, outputPath);
            fs.writeFileSync(fullPath, pdfBytes);
            
            console.log(`Watermark added successfully: ${outputPath}`);
            return { success: true, path: fullPath };
        } catch (error) {
            console.error('Error adding watermark:', error);
            throw error;
        }
    }

    /**
     * Get list of generated PDFs
     */
    getGeneratedFiles() {
        try {
            const files = fs.readdirSync(this.config.outputDir)
                .filter(file => path.extname(file).toLowerCase() === '.pdf')
                .map(file => ({
                    name: file,
                    path: path.join(this.config.outputDir, file),
                    size: fs.statSync(path.join(this.config.outputDir, file)).size,
                    created: fs.statSync(path.join(this.config.outputDir, file)).birthtime
                }));
            
            return files;
        } catch (error) {
            console.error('Error getting generated files:', error);
            return [];
        }
    }
}

module.exports = PDFBot;