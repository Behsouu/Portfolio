const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    page.on('console', msg => {
        console.log(`[PAGE CONSOLE] ${msg.type()}: ${msg.text()}`);
        if (msg.type() === 'error') {
            const location = msg.location();
            console.log(`Error Location: ${location.url}:${location.lineNumber}:${location.columnNumber}`);
        }
    });

    page.on('pageerror', error => {
        console.log(`[PAGE ERROR] ${error.message}`);
    });

    await page.goto('http://127.0.0.1:8086/index.html');
    console.log("Page loaded. Clicking RPG button...");

    await page.click('#rpg-mode-btn');
    // wait a bit for scene to load
    await page.waitForTimeout(3000);

    await browser.close();
})();
