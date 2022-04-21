var bcrypt = require('bcrypt-nodejs')
var autenticacao = require('../../middleware/autenticador');

module.exports = function(app, model) {
 
    app.get('/usuarios',autenticacao, function(req, res){

         model.usuario.findAll({
             where : {
                 status : 1,
             }
         }).then(usuarios=> {

            res.render('usuario/index', {list : usuarios, role : req.session.role})
         })
    });

    app.get('/usuario/create', autenticacao, function(req, res){

        res.render('usuario/create', {body : ''})
    });

    app.post('/usuario/create', autenticacao, function(req, res){

        try{
                req.body.senha = bcrypt.hashSync(req.body.senha);

                model.usuario.create(req.body).then(usuario=>{
                req.flash('info', 'Registro cadastrado com sucesso');
                res.redirect('/usuarios')
            })
            
      }catch(error){
        req.flash('error', 'Erro ao cadastrar ' + error);
        res.render('usuario/edit', {body : req.body})
      }

    });

    app.get('/usuario/edit', autenticacao, function(req, res){
        
        console.log(req.query)

        model.usuario.findAll({
           where :{
               id : req.query.id,
          }
        }).then(usuario=> {

            res.render('usuario/edit', {body : usuario[0]})
         });
    });

    app.post('/usuario/edit', autenticacao, function(req, res){
       
        try{

        
        req.body.senha = bcrypt.hashSync(req.body.senha);

        model.usuario.update({
            senha : req.body.senha,
            nome : req.body.nome,
            cpf : req.body.cpf,
            role : req.body.role
        }, {where : {id : req.body.id} }).then(usuario=>{
            req.flash('info', 'Registro cadastrado com sucesso');
            res.redirect('/usuarios')
        })

    }catch(error){
        req.flash('error', 'erro ao cadastrar ' + error);
        res.render('usuarios/edit', {body : req.body})
    }
    });

    
    app.get('/usuario/desabilitar', autenticacao, function(req, res){
    
        try{

            model.usuario.update({
                status : 0,
            }, {where : {id: req.query.id}}).then(contato=>{
                
                req.flash('info', 'Registro desabilitado com sucesso');
                res.redirect('/usuarios')
            });

        }catch(error){

            req.flash('error', 'Algo aconteceu com o cadastro '+ error);
            res.redirect('/usuarios')
        }
    });

}

