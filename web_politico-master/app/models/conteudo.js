'use strict'

module.exports = (sequelize, DataTypes) => {
 
var Conteudo = sequelize.define('conteudo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  }, 
  titulo : DataTypes.STRING,
  path : DataTypes.TEXT,
  conteudo :  DataTypes.TEXT, 
  tipo : { 
    type : DataTypes.ENUM,
    values:  ['estatico', 'noticia'],
  },
  tipo_noticia_img : { 
    type : DataTypes.ENUM,
    values:  ['destaque', 'comum'],
  },
  createdAt : DataTypes.DATE,
  updatedAt : DataTypes.DATE,
  status : {
        type: DataTypes.ENUM,
        values:  ['ativo', 'inativo'],
    }, 
  });

  Conteudo.associate = function(models){
      
    }
    
  return Conteudo;
}
