$(document).ready(function(){

        $('#calendar').fullCalendar({
          header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay,listWeek'
          },
          defaultView: 'month',
          defaultDate: Date.now(),
          navLinks: true, // can click day/week names to navigate views
          selectable: true,
          selectHelper: true,
          editable: true,
          
          loading: function(bool) {
            console.log('loading')
            $('#loading').toggle(bool);
          },
       
          select: function(startDate, endDate) {
         
          var agenda = {id : 0, title : '',    start : startDate.format('DD/MM/YYYY HH:mm:ss'), end : startDate.format('DD/MM/YYYY HH:mm:ss')};

            $('#id').val(agenda.id);
            $('#start').val(agenda.start);
            $('#end').val(agenda.end);
            $('#is_realizado').prop('checked',false); 
            $('#title').val('');
            $('#description').val('');
            $('#solicitante_id').val('')
            $('#responsavel_id').val('');
            $('#evento_contatos').val('')
            document.getElementById('formatted-address2').innerHTML = '';
            $('#solicitante_id').trigger("chosen:updated");
            $('#responsavel_id').trigger("chosen:updated");
            $('#evento_contatos').trigger("chosen:updated");
            $('.cancelar-evento').hide();
            $('.check-reuniao').hide();
            $('#exampleModal').modal('show')
            set_text_boxs_contato_reuniao('');
            document.getElementById('formatted-address').innerHTML = '';
            document.getElementById('formatted-address2').innerHTML = '';
            $('[href="#home"]').trigger('click');

          },
          
          eventDrop : function(event, delta, revertFunc){
           
            var fim = event.end == null ? moment( event.start.format('MM/DD/YYYY HH:mm:ss').toString()).add(2, 'hours') : event.end;
     
           var agenda = {id : event.id, title : event.title, start : event.start.format('MM/DD/YYYY HH:mm:ss'), 
                        responsavel_id : event.responsavel != undefined ? event.responsavel.id : null,
                        solicitante_id : event.solicitante != undefined ? event.solicitante.id : null, 
                        end : fim.format('MM/DD/YYYY HH:mm:ss'), convidados : event.evento_contatos, tipo : 'arrastar', status : event.status};
          
           ajax(agenda, revertFunc);
       
          },

          eventResize: function(event, delta, revertFunc) {

            var fim = event.end == null ? moment(event.start.format('MM/DD/YYYY HH:mm:ss').toString()).add(2, 'hours') : event.end; 
      
            var agenda = {id : event.id, title : event.title, start : event.start.format('MM/DD/YYYY HH:mm:ss'), 
                          end : fim.format('MM/DD/YYYY HH:mm:ss'), 
                          responsavel_id : event.responsavel != undefined ? event.responsavel.id : null,
                          solicitante_id : event.solicitante != undefined ? event.solicitante.id : null, 
                          convidados : event.evento_contatos, tipo : 'arrastar', status : event.status};
    
            ajax(agenda, revertFunc);
         
            },
    
           eventClick:  function(event, jsEvent, view) {
            
            var fim = event.end == null ? moment(event.start.format('MM/DD/YYYY HH:mm:ss').toString()).add(2, 'hours') : event.end;
            
            var agenda = {id : event.id, title : event.title, description : event.description, status : event.status,
                          responsavel_id : event.responsavel != undefined ? event.responsavel.id : null,
                          solicitante_id : event.solicitante != undefined ? event.solicitante.id : null, 
                          solicitante_text : event.solicitante != undefined ? event.solicitante.nome : '',
                          responsavel_text : event.responsavel != undefined ? event.responsavel.nome : '',
                          convidados : event.evento_contatos != undefined ? event.evento_contatos : [],
                          start : event.start.format('DD/MM/YYYY HH:mm'), 
                          end : fim.format('DD/MM/YYYY HH:mm')};

           $('#evento_contatos').empty()
           $('#solicitante_id').val('');
           $('#responsavel_id').val('');
           $('[href="#home"]').trigger('click');
           document.getElementById('formatted-address').innerHTML = '';
           document.getElementById('formatted-address2').innerHTML = '';
           set_text_boxs_contato_reuniao('')
           $.get('/agenda/get_convidados/', {id : agenda.id}, function(data){
          
              $.each(data.evento_contatos, function(i, e){
                  $('#evento_contatos').append('<option selected value=' + e.id + '> ' + e.nome  +'</option>')
                  $('#evento_contatos').trigger("chosen:updated");
              }) 
              var solicitante = data.solicitante != undefined ? data.solicitante : null;
              var responsavel = data.responsavel != undefined ? data.responsavel : null;
              if(solicitante != null)
               $('#solicitante_id').append('<option selected value=' + solicitante.id + '> ' + solicitante.nome  +'</option>')
              if(responsavel != null){
                $('#responsavel_id').append('<option selected value=' + responsavel.id + '> ' + responsavel.nome  +'</option>');
                
                 var objeto = {
                    formattedAddress : `${responsavel.rua}, ${responsavel.numero} - ${responsavel.bairro}, ${responsavel.cidade}, ${responsavel.cep}`,
                    latitude : responsavel.latitude,
                    longitude : responsavel.longitude,
                 }
                 set_endereco_cards(objeto); 
                 set_text_boxs_contato_reuniao(responsavel)   
              } 
            
              $('#solicitante_id').trigger("chosen:updated");
              $('#responsavel_id').trigger("chosen:updated");
           });  
         
            $('#id').val(agenda.id);
            $('#title').val(agenda.title);
            $('#description').val(agenda.description);
            $('#start').val(agenda.start);
            $('#end').val(agenda.end);
           // $('#solicitante_id').append('<option value="' + agenda.solicitante_id +'" selected="selected"> ' + agenda.solicitante_text + '</option>')
           // $('#responsavel_id').append('<option value="' + agenda.responsavel_id +'" selected="selected"> ' + agenda.responsavel_text + '</option>')
            $("input[name='status'][value='"+ agenda.status +"']").prop('checked', true);
            $('#solicitante_id').trigger("chosen:updated");
            $('#responsavel_id').trigger("chosen:updated");
            $('.cancelar-evento').show();
            $('.check-reuniao').show();
            $('#exampleModal').modal('show')
            
            }, 
          events: {
              url : '/agenda/get_json', error: function() {
                $('#script-warning').show();
              }
          }
        },);
        
        function ajax(agenda, revertFunc){

            $.ajax({
                method: "POST",
                url: "/agenda/send",
               // cache: false,
                //async: false,
                data: agenda,
            })
            .done(function(data) {
                sucesso();
                $('#exampleModal').modal('hide');

                if(data.tipo === 'update'){
                 
                    var item = $("#calendar").fullCalendar( 'clientEvents', data.id );
                    item[0].title = data.title;
                    item[0].description = data.description;
                    item[0].start = data.start;
                    item[0].end = data.end;
                    item[0].color = data.color;
                    console.log(item[0])
                    $('#calendar').fullCalendar('updateEvent',item[0]);

                }else{
                    $('#calendar').fullCalendar('renderEvent', data);
                } 
            })
            .fail(function(data) {
                erro();
                revertFunc();
                $('#exampleModal').modal('hide');
                $('.salvar').button('reset');
            })  
            .always(function(data) {
                $('.salvar').button('reset');
            });
        }

        $('.salvar').on('click', function(){
          
        var $this = $(this);
         $this.button('loading');

        var agenda = {
                id : $('#id').val(), 
                title : $('#title').val(), 
                description : $('#description').val(),
                solicitante_id : $('#solicitante_id').val(),
                responsavel_id :  $('#responsavel_id').val(),
                responsavel_text : $('#solicitante_id').text(),
                solicitante_text : $('#responsavel_id').text(),
                evento_contatos : '', // $('#evento_contatos').val(),
                status :  $('[name=status]:checked').val(),
                start : moment($('#start').val().toString(), 'DD/MM/YYYY HH:mm:ss').format('MM/DD/YYYY HH:mm:ss').toString(), 
                end :   moment($('#end').val().toString(), 'DD/MM/YYYY HH:mm:ss').format('MM/DD/YYYY HH:mm:ss').toString(), 
            } 
            ajax(agenda); 
        });
        
        $('.cancelar-evento').on('click', function(){
              
            var flag =  confirm('Deseja cancelar este evento');
           
            if(flag){

                // var item = $("#calendar").fullCalendar( 'clientEvents', $('#id').val());
                $('#calendar').fullCalendar('removeEvents', $('#id').val());

                $.get('/agenda/desabilitar', {id : $('#id').val() }, function(){
                    $('#exampleModal').modal('hide');
                })
            }
        });

    
        $('.myDatepicker').datetimepicker({
            format: 'DD/MM/YYYY HH:mm',
            locale: 'pt-br',
        });

        $(".myDatepicker").on("dp.change", function(e) {
            
            var end = new Date(moment($('#end').val().toString(), 'DD/MM/YYYY HH:mm:ss').format('MM/DD/YYYY HH:mm:ss').toString());
            var start = new Date(moment($('#start').val().toString(), 'DD/MM/YYYY HH:mm:ss').format('MM/DD/YYYY HH:mm:ss').toString());
  
            if( start > end){
                $('.salvar').prop('disabled', true);
                console.log('entrou aqui')
                atencao("Data Inicial é maior que Data Final");

            }else  $('.salvar').prop('disabled', false);

        });

       $('[data-toggle="tab"]').on('click', function(){
           if($(this).attr('href') == '#home'){
               $('.salvar').show();
               $('.cancelar-evento').show();
           }else{
            $('.salvar').hide();
            $('.cancelar-evento').hide();
           }
       })  

       $('#formatted-address').on('click', function(){

          let array_endereco =  $(this).text().split(',');
          
          if(array_endereco.length == 4){
   
            $('#cep').val(array_endereco[2]);
            $('#cidade').val(array_endereco[1].trim());
            $('#rua').val(array_endereco[0].trim());
            $('#bairro').val();
            $('#numero').val();
          }
          else {
            $('#rua').val(array_endereco[0].trim());
            $('#cep').val(array_endereco[3]);
            $('#cidade').val(array_endereco[1].trim());
            $('#numero').val(array_endereco[1].trim());
            $('#bairro').val(array_endereco[2]);
          }
          $('[href="#menu1"]').trigger('click');

       })
       
       $('#formatted-address2').on('click', function(){
          $('[href="#menu1"]').trigger('click');
       })

       $('.salvar-contato').on('click', function(){
            
            if($('#nome_agenda').val() == ''){
                atencao("O campo nome é obrigatório");
                $('#nome_agenda').focus();
            }else 
              add_contato()
       })

       $('#responsavel_id').on('change', function(){
        
    
           $.get('/contato/get_contato', {id :  $(this).val() }, function(data){
            
                if(data.latitude == 0.00000000){
                    local_endereco = `<ul class="list-group">
                    <li class="list-group-item">ATENÇÃO!!! INDIQUE A GEOREFERÊNCIA</li>
                </ul>`;
                }
                else{

                    var objeto = {
                    formattedAddress : `${data.rua}, ${data.numero} - ${data.bairro}, ${data.cidade}, ${data.cep}`,
                    latitude : data.latitude,
                    longitude : data.longitude,
                }
                set_endereco_cards(objeto);   
                set_text_boxs_contato_reuniao(data)   
                } 
            });
       });

    function erro(){
        new PNotify({
            title: 'Ops !!!',
            text: 'Erro ao salvar agenda!',
            type: 'error',
            hide: false,
            styling: 'bootstrap3'
        });
    }
     
    function sucesso(msg){
        new PNotify({
            title: 'OK !!!',
            text: msg,
            type: 'success',
            hide: true,
            styling: 'bootstrap3'
        });
    }

    function atencao(msg){
        new PNotify({
            title: 'Atenção !!!',
            text: msg,
            type: 'danger',
            hide: true,
            styling: 'bootstrap3'
        });
    }

    function set_endereco_cards(objeto){

     var local_endereco = `<ul class="list-group">
                  <li class="list-group-item">${objeto.formattedAddress}</li>
                  <li class="list-group-item">   <a target="_blank" href="https://maps.google.com/?q=${objeto.latitude},${objeto.longitude}"> Link gps ou google maps, https://maps.google.com/?q=${objeto.latitude},${objeto.longitude} </a> </li>
                </ul>`; 
      
      document.getElementById('formatted-address').innerHTML = local_endereco;          
      document.getElementById('formatted-address2').innerHTML = local_endereco;
    }

    function set_text_boxs_contato_reuniao(objeto){
        $('#rua').val(objeto.rua);
        $('#cep').val(objeto.cep);
        $('#cidade').val(objeto.cidade);
        $('#numero').val(objeto.numero);
        $('#bairro').val(objeto.bairro);
        $('#nome_agenda').val(objeto.nome)
        $('[name="celular1"]').val(objeto.celular1) 
        $('#contato_agenda_id').val(objeto.id);
        $('#latitude').val(objeto.latitude)
        $('#longitude').val(objeto.longitude)
        document.getElementById('location-input').value = ''; 
        if(objeto.quem_indicou != undefined)
           $('#indicacao').append('<option selected value=' + objeto.quem_indicou.id + '> ' + objeto.quem_indicou.nome  +'</option>');
        $('#indicacao').trigger("chosen:updated"); 
        if(objeto.id != undefined){
           $($('.salvar-contato')[1]).show();
           $($('.salvar-contato')[0]).hide();
        }else{
            $($('.salvar-contato')[1]).hide();
            $($('.salvar-contato')[0]).show();
        }   
    }

    function add_contato(){
        let contato_agenda = {
            id : $('#contato_agenda_id').val(),   
            quem_indicou : $('#indicacao').val(),
            nome : $('#nome_agenda').val(), 
            celular : $('[name="celular1"]').val(), 
            cep : $('#cep').val(),
            rua : $('#rua').val(),
            cidade : $('#cidade').val(),
            numero : $('#numero').val(),
            bairro : $('#bairro').val(),
            latitude : $('#latitude').val(),
            longitude : $('#longitude').val(),
           }
          
           $.ajax({
               method: "POST",
               url: "/agenda/salvar_contato",
               // cache: false,
               //async: false,
               data: contato_agenda,
           }).done(function(data){
               
               if(data.has_celular != false){
                   $('#responsavel_id').append('<option selected value=' + data.id + '> ' + data.nome  +'</option>')
                   $('#responsavel_id').trigger("chosen:updated");
                   $('[href="#menu1"]').closest('li').removeClass('active')
                   $('[href="#home"]').trigger('click');
                   sucesso("Contato vinculado a reunião")
               }
               else  atencao("Esse contato já existe!!!")
           })
           .fail(function(data){

           })
           .always(function(data){
           })
    }
var map = new google.maps.Map(document.getElementById('map'), {
    center:{lat:-8.762996,lng: -63.835537},
    zoom: 15});
var markers = [];

google.maps.event.addListener(map,'click',function(event) {
    
    setMapOnAll(null);
    get_Axio(map, event);
});

function setMapOnAll(map, event) {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
  }

function get_Axio(map, event){
    axios.get('https://maps.googleapis.com/maps/api/geocode/json',{
        params:{
          address: event.latLng.lat() + ',' +event.latLng.lng() ,
          key:'AIzaSyDsORswvfIOdE5ZfCHwW5cFs7Tkb9dfHd8'
        }
      })
      .then(function(response){
            // Formatted Address
        var formattedAddress = response.data.results[0].formatted_address;
          // Geometry
         var lat = response.data.results[0].geometry.location.lat;
         var lng = response.data.results[0].geometry.location.lng;

         var objeto = {
            formattedAddress : formattedAddress,
            latitude : lat,
            longitude : lng,
        }

        set_endereco_cards(objeto); 

        $('#latitude').val(lat)
        $('#longitude').val(lng)

        setMapOnAll(null);
        var marker = new google.maps.Marker({
            position: {lat: lat, lng: lng},
            map: map,
            icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
          });
        
          var infoWindow = new google.maps.InfoWindow({
            content: formattedAddress
          });

          marker.addListener('click', function(){
            infoWindow.open(map, marker);
          });
          markers.push(marker);
      });
}  

$('#location-form').on('submit', function(){
    
    axios.get('https://maps.googleapis.com/maps/api/geocode/json',{
        params:{
          address: document.getElementById('location-input').value,
          key:'AIzaSyDsORswvfIOdE5ZfCHwW5cFs7Tkb9dfHd8'
        }
      })
      .then(function(response){
          // Formatted Address
        var formattedAddress = response.data.results[0].formatted_address;
           // Geometry
        var lat = response.data.results[0].geometry.location.lat;
        var lng = response.data.results[0].geometry.location.lng;

        var objeto = {
            formattedAddress : formattedAddress,
            latitude : lat,
            longitude : lng,
        }

        set_endereco_cards(objeto);   
        
        $('#latitude').val(lat)
        $('#longitude').val(lng)

       var map = new google.maps.Map(document.getElementById('map'), {
            center:{lat:lat,lng: lng},
            zoom: 15});

        setMapOnAll(null);
        var marker = new google.maps.Marker({
            position: {lat: lat, lng: lng},
            map: map,
            icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
          });
        
          var infoWindow = new google.maps.InfoWindow({
            content: formattedAddress
          });

          marker.addListener('click', function(){
            infoWindow.open(map, marker);
          });
          markers.push(marker);

        google.maps.event.addListener(map,'click',function(event) {
    
            setMapOnAll(null);
            get_Axio(map, event);
        });
         
      });
    
    return false;
});  })