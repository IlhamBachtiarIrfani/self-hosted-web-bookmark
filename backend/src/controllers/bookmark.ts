import { Request, Response } from "express";
import { Op } from 'sequelize';

import Bookmarks from "../models/bookmarks";
import Tags from "../models/tags";
import BookmarkTags from "../models/bookmarkTags";
import { getWebProperties } from "../utils/webProps";
import sequelize from "sequelize";
import EventEmitter from "events";

export const eventEmitter = new EventEmitter();

export async function getAllBookmark(req: Request, res: Response) {
    eventEmitter.emit('update', { function: 'getData' });

    const search = req.query.search as string;
    const tags = req.query.tags as string[];

    const limit = Number(req.query.limit as string ?? 10);
    const page = Number(req.query.page as string ?? 0);

    const sortBy = req.query.sortBy as string ?? 'createdAt';
    const sortOrder = req.query.sortOrder as string ?? 'DESC';

    const searchWhere: any = {}
    const tagsWhere: any = {}
    let where: any = {}

    if (sortBy && !['TITLE', 'CREATEDAT', 'UPDATEDAT'].includes(sortBy.toUpperCase())) {
        return res.status(400).send({ error: 'Invalid sortBy value' });
    }

    if (sortOrder && !['ASC', 'DESC'].includes(sortOrder.toUpperCase())) {
        return res.status(400).send({ error: 'Invalid sortOrder value' });
    }

    if (search) {
        searchWhere[Op.or] = [
            sequelize.where(sequelize.fn('LOWER', sequelize.col('title')), 'LIKE', `%${search.toLowerCase()}%`),
            sequelize.where(sequelize.fn('LOWER', sequelize.col('url')), 'LIKE', `%${search.toLowerCase()}%`),
            sequelize.where(sequelize.fn('LOWER', sequelize.col('pageTitle')), 'LIKE', `%${search.toLowerCase()}%`),
            sequelize.where(sequelize.fn('LOWER', sequelize.col('description')), 'LIKE', `%${search.toLowerCase()}%`),
        ]

        where = searchWhere;
    }

    if (tags) {
        const tagConditions: any[] = [];
        for (const tag of tags) {
            tagConditions.push(
                sequelize.where(
                    sequelize.fn('LOWER', sequelize.col('tags.name')),
                    'LIKE',
                    `%${tag.toLowerCase()}%`
                )
            );

            tagConditions.push(
                sequelize.where(
                    sequelize.fn('LOWER', sequelize.col('tags.id')),
                    `${tag.toLowerCase()}`
                )
            );
        }
        tagsWhere[Op.or] = tagConditions;

        where = tagsWhere;
    }

    if (tags && search) {
        where = {}
        where[Op.and] = [searchWhere, tagsWhere];
    }

    const bookmarks = await Bookmarks.findAll({
        include: [
            {
                model: Tags,
                as: "tags",
                through: { attributes: [] },
            },
        ],
        order: [[sortBy, sortOrder]],
        where,
        limit: limit,
        offset: limit * page,
    });

    const result = bookmarks.map((item, index) => {
        let itemData = item;

        if (itemData.favicon) itemData.favicon = req.baseUrl + itemData.favicon;
        if (itemData.screenshot) itemData.screenshot = req.baseUrl + itemData.screenshot;
        if (itemData.thumbnail) itemData.thumbnail = req.baseUrl + itemData.thumbnail;

        return itemData;
    })

    return res.status(200).json(result);
}

export async function getBookmarkById(req: Request, res: Response) {
    eventEmitter.emit('update', { function: 'getDataById' });

    const id = req.params.id;

    const bookmark = await Bookmarks.findByPk(id, {
        include: [
            {
                model: Tags,
                as: "tags",
                through: { attributes: [] },
            },
        ],
    });

    if (!bookmark) {
        return res.status(404).send('Bookmark not found');
    }

    let itemData = bookmark;

    if (itemData.favicon) itemData.favicon = req.baseUrl + itemData.favicon;
    if (itemData.screenshot) itemData.screenshot = req.baseUrl + itemData.screenshot;
    if (itemData.thumbnail) itemData.thumbnail = req.baseUrl + itemData.thumbnail;

    return res.status(200).json(itemData);
}

export async function refreshBookmark(req: Request, res: Response) {
    eventEmitter.emit('update', { function: 'getDataById' });

    const id = req.params.id;

    const bookmark = await Bookmarks.findByPk(id, {
        include: [
            {
                model: Tags,
                as: "tags",
                through: { attributes: [] },
            },
        ],
    });

    if (!bookmark) {
        return res.status(404).send('Bookmark not found');
    }

    res.status(200).send('Bookmark will update');
    eventEmitter.emit('update', { notification: 'dataUpdated', detail: 'bookmarkRefresh' });

    getWebProperties(req, bookmark.url, bookmark);
}

export async function deleteBookmark(req: Request, res: Response) {
    eventEmitter.emit('update', { function: 'deleteData' });

    const id = req.params.id;

    const bookmark = await Bookmarks.findByPk(id);

    if (!bookmark) {
        return res.status(404).send('Bookmark not found');
    }

    bookmark.destroy();

    eventEmitter.emit('update', { notification: 'dataUpdated', detail: 'bookmarkDeleted' });

    return res.status(200).send('Bookmark deleted');
}

export async function restoreBookmark(req: Request, res: Response) {
    eventEmitter.emit('update', { function: 'restoreData' });

    const id = req.params.id;

    const bookmark = await Bookmarks.findByPk(id, { paranoid: false });

    if (!bookmark) {
        return res.status(404).send('Bookmark not found');
    }

    bookmark.restore();

    eventEmitter.emit('update', { notification: 'dataUpdated', detail: 'bookmarkRestored' });

    return res.status(200).send('Bookmark restored');
}

export async function updateBookmark(req: Request, res: Response) {
    eventEmitter.emit('update', { function: 'updateData' });

    const id = req.params.id;

    const title = req.body.title as string;
    const tags = req.body.tags as string[];

    if (!title) {
        console.log(req.body);
        return res.status(400).send('Params not complete');
    }

    const bookmark = await Bookmarks.findByPk(id);

    if (!bookmark) {
        return res.status(404).send('Bookmark not found');
    }

    if (Array.isArray(tags)) {
        const tagsNotInList = await Tags.findAll({
            include: [
                {
                    model: Bookmarks,
                    as: "bookmarks",
                    where: {
                        id: bookmark.id
                    }
                },
            ],
            where: {
                name: {
                    [Op.notIn]: tags
                }
            }
        });

        tagsNotInList.map(async (tagData) => {
            const bookmarkTagData = await BookmarkTags.findOne({
                where: {
                    bookmarkId: bookmark.id,
                    tagId: tagData.id,
                }
            });

            await bookmarkTagData.destroy();
        })

        await tags.map(async (tagData) => {
            await findOrCreateBookmarkTag(bookmark.id, tagData);
        });
    }

    await bookmark.update({ title: title });
    await bookmark.reload();

    eventEmitter.emit('update', { notification: 'dataUpdated', detail: 'bookmarkUpdated' });

    return res.status(200).send(bookmark);

}

export async function createBookmark(req: Request, res: Response) {
    eventEmitter.emit('update', { function: 'addData' });

    const title = req.body.title as string;
    const url = req.body.url as string;
    const tags = req.body.tags as string[];

    console.log("InsertData");

    if (!title || !url) {
        console.log(req.body);
        return res.status(400).send('Params not complete');
    }

    if (tags && !Array.isArray(tags)) {
        return res.status(400).send('Tags must be an array of strings');
    }

    const bookmark = await Bookmarks.create({
        title,
        url,
    });

    if (Array.isArray(tags)) {
        await tags.map(async (tagData) => {
            await findOrCreateBookmarkTag(bookmark.id, tagData);
        });
    }

    await bookmark.reload();
    res.status(201).json(bookmark);

    eventEmitter.emit('update', { notification: 'dataUpdated', detail: 'bookmarkCreated' });

    getWebProperties(req, url, bookmark);
}

async function findOrCreateBookmarkTag(bookmarkId: string, tagData: string) {
    const [tag, tagCreated] = await Tags.findOrCreate({
        where: {
            name: tagData
        },
        defaults: {
            name: tagData
        },
        paranoid: false
    });

    if (tag.deletedAt) {
        await tag.restore();
    }

    const [bookmarkTag, bookmarkCreated] = await BookmarkTags.findOrCreate({
        where: {
            bookmarkId: bookmarkId,
            tagId: tag.id,
        },
        defaults: {
            bookmarkId: bookmarkId,
            tagId: tag.id,
        },
        paranoid: false
    });

    if (bookmarkTag.deletedAt) {
        await bookmarkTag.restore();
    }
}

export let subscribeBookmarkClients: Array<Response> = [];

export async function subscribeBookmark(req: Request, res: Response) {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    subscribeBookmarkClients.push(res);
    eventEmitter.emit('update', { data: "clientConnected" });

    req.on('close', function () {
        subscribeBookmarkClients = subscribeBookmarkClients.filter(function (client) {
            return client !== res;
        });
        eventEmitter.emit('update', { data: "clientDisconnected" });
    });
}

eventEmitter.on('update', (data) => {
    console.log("Event : " + JSON.stringify(data));

    subscribeBookmarkClients.forEach((client) => {
        client.write('data: ' + JSON.stringify(data) + '\n\n');
        client.flushHeaders();
    });
});