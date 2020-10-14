$(document).ready(function(){

    var options = {
         editOnAdd: true,
         controlOrder: [
             'text',
             'textarea'
         ],
        disabledAttrs: [
            'placeholder',
            'access',
            'value'
        ],
        dataType: 'json',
        onSave: function onSave(evt, formData) {saveForms(formData);}
     };
    var formBuilder =  $("#formBuilder").formBuilder(options);


    $('#adminaddnewCategory').on('click' , function () {
        $.ajax({
            url: '/adminCreazione/newCategory',
            type: 'Post',
            data: {
                adminnameCa : $('#admintextNome').val(),
                adminCatPublished : $('#adminCatPublished').val()
            },
            success : function (exist) {
                if(exist == 'Categoria e stato creato') {
                    $('#adminCreazioneCat').modal('hide');
                    swal(exist);
                    $('.confirm').on('click' , function () {
                        location.reload();
                    })
                }
                else if (exist == 'E stato un problema nell creazione della categoria'){
                    $('#adminCreazioneCat').modal('hide');
                    swal(exist);
                    $('.confirm').on('click' , function () {
                        location.reload();
                    })

                }
                else {
                    swal(exist)
                }

            }
        })
    });


});


function saveForms(formData) {
    var titleVal = $('#camp-title').val();
    var category = $('#categoria').val();
    var published = $('#published').val();


    if( titleVal == '' ) {
        swal({
            title: "Sicurati che il titolo non e vuoto",
            type: "warning"
        })
    }
    else {
        $.ajax({

            type: "POST",
            url: "/adminCreazione/save",
            data: {
                "htmlForm": formData,
                "title": titleVal,
                "category" : category,
                "published": published
            },
            success: function (exist) {
                swal(exist);
                if(exist == 'Campionamento esiste sull database') {
                    //do nothing
                }
                else {
                    $('.confirm').on('click' , function () {
                        location.reload();
                    })
                }

            }
        })
    }

}
