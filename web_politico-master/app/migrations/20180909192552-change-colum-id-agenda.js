'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return  queryInterface.changeColumn(
      'eventos', // name of Source model
      'id', // name of the key we're adding 
      {
        autoIncrement: true,
        primaryKey : true,
        type: Sequelize.INTEGER,
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
