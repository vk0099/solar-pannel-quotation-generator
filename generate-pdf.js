
/**
 * Example Puppeteer script to generate a PDF.
 * To run: 
 * 1. npm install puppeteer
 * 2. node generate-pdf.js
 */

const puppeteer = require('puppeteer');

async function generateQuotationPDF() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  // 1. Navigate to your app (replace with your local dev URL or a static file path)
  // For static files: await page.goto(`file://${path.join(__dirname, 'index.html')}`, { waitUntil: 'networkidle0' });
  await page.goto('http://localhost:3000', { 
    waitUntil: 'networkidle0' // Wait for React to finish rendering
  });

  // 2. Generate the PDF with professional options
  await page.pdf({
    path: 'Solar_Quotation.pdf',
    format: 'A4',
    printBackground: true, // IMPORTANT: Must be true for Tailwind backgrounds
    displayHeaderFooter: true,
    
    // Header Template: Injected on top of every page
    headerTemplate: `
      <div style="font-size: 10px; width: 100%; border-bottom: 1px solid #eee; padding: 10px 40px; display: flex; justify-content: space-between; font-family: 'Inter', sans-serif;">
        <span style="color: #666;">Aashika Solar Systems - Official Quotation</span>
        <span class="date" style="color: #999;"></span>
      </div>
    `,

    // Footer Template: Injected at the bottom of every page
    footerTemplate: `
      <div style="font-size: 9px; width: 100%; padding: 10px 40px; display: flex; justify-content: space-between; color: #777; font-family: 'Inter', sans-serif;">
        <span>Contact: +91-9966995752 | aashikasolarsystemsatp@gmail.com</span>
        <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
      </div>
    `,

    margin: {
      top: '60px',    // Leave space for the headerTemplate
      bottom: '60px', // Leave space for the footerTemplate
      left: '0px',
      right: '0px'
    }
  });

  console.log('PDF Generated Successfully: Solar_Quotation.pdf');
  await browser.close();
}

// generateQuotationPDF();
