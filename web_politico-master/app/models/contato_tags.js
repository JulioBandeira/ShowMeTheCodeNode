'use strict'

module.exports = (sequelize, DataTypes) => {

var Contato_Tags = sequelize.define('contato_tag', 
{
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },

    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },

    TagId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },

    ContatoId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },     

}

)

return Contato_Tags;

}