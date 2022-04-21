'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    // return  queryInterface.addColumn(
    //   'contatos', // name of Source model
    //   'data_nascimento', // name of the key we're adding 
    //   {
    //     type: Sequelize.DATE,
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
