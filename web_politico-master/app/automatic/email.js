var CronJob = require('cron').CronJob;
var nodemailer = require('nodemailer');
var moment = require('moment');
require('devbox-linq')

module.exports = (app, model)=> {
   
new CronJob('00 00 05 * * *', function() {
  
  var mes = (new Date().getMonth()+1);
  var date = new Date().getFullYear() + '-' + ((new Date().getMonth()) > 9 ?   ('1' + mes) :  ('0' + mes)   + '-' + new Date().getDate());

   model.evento.findAll({
    where:{
       // status : 1,
        start : {
           $gte : date + ' ' + '00:00:00',
        },
        end : {
         $lt :  date + ' ' + '23:59:59',
        }
    },
    include: [
     { model: model.contato, as: 'solicitante' },
     { model: model.contato, as: 'responsavel' },
     //{ model: model.contato, as: 'evento_contatos' },    
   ]
   }).then(eventos => {

    eventos.forEach(element => {
     
       if(element.solicitante != undefined && element.responsavel != undefined){
          var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'rafaelclaros.ro@gmail.com',
              pass: 'rc745296*'
            }});
        
          var mailOptions = {
            from: 'rafaelclaros.ro@gmail.com',
            to: element.solicitante.email1 + ',' + element.responsavel.email1,
            subject: element.title,
            text: element.description
        };
       
        transporter.sendMail(mailOptions, function(error, info){
            if (error)  console.log(error);
            else  console.log('Email sent: ' + info.response);
          });
         }  // fim if 
       }) // fim foreach
   });
}, null, true, 'America/Caracas');}