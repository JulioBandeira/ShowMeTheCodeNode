'use strict'

module.exports = (sequelize, DataTypes) => {

var convidado = sequelize.define('convidado', 
{
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },

    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },

    evento_id :
      {
        type: DataTypes.INTEGER,
        references: {
          model: 'eventos', // name of Target model
          key: 'id',
        },
    },

      contato_id :
      {
        type: DataTypes.INTEGER,
        references: {
          model: 'contatos', // name of Target model
          key: 'id',
        },
      }, 
})

 convidado.removeAttribute('id');

return convidado;

}