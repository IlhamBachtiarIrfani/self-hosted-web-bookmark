'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Bookmarks', 'pageTitle', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'favicon'
    });

    await queryInterface.addColumn('Bookmarks', 'image', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'pageTitle'
    });

    await queryInterface.addColumn('Bookmarks', 'description', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'image'
    });

    await queryInterface.addColumn('Bookmarks', 'locale', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'description'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Bookmarks', 'pageTitle');
    await queryInterface.removeColumn('Bookmarks', 'image');
    await queryInterface.removeColumn('Bookmarks', 'description');
    await queryInterface.removeColumn('Bookmarks', 'locale');
  }
};
