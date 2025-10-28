const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const multer = require('multer');
const path = require('path');
const PDFBot = require('./pdf-bot');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize PDF Bot
const pdfBot = new PDFBot({
    outputDir: './generated-pdfs',
    defaultFormat: 'A4'
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Configure multer for file uploads
const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['application/pdf', 'text/html', 'text/plain'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'), false);
        }
    }
});

// Routes

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Generate PDF from HTML
app.post('/api/generate/html', async (req, res) => {
    try {
        const { html, filename = 'output.pdf', options = {} } = req.body;
        
        if (!html) {
            return res.status(400).json({ error: 'HTML content is required' });
        }
        
        const result = await pdfBot.generateFromHTML(html, filename, options);
        res.json({
            message: 'PDF generated successfully',
            ...result
        });
    } catch (error) {
        console.error('HTML to PDF error:', error);
        res.status(500).json({ error: 'Failed to generate PDF from HTML' });
    }
});

// Generate PDF from text
app.post('/api/generate/text', async (req, res) => {
    try {
        const { text, filename = 'text-output.pdf', options = {} } = req.body;
        
        if (!text) {
            return res.status(400).json({ error: 'Text content is required' });
        }
        
        const result = await pdfBot.generateFromText(text, filename, options);
        res.json({
            message: 'PDF generated successfully from text',
            ...result
        });
    } catch (error) {
        console.error('Text to PDF error:', error);
        res.status(500).json({ error: 'Failed to generate PDF from text' });
    }
});

// Merge PDFs
app.post('/api/merge', upload.array('pdfs', 10), async (req, res) => {
    try {
        const { filename = 'merged.pdf' } = req.body;
        
        if (!req.files || req.files.length < 2) {
            return res.status(400).json({ error: 'At least 2 PDF files are required' });
        }
        
        const pdfPaths = req.files.map(file => file.path);
        const result = await pdfBot.mergePDFs(pdfPaths, filename);
        
        res.json({
            message: 'PDFs merged successfully',
            ...result
        });
    } catch (error) {
        console.error('PDF merge error:', error);
        res.status(500).json({ error: 'Failed to merge PDFs' });
    }
});

// Extract text from PDF
app.post('/api/extract', upload.single('pdf'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'PDF file is required' });
        }
        
        const result = await pdfBot.extractText(req.file.path);
        res.json({
            message: 'Text extracted successfully',
            ...result
        });
    } catch (error) {
        console.error('Text extraction error:', error);
        res.status(500).json({ error: 'Failed to extract text from PDF' });
    }
});

// Add watermark
app.post('/api/watermark', upload.single('pdf'), async (req, res) => {
    try {
        const { 
            watermarkText, 
            filename = 'watermarked.pdf',
            opacity = 0.3,
            fontSize = 50
        } = req.body;
        
        if (!req.file || !watermarkText) {
            return res.status(400).json({ error: 'PDF file and watermark text are required' });
        }
        
        const result = await pdfBot.addWatermark(
            req.file.path, 
            watermarkText, 
            filename,
            { opacity: parseFloat(opacity), fontSize: parseInt(fontSize) }
        );
        
        res.json({
            message: 'Watermark added successfully',
            ...result
        });
    } catch (error) {
        console.error('Watermark error:', error);
        res.status(500).json({ error: 'Failed to add watermark' });
    }
});

// Get list of generated files
app.get('/api/files', (req, res) => {
    try {
        const files = pdfBot.getGeneratedFiles();
        res.json({ files });
    } catch (error) {
        console.error('File list error:', error);
        res.status(500).json({ error: 'Failed to get file list' });
    }
});

// Download generated PDF
app.get('/api/download/:filename', (req, res) => {
    try {
        const filename = req.params.filename;
        const filePath = path.join('./generated-pdfs', filename);
        
        res.download(filePath, filename, (err) => {
            if (err) {
                console.error('Download error:', err);
                res.status(404).json({ error: 'File not found' });
            }
        });
    } catch (error) {
        console.error('Download error:', error);
        res.status(500).json({ error: 'Download failed' });
    }
});

// Serve static files (for web interface)
app.use(express.static('public'));

// API documentation endpoint
app.get('/api/docs', (req, res) => {
    res.json({
        name: 'PDF Generate Bot API',
        version: '1.0.0',
        endpoints: {
            'POST /api/generate/html': 'Generate PDF from HTML',
            'POST /api/generate/text': 'Generate PDF from text',
            'POST /api/merge': 'Merge multiple PDFs',
            'POST /api/extract': 'Extract text from PDF',
            'POST /api/watermark': 'Add watermark to PDF',
            'GET /api/files': 'List generated files',
            'GET /api/download/:filename': 'Download generated PDF',
            'GET /health': 'Health check'
        }
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 PDF Generate Bot server is running on port ${PORT}`);
    console.log(`📖 API Documentation: http://localhost:${PORT}/api/docs`);
    console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
});

module.exports = app;