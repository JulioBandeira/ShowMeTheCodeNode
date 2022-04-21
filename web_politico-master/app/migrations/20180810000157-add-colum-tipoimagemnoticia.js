'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return  queryInterface.addColumn(
      'conteudos', // name of Source model
      'tipo_noticia_img', // name of the key we're adding 
      {
        type: Sequelize.ENUM,
        values: ['destaque', 'comum'],
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
