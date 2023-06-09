import { Request } from "express";
import ogs from 'open-graph-scraper';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { ImageObject } from "open-graph-scraper/dist/lib/types";

import { getBaseUrl, isValidUrl, takeScreenshot } from "../utils/common";

import Bookmark from "../models/bookmarks";
import { eventEmitter } from "../controllers/bookmark";

export async function getWebProperties(req: Request, url: string, bookmark: Bookmark) {
    console.log("Run in background")
    const filename = uuidv4();

    try {

        console.log("Get Web Meta");
        const data = await ogs({ url: url, timeout: 30000 });

        const baseUrl = getBaseUrl(url);

        const { result } = data;

        const { ogTitle, ogDescription, ogLocale, favicon, ogImage } = result;

        bookmark.update({
            pageTitle: ogTitle,
            description: ogDescription,
            locale: ogLocale,
        })

        eventEmitter.emit('update', { notification: 'dataUpdated', detail: 'newMeta' });

        if (favicon) {
            await getFavIcon(baseUrl, bookmark, filename, favicon);
        }

        if (ogImage && ogImage.length > 0) {
            await getWebImage(bookmark, filename, ogImage[0]);
        }
    } catch (err) {
        console.error("Cant Get Web Props : " + err?.toString());
    }

    await getScreenshotWeb(bookmark, filename, url)
}

async function getFavIcon(baseUrl: string, bookmark: Bookmark, filename: string, url: string) {
    try {
        if (!isValidUrl(url)) {
            url = `${baseUrl}/${url}`;
        }

        const favIconResponse = await fetch(url);

        if (!favIconResponse.ok) {
            return console.error(`Failed to download favicon: HTTP ${favIconResponse.status}`);
        }

        const favIconFilename = `/public/icon/${filename}.ico`;

        const buffer = await favIconResponse.arrayBuffer();
        await fs.promises.writeFile("." + favIconFilename, new DataView(buffer));

        console.log(`Saved favicon to ${favIconFilename}`);

        await bookmark.update({
            favicon: favIconFilename,
        })

        eventEmitter.emit('update', { notification: 'dataUpdated', detail: 'newFavicon' });
    } catch (err) {
        console.error(err);
        console.log("Can't save favicon : " + url);
    }
}

async function getWebImage(bookmark: Bookmark, filename: string, image: ImageObject) {
    try {
        const imageType = image.type;
        const imageFilename = `/public/image/${filename}.${imageType ?? 'webp'}`;

        const imageResponse = await fetch(image.url);

        if (!imageResponse.ok) {
            return console.error(`Failed to download favicon: HTTP ${imageResponse.status}`);
        }

        const buffer = await imageResponse.arrayBuffer();
        await fs.promises.writeFile("." + imageFilename, new DataView(buffer));

        console.log(`Saved Web Image to ${imageFilename}`);

        await bookmark.update({
            thumbnail: imageFilename,
        })

        eventEmitter.emit('update', { notification: 'dataUpdated', detail: 'newThumbnail' });

    } catch (err) {
        console.error(err);
        console.log("Can't save image : " + image.url);
    }
}

async function getScreenshotWeb(bookmark: Bookmark, filename: string, url: string) {
    try {
        const screenshot = await takeScreenshot(url);

        if (!screenshot) {
            return;
        }
        const screenshotFilename = `/public/screenshot/${filename}.webp`;

        await fs.promises.writeFile("." + screenshotFilename, screenshot);

        console.log(`Saved Web Image to ${screenshotFilename}`);

        await bookmark.update({
            screenshot: screenshotFilename,
        })

        eventEmitter.emit('update', { notification: 'dataUpdated', detail: 'newScreenshot' });
    } catch (err) {
        console.error(err);
        console.log("Can't save screenshot : " + url);
    }
}