import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import Bookmark from './bookmark';
import BookmarkTag from './bookmarkTag';

class Tag extends Model {
    public id!: number;
    public name!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date | null;
}

Tag.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'Tag',
    timestamps: true,
    paranoid: true,
});

export default Tag;