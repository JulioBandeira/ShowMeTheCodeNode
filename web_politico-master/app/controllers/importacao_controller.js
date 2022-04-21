var funcionarios = require('../../json-funcionarios/funcionarios.json');

var xlsx = require('node-xlsx');
const multer = require('multer');

//MULTER CONFIG: to get file photos to temp server storage
const multerConfig = {
    //specify diskStorage (another option is memory)
    storage: multer.diskStorage({

      //specify destination
      destination: function(req, file, next){
        next(null, 'public/uploads/excel');
      },

      //specify the filename to be unique
      filename: function(req, file, next){
        //console.log(file);
        //get the file mimetype ie 'image/jpeg' split and prefer the second value ie'jpeg'
        const ext = file.mimetype.split('/')[1];
        //set the file fieldname to a unique name containing the original name, current datetime and the extension.
        next(null, file.fieldname + '-' + Date.now() + '.'+ext);
      }
    }),
  };

module.exports = (app, model)=>{

   // importar();
   
    app.get('/importacao/for_excel', function(req, res){
        
        res.render('importacao/excel');
    })


    app.post('/importacao/for_excel', multer(multerConfig).single('photo'), function(req, res){
       
    //    var array2 =  [ 'SD PM', 0
    //     'OZIELSON ARAÚJO DE CASTRO', 1
    //     'Rua Vista Alegre, 2221, setor 04', 2
    //     '9241-1272', 3
    //     '9950-0318' ]; 4


        console.log(req.file)

        var array = xlsx.parse(req.file.path); // parses a file
        
        var list = [];
        array[0].data.forEach(element=> {
          var objeto = {
              patente : element[0],
              nome : element[1],
              endereco : element[2],
              telefone1 : element[3], // != undefined ? element[3].replace('-', '') : '',
              telefone2 : element[4], // != undefined ? element[4].replace('-', '') : '',
              //telefone1 : element[3] != undefined ? element[3].replace('-', '') : '',
              // telefone2 : element[4] != undefined ? element[4].replace('-', '') : '',
          }
          list.push(objeto)
        })
        
      list.forEach(element =>{

        model.contato.create({
            nome : element.nome,
            endereco : element.endereco,
            empresa : 'PMRO',
            profissao : 'POLICIAL - ' + element.patente,
            telefone1 : element.telefone1 != undefined ? element.telefone1.toString().replace('-', '') : '',
            telefone2 : element.telefone2 != undefined ? element.telefone2.toString().replace('-', '') : '',

        }).then(contato=>{
             
            model.contato_tags.create({
                ContatoId : contato.id,
                TagId : 119,
            })
            
            res.json('ok');
        });

      })   
        

        res.json(list) // render('importacao/excel');
    })

    function importar(){

      funcionarios.data.forEach(fun => {
            model.contato.create({
                nome : fun.Nome,
                profissao : fun.Profissao != undefined ? fun.Profissao : '',
                empresa: fun.Empresa != undefined ? fun.Empresa : '',
                cidade : fun.Cidade != undefined ? fun.Cidade : '',
                bairro : fun.Bairro != undefined ? fun.Bairro : '',
                rua : fun.logradouro != undefined ? fun.logradouro : '',
                celular1 : fun.telefone != undefined ? fun.telefone : '',
                tipo_de_contato : ['contato'],
                tipo_pessoa : ['pessoa_fisica'],
                local_de_votacao : 'ZONA:  21, LOCAL: Indefinido, ENDER: Indefinido, BAIRRO: Indefinido, MUNICÍPIO: Indefinido'
            });
        });
    }
}

