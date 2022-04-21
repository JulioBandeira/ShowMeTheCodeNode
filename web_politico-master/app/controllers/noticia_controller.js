var autenticacao = require('../../middleware/autenticador');
require('devbox-linq');
// const multer = require('multer');
var moment = require('moment');
var fs = require("fs");

//MULTER CONFIG: to get file photos to temp server storage
// const multerConfig = {
//     //specify diskStorage (another option is memory)
//     storage: multer.diskStorage({

//       //specify destination
//       destination: function(req, file, next){
//         next(null, 'public/images');
//       },

//       //specify the filename to be unique
//       filename: function(req, file, next){
//         //console.log(file);
//         //get the file mimetype ie 'image/jpeg' split and prefer the second value ie'jpeg'
//         const ext = file.mimetype.split('/')[1];
//         //set the file fieldname to a unique name containing the original name, current datetime and the extension.
//         next(null, file.fieldname + '-' + Date.now() + '.'+ext);
//       }
//     }),

//     // filter out and prevent non-image files.
//     fileFilter: function(req, file, next){

//           //console.log(file)
//           if(!file){
//             next();
//           }

//         // only permit image mimetypes
//         const image = file.mimetype.startsWith('image/');
//         if(image){
//           console.log('photo uploaded');
//           next(null, true);
//         }else{
//           console.log("file not supported")
//           //TODO:  A better message response to user on failure.
//           return next();
//         }
//     }
//   };

module.exports = function(app, model) {
 
    app.get('/noticias',  autenticacao, function(req, res){

          model.conteudo.findAll({
              where :{
                tipo : ['noticia'],
                status : ['ativo'],
              }
          }).then(noticias =>{

            res.render('noticia/index', {list :  noticias, role : req.session.role})
        });
    });

    app.get('/noticia/create', autenticacao, function(req, res, next){
    
        res.render('noticia/create', {body : ''})
    });

    //multer(multerConfig).single('photo')

    app.post('/noticia/createww', function(req, res, next) {

    
        let sampleFile = req.files.photo;
        let file = sampleFile.md5 + '-'+ Date.now() + '.jpg';
       
        // Use the mv() method to place the file somewhere on your server
        sampleFile.mv('./public/images/' + sampleFile.md5 + '-'+ Date.now() + '.jpg', function(err) {
          if (err)
            return res.status(500).send(err);
        });

        res.send('File uploaded!');
      });

    app.post('/noticia/create',function(req, res){
        
        let sampleFile = req.files.photo;
        let file = sampleFile.md5 + '-'+ Date.now() + '.jpg';
       
        // Use the mv() method to place the file somewhere on your server
        sampleFile.mv('./public/imagens/' + sampleFile.md5 + '-'+ Date.now() + '.jpg', function(err) {
          if (err)
            return res.status(500).send(err);
        });
        
        model.conteudo.create({
            titulo : req.body.titulo,
            conteudo : req.body.conteudo,
            tipo : ['noticia'],
            status : ['ativo'],
            path : file, // req.file != undefined ? new Buffer(fs.readFileSync(req.file.path)).toString("base64") : '',
            tipo_noticia_img : [req.body.tipo_noticia_img],
            
        }).then(x=>{

            req.flash('info', 'Registro cadastrado com sucesso');
            res.redirect('/noticias');
        });
    });

    app.get('/noticia/edit', autenticacao, function(req, res){
       
        console.log('--------------------------')
        console.log(__dirname + '/public/images/')
        console.log('--------------------------')

        model.conteudo.find({
            where:{
                id : req.query.id,
            }
        }).then(noticia=>{
           res.render('noticia/edit', {body : noticia})
        })
    });

    app.post('/noticia/edit', function(req, res){
        


        let sampleFile = req.files.photo;
        let file = sampleFile.md5 + '-'+ Date.now() + '.jpg';
       
        // Use the mv() method to place the file somewhere on your server
        sampleFile.mv('./public/imagens/' + sampleFile.md5 + '-'+ Date.now() + '.jpg', function(err) {
          if (err)
            return res.status(500).send(err);
        });

        model.conteudo.update({
            titulo : req.body.titulo,
            conteudo : req.body.conteudo,
            titulo : req.body.titulo,
            conteudo : req.body.conteudo,
            tipo : ['noticia'],
            status : ['ativo'],
            path : file,
            tipo_noticia_img : req.body.tipo_noticia_img,

        }, {where : {id : req.body.id} }).then(x=>{
            
            req.flash('info', 'Registro cadastrado com sucesso');
            res.redirect('/noticias')
        });
    }); 
 


    app.get('/noticia/desabilitar', autenticacao, function(req, res){
    
        try{

            model.conteudo.update({
                status :  ['ativo'],
            }, {where : {id: req.query.id}}).then(contato=>{
                
                req.flash('info', 'Registro desabilitado com sucesso');
                res.redirect('/noticias')
            });

        }catch(error){

            req.flash('error', 'Algo aconteceu com o cadastro '+ error);
            res.redirect('/noticias')
        }
    });

    app.get('/noticia/show/:id', function(req, res){
        
        model.conteudo.find({
            where:{
                id : req.params.id,
            }
        }).then(noticia=>{

            res.render('site/conteudo', {body : noticia != undefined ? noticia : ''});
        })
    });

    app.get('/noticias/show/', function(req, res){
        
        model.conteudo.findAll({
            where:{
                tipo : ['noticia'],
                status :  ['ativo'],
            }
        }).then(noticias => {
            res.render('site/noticias', {list : noticias, moment : moment});
        });
        
    });

    // app.post('/upload', multer(multerConfig).single('photo'),function(req, res){
    //     //Here is where I could add functions to then get the url of the new photo
    //     //And relocate that to a cloud storage solution with a callback containing its new url
    //     //then ideally loading that into your database solution.   Use case - user uploading an avatar...
    //     res.send('Complete! Check out your public/photo-storage folder.  Please note that files not encoded with an image mimetype are rejected. <a href="index.html">try again</a>');
    // });

}
