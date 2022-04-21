'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    
    return [ queryInterface.addColumn(
      'contatos', // name of Source model
      'indicacao', // name of the key we're adding 
      {
        //latitude DECIMAL(10, 8), 
        //Longitude DECIMAL(11, 8)
        type: Sequelize.INTEGER,
      }
    ),

    queryInterface.addColumn(
      'contatos', // name of Source model
      'facebook', // name of the key we're adding 
      {
        type: Sequelize.STRING,
      }
    ),

  ]

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
