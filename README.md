# PDF Generate Bot

## Overview
This is a PDF generation bot that can create PDF documents from various input sources.

## Features
- Generate PDFs from HTML content
- Convert text to PDF
- Merge multiple PDFs
- Add watermarks to PDFs
- Extract text from existing PDFs

## Installation
```bash
npm install
# or
pip install -r requirements.txt
```

## Usage

### Basic PDF Generation
```javascript
const pdfBot = require('./pdf-bot');

// Generate PDF from HTML
pdfBot.generateFromHTML('<h1>Hello World</h1>', 'output.pdf');

// Generate PDF from text
pdfBot.generateFromText('Simple text content', 'text-output.pdf');
```

### Advanced Features
```javascript
// Add watermark
pdfBot.addWatermark('input.pdf', 'watermark.png', 'output.pdf');

// Merge PDFs
pdfBot.mergePDFs(['file1.pdf', 'file2.pdf'], 'merged.pdf');

// Extract text
const text = pdfBot.extractText('document.pdf');
console.log(text);
```

## Configuration
Create a `config.json` file:
```json
{
  "outputDir": "./generated-pdfs",
  "defaultFormat": "A4",
  "quality": "high",
  "watermark": {
    "enabled": false,
    "opacity": 0.3
  }
}
```

## API Endpoints
- `POST /generate` - Generate PDF from content
- `POST /merge` - Merge multiple PDFs
- `GET /extract/:filename` - Extract text from PDF
- `POST /watermark` - Add watermark to PDF

## Examples
See the `/examples` directory for sample implementations.

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License
MIT License - see LICENSE file for details

## Support
For issues and questions, please open a GitHub issue.