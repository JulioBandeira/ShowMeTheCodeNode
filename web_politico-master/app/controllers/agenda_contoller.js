var autenticador = require('../../middleware/autenticador');
var moment = require('moment');
require('devbox-linq')
//https://momentjs.com/timezone/

module.exports = (app, model)=>{

    app.get('/agenda/index', autenticador, (req, res)=>{
        
        res.render('agenda/index');
    });
    
    app.post('/agenda/send2/', autenticador, (req, res)=>{
        
        (async () => {
            try{

                var convidados = req.body.evento_contatos != '' ? req.body.evento_contatos : []; 
                req.body.start =  moment.tz(req.body.start, "America/Porto_Velho"); // moment(req.body.start.replace(/[/]/g, '-'), ["MM-DD-YYYY HH:mm:ss", "DD-MM-YYYY HH:mm:ss"], 'pt-br', true).add(-3, 'hours') 
                req.body.end =  moment.tz(req.body.end, "America/Porto_Velho"); //moment(req.body.end.replace(/[/]/g, '-'), ["MM-DD-YYYY HH:mm:ss", "DD-MM-YYYY HH:mm:ss"], 'pt-br', true).add(-3, 'hours') 
                
               const agenda = await model.evento.create({
                    title : req.body.title,
                    description : req.body.description,
                    start : req.body.start,
                    end : req.body.end,
                    solicitante_id:  req.body.solicitante_id  ? req.body.solicitante_id : null, //  req.body.solicitante_id, // === 'null' ? null  : req.body.solicitante_id,
                    responsavel_id : req.body.responsavel_id ? req.body.responsavel_id : null, // === 'null' ? null  : req.body.solicitante_id,
                    status : [req.body.status],
                   })
                
              await insert_eventos(convidados, model, agenda.id)
                
                agenda.evento_contatos = [];

               const teste = await model.convidado.findAll({
                    
                    where : {
                        evento_id : agenda.id,
                    },

                    // include: [
                    //     { model: model.contato, as: 'evento_contatos' },    
                    //   ]
                });
                
                console.log(teste)

                res.json(agenda)

            } finally {
                // client.release()
            }	  
        })().catch(e => console.log(e.stack)) // fim (async()
    })

    async function insert_eventos(convidados, model, agenda_id){
        convidados.forEach(async convidado => { 
            model.convidado.create({
                evento_id : agenda_id,
                contato_id : convidado,
        })});   
    }

    app.post('/agenda/send', autenticador, (req, res)=>{
       
        try{

            console.log(req.body.solicitante_id)
            console.log(req.body.responsavel_id)
            
            var convidados = req.body.evento_contatos != '' ? req.body.evento_contatos : []; 
            req.body.start =  moment.tz(req.body.start, "America/Porto_Velho"); // moment(req.body.start.replace(/[/]/g, '-'), ["MM-DD-YYYY HH:mm:ss", "DD-MM-YYYY HH:mm:ss"], 'pt-br', true).add(-3, 'hours') 
            req.body.end =  moment.tz(req.body.end, "America/Porto_Velho"); //moment(req.body.end.replace(/[/]/g, '-'), ["MM-DD-YYYY HH:mm:ss", "DD-MM-YYYY HH:mm:ss"], 'pt-br', true).add(-3, 'hours') 
            
            console.log('||||||||||||||||||||||||||||||||||||||||\-------------------')
            console.log(req.body.start.format())
            console.log(req.body.end.format())
            console.log('-------------------')

            if(req.body.id != 0){
                if(req.body.tipo != 'arrastar'){
                    model.convidado.destroy({where:{evento_id : req.body.id}});

                    convidados.forEach(convidado => { 
                        model.convidado.create({
                        evento_id : req.body.id,
                        contato_id : convidado,
                    })});
                }    
                
                model.evento.update({

                    title : req.body.title,
                    description : req.body.description,
                    start : req.body.start,
                    end : req.body.end,
                    solicitante_id:  req.body.solicitante_id == ''  ? null  : req.body.solicitante_id, 
                    responsavel_id : req.body.responsavel_id  == '' ? null : req.body.responsavel_id , 
                    status : [req.body.status],
                   
                }, {where : {id : req.body.id}}).then(x=>{
                        var data = req.body;
                            data.tipo = 'update';
                            data.color = get_color(req.body.status);

                        res.json(data)
                }).catch(function(err) {
                    res.json(err);
                });
            }else{
                    model.evento.create({
                        
                    title : req.body.title,
                    description : req.body.description,
                    start : req.body.start,
                    end : req.body.end,
                    solicitante_id:  req.body.solicitante_id  ? req.body.solicitante_id : null, //  req.body.solicitante_id, // === 'null' ? null  : req.body.solicitante_id,
                    responsavel_id : req.body.responsavel_id ? req.body.responsavel_id : null, // === 'null' ? null  : req.body.solicitante_id,
                    status : [req.body.status],

                   }).then(evento=>{
                    
                    convidados.forEach(convidado => { 
                        model.convidado.create({
                            evento_id : e.id,
                            contato_id : convidado,
                    })})
                        var data = evento;
                        data.tipo = 'create';
                        data.color = get_color(req.body.status);
                        res.json(data)
                    }).catch(function(err) {
                        res.json(err);
                    });
            }
      }catch(error){
          res.json(error)
      }
    })
    
    app.get('/agenda/get_convidados', autenticador, (req, res)=>{

        model.evento.find({
            where:{
                id : req.query.id,
            },
            include: [
                { model: model.contato, as: 'solicitante' },
                { model: model.contato, as: 'responsavel' },
                { model: model.contato, as: 'evento_contatos' },    
              ]
        }).then(eventos=> {
            res.json(eventos)
        })
    })

    app.get('/agenda/get_json', autenticador, (req, res)=>{

        model.evento.findAll({
            //status : '',
           //  raw: true,
           //  all: true, 
           //attributes : ['start', 'end', 'title', 'description', 'solicitante.id', 'responsavel.id'],
            include: [
                { model: model.contato, as: 'solicitante' },
                { model: model.contato, as: 'responsavel' },
                { model: model.contato, as: 'evento_contatos' },    
              ]
        }).then(eventos=>{
           
            var list = [];
            eventos.where(x=> x.status != 'excluido').forEach(x=>{
                var objeto = {
                    id : x.id,
                    start : x.start,
                    end : x.end,
                    title : x.title,
                    description : x.description,
                    solicitante : x.solicitante,
                    responsavel : x.responsavel,
                    evento_contatos : x.evento_contatos,
                    status : x.status,
                    color  : get_color(x.status),
                };
              
                list.push(objeto);
            });

            res.json(list)
        })
    })

    app.get('/agenda/get_eventos', autenticador, (req, res)=>{

        //xxconsole.log(model)
          model.evento.findAll({
             //  raw: true,
             //  all: true, 
             //attributes : ['start', 'end', 'title', 'description', 'solicitante.id', 'responsavel.id'],
            //   include: [
            //       { model: model.contato, as: 'solicitante' },
            //       { model: model.contato, as: 'responsavel' },
            //       { model: model.contato, as: 'evento_contatos' },    
            //     ]
          }).then(eventos=>{
      
              res.json(eventos)
          })
    })
    
    app.get('/agenda/show', autenticador, function(req, res){
        
        model.evento.find({
            id : req.query.id,
        }).then(evento => {
            res.json(evento);
        });
    });

    app.get('/agenda/desabilitar',autenticador, function(req, res){
 
        model.evento.update({
            status : ['excluido'], 
        }, {where : {id : req.query.id}}).then(x=>{
            res.json(true);
        });
    });
   
    app.post('/agenda/salvar_contato', function(req, res, next){
        
        model.contato.find({
           where :{
               celular1 : req.body.celular,
           }
        }).then(contatos =>{
            
            if(contatos  != null && req.body.id == ''){
               var flag  = { has_celular : false};
               res.json(flag)
            }else{
             if(req.body.id != ''){

                model.contato.update({
                    nome : req.body.nome,
                    celular1:  req.body.celular,
                    cep:  req.body.cep,
                    rua:  req.body.rua,
                    cidade:  req.body.cidade,
                    numero:  req.body.numero,
                    bairro: req.body.bairro,
                    longitude:  req.body.longitude,
                    latitude : req.body.latitude,
                    },{where :{
                        id : req.body.id,
                    }
                }).then(contato=>{
                    res.json(req.body);
                }).catch(x=>{
                    res.json(x);
                })
             }else{
           
                model.contato.create({

                    solicitante_id : req.body.quem_indicou,
                    nome : req.body.nome,
                    celular1:  req.body.celular,
                    cep:  req.body.cep,
                    rua:  req.body.rua,
                    cidade:  req.body.cidade,
                    numero:  req.body.numero,
                    bairro: req.body.bairro,
                    longitude:  req.body.longitude,
                    latitude : req.body.latitude,

                }).then(contato =>{
                    res.json(contato);
                }).catch(x=>{
                    res.json(x);
                })
             }   
            }
        })
    });

    function get_color(status ){
    
        if(status == 'a_confirmar' || status == null)  
            return '#5c5c8a';
        if(status == 'confirmado')  
             return '#00b300';
        if(status == 'cancelado') 
            return '#cc3300';
    }
}


