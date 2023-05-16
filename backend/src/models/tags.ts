import { BelongsToManyAddAssociationMixin, BelongsToManyGetAssociationsMixin, DataTypes, Model } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import sequelize from '../config/database';
import Bookmarks from './bookmarks';

export default class Tags extends Model {
    public id!: string;
    public name!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date | null;

    public readonly bookmarks?: Bookmarks[];

    public addBookmark!: BelongsToManyAddAssociationMixin<Bookmarks, number>;
    public getBookmarks!: BelongsToManyGetAssociationsMixin<Bookmarks>;
}

Tags.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize,
    timestamps: true,
    paranoid: true,
    modelName: 'Tags',
});

Tags.beforeCreate((tags: Tags) => (tags.id = uuidv4()));