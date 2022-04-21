'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   
    return [ queryInterface.addColumn(
      'contatos', // name of Source model
      'instagram', // name of the key we're adding 
      {
        type: Sequelize.STRING,
      }
    ),] 

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
