
   function campos_pessoa_juridica_hide(){
    $('.cnpj').hide();
    $('.razao_social').hide();
    $('.nome_fantasia').hide();
    $('.cpf').show();
}

function campos_pessoa_juridica_show(){
$('.cnpj').show();
$('.razao_social').show();
$('.nome_fantasia').show();
$('.cpf').hide();
}

$('.js-example-basic-single').select2();

$('.select2').each( function(){

    $(this).select2({
        ajax: {
          url: $(this).data('url'),
          data: function (params) {
            var query = {
              query: params.term,
              type: 'public'
            }
            // Query parameters will be ?search=[term]&type=public
            return query;
          }
        }
      });
});

// $('.select2').select2({
//     ajax: {
//       url: '/contato/get_tag',
//       data: function (params) {
//         var query = {
//           query: params.term,
//           type: 'public'
//         }
  
//         // Query parameters will be ?search=[term]&type=public
//         return query;
//       }
//     }
//   });

campos_pessoa_juridica_hide();

// $(".chosen-select").chosen({ placeholder_text_single: "Selecione...", allow_single_deselect: true });

// $('.chosen').chosen({
//     allow_single_deselect: true,
//     placeholder_text_single: "Selecione um funcionário",
//     no_results_text: "Funcionário não encontrado"
// });

$('.chosen-ajax-deselect').each( function(){
    $(this).ajaxChosen({
        type: 'GET',
        url:  $(this).data('url'),
        jsonTermKey: "query",
        dataType: 'json',
        },
        null,
        {
        width: "100%",
        allow_single_deselect: true,
        placeholder_text_single: "Selecione...",
    });
});

// $('.chosen-ajax-indicacao').ajaxChosen({
//     type: 'GET',
//     url: '/contato/get_contatos', // $(this).data('url'),
//     jsonTermKey: "query",
//     dataType: 'json',
//     },
//     null,
//     {
//     width: "100%",
//     allow_single_deselect: true,
//     placeholder_text_single: "Selecione...",
// });

// $('.chosen-ajax-local').ajaxChosen({
//         type: 'GET',
//         url: $(this).data('url'),
//         jsonTermKey: "query",
//         dataType: 'json',
//     },
//     null,
//     {
//         width: "100%",
//         allow_single_deselect: true,
//         placeholder_text_single: "Selecione...",
// });

// $('.chosen-ajax-bairro').ajaxChosen({
//     type: 'GET',
//     url: $(this).data('url'),
//     jsonTermKey: "query",
//     dataType: 'json',
// },
// null,
// {
//     width: "100%",
//     allow_single_deselect: true,
//     placeholder_text_single: "Selecione...",
// });


$('.search-end').on('blur change', function () {

$.ajax({
url: 'https://api.postmon.com.br/v1/cep/' + $('#cep').val().replace('-', ''),
type:"GET",
dataType: "json",
success: function(data){
             
            $('#bairro').val(data.bairro);  
            $('#rua').val(data.logradouro);
            var estado_cidade = data.estado + ' - ' + data.cidade; 
            $('#cidade').val(estado_cidade);
            $('#estado').val(estado);
            $('#latitude').val('');
            $('#longitude').val('   ');

            var cep = $('#cep').val(),
            numero = $('#numero').val();
           // R. Cardeal da Silva, 335, Ribeira do Pombal - BA, 48400-000, Brasil
            var para_end = numero === '' ? ('cep ' + cep) : ($('#rua').val() +  ', ' + $('#numero').val() + ', ' + $('#bairro').val() + ', ' + data.cidade + ' - ' + data.estado  + ', ' + $('#cep').val() + ', Brasil'); 
            console.log(para_end);
                axios.get('https://maps.googleapis.com/maps/api/geocode/json',{
                    params:{
                    address: para_end,
                    key:'AIzaSyDsORswvfIOdE5ZfCHwW5cFs7Tkb9dfHd8'
                }})  
                .then(function(response){ 

                    console.log(response.data.results.length)

                    if(response.data.results.length == 0){
                        erro();
                    }else{

                        var endereco = {
                        
                            latitude : response.data.results[0].geometry.location.lat,
                            longitude : response.data.results[0].geometry.location.lng

                        }
                            $('#latitude').val(endereco.latitude);
                            $('#longitude').val(endereco.longitude);
                    }
                 });


     }, 
error : function(){
        erro(); 
   
 },
});
})

$('#tipo_pessoa').on('change', function(){

if($(this).val() == 'pessoa_fisica'){
    campos_pessoa_juridica_hide();
}else{
    campos_pessoa_juridica_show();
  
}
})

$.get('/auth/get_info', function(data){
    $('#usuario_session').text(data)
})

function erro(){
    new PNotify({
        title: 'Ops !!!',
        text: 'CEP/Latitude/Longitude não encotrado!',
        type: 'error',
        hide: true,
        styling: 'bootstrap3'
    });
}




