var express = require('express');
var bodyParser = require('body-parser')
const consign = require('consign');
const models = require('./app/models');
var session = require('express-session');
var expressValidator = require('express-validator');
var flash = require('express-flash');
//const Nexmo = require('nexmo');
var app = express();
const fileUpload = require('express-fileupload');



app.use(session({ resave: true, saveUninitialized: true, secret: 'ntalk',
                  maxAge: 24 * 60 * 60 * 1000 // 24 hours
 }));
 
//  app.get('*', (req, res, next) => {
  
//     if (req.headers["x-forwarded-proto"] === "https"){
//         return next();
//     }
//     res.redirect("https://" + req.headers.host + req.url);  
   
// });

//For BodyParser
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());


//For Handlebars
app.set('views', './app/views/');
app.use(express.static(__dirname + '/public')) //Serves resources from public folder
app.set('view engine', '.ejs');
app.use(expressValidator());
app.use(fileUpload());
app.use(flash());

models.sequelize.sync().then(function() {
    console.log('Data Base ativo!!!')
}).catch(function(err) {
    console.log(err, "Algum erro no database!!!")
});

consign({})
     .then('./app/automatic/')
	 .then('./app/controllers/')
     .into(app, models);


app.use(function(req, res, next) 
{    
     res.status(404); 
     res.render('error_server/page_404');
 }); 

// app.use(function(error, req, res, next) 
// {
//      res.status(500); 
//      res.render('error_server/page_500');
// })

// app.use(function(error, req, res, next) 
// {
//      res.status(403); 
//      res.render('error_server/page_403');
// })


app.listen(3000, function(err) {
 
    if (!err)
        console.log("APP Político está ativo");
    else console.log(err)
 
});

