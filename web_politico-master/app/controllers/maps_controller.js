var local_coordenadas = require('../../json-local-localidade/json-local-coordenada.json');
var local_secao = require('../../json-local-localidade/arquivo_secao_json.json');

var moment = require('moment');

module.exports = (app, model)=>{

    const Op = model.Sequelize.Op; 

    app.get('/maps', function(req, res){

        res.render('maps/contato')
    })
  
     
    app.get('/maps/index', function(req, res){

        res.render('maps/index')
    })

    app.get('/maps/json', function(req, res){
        
       model.contato.findAll({
           where : {
               latitude : {[Op.not] :  null},
               longitude : {[Op.not] :  null},
           }
       }).then(contatos => {
      
        var list = [];

        contatos.forEach(element => {
            // coords:{lat:-8.762996,lng: -63.835537},
               var objeto = {
                  coords : {lat : Number(element.latitude), lng : Number(element.longitude)} , 
                  content : element.nome,
               }

               list.push(objeto)
          });
             
          res.json(list);
       }) 
       
    })

    app.get('/maps/json_filter', function(req, res){
       
        model.contato.findAll({
            where : {
                latitude : {[Op.not] :  null},
                longitude : {[Op.not] :  null},
                local_de_votacao  : {
                    [Op.like] : '%' + req.body.local_de_votacao + '%',
                }, 
            }
        }).then(contatos => {
       
         var list = [];
 
         contatos.forEach(element => {
             // coords:{lat:-8.762996,lng: -63.835537},
                var objeto = {
                   coords : {lat : Number(element.latitude), lng : Number(element.longitude)} , 
                   content : element.nome,
                }
 
                list.push(objeto)
           });
              
           res.json(list);
        }) 
    })

    app.get('/local_votacao/local_coordenada', function(req, res){
    
        var list = [];
        local_coordenadas
            .filter(x=> x.latitude !== undefined && x.longitude !== undefined).forEach(element => {
                var objeto = {
                    coords : {lat : Number(element.latitude), lng : Number(element.longitude)} , 
                    content : 'Zona: ' + element.zona + ' - ' + element.local + ' - ' + element.municipio, 
                 }
                 list.push(objeto)
            })
         res.json(list)   
    });
    
    app.get('/eventos/local_coordenadas', function(req, res){
    
        model.evento.findAll({
            where : {
              //  status : ['confirmado']
            },
            include: [
                { model: model.contato, as: 'responsavel' },
              ]
        }).then(eventos=>{
    
            var list = [];
            eventos.where(x=> x.responsavel != undefined).forEach(element=>{
                var objeto = {
                    coords : { lat : Number(element.responsavel.latitude), lng : Number(element.responsavel.longitude)},
                    content : element.title + ', ' + moment(element.start).format('DD/MM/YYYY HH:mm')  + ' - ' +  moment(element.end).format('DD/MM/YYYY HH:mm') + ', Reponsável: ' + element.responsavel.nome, 
                };
                list.push(objeto);
            });
            return list;

        }).then(list=>{

            res.json(list)
        }) 
    });

    app.get('/maps/get_lideranca', function(req, res){
      
      model.contato.findAll({
          where :{
            latitude : {[Op.not] :  null},
            longitude : {[Op.not] :  null},
            tipo_de_contato : ['lideranca'],
          }
      }).then(contatos => {

        var list = [];

        contatos.forEach(element => {
               var objeto = {
                  coords : {lat : Number(element.latitude), lng : Number(element.longitude)} , 
                  content : 'Liderança ' + element.nome,
               }
               list.push(objeto)
          });
          res.json(list);
      })   
    })

    app.get('/maps/secao', function(req, res){
        
        var list = [];
       
        local_secao.forEach(element => {
            // coords:{lat:-8.762996,lng: -63.835537},
               var objeto = {
                  coords : {lat : Number(element.latitude), lng : Number(element.longitude)} , 
                  content : `Local: ${element.local}, Colégio: ${element.colegio}, Total: ${element.total}`,
               }

               list.push(objeto)
          });
             

        res.json(list)
    })
}      