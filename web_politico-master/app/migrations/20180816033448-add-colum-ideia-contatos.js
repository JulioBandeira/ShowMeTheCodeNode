'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return  queryInterface.addColumn(
      'contatos', // name of Source model
      'ideia', // name of the key we're adding 
      {
        type: Sequelize.TEXT,
       // type :  Sequelize.BOOLEAN,
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
