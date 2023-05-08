import puppeteer, { Browser } from 'puppeteer';

export function getBaseUrl(urlString: string) {
    const parsedUrl = new URL(urlString);
    return parsedUrl.origin;
}

export function isValidUrl(urlString: string) {
    try {
        new URL(urlString);
        return true;
    } catch (error) {
        return false;
    }
}

export async function takeScreenshot(url) {
    let browser: Browser | null = null;
    try {
        console.log("Taking Screenshot");
        browser = await puppeteer.launch({
            headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox']
            , executablePath: '/usr/bin/google-chrome-stable'
        });
        const page = await browser.newPage();

        await page.setViewport({
            width: 1366,
            height: 768
        });

        await page.goto(url, { waitUntil: 'networkidle0', timeout: 120000 });
        const screenshot = await page.screenshot({ type: 'webp' });
        return screenshot;
    } catch (err) {
        console.error("Cant Run Puppeteer : " + err.toString());
    } finally {
        if (browser)
            await browser.close();
    }
}