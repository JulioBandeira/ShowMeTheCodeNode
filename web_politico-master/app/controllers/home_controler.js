var autenticacao = require('../../middleware/autenticador');
var moment = require('moment');
const accountSid = 'ACb5e14b39c3228207102ad7afe324b49c';
const authToken = '900240ea4bc152b5f6bbbf083054d8cd';
const client = require('twilio')(accountSid, authToken);

module.exports = (app, model) =>{
    
    app.get('/', (req, res) =>{

        model.conteudo.findAll({
            where:{
                tipo : ['noticia'],
                status : ['ativo'],
            }
        }).then(noticias => {
           // res.json(noticias);
            res.render('site/home', {list : noticias, moment : moment});
        });
    })

    app.get('/home/index', (req, res) =>{
      
        model.conteudo.findAll({
            where:{
                tipo : ['noticia'],
                status : ['ativo'],
            }

        }).then(noticias => {
            //res.json(noticias);
            res.render('site/home', {list : noticias, moment : moment});
        });
    })

    app.get('/admin', autenticacao, (req, res) =>{
      
        (async () => {
             try{
    
            const cont_contatos = await model.contato.count({where:{status : 1}});
            const ideias = await model.contato.findAll({
                                where:{tipo_de_contato : ['ideia']},
                                 order: [
                                   ['id', 'DESC'],
                                 ],  
                                 limit: 6
            });
            const eventos = await model.evento.findAll({where : {status : ['confirmado']},  order: [['start', 'DESC']]});

            var objeto = {
                cont_contatos : cont_contatos,
                eventos : eventos,
                ideias : ideias,
                moment : moment,
            }
     
            //  res.json({objeto: objeto})
             res.render('home/index', {objeto: objeto})
            } finally {
                // client.release()
            }	  
        })().catch(e => console.log(e.stack)) // fim (async()
   
    });

 
}




//   app.get('/contato/count_contatos', autenticador, function(req, res){

//         model.contato.count({
//             where:{
//                 status : 1,
//             }
//         }).then(count=>{

//             res.json(count);
//         });
//     });
