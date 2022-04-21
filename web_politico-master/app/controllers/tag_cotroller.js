var autenticacao = require('../../middleware/autenticador');
var bairros = require('../../json-brasil/bairros.json');
require('devbox-linq')

module.exports = function(app, model) {
 
    app.get('/tags',  autenticacao, function(req, res){

          model.tag.findAll({
              where :{
                status : 1,
              }
          }).then(tags =>{

            res.render('tag/index', {list :  tags, role : req.session.role})
        });
    });

    app.get('/tag/create', autenticacao, function(req, res){
       
        model.grupo_tag.findAll().then(grupo_tags => {

            res.render('tag/create', {grupo_tags : grupo_tags, body : ''})
        })
    });

    app.post('/tag/create', autenticacao, function(req, res){
    
        model.tag.create({
            grupo_tag_id : req.body.grupo_tag_id,
            descricao : req.body.descricao,
        }).then(x=>{

            req.flash('info', 'Registro cadastrado com sucesso');
            res.redirect('/tags');
        });
    });

    app.get('/tag/edit', autenticacao, function(req, res){
       
        model.tag.find({
            where:{
                id : req.query.id,
            }
        }).then(tag=> {
            return tag;
        }).then(tag=>{
          
            model.grupo_tag.findAll().then(grupos=>{
                
                res.render('tag/edit', {grupo_tags : grupos, body: tag})
            })
        })
        
    });

    app.post('/tag/edit', autenticacao, function(req, res){
       
        model.tag.update({
            descricao : req.body.descricao,
            grupo_tag_id : req.body.grupo_tag_id,

        }, {where : {id : req.body.id} }).then(x=>{
            
            req.flash('info', 'Registro cadastrado com sucesso');
            res.redirect('/tags')
        });
    });

    app.get('/tag/desabilitar', autenticacao, function(req, res){
    
        try{

            model.tag.update({
                status : 0,
            }, {where : {id: req.query.id}}).then(contato=>{
                
                req.flash('info', 'Registro desabilitado com sucesso');
                res.redirect('/tags')
            });

        }catch(error){

            req.flash('error', 'Algo aconteceu com o cadastro '+ error);
            res.redirect('/tags')
        }
    });

}


 //   var regex = new RegExp("Porto Velho", "g");
    // var pvh_bairro = bairros.data.where(x=> x.Uf == "RO" && x.Nome.includes("Porto Velho"))
      
    //   pvh_bairro.forEach(element => {
    //         model.tag.create({
    //             grupo_tag_id : 1,
    //             descricao : element.Nome,
    //         });
    //   });