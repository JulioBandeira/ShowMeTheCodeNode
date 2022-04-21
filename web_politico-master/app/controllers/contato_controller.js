var autenticador = require('../../middleware/autenticador');
require('devbox-linq')
var validacao = require('../../validacoes/contato')
local_votacao = require('../../json-local-localidade/local-votacao.json');
var moment = require('moment');

module.exports = function(app, model) {
  
    const Op = model.Sequelize.Op; 
    const sequelize = model.sequelize; 
    
    app.get('/contatos', autenticador, function(req, res){
       
        model.contato.findAll({
            raw: true,
            attributes : ['id', 'nome', 'celular1', 'tipo_de_contato'],
            where: {
                status: 1,
              } 
           }).then(list=> {
               res.render('contato/index', {list: list, role : req.session.role})
           });
    });

    app.get('/contato/create', autenticador, function(req, res){
        var body  = {
            tags : [],
        }
    
        res.render('contato/create', { body : body, moment : moment} );
    });
   
    app.get('/contato/get_tag', autenticador, (req, res) =>
    {
       var query = req.query.query;
   
       model.sequelize.query("SELECT `tags`.id, CONCAT(`tags` .descricao, ' (', grupo_tags.descricao, ')') as descricao FROM `tags` inner join `grupo_tags` on `tags` .grupo_tag_id = `grupo_tags`.id where `tags`.`descricao` LIKE '%"+ query +"%' and `tags`.status = 1", { type: model.sequelize.QueryTypes.SELECT  })
                    .then(tags => {
                           var list = [];
                           tags.forEach(element=>{
                             obj = {};
                              obj = {
                                  id : element.id,
                                  text : element.descricao,
                              }
                              list.push(obj);
                          })
                          res.json({results :  list});
                    });
    })

    app.get('/contato/get_contatos', autenticador, function(req, res){
        
        model.contato.findAll({
            where : {
                nome  : {
                    [Op.like] : '%' + req.query.query + '%',
                }, 
                status : 1
            }
        }).then(contatos=> {

            var list = [];
            contatos.forEach(element=>{
              obj = {};
               obj = {
                   id : element.id,
                   text : element.nome,
               }
               list.push(obj);
           })

           res.json({results : list});
        });
    });
    
    app.get('/contato/get_contatoss', autenticador, function(req, res){
        
        model.contato.findAll({
            where : {
                nome  : {
                    [Op.like] : '%' + req.query.query + '%',
                }, 
                status : 1
            }
        }).then(contatos=> {

            var list = [];
            contatos.forEach(element=>{
              obj = {};
               obj = {
                   value : element.id,
                   text : element.nome,
               }
               list.push(obj);
           })

           res.json(list);
        });
    });

    app.post('/contato/create', autenticador, function(req, res){
    
    try{
       
    if(validacao(req,res)){

        var tags = req.body.tags != undefined ? req.body.tags : [];
        req.body.tipo_de_contato = req.body.tipo_contato != undefined ? [req.body.tipo_contato].join() : '';    
        req.body.indicacao = req.body.indicacao != '' ? req.body.indicacao : null;
        
        model.contato.create(req.body).then(contato=> {
                 return contato;

            }).then(contato=> {
                
                tags.forEach(element => {
                    model.contato_tags.create({
                        ContatoId : contato.id,
                        TagId : element,
                            })
                     })

                model.tag.findAll({
                    raw: true,
                   // all: true, 
                   // attributes : ['id', 'descricao'],
                     where: {
                        id: {
                            [Op.in]: tags
                          }
                       },
                       
                    }).then(tags => {

                    req.flash('info', 'Registro cadastrado com sucesso');
                    res.redirect('/contatos')
                });  
    
            });
        }else{
           
            req.body.tags = [];
            res.render('contato/create', {body: req.body} )   
        }
         
    }catch(error){
       req.flash('erro', 'Erro ao cadastrar: '+ error);
       req.body.tags = [];
       res.status(500).render('contato/create', {body: req.body} )
    }    
    });

    app.get('/contato/edit', autenticador, function(req, res){
       
       try{
        
        model.contato.find({
            // raw: true,
           
             include: [
                 {
                    model: model.tag, 
                    through : {attributes : ['tags.id', 'tags.descricao', 'tags.grupo_tag_id']}, //'contato_tags'
                 },
                 {
                    model: model.contato, as: 'quem_indicou',
                 }],
             where: {
                 id: req.query.id,
               },
               
            }).then(contato => {
             
                    res.render('contato/edit', {body: contato, moment : moment});
                    //res.json(contato)
                    //res.render('contato/edit', {body: body[0]})     
            });
       
        }catch(erro){
            
            req.flash('error', 'error ' + erro );
            res.json(erro)
        }
    });

    app.post('/contato/edit', autenticador, function(req, res){
       
        try{
        
        req.body.data_nascimento = moment(req.body.data_nascimento.replace(/[/]/g, '-'), ["DD-MM-YYYY HH:mm:ss"]);
        var tags = req.body.tags != undefined ? req.body.tags : [];
        req.body.tipo_de_contato = req.body.tipo_contato != undefined ? [req.body.tipo_contato].join() : '';    
        req.body.indicacao = req.body.indicacao != '' ? req.body.indicacao : null;
        
        model.contato_tags.destroy({
            where:{
             ContatoId : req.body.id,
            }
        })
        
        tags.forEach(element => {
            model.contato_tags.create({
                ContatoId : req.body.id,
                TagId : element,
                    })
             })

        model.contato.update(req.body, {where : {id: req.body.id}}).then(contato=> {
        
                model.tag.findAll({
                    //raw: true,
                   // all: true, 
                   // attributes : ['id', 'descricao'],
                     where: {
                        id: {
                            [Op.in]: tags
                          }
                       },
                       
                    }).then(tags => {
            
                    req.flash('info', 'Registro cadastrado com sucesso');
                    res.redirect('/contatos')
                  
                });
            });

    }catch(error){

        req.body.tags = []; 
        req.flash('erro', 'Erro ao cadastrar: '+ error);
        res.status(500).render('contato/edit', {body: req.body} )
    }
    });

    app.get('/contato/desabilitar', autenticador, function(req, res){
    
        try{

            model.contato.update({
                status : 0,
            }, {where : {id: req.query.id}}).then(contato=>{
                
                req.flash('info', 'Registro desabilitado com sucesso');
                res.redirect('/contatos')
            });

        }catch(error){

            req.flash('error', 'Algo aconteceu com o cadastro '+ error);
            res.redirect('/contatos')
        }
    });

    app.get('/contato/show_by_district', function(req, res){

        model.contato.findAll({ 
            attributes: ['bairro', [sequelize.fn('count', sequelize.col('bairro')), 'cnt']],
            group: ['bairro'],
        }).then(result => {

            res.json(result)
        });
    });

    app.get('/contato/show', autenticador, function(req, res){
        
        model.contato.find({
              include: [
                  { model: model.tag, as: 'tags' },
                  { model: model.contato, as: 'quem_indicou' },
                 // { model: model.contato, as: 'evento_contatos' },    
                ], 
            where : { id : req.query.id }
        }).then(contato => {
            
           // res.json(contato);
          res.render('contato/show', {contato : contato, moment : moment} );
        });
    });

    app.post('/contato/new', function(req, res){
       
        model.contato.create({
            nome : req.body.nome,
            email1 : req.body.email1,
            celular1 : req.body.celular1,
            telefone1 : req.body.telefone1,
            ideia : req.body.ideia,
            endereco : req.body.endereco,
            tipo_de_contato : ['ideia']
        })
        .then(contato=> {
            return contato;
       })

       res.json('ok');
    })

    app.get('/contato/get_contato', autenticador, function(req, res){

        model.contato.find({
            where : {
                id : req.query.id,
            },
            include: [
                  { model: model.contato, as: 'quem_indicou' },
              ], 
        }).then(contato=>{
            res.json(contato);
        })
    })
}