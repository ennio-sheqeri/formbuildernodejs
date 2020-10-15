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
            url: '/adminFormsCreate/newCategory',
            type: 'Post',
            data: {
                adminnameCa : $('#admintextNome').val(),
                adminCatPublished : $('#adminCatPublished').val()
            },
            success : function (exist) {
                if(exist == 'Create a category') {
                    $('#adminCreateCat').modal('hide');
                    swal(exist);
                    $('.confirm').on('click' , function () {
                        location.reload();
                    })
                }
                else if (exist == 'Error during category creation'){
                    $('#adminCreateCat').modal('hide');
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
            title: "Make sure the title is not empty",
            type: "warning"
        })
    }
    else {
        $.ajax({

            type: "POST",
            url: "/adminFormsCreate/save",
            data: {
                "htmlForm": formData,
                "title": titleVal,
                "category" : category,
                "published": published
            },
            success: function (exist) {
                swal(exist);
                if(exist == 'Form exist in DB') {
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
