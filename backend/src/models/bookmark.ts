import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Bookmark extends Model {
    public id!: number;
    public title!: string;
    public url!: string;
    public thumbnail!: string | null;
    public favicon!: string | null;
    public pageTitle!: string | null;
    public image!: string | null;
    public description!: string | null;
    public locale!: string | null;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date | null;
}

Bookmark.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    thumbnail: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    favicon: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    pageTitle: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    locale: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'Bookmark',
    timestamps: true,
    paranoid: true, // add this
});

export default Bookmark;