'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    
    return  [queryInterface.addColumn(
      'eventos', // name of Source model
      'responsavel_id', // name of the key we're adding 
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'contatos', // name of Target model
          key: 'id', // key in Target model that we're referencing
        },
      }
    )],

    [queryInterface.addColumn(
      'eventos', // name of Source model
      'solicitante_id', // name of the key we're adding 
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'contatos', // name of Target model
          key: 'id', // key in Target model that we're referencing
        },
      }
    )]
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
