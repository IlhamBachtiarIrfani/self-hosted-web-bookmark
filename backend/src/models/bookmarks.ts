import { BelongsToManyAddAssociationMixin, BelongsToManyGetAssociationsMixin, DataTypes, Model } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import sequelize from '../config/database';
import Tags from './tags';

export default class Bookmarks extends Model {
    public id!: string;
    public title!: string;
    public url!: string;
    public pageTitle!: string | null;
    public thumbnail!: string | null;
    public screenshot!: string | null;
    public favicon!: string | null;
    public description!: string | null;
    public locale!: string | null;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt?: Date;

    public readonly tags?: Tags[];

    public addTag!: BelongsToManyAddAssociationMixin<Tags, number>;
    public getTags!: BelongsToManyGetAssociationsMixin<Tags>;
}

Bookmarks.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
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
    pageTitle: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    thumbnail: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    screenshot: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    favicon: {
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
    timestamps: true,
    paranoid: true,
    modelName: 'Bookmarks'
})

Bookmarks.beforeCreate((bookmark: Bookmarks) => (bookmark.id = uuidv4()));