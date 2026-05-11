const puppeteer = require('puppeteer');

async function generatePdf(html) {
    const browser = await puppeteer.launch({
        executablePath: process.env.NODE_ENV === 'production' ? '/usr/bin/chromium-browser' : undefined,
        args: process.env.NODE_ENV === 'production'
            ? ['--no-sandbox', '--disable-setuid-sandbox']
            : [],
        headless: true
    });
    const page = await browser.newPage()

    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' }
    });

    await browser.close();

    return pdf;
};

module.exports = { generatePdf }