import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import Bookmarks from './bookmarks';
import Tags from './tags';

export default class BookmarkTags extends Model {
    public bookmarkId!: string;
    public tagId!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date | null;
}

BookmarkTags.init({
    bookmarkId: {
        type: DataTypes.UUID,
        primaryKey: true,
    },
    tagId: {
        type: DataTypes.UUID,
        primaryKey: true,
    },
}, {
    sequelize,
    timestamps: true,
    paranoid: true,
    modelName: 'BookmarkTags',
});

Bookmarks.belongsToMany(Tags, {
    through: BookmarkTags,
    foreignKey: "bookmarkId",
    as: "tags"
});
Tags.belongsToMany(Bookmarks, {
    through: BookmarkTags,
    foreignKey: "tagId",
    as: "bookmarks"
});