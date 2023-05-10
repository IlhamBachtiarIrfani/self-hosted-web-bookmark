import { Request, Response } from "express";
import { Op } from 'sequelize';

import Bookmarks from "../models/bookmarks";
import Tags from "../models/tags";
import BookmarkTags from "../models/bookmarkTags";
import { getWebProperties } from "../utils/webProps";
import sequelize from "sequelize";

export async function getAllBookmark(req: Request, res: Response) {
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
                attributes: ["id", "name"],
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

export async function createBookmark(req: Request, res: Response) {
    const { title, url, tags } = req.body;

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
            console.log(tagData);

            const [tag, created] = await Tags.findOrCreate({
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

            await BookmarkTags.create({
                bookmarkId: bookmark.id,
                tagId: tag.id,
            })
        });
    }

    await bookmark.reload();
    res.status(201).json(bookmark);

    getWebProperties(req, url, bookmark);
}