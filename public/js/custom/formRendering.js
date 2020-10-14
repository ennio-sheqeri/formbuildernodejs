$(document).ready(function(){
    var labelsAndNames = [];
    var campCreato = [];

    $.ajax({
        url : 'home/get-users',
        type: 'post',
        success : function (userRoles) {
            $.ajax({
                url: 'home/get-categories',
                type: 'post',
                success : function (categories) {
                    $.ajax({
                        url : 'home/get-campionamenti',
                        type: 'post',
                        success: function (campionamenti) {
                            for(var z = 0 ; z < userRoles[0].categoriesToShow.length ; z++ ) {
                                for(var i = 0 ; i < categories.length; i ++) {
                                    if(userRoles[0].categoriesToShow[z] == 'None Selected') {
                                        var result = '<div class="box box-default collapsed-box" style="cursor: pointer">'
                                        result += '<div class="box-header with-border" data-widget="collapse"><i class="fa fa-plus"></i>'
                                        result += '<h3 class="box-title">'+ categories[i].categoryName +'</h3>'
                                        result += '</div>'
                                        result += '<div class="box-body">'
                                        result += '<ul id="ul_o list-append" style="list-style: none">'
                                        for(var j = 0 ; j < campionamenti.length; j++){
                                            if(categories[i].categoryName == campionamenti[j].categoria) {
                                                result += '<li><a id="'+campionamenti[j]._id+'" class="get-id" >'+campionamenti[j].titolo+'</a></li>'

                                            }
                                        }
                                        result += '</ul>'
                                        result += '</div>'
                                        result += '</div>'
                                        $('#append-js').append(result);
                                    }
                                    else {
                                        if(userRoles[0].categoriesToShow[z] == categories[i].categoryName) {
                                            var result = '<div class="box box-default collapsed-box" style="cursor: pointer">'
                                            result += '<div class="box-header with-border" data-widget="collapse"><i class="fa fa-plus"></i>'
                                            result += '<h3 class="box-title">'+ categories[i].categoryName +'</h3>'
                                            result += '</div>'
                                            result += '<div class="box-body">'
                                            result += '<ul id="ul_o list-append" style="list-style: none">'
                                            for(var j = 0 ; j < campionamenti.length; j++){
                                                if(categories[i].categoryName == campionamenti[j].categoria) {
                                                    result += '<li><a id="'+campionamenti[j]._id+'" class="get-id" >'+campionamenti[j].titolo+'</a></li>'

                                                }
                                            }
                                            result += '</ul>'
                                            result += '</div>'
                                            result += '</div>'
                                            $('#append-js').append(result);
                                        }
                                    }

                                }
                            }
                            $('#append-js').on('click' , '.get-id' , function () {
                                $('#campionamento-rendered').removeClass('hidden');
                                $('#user-filled-data').addClass('hidden');
                                labelsAndNames.length = 0;
                                var id = $(this).attr('id');
                                $.ajax({
                                    url: 'home/get-items',
                                    type: 'Post',
                                    data: {
                                        id: id
                                    },
                                    success: function (response) {

                                        $('.camp-titolo').text('').text(response[0].titolo);

                                        var categoryId = response[0]._id;



                                        $('.fb-render').formRender({
                                            dataType: 'json',
                                            formData: response[0].campionamento[0]
                                        });
                                        var arrayCamp = JSON.parse(response[0].campionamento[0]);
                                        console.log(arrayCamp);
                                        for(var i = 0; i < arrayCamp.length; i++) {
                                            const pushCamp = {};

                                            pushCamp.label = arrayCamp[i].label;
                                            pushCamp.name = arrayCamp[i].name;
                                            labelsAndNames.push(pushCamp);
                                        }
                                        labelsAndNames['catId'] = categoryId;

                                        $.ajax({
                                            url: 'home/get-filled-by-user',
                                            type: 'post',
                                            data: {
                                                id: labelsAndNames.catId,
                                                titolo : $('.camp-titolo').text()
                                            },
                                            success: function (data) {
                                                $('#get-number-of-filled').html(data.data)
                                            }
                                        })


                                    }

                                });
                            })
                        }
                    })

                }
            });
        }
    });

    $('#save-rendered').on('submit', function (e) {
        e.preventDefault();
        const input = {};
        var formData = $(this).serializeArray();
        console.log(formData);
        for(var j = 0; j < formData.length ; j++){
            for(var z = 0; z <labelsAndNames.length; z++) {
                if(formData[j].name === labelsAndNames[z].name) {

                    input[labelsAndNames[z].label] = formData[j].value;

                }
            }
        }
        input['Creato Da'] = $('#user-name').text();
        input['CCMS ID'] = $('#user-ccmsid').text();
        input['Creato A'] = new Date();
        campCreato.push(input );



        var jsonCampCreato = JSON.stringify(campCreato[0]);

        $.ajax({
            url: 'home/saveFilledForm',
            type: 'post',
            data: {
                formdata : jsonCampCreato,
                title : $('.camp-titolo').text(),
                CampId: labelsAndNames.catId
            },
            success : function (salvato) {
                swal(salvato);
                $('.confirm').on('click' , function () {
                    location.reload();
                })
            }
        });
    });
    
    $('#get-number-of-filled').on('click' , function () {
        $('#campionamento-rendered').addClass('hidden');
        $('#user-filled-data').removeClass('hidden');

        if ( $.fn.DataTable.isDataTable( '#compilati-table-by-user' ) ) {

            $.fn.dataTable.ext.errMode = 'none';
            var id = labelsAndNames.catId;



            $.ajax({
                url: "/home/get-filled",
                type: 'post',
                data:  {
                    "id" : id
                },
                success : function (result) {

                    var firstItem = [];

                    firstItem.push(JSON.parse(result.data[0].campionamentoCompilato[0]));
                    for (var o = 0; o < result.data.length; o++) {

                        if (o > 0 && o < result.data.length) {
                            const item2 = (JSON.parse(result.data[o].campionamentoCompilato[0]));
                            firstItem.push(item2);

                        }

                    }
                    var my_columns = [];
                    $.each((firstItem[firstItem.length - 1]), function (key, value) {
                        var my_item = {};
                        my_item.data = key;
                        my_item.title = key;
                        my_columns.push(my_item);
                    });
                    $('#compilati-table-by-user').DataTable().destroy();
                    $('#compilati-table-by-user').empty();
                    $('#compilati-table-by-user').on( 'error.dt', function ( e, settings, techNote, message ) {
                        console.log( 'An error has been reported by DataTables: ', message );
                    } ).DataTable({
                        data: firstItem,
                        "columns": my_columns
                    });



                }

            })
        }
        else {
            var id = labelsAndNames.catId;
            $.fn.dataTable.ext.errMode = 'none';


            $('#compilati-table-box').removeClass('hidden');
            $.ajax({
                url: "/home/get-filled",
                type: 'post',
                data:  {
                    "id" : id
                },
                success : function (result) {
                    var firstItem = [];

                    firstItem.push(JSON.parse(result.data[0].campionamentoCompilato[0]));
                    for (var o = 0; o < result.data.length; o++) {

                        if (o > 0 && o < result.data.length) {
                            const item2 = (JSON.parse(result.data[o].campionamentoCompilato[0]));
                            firstItem.push(item2);

                        }

                    }
                    var my_columns = [];
                    $.each((firstItem[firstItem.length - 1]), function (key, value) {
                        var my_item = {};
                        my_item.data = key;
                        my_item.title = key;
                        my_columns.push(my_item);
                    });
                    $('#compilati-table-by-user').on( 'error.dt', function ( e, settings, techNote, message ) {
                        console.log( 'An error has been reported by DataTables: ', message );
                    } ).DataTable({
                        data: firstItem,
                        "columns": my_columns
                    });



                }

            })
        }

        $('#go-back').on('click' , function () {
            $('#campionamento-rendered').removeClass('hidden');
            $('#user-filled-data').addClass('hidden');
        })

    })

});