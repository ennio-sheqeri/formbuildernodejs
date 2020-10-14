$(document).ready(function(){




        $('#addnewCategory').off().on('click' , function () {
            $.ajax({
                url: '/categories/save',
                type: 'Post',
                data: {
                    nameCa : $('#textNome').val(),
                    publicareCa : $('#catPublished').val()
                },
                success : function (exist) {
                    if(exist == 'Categoria e stato creato') {
                        $('#myModal').modal('hide');
                        swal(exist);
                        $('.confirm').on('click' , function () {
                           location.reload();
                        })
                    }
                    else if (exist == 'E stato un problema nell creazione della categoria'){
                        $('#myModal').modal('hide');
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



    var table = $('#categorie_create').DataTable({
        "paging": true,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": true,
        ajax: {
            url: "/categories/get-all",
            type: "POST",
            dataSrc: "data"
        },
        "pageLength": 30,
        aoColumns: [
            {
                "mData": "_id"
            }, {
                "mData": "categoryName"
            }, {
                "mData": null,
                "bSortable": false,
                "mRender": function (o) {
                    return '<input type="checkbox" class="isCatPublished" data-toggle="toggle" data-isPublished= '+o.published+' data-on="SI" data-off="NO"></td>'
                }
            },{
                "mData": "createdBy"
            }, {
                "mData": "created_at"
            },
            {
                "mData": null,
                "bSortable": false,
                "mRender": function (o) {
                    return '<button type="button" onclick="showCatDetails()" data-title="'+o.categoryName+'" class="btn btn-sm btn-primary show-camp-of-cat"><i class="fa fa-table"></i> Piu Dettagli</button>'
                }
            }
        ],
        "fnDrawCallback": function() {
            initToggleCatPublished();
        }
    });

    $('#categorie_create').off().on('click' , '.toggle-group' , function () {
        $('.isCatPublished').change(function () {

            var id = $(this).closest('tr').find('td:first-of-type').text();
            var isPublished = $(this).prop('checked');
            $.post("/categories/update-published", {
                id: id,
                isPublished: isPublished
            }).done(function (data) {
                if (data === 'ok') {
                    location.reload();
                }
                else {
                    swal('Errore con il database');
                }
            });
        });
    })






});

function showCatDetails() {
    $('#categorie_create').off().on('click', '.show-camp-of-cat', function () {
        var title = $(this).attr('data-title');
        var table;
        $('#categorie').addClass('hidden');
        $('#campionamenti_di_categoria').removeClass('hidden');
        $('.campionamenti-di').text('').text("Campionamenti di " + title);
        if ( $.fn.DataTable.isDataTable( '#campionamenti_categoria' ) ) {
            $('#campionamenti_categoria').DataTable().destroy();
            $('#campionamenti_categoria tbody').empty();
            table = $('#campionamenti_categoria').DataTable({
                "paging": true,
                "lengthChange": true,
                "searching": true,
                "ordering": true,
                "info": true,
                "autoWidth": true,
                ajax: {
                    url: "/categories/campionamenti",
                    type: "POST",
                    data: {
                        title: title
                    },
                    dataSrc: "data"
                },
                aoColumns: [
                    {
                        "mData": "_id"
                    }, {
                        "mData": "title"
                    }, {
                        "mData": "categoria"
                    }, {
                        "mData": "createdBy"
                    }, {
                        "mData": "created_at"
                    }
                ]
            });
        }
        else {

            table = $('#campionamenti_categoria').DataTable({
                "paging": true,
                "lengthChange": true,
                "searching": true,
                "ordering": true,
                "info": true,
                "autoWidth": true,
                ajax: {
                    url: "/categories/campionamenti",
                    type: "POST",
                    data: {
                        title: title
                    },
                    dataSrc: "data"
                },
                aoColumns: [
                    {
                        "mData": "_id"
                    }, {
                        "mData": "title"
                    }, {
                        "mData": "categoria"
                    }, {
                        "mData": "createdBy"
                    }, {
                        "mData": "created_at"
                    }
                ]
            });
        }

        $('#cat-go-back').off().on('click' , function () {
            $('#campionamenti_di_categoria').addClass('hidden');
            $('#categorie').removeClass('hidden');
            $('#categorie_create').DataTable().destroy();
            $('#categorie_create tbody').empty();
            var table = $('#categorie_create').DataTable({
                "paging": true,
                "lengthChange": true,
                "searching": true,
                "ordering": true,
                "info": true,
                "autoWidth": true,
                ajax: {
                    url: "/categories/get-all",
                    type: "POST",
                    dataSrc: "data"
                },
                "pageLength": 30,
                aoColumns: [
                    {
                        "mData": "_id"
                    }, {
                        "mData": "categoryName"
                    }, {
                        "mData": null,
                        "bSortable": false,
                        "mRender": function (o) {
                            return '<input type="checkbox" class="isCatPublished" data-toggle="toggle" data-isPublished= '+o.published+' data-on="SI" data-off="NO"></td>'
                        }
                    },{
                        "mData": "createdBy"
                    }, {
                        "mData": "created_at"
                    },
                    {
                        "mData": null,
                        "bSortable": false,
                        "mRender": function (o) {
                            return '<button type="button" onclick="showCatDetails()" data-title="'+o.categoryName+'" class="btn btn-sm btn-primary show-camp-of-cat"><i class="fa fa-table"></i> Piu Dettagli</button>'
                        }
                    }
                ],
                "fnDrawCallback": function() {
                    initToggleCatPublished();
                }
            });

            $('#categorie_create').off().on('click' , '.toggle-group' , function () {
                $('.isCatPublished').change(function () {

                    var id = $(this).closest('tr').find('td:first-of-type').text();
                    var isPublished = $(this).prop('checked');
                    $.post("/categories/update-published", {
                        id: id,
                        isPublished: isPublished
                    }).done(function (data) {
                        if (data === 'ok') {
                            location.reload();
                        }
                        else {
                            swal('Errore con il database');
                        }
                    });
                });
            })
        })
    })
}


function initToggleCatPublished() {

    $('.isCatPublished').each(function () {

        var isPublished = $(this).attr('data-isPublished');


        if (isPublished === 'true'){
            $(this).bootstrapToggle('on');
        }
        else {
            $(this).bootstrapToggle('off');
        }
    });
}
