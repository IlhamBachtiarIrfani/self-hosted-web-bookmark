import { Request, Response } from "express";
import ogs from 'open-graph-scraper';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { ImageObject } from "open-graph-scraper/dist/lib/types";

import { getBaseUrl, isValidUrl, takeScreenshot } from "../utils/common";

import Bookmark from "../models/bookmark";
import Tag from "../models/tag";
import BookmarkTag from "../models/bookmarkTag";


Bookmark.belongsToMany(Tag, { through: BookmarkTag, as: 'tags' });
Tag.belongsToMany(Bookmark, { through: BookmarkTag, as: 'tags' });

let subscribeBookmarkClients: Array<Response> = [];

async function sendUpdates(baseUrl: string) {
    const bookmarks = await Bookmark.findAll({
        include: {
            model: Tag, as: 'tags',
            attributes: ['id', 'name'],
            through: { attributes: [] }
        },
        order: [['id', 'DESC']]
    });

    const result = bookmarks.map((item, index) => {
        let itemData = item;

        if (itemData.favicon) itemData.favicon = baseUrl + itemData.favicon;
        if (itemData.image) itemData.image = baseUrl + itemData.image;
        if (itemData.thumbnail) itemData.thumbnail = baseUrl + itemData.thumbnail;

        return itemData;
    })

    subscribeBookmarkClients.forEach(function (client) {
        client.write('data: ' + JSON.stringify(result) + '\n\n');
        client.flushHeaders();
    });
}

export async function subscribeBookmark(req: Request, res: Response) {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    subscribeBookmarkClients.push(res);
    sendUpdates(req.baseUrl);

    req.on('close', function () {
        subscribeBookmarkClients = subscribeBookmarkClients.filter(function (client) {
            return client !== res;
        });
        console.log('Client disconnected.');
    });
}

export async function getAllBookmark(req: Request, res: Response) {
    const bookmarks = await Bookmark.findAll();

    res.json(bookmarks);
}

export async function createBookmark(req: Request, res: Response) {
    const { title, url, tags } = req.body;

    console.log("InsertData");

    if (!title || !url) {
        return res.status(400).send('Params not complete');
    }

    if (tags && !Array.isArray(tags)) {
        return res.status(400).send('Tags must be an array of strings');
    }

    const bookmark = await Bookmark.create({
        title,
        url,
    });

    if (Array.isArray(tags)) {
        await tags.map(async (tagData) => {
            console.log(tagData);

            const [tag, created] = await Tag.findOrCreate({
                where: {
                    name: tagData
                },
                defaults: {
                    name: tagData
                }
            });

            if (created) {
                console.log("New tag created");
            }

            await BookmarkTag.create({
                bookmarkId: bookmark.id,
                tagId: tag.id,
            })
        });
    }

    sendUpdates(req.baseUrl);

    await bookmark.reload();
    res.json(bookmark);

    getWebProperties(req, url, bookmark);
}
async function getWebProperties(req: Request, url: string, bookmark: Bookmark) {
    try {
        console.log("Run in background")
        const filename = uuidv4();
        const data = await ogs({ url: url, timeout: 30000 });
        const baseUrl = getBaseUrl(url);

        const { result } = data;

        const { ogTitle, ogDescription, ogLocale, favicon, ogImage } = result;

        bookmark.update({
            pageTitle: ogTitle,
            description: ogDescription,
            locale: ogLocale,
        })

        if (favicon) {
            await getFavIcon(baseUrl, bookmark, filename, favicon);
        }

        if (ogImage && ogImage.length > 0) {
            await getWebImage(bookmark, filename, ogImage[0]);
        }

        sendUpdates(req.baseUrl);

        await getScreenshotWeb(bookmark, filename, url)

        sendUpdates(req.baseUrl);
    } catch (err) {
        console.error(err);
    }
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
            image: imageFilename,
        })

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
            thumbnail: screenshotFilename,
        })
    } catch (err) {
        console.error(err);
        console.log("Can't save screenshot : " + url);
    }
}