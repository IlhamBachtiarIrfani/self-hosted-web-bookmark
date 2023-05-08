import { Sequelize } from 'sequelize';
const sequelize = new Sequelize({
    dialect: 'mysql',
    host: 'database',
    port: 3306,
    username: 'root',
    password: 'moimeowrootpassword',
    database: 'webBookmarkDB',
    logging: false,
});

export default sequelize;