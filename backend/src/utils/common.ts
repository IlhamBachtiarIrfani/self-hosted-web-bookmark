import puppeteer from 'puppeteer';

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
    console.log("Taking Screenshot");
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    await page.setViewport({
        width: 1366,
        height: 768
    });

    await page.goto(url, { waitUntil: 'networkidle0', timeout: 120000 });
    const screenshot = await page.screenshot({ type: 'webp' });

    await browser.close();

    return screenshot;
}