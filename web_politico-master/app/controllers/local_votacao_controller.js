var local_votacoes = require('../../json-local-localidade/local-votacao.json');
var local_secao = require('../../json-local-localidade/eleitor_sum_secao.json');
var axios = require('axios');
var fs = require('fs');
require('devbox-linq');
var _ = require('lodash');

module.exports = (app, model)=>{

    app.get('/local_votacao/get_locais', (req, res)=>{
        var list = [];
 
    var text = removerAcentos(req.query.query);    

    var localidades = local_votacoes.data
        .filter(x=> x.municipio !== undefined && x.local !== undefined && x.endereco !== undefined && x.bairro !== undefined)
        .filter(x=> removerAcentos(x.municipio).includes(text) || x.zona.trim() == text.trim() 
                    || removerAcentos(x.local).includes(text) || removerAcentos(x.endereco).includes(text)
                    || removerAcentos(x.bairro).includes(text)    );
  
        localidades.forEach(elemento => {
            var objeto = {
             
                id : 'ZONA: '  + elemento.zona  + ', LOCAL: ' + elemento.local + ', ENDER: ' + elemento.endereco + ', BAIRRO: ' + elemento.bairro + ', MUNICÍPIO: ' + elemento.municipio,
                text :  'ZONA: '  + elemento.zona  + ', LOCAL: ' + elemento.local + ', ENDER: ' + elemento.endereco + ', BAIRRO: ' + elemento.bairro + ', MUNICÍPIO: ' + elemento.municipio,
            }

            list.push(objeto);
        });
        
        res.json({results : list});
    });

    app.get('/local_votacao/set_coordenada', function(req, res){
    
    var list = [];
   // local_votacoes.data.filter(x=> x.municipio !== undefined && x.local !== undefined && x.endereco !== undefined && x.bairro !== undefined)
    //local_coordenadas.filter(x=> x.latitude == '' && x.longitude == '')
    local_votacoes.data.filter(x=> x.municipio !== undefined && x.local !== undefined && x.endereco !== undefined && x.bairro !== undefined).forEach(element => {
            
            var para_end = element.endereco + ' ' + element.bairro + ' ' + element.municipio;
            
            axios.get('https://maps.googleapis.com/maps/api/geocode/json',{
                params:{
                address: para_end,
                key:'AIzaSyDsORswvfIOdE5ZfCHwW5cFs7Tkb9dfHd8'
            }}).then(function(response){ 

                console.log(response.data.results.length)
                var local = {};

                if(response.data.results.length == 0){
                    
                    local = {
                        zona : element.zona,
                        municipio: element.municipio,
                        local: element.local,
                        endereco : element.endereco,
                        bairro : element.bairro,
                        codigo : element.bairro,
                        latitude : '',
                        longitude : '',
                    }

                    list.push(local)
                }else{
                   

                     local = {
                        zona : element.zona,
                        municipio: element.municipio,
                        local: element.local,
                        endereco : element.endereco,
                        bairro : element.bairro,
                        codigo : element.bairro,
                        latitude : response.data.results[0].geometry.location.lat,
                        longitude : response.data.results[0].geometry.location.lng
                    }
                    list.push(local)
                }

                return list;
             }).then(list=>  {
                
                var json = JSON.stringify(list);
                fs.writeFileSync('./arquivo_json'+".json", json, 'utf8', function(err) {
                    if(err)  return console.log(err);
                }); 
                 console.log(list)
             });  

        });
    })

    app.get('/local_votacao/get_local', function(req, res){
 
     var list = [];
     var lista =  _(local_secao.Plan1).map((objec, keys)=> ({
        
            zona : objec.zona,
            municipio : objec.municipio , 
            local_votacao:  objec.local_votacao,
            endereco:  objec.endereco ,
            total :  Number(objec.total),

     }))
     .groupBy("local_votacao")
     .map((objs, key)=> ({

         colegio : key, 
         endereco : `${objs[0].endereco} ${objs[0].municipio}`,
         total : _.sumBy(objs, 'total')
        }));

        lista.forEach(element=>{
            axios.get('https://maps.googleapis.com/maps/api/geocode/json',{
                params:{
                address: element.endereco,
                key:'AIzaSyDsORswvfIOdE5ZfCHwW5cFs7Tkb9dfHd8'
            }}).then(function(response){ 

                console.log(response.data.results.length)
                
                var local = {};
                
                if(response.data.results.length == 0){
                    
                    local = {
                        colegio : element.colegio,
                        local: element.endereco,
                        total : element.total,
                        latitude : '',
                        longitude : '',
                    }

                    list.push(local)
                }else{
                   

                     local = {
                        colegio : element.colegio,
                        local: element.endereco,
                        total : element.total,
                        latitude : response.data.results[0].geometry.location.lat,
                        longitude : response.data.results[0].geometry.location.lng
                    }
                    list.push(local)
                }

                return list;

            }).then(list=>  {
                
                var json = JSON.stringify(list);
                fs.writeFileSync('./arquivo_secao_json'+".json", json, 'utf8', function(err) {
                    if(err)  return console.log(err);
                }); 
                 console.log(list)
             });  
        })

        res.json(lista)
    })

var map={"â":"a","Â":"A","à":"a","À":"A","á":"a","Á":"A","ã":"a","Ã":"A","ê":"e","Ê":"E","è":"e","È":"E","é":"e","É":"E","î":"i","Î":"I","ì":"i","Ì":"I","í":"i","Í":"I","õ":"o","Õ":"O","ô":"o","Ô":"O","ò":"o","Ò":"O","ó":"o","Ó":"O","ü":"u","Ü":"U","û":"u","Û":"U","ú":"u","Ú":"U","ù":"u","Ù":"U","ç":"c","Ç":"C"};

function get_soma(itens){

    itens.map(function(values, keys){
        return values;
    })
   
}

function removerAcentos(s){

           return s.toUpperCase().replace(/[\W\[\] ]/g,
            function(a){
                return map[a]||a}
            ) 
};

}

    