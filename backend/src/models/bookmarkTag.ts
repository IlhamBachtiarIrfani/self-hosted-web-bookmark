import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import Bookmark from './bookmark';
import Tag from './tag';

class BookmarkTag extends Model {
    public id!: number;
    public title!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date | null;
}

BookmarkTag.init({
    bookmarkId: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER.UNSIGNED,
    },
    tagId: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER.UNSIGNED,
    },
}, {
    sequelize,
    modelName: 'Bookmark_Tag',
    timestamps: true,
    paranoid: true,
});

BookmarkTag.belongsTo(Bookmark, { foreignKey: 'bookmarkId' });
BookmarkTag.belongsTo(Tag, { foreignKey: 'tagId' });

export default BookmarkTag;