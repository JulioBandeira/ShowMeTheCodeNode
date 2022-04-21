'use strict'

module.exports = (sequelize, DataTypes) => {
 
    
var Grupo_Tag = sequelize.define('grupo_tag', {

    descricao : DataTypes.STRING,

    status : {
      type :  DataTypes.BOOLEAN,
      defaultValue: 1,
  } 
   
  });
 
  Grupo_Tag.associate = models => {
   

    Grupo_Tag.hasMany(models.tag);

  };
  
    return Grupo_Tag;
} ;