const { check, oneOf, validationResult } = require('express-validator/check');

module.exports = function( req	,res){

	//  req.assert('email1', 'E-mail inválido').isEmail();
	//  req.checkBody('cpf', 'Email already exists').custom(value =>{
	// 	 console.log(req.body.cpf)
	// 	 return true;
	//  })
	//  req.assert('cnpj', 'CPF Inválido').matches("/^([0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}|[0-9]{2}\.?[0-9]{3}\.?[0-9]{3}\/?[0-9]{4}\-?[0-9]{2})$/");
	 // req.assert('password', 'Sua senha dever conter de 6 a 10 caracteres').len(6,10);

	var validacaoErros = req.validationErrors() || [];

	if(validacaoErros.length > 0){
		validacaoErros.forEach(function(e){
			req.flash('erro', e.msg);
		});
		return false;
	}
	return true;
}