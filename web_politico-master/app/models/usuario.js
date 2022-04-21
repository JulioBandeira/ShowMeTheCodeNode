'use strict'

module.exports = (sequelize, DataTypes) => {
 
    
var Usuario = sequelize.define('usuario', {

    nome : DataTypes.STRING,
    cpf : DataTypes.STRING,
    senha : DataTypes.STRING,
    role: {
        type: DataTypes.ENUM,
        values: ['user', 'admin']
      },

      status : {
        type : DataTypes.BOOLEAN,
        defaultValue: 1,
    } 
  });

    return Usuario;
} ;