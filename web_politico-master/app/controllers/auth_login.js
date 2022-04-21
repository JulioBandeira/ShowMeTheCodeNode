var bcrypt = require('bcrypt-nodejs')
var autenticacao = require('../../middleware/autenticador');

module.exports = (app, model)=>{

    app.get('/auth/login', (req, res)=>{
        res.render('auth/login')
    });

    app.post('/auth/login', (req, res)=>{
        model.usuario.find({
            where :{
                cpf : req.body.cpf,
            }
        }).then(usuario => {
            
           if(usuario != null &&  bcrypt.compareSync(req.body.senha, usuario.senha)){
             
               req.session.role = usuario.role;
               req.session.usuario = usuario.nome;

               res.redirect('/admin');
           }else{

                req.flash('erro', 'Login inválido');
                res.render('auth/login');
           } 
        })
            
    });
    
    app.get('/auth/get_info', autenticacao, (req, resp) =>{

        resp.json(req.session.usuario)
    });

    app.get('/auth/logout', autenticacao, (req, resp) => {
           
        req.session.destroy();

        resp.redirect('/auth/login');
    });
}