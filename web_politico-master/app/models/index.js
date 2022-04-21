"use strict";
 
var fs = require("fs");
var path = require("path");
var Sequelize = require("sequelize");
var env = process.env.NODE_ENV || "development";
var config = require(path.join(__dirname, '..', 'config', 'config.json'))[env];
var sequelize = new Sequelize(config.database, config.username, config.password, config, {
    
    timezone: '-02:00' //for writing to database
});
var db = {};
 
//sequelize    = new Sequelize(config.database, config.username, config.password, { timezone : "+08:00", pool:config.pool, dialect: 'mysql', logging: false, host: config.host})
 
fs
    .readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js");
    })
    .forEach(function(file) {
        var model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });
 
Object.keys(db).forEach(function(modelName) {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});
 
 
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.contato = require('../models/contato.js')(sequelize, Sequelize);
db.tag = require('../models/tag.js')(sequelize, Sequelize);
db.grupo_tag = require('../models/grupo_tag.js')(sequelize, Sequelize);
db.usuario = require('../models/usuario.js')(sequelize, Sequelize);
db.contato_tags = require('../models/contato_tags.js')(sequelize, Sequelize);
db.evento = require('../models/evento.js')(sequelize, Sequelize);
db.conteudo = require('../models/conteudo.js')(sequelize, Sequelize);

//relacionamento many to many inicio
db.tag.belongsToMany(db.contato, { through: 'contato_tags' })
db.contato.belongsToMany(db.tag, { through: 'contato_tags' })
//relacionamento many to many fim

//relacionamento one to many - inicio
db.grupo_tag.hasMany(db.tag, {foreignKey: 'grupo_tag_id', as: 'tags'});
db.tag.belongsTo(db.grupo_tag, { foreignKey: 'grupo_tag_id', as: 'grupo' });
//relacionamento one to many - fim

//relacionamento one to many - inicio
//db.contato.hasMany(db.evento, {foreignKey: 'solicitante_id', as : 'solicitante' });
//db.contato.hasMany(db.evento, {foreignKey: 'responsavel_id',  as : 'responsavel' });

db.contato.belongsTo(db.contato, {foreignKey: 'indicacao', as : 'quem_indicou' });

db.evento.belongsTo(db.contato, { foreignKey: 'solicitante_id', as: 'solicitante' });
db.evento.belongsTo(db.contato, { foreignKey: 'responsavel_id', as: 'responsavel' });
//relacionamento one to many - fim

//relacionamento many to many inicio
db.evento.belongsToMany(db.contato, { as : 'evento_contatos', through: 'convidados', foreignKey: 'evento_id' });
db.contato.belongsToMany(db.evento, { as : 'evento_contatos', through: 'convidados',  foreignKey : 'contato_id'});
//relacionamento many to many fim 

module.exports = db;