require('devbox-linq')
var bairros = require('../../json-brasil/bairros.json');
var local_secao = require('../../json-local-localidade/arquivo_secao_json.json');
var moment = require('moment');
var qr = require('qr-image');

module.exports = (app, model) => {

    app.get('/relatorio/contatos', (req, res)=>{

        res.render('relatorio/contatos');

    })

    app.post('/relatorio/contatos', (req, res)=>{

      model.contato.findAll({
        where: {},
            //  raw: true,
             //all: true, 
             status : 1,
            // through : {attributes : ['nome', 'cidade', 'celular1', 'rua', 'bairro', 'data_nascimento']},
             include: [
                 { 
                   model: model.tag, 
                   //where : {id : req.body.lideranca},
                   through : {attributes : ['tags.id', 'tags.descricao', 'tags.grupo_tag_id']}, //'contato_tags'
                     
                   //  nested: true 
               //  { model: model.contato, as: 'responsavel' },
               //  { model: model.contato, as: 'evento_contatos' },    
                 }]
         }).then(contatos => {
           
        
          (async () => {
         
            try{

                let filter_contatos = await get_contatos_filter(contatos, req.body);

                res.render('relatorio/contatos_list', {list : filter_contatos})

            } finally {
               // client.release()
            }	  
           })().catch(e => console.log(e.stack)) // fim (async()
            
        });
    })
    
    app.post('/relatorio/agenda', (req, res)=>{

        model.evento.findAll({
            status : 1,
            //attributes : ['start', 'end', 'title', 'description', 'solicitante.id', 'responsavel.id'],
             include: [
                 { model: model.contato, as: 'solicitante' },
                 { model: model.contato, as: 'responsavel' },
                // { model: model.contato, as: 'evento_contatos' },    
               ]
         }).then(eventos => {
            
            (async () => {
         
                try{
    
                    let filter_eventos = await get_agenda_filter(eventos, req.body);
    
                    res.render('relatorio/agenda_list', {list : filter_eventos, moment : moment})
    
                } finally {
                   // client.release()
                }	  
               })().catch(e => console.log(e.stack)) // fim (async(
        })
    })
    
    app.post('/relatorio/agenda2', (req, res)=>{

        var inicio = `${moment(req.body.inicio, 'DD/MM/YYYY HH:mm:ss').format('L')} : 00:00:00`;
        var fim = `${moment(req.body.fim, 'DD/MM/YYYY HH:mm:ss').format('L')} : 23:59:59`;

        model.evento.findAll({
            status : 1,
            //attributes : ['start', 'end', 'title', 'description', 'solicitante.id', 'responsavel.id'],
             include: [
                // { model: model.contato, as: 'solicitante' },
                { model: model.contato, as: 'responsavel' },
                // { model: model.contato, as: 'evento_contatos' },    
               ],
               where :{
                
                //   start: {
                //       $gte:  moment.tz(inicio, "America/Porto_Velho")
                //     },
                //   end : {
                //     $lte : moment.tz(fim,  "America/Porto_Velho")
                //   } 
               }
         }).then(eventos => {
           
            var list = [];

            eventos.forEach(element => {
                
                var objeto = {
                    title : element.title,
                    codigo_qr : create_qr(element),
                    responsavel : element.responsavel,
                    end : element.end,
                    start : element.start,
                }

                list.push(objeto)
            });

            return list;
        }).then(list => {

            //res.json(list)
           res.render('relatorio/agenda_list', {list : list, moment : moment})
        })
    })

    app.get('/relatorio/agenda', (req, res)=>{

        res.render('relatorio/agenda')
    })
    
    app.get('/relatorio/get_bairro', (req, res)=>{

        res.json();
    })

    app.get('/relatorio/secao', (req, res)=>{
        
        var list = [];
       
        local_secao.forEach(element => {
            // coords:{lat:-8.762996,lng: -63.835537},
               var objeto = {
                  coords : {lat : Number(element.latitude), lng : Number(element.longitude)} , 
                  content : `Local: ${element.local}, Colégio: ${element.colegio}, Total: ${element.total}`,
               }

               list.push(objeto)
          });

        res.render('relatorio/colegios', {list : list} )
    })

   async  function  get_contatos_filter(contatos, paramentros) {
    
        console.log(paramentros)

        if(paramentros.lideranca != '')
            contatos = contatos.where(x=>  x.indicacao ==  Number(paramentros.lideranca));
        else if (paramentros.bairro != '') 
            contatos = contatos.where(x=> x.bairro != undefined &&  x.bairro.includes(paramentros.bairro));
        else if (paramentros.eleitoral != '')     
             contatos = contatos.where(x=>  x.local_de_votacao != undefined && x.local_de_votacao.includes(paramentros.local_de_votacao));
        else if (paramentros.data_nascimento != '')  
        
            contatos = contatos.where(x=> x.data_nascimento != undefined &&  moment(x.data_nascimento, 'DD/MM/YYYY HH:mm:ss') == moment(paramentros.data_nascimento, 'DD/MM/YYYY HH:mm:ss'));        

        return contatos;
    }

    async function get_agenda_filter(eventos, paramentros){
         
        if(paramentros.inicio != '')
            eventos = eventos.where(x=> x.start != undefined && x.end != undefined && moment(x.start, 'DD/MM/YYYY HH:mm:ss') >= moment(paramentros.inicio, 'DD/MM/YYYY HH:mm:ss') && moment(x.end, 'DD/MM/YYYY HH:mm:ss') <= moment(paramentros.fim, 'DD/MM/YYYY HH:mm:ss'));

        return eventos;
    }

    function create_qr(element){
      
        var svg_string = '';

        if (element.responsavel != undefined)
        {
            var text_link = `https://maps.google.com/?q=${element.responsavel.latitude},${element.responsavel.longitude}`;
            var svg_string = qr.imageSync(text_link, { type: 'svg' });
        }
         
        return svg_string;

    }
}
