'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    // return  queryInterface.addColumn(
    //   'eventos', // name of Source model
    //   'is_realizado', // name of the key we're adding 
    //   {
    //     type: Sequelize.BOOLEAN,
    //   }
    // )
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
