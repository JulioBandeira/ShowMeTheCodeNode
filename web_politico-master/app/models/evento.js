'use strict'

module.exports = (sequelize, DataTypes) => {
 
var Evento = sequelize.define('evento', {
    
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      }, 
    
      responsavel_id :
      {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
        references: {
          model: 'contatos', // name of Target model
          key: 'id', // key in Target model that we're referencin
        },
      },
      
      solicitante_id :
      {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
        references: {
          model: 'contatos', // name of Target model
          key: 'id',
        },
      },

    title : DataTypes.STRING,
    description : DataTypes.STRING,
    start : DataTypes.DATE,
    end : DataTypes.DATE,
    is_realizado : {
      type :  DataTypes.BOOLEAN,
    },
    status : {
        type: DataTypes.ENUM,
        values:  ['a_confirmar', 'confirmado', 'cancelado', 'excluido'],
        //defaultValue: ['a_confirmar'],
    }, 
  });

  Evento.associate = function(models){
      //   Evento.hasMany(models.contato, {foreignKey: 'solicitante_id' });
       //  db.contato.hasMany(db.evento, { foreignKey: 'solicitante_id' });
    }

    return Evento;
}
