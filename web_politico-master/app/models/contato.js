'use strict'

module.exports = (sequelize, DataTypes) => {

var Contato = sequelize.define('contato', {
    
    tipo_de_contato : {

        type: DataTypes.ENUM,
        values:  ['colaborador', 'contato', 'fornecedor', 'lideranca', 'ideia'],
        //allowNull: false

      //  values : ['colaborador', 'contato', 'fornecedor', 'lideranca']
    },

    tipo_pessoa:  {
        type: DataTypes.ENUM,
        values:  ['pessoa_fisica', 'pessoa_juridica'],
    },
        
    //pessoa fisica
    cpf: DataTypes.STRING,
    profissao : DataTypes.STRING,
    empresa : DataTypes.STRING,
    data_nascimento : DataTypes.DATE,
    profissao : DataTypes.STRING,

    //pessoa juridica
    cnpj : DataTypes.STRING,
    nome_fantasia : DataTypes.STRING,
    razao_social : DataTypes.STRING,
   
    //dados para contato
    nome: DataTypes.STRING, //nome da pessoa para entrar em contato
    celular1 : DataTypes.STRING,
    celula2 : DataTypes.STRING,
    telefone1 : DataTypes.STRING,
    telefone2: DataTypes.STRING,
    email1: DataTypes.STRING,
    email2: DataTypes.STRING,
   
    //endereço do eleitor
    cep: DataTypes.STRING,
    cidade : DataTypes.STRING,
    estado : DataTypes.STRING,
    rua : DataTypes.STRING,
    numero : DataTypes.STRING,
    bairro : DataTypes.STRING,

    //local de votação
    local_de_votacao : DataTypes.STRING,

    status : {
        type :  DataTypes.BOOLEAN,
        defaultValue: 1,
    },

    latitude : DataTypes.DECIMAL(10, 8),
    longitude : DataTypes.DECIMAL(11, 8),

    indicacao : DataTypes.INTEGER,
    facebook : DataTypes.STRING,
    instagram : DataTypes.STRING,

    ideia : DataTypes.TEXT,

  });
   
  Contato.associate = function(models){
     Contato.belongsToMany(models.tag, { through: 'contato_tags'})

     Contato.hasMany(models.tag, {foreignKey: 'solicitante_id' });
     Contato.hasMany(models.tag, {foreignKey: 'responsavel_id' });
}

return Contato;

}
 