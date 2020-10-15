$(document).ready(function(){

    var table = $('#created_forms').DataTable({
        "paging": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "dom": 'Bfrtip',
        "autoWidth": true,
        "scrollX": true,
        "buttons": [
            'csv', 'copy', 'pdf'
        ],
        "pageLength": 30,
        responsive: true,
        ajax: {
            url: "/createfoms/get-all",
            type: "POST",
            dataSrc: "data"
        },

        aoColumns: [
            {
                "mData": "_id"
            }, {
                "mData": "title"
            },{
                "mData": "category"
            }, {
                "mData": "createdBy"
            }, {
                "mData": "created_at"
            },
            {
                "mData": null,
                "bSortable": false,
                "mRender": function (o) {
                    return '<input type="checkbox" class="isPublished" data-toggle="toggle" data-isPublished= '+o.published+' data-on="Yes" data-off="NO">'
                }
            },
            {
                "mData": null,
                "bSortable": false,
                "mRender": function (o) {
                    return '<button type="button" onclick="showDetails()" class="btn btn-sm btn-primary toogle-modal"><i class="fa fa-table"></i> hape</button>'
                }
            },
            {
                "mData": null,
                "bSortable": false,
                "mRender": function (o) {
                    return '<button type="button" id="'+ o._id +'" onclick="editDetails()" class="btn btn-sm btn-default edit-data"><i class="fa fa-edit"></i> Edit</button>'
                }
            }
        ],
        "fnDrawCallback": function() {
            initTogglePublished();
        }
    });



    $('#created_forms').off().on('click' , '.toggle-group' , function () {
        $('.isPublished').change(function () {

            var id = $(this).closest('tr').find('td:first-of-type').text();
            var isPublished = $(this).prop('checked');
            $.post("/forms/update-published", {
                id: id,
                isPublished: isPublished
            }).done(function (data) {
                if (data === 'ok') {
                    location.reload();
                }
                else {
                    swal('Error in DB!');
                }
            });
        });
    })
});


    function showDetails() {

        $('#created_forms').off().on('click', '.toogle-modal' , function () {

            function cb(start, end) {
                $('#fromToRangeWage span').html(start.format('DD/MM/YYYY') + ' - ' + end.format('DD/MM/YYYY'));
            }
            $('#fromToRangeWage').daterangepicker({
                startDate: moment().subtract(6, 'days'),
                endDate: moment(),
                ranges: {
                    'Today': [moment(), moment()],
                    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                    'This Month': [moment().startOf('month'), moment().endOf('month')],
                    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                }
            }, cb);
            var drp = $('#fromToRangeWage').data('daterangepicker');
            var id = $(this).closest('tr').find('td:first-of-type').text();

            $.fn.dataTable.ext.errMode = 'none';

            $.ajax({
                url: "/forms/get-filled",
                type: 'post',
                data:  {
                    "id" : id,
                    startTime : drp.startDate.format() ,
                    endTime : drp.endDate.format()
                },

                success : function (result) {
                    if(result.data.length == 0) {
                        swal("No data Inserted");
                        $('#form-table-box').addClass('hidden');
                    }
                    else {
                        if ( $.fn.DataTable.isDataTable( '#forms-table' ) ) {
                            $('#forms-table').DataTable().destroy();
                            $('#forms-table').empty();
                        }
                        $('#first-box').hide();
                        $('#form-table-box').removeClass('hidden');
                        var firstItem = [];

                        firstItem.push(JSON.parse(result.data[0].formcomplite[0]));
                        for (var o = 0; o < result.data.length; o++) {

                            if (o > 0 && o < result.data.length) {
                                const item2 = (JSON.parse(result.data[o].formcomplite[0]));
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
                        var table = $('#forms-table').on( 'error.dt', function ( e, settings, techNote, message ) {
                            console.log( 'An error has been reported by DataTables: ', message );
                        } ).DataTable({
                            "paging": true,
                            "searching": true,
                            "ordering": true,
                            "info": true,
                            "dom": 'Bfrtip',
                            "autoWidth": true,
                            "scrollX": true,
                            "buttons": [
                                'csv', 'copy', 'pdf'
                            ],
                            responsive: true,
                            data: firstItem,
                            "columns": my_columns
                        });
                        $('#forms-table tbody').on('click' , 'tr' , function () {
                            if ( $(this).hasClass('selected') ) {
                                $(this).removeClass('selected');
                            }
                            else {
                                var time = $(this).find('td:nth-last-of-type(1)').text();
                                var creatoDa = $(this).find('td:nth-last-of-type(3)').text();
                                table.$('tr.selected').removeClass('selected');
                                $(this).addClass('selected');
                                $('#deleteRow').click( function () {

                                    $.ajax({
                                        url: 'forms/delete-item',
                                        type: 'post',
                                        data : {
                                            time: time,
                                            nome: creatoDa
                                        },
                                        success : function (result) {
                                            table.row('.selected').remove().draw( false );
                                        }
                                    })

                                } );
                            }
                        })

                    }
                }

            });


            $('#fromToRangeWage').on('apply.daterangepicker', function (ev, picker) {
                //do something, like clearing an input
                $.fn.dataTable.ext.errMode = 'none';

                $.ajax({
                    url: "/forms/get-filled",
                    type: 'post',
                    data:  {
                        "id" : id,
                        startTime : drp.startDate.format(),
                        endTime : drp.endDate.format()
                    },

                    success : function (result) {
                        if(result.data.length == 0) {
                            swal("No data Insert in DB");
                            $('#forms-table tbody').empty();
                        }
                        else {
                            if ( $.fn.DataTable.isDataTable( '#forms-table' ) ) {
                                $('#forms-table').DataTable().destroy();
                                $('#forms-table').empty();
                            }
                            $('#first-box').hide();
                            $('#form-table-box').removeClass('hidden');
                            var firstItem = [];

                            firstItem.push(JSON.parse(result.data[0].formcomplite[0]));
                            for (var o = 0; o < result.data.length; o++) {

                                if (o > 0 && o < result.data.length) {
                                    const item2 = (JSON.parse(result.data[o].formcomplite[0]));
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
                            var table = $('#forms-table').on( 'error.dt', function ( e, settings, techNote, message ) {
                                console.log( 'An error has been reported by DataTables: ', message );
                            } ).DataTable({
                                "paging": true,
                                "searching": true,
                                "ordering": true,
                                "info": true,
                                "dom": 'Bfrtip',
                                "autoWidth": true,
                                "scrollX": true,
                                "buttons": [
                                    'csv', 'copy', 'pdf'
                                ],
                                responsive: true,
                                data: firstItem,
                                "columns": my_columns
                            });
                            $('#forms-table tbody').on('click' , 'tr' , function () {
                                if ( $(this).hasClass('selected') ) {
                                    $(this).removeClass('selected');
                                }
                                else {
                                    var time = $(this).find('td:nth-last-of-type(1)').text();
                                    var creatoDa = $(this).find('td:nth-last-of-type(3)').text();
                                    table.$('tr.selected').removeClass('selected');
                                    $(this).addClass('selected');
                                    $('#deleteRow').click( function () {

                                        $.ajax({
                                            url: 'forms/delete-item',
                                            type: 'post',
                                            data : {
                                                time: time,
                                                nome: creatoDa
                                            },
                                            success : function (result) {
                                                table.row('.selected').remove().draw( false );
                                            }
                                        })

                                    } );
                                }
                            })

                        }
                    }

                });


            });


            $('#go-back-onDetails').off().on('click' , function () {
                $('#form-table-box').addClass('hidden');
                $('#first-box').show();
                $('#created_forms').DataTable().destroy();
                $('#created_forms tbody').empty();
                var table = $('#created_forms').DataTable({
                    "paging": true,
                    "searching": true,
                    "ordering": true,
                    "info": true,
                    "dom": 'Bfrtip',
                    "autoWidth": true,
                    "scrollX": true,
                    "buttons": [
                        'csv', 'copy', 'pdf'
                    ],
                    "pageLength": 30,
                    responsive: true,
                    ajax: {
                        url: "/forms/get-all",
                        type: "POST",
                        dataSrc: "data"
                    },

                    aoColumns: [
                        {
                            "mData": "_id"
                        }, {
                            "mData": "title"
                        },{
                            "mData": "category"
                        }, {
                            "mData": "createdBy"
                        }, {
                            "mData": "created_at"
                        },
                        {
                            "mData": null,
                            "bSortable": false,
                            "mRender": function (o) {
                                return '<input type="checkbox" class="isPublished" data-toggle="toggle" data-isPublished= '+o.published+' data-on="YES" data-off="NO"></td>'
                            }
                        },
                        {
                            "mData": null,
                            "bSortable": false,
                            "mRender": function (o) {
                                return '<button type="button" onclick="showDetails()" class="btn btn-sm btn-primary toogle-modal"><i class="fa fa-table"></i> hape</button>'
                            }
                        },
                        {
                            "mData": null,
                            "bSortable": false,
                            "mRender": function (o) {
                                return '<button type="button" id="'+ o._id +'" onclick="editDetails()" class="btn btn-sm btn-default edit-data"><i class="fa fa-edit"></i> Edit</button>'
                            }
                        }
                    ],
                    "fnDrawCallback": function() {
                        initTogglePublished();
                    }
                });
                $('#created_forms').off().on('click' , '.toggle-group' , function () {
                    $('.isPublished').change(function () {

                        var id = $(this).closest('tr').find('td:first-of-type').text();
                        var isPublished = $(this).prop('checked');
                        $.post("/forms/update-published", {
                            id: id,
                            isPublished: isPublished
                        }).done(function (data) {
                            if (data === 'ok') {
                                location.reload();
                            }
                            else {
                                swal('Error in DB!');
                            }
                        });
                    });
                })
            })


        })
    }

     function editDetails() {



         $('#created_forms').off().on('click', '.edit-data' , function () {
             $('#form-table-box').addClass('hidden');
             $('#first-box').hide();
             $('.go-back').hide();


             var editForm;

             $('.edit-fb-render').show();
             $('.fb-editor').empty();
             $('.form-editing').hide();
             $.ajax({
                 url: 'forms/get-categories',
                 type: 'post',

                 success: function (data) {

                    for(var z = 0 ; z < data.length ; z ++) {
                        $('#editCategoria').append('<option value="'+ data[z].categoryName +'">'+data[z].categoryName+'</option>')
                    }
                 }
             });


             var id = $(this).attr('id');
             $.ajax({
                 url: 'forms/get-item',
                 type: 'post',
                 data : {
                     'id' : id
                 },
                 beforeSend: function () {
                     $('.loader').removeClass('hidden')
                 },
                 success : function (data) {
                     $('.loader').addClass('hidden');
                     editForm = data[0].formcomplite[0];
                     $('#edit-form').removeClass('hidden');
                     $('.edit-camp-title').text('').text(data[0].title);
                     $('#edit-id').val(data[0]._id);

                     $('.edit-fb-render').formRender({
                         dataType: 'json',
                         formData: editForm
                     });

                     $('#editCategoria').val( [data[0].categoria]);

                     //go-back-without-modification

                     $('.formRender-edit-form').off().on('click' , function () {
                         $('.go-back').show();
                         $('.go-back-without-modification').hide();
                         $('.formRender-edit-form').hide();
                         $('.edit-fb-render').hide();
                         $('.form-editing').show();

                         $('#camp-edit-title').val(data[0].title);


                         var template = $('.fb-editor');
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
                             formData : data[0].formcomplite[0],
                             onSave: function onSave(evt, formData) {saveForm(formData);}
                         };
                         template.formBuilder(options);
                     })



                 }
             })
         });
         $('.go-back-without-modification').off().on('click' , function () {
            $('#edit-form').addClass('hidden');
            $('#first-box').show();
             $('#created_forms').DataTable().destroy();
             $('#created_forms tbody').empty();
             var table = $('#created_forms').DataTable({
                 "paging": true,
                 "searching": true,
                 "ordering": true,
                 "info": true,
                 "dom": 'Bfrtip',
                 "autoWidth": true,
                 "scrollX": true,
                 "buttons": [
                     'csv', 'copy', 'pdf'
                 ],
                 "pageLength": 30,
                 responsive: true,
                 ajax: {
                     url: "/forms/get-all",
                     type: "POST",
                     dataSrc: "data"
                 },

                 aoColumns: [
                     {
                         "mData": "_id"
                     }, {
                         "mData": "title"
                     },{
                         "mData": "category"
                     }, {
                         "mData": "createdBy"
                     }, {
                         "mData": "created_at"
                     },
                     {
                         "mData": null,
                         "bSortable": false,
                         "mRender": function (o) {
                             return '<input type="checkbox" class="isPublished" data-toggle="toggle" data-isPublished= '+o.published+' data-on="YES" data-off="NO"></td>'
                         }
                     },
                     {
                         "mData": null,
                         "bSortable": false,
                         "mRender": function (o) {
                             return '<button type="button" onclick="showDetails()" class="btn btn-sm btn-primary toogle-modal"><i class="fa fa-table"></i> hape</button>'
                         }
                     },
                     {
                         "mData": null,
                         "bSortable": false,
                         "mRender": function (o) {
                             return '<button type="button" id="'+ o._id +'" onclick="editDetails()" class="btn btn-sm btn-default edit-data"><i class="fa fa-edit"></i> Edit</button>'
                         }
                     }
                 ],
                 "fnDrawCallback": function() {
                     initTogglePublished();
                 }
             });
             $('#created_forms').off().on('click' , '.toggle-group' , function () {
                 $('.isPublished').change(function () {

                     var id = $(this).closest('tr').find('td:first-of-type').text();
                     var isPublished = $(this).prop('checked');
                     $.post("/forms/update-published", {
                         id: id,
                         isPublished: isPublished
                     }).done(function (data) {
                         if (data === 'ok') {
                             location.reload();
                         }
                         else {
                             swal('Error in DB!');
                         }
                     });
                 });
             })
         })
     }

function initTogglePublished() {

    $('.isPublished').each(function () {

        var isPublished = $(this).attr('data-isPublished');


        if (isPublished === 'true'){
            $(this).bootstrapToggle('on');
        }
        else {
            $(this).bootstrapToggle('off');
        }
    });
}

function saveForm(formData) {
    var titleVal = $('#camp-edit-title').val();
    var category = $('#editCategoria').val();
    var published = $('#editPublished').val();
    var id = $('#edit-id').val();




    if( titleVal == '' ) {
        swal({
            title: "Make sure the title is not empty",
            type: "warning"
        })
    }
    else {
        $.ajax({

            type: "POST",
            url: "/forms/saveEdited",
            data: {
                "htmlForm": formData,
                "title": titleVal,
                "category" : category,
                "published": published,
                "id":id
            },
            success: function (sms) {
                swal(sms);
                $('.confirm').on('click' , function () {
                    location.reload();
                })


            }
        })
    }

}


function ShowByDate() {

}