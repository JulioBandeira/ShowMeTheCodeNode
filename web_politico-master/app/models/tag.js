'use strict'

module.exports = (sequelize, DataTypes) => {
 
    
var Tag = sequelize.define('tag', {

    descricao : DataTypes.STRING,
    grupo_tag_id : {
        type: DataTypes.INTEGER,
        references: {
          model: 'grupo_tags', // name of Target model
          key: 'id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
    },

    status : {
        type :  DataTypes.BOOLEAN,
        defaultValue: 1,
    } 
  });

    Tag.associate = function(models){
        Tag.belongsToMany(models.contato, { through: 'contato_tags'})
    }

    return Tag;
}

//db.tag.belongsTo(db.grupo_tag, {foreignKey : 'fk_grupo_tag'});