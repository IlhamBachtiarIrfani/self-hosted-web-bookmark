import Bookmarks from 'models/bookmarks';
import Tags from 'models/tags';
import BookmarkTags from 'models/bookmarkTags';
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
    dialect: 'mysql',
    host: 'localhost',
    port: 13306,
    username: 'root',
    password: 'moimeowrootpassword',
    database: 'webBookmarkDB',
    logging: false,
});

export default sequelize;