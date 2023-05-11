import Bookmarks from 'models/bookmarks';
import Tags from 'models/tags';
import BookmarkTags from 'models/bookmarkTags';
import { Sequelize } from 'sequelize';
require('dotenv').config();

const sequelize = new Sequelize({
    dialect: 'mysql',
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port:Number(process.env.DB_PORT),
    logging: false,
});

export default sequelize;