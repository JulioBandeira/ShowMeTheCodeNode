var autenticacao = require('../../middleware/autenticador');
var bairros = require('../../json-brasil/bairros.json');
require('devbox-linq')

module.exports = function(app, model) {
 
    app.get('/grupo_tags',  autenticacao, function(req, res){

          model.grupo_tag.findAll({
              where:{
                status: 1,
              }
          }).then(tags =>{

            res.render('grupo_tags/index', {list :  tags, role : req.session.role}) 
        });
    });

    app.get('/grupo_tags/create', autenticacao, function(req, res){
       
           res.render('grupo_tags/create', {body : ''})
    });

    app.post('/grupo_tags/create', autenticacao, function(req, res){
    
        model.grupo_tag.create({
            descricao : req.body.descricao,
        }).then(x=>{
            req.flash('info', 'Registro cadastrado com sucesso');
            res.redirect('/grupo_tags');
        });
    });

    app.get('/grupo_tags/edit', autenticacao, function(req, res){
       
        model.grupo_tag.find({
            where:{
                id : req.query.id,
            }

        }).then(grupo_tag=> {
            
            res.render('grupo_tags/edit', {body: grupo_tag})
        });
        
    });

    app.post('/grupo_tags/edit', autenticacao, function(req, res){
       
        console.log(req.body)

        model.grupo_tag.update({
            descricao : req.body.descricao,
        }, {where : {id : req.body.id} }).then(x=>{

            req.flash('info', 'Registro cadastrado com sucesso');
            res.redirect('/grupo_tags')
        });
    });

    app.get('/grupo_tags/desabilitar', autenticacao, function(req, res){
    
        try{

            model.grupo_tag.update({
                status : 0,
            }, {where : {id: req.query.id}}).then(contato=>{
                
                req.flash('info', 'Registro desabilitado com sucesso');
                res.redirect('/grupo_tags')
            });

        }catch(error){

            req.flash('error', 'Algo aconteceu com o cadastro '+ error);
            res.redirect('/grupo_tags')
        }
    });

}