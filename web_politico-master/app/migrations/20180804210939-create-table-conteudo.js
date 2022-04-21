'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */

   return queryInterface.createTable('conteudos', {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
          }, 
          titulo : Sequelize.STRING,
          conteudo : Sequelize.STRING,
          createdAt : Sequelize.DATE,
          updatedAt : Sequelize.DATE,
          status : {
              type: Sequelize.ENUM,
              values:  ['ativo', 'inativo'],
          }, 
       });
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
