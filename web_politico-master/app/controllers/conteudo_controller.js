var autenticacao = require('../../middleware/autenticador');
var bairros = require('../../json-brasil/bairros.json');

require('devbox-linq')

module.exports = function(app, model) {
 
    app.get('/conteudos',  autenticacao, function(req, res){

          model.conteudo.findAll({
            where :{
                tipo : ['estatico'],
                status : ['ativo'],
              }
          }).then(conteudos =>{

            res.render('conteudo/index', {list :  conteudos, role : req.session.role})
        });
    });

    app.get('/conteudo/create', autenticacao, function(req, res){
    
        res.render('conteudo/create', {body : ''})
    });

    app.post('/conteudo/create', autenticacao, function(req, res){
       
        model.conteudo.create({
            titulo : req.body.titulo,
            conteudo : req.body.conteudo,
            status : ['ativo'],
            tipo : ['estatico'],
        }).then(x=>{

            req.flash('info', 'Registro cadastrado com sucesso');
            res.redirect('/conteudos');
        });
    });

    app.get('/conteudo/edit', autenticacao, function(req, res){
       
        model.conteudo.find({
            where:{
                id : req.query.id,
            }
        }).then(conteudo=>{
          
           res.render('conteudo/edit', {body : conteudo})
        })
        
    });

    app.post('/conteudo/edit', autenticacao, function(req, res){
       
        model.conteudo.update({
            titulo : req.body.titulo,
            conteudo : req.body.conteudo,
            status : ['ativo'],
            tipo : ['estatico'],
        }, {where : {id : req.body.id} }).then(x=>{
            
            req.flash('info', 'Registro cadastrado com sucesso');
            res.redirect('/conteudos')
        });
    });

    app.get('/conteudo/desabilitar', autenticacao, function(req, res){
    
        try{

            model.tag.update({
                status : ['inativo'],
            }, {where : {id: req.query.id}}).then(contato=>{
                
                req.flash('info', 'Registro desabilitado com sucesso');
                res.redirect('/conteudos')
            });

        }catch(error){

            req.flash('error', 'Algo aconteceu com o cadastro '+ error);
            res.redirect('/conteudos')
        }
    });

    app.get('/conteudo/show/:id', function(req, res){
        
        console.log(req.params)

        model.conteudo.find({
            where:{
                id : req.params.id,
            }
        }).then(conteudo=>{

            res.render('site/conteudo', {body : conteudo != undefined ? conteudo : ''});
        })
    })
   
    app.get('/conteudo/json_show', function(req, res){
    
        model.conteudo.find({
            where:{
                id : req.query.id,
            }
        }).then(conteudo=>{

            res.json(conteudo);
        })
    })

    app.get('/conteudo/whats', function(req, res){
        
            res.render('site/whats');
    })

}
