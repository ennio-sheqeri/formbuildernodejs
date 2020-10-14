$(document).ready(function(){
    var table = $('#all-users').DataTable({
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
        "pageLength": 10,
        responsive: true,
        ajax: {
            url: "/users/get-users",
            type: "POST",
            dataSrc: "data"
        },

        aoColumns: [
            {
                "mData": "_id"
            }, {
                "mData": "username"
            }, {
                "mData": "name"
            },
            {
                "mData": null,
                "bSortable": false,
                "mRender": function (o) {
                    return '<input type="checkbox" class="isAdmin" data-toggle="toggle" data-isAdmin= '+o.isAdmin+' data-on="SI" data-off="NO" ></td>'
                }
            },
            {
                "mData": null,
                "bSortable": false,
                "mRender": function (o) {
                    return '<button type="button" data-toggle="modal" data-target="#updateUsers" data-backdrop="static" data-keyboard="false" class="btn btn-primary modify-users-access" id="'+ o._id +'" onclick="Modify()"><i class="fa fa-check"></i>Modifica Accesso</button>'
                }
            }
        ],
        "fnDrawCallback": function() {
            initToggleAdmin();
        }
    });

    /*data-toggle="modal" data-target="#updateUsers" data-backdrop="static" data-keyboard="false"  */
    $('#all-users').off().on('click' ,'.toggle-group' ,  function () {
        $('.isAdmin').change(function () {
            var id = $(this).closest('tr').find('td:first-of-type').text();
            var isAdmin = $(this).prop('checked');
            $.post("/users/update-admin", {
                id: id,
                isAdmin: isAdmin
            }).done(function (data) {
                if (data === 'ok') {
                    location.reload();
                }
                else {
                    swal('Errore con il database');
                }
            });
        });
    });



});

function initToggleAdmin() {

    $('.isAdmin').each(function () {

        var isPublished = $(this).attr('data-isAdmin');


        if (isPublished === 'true'){
            $(this).bootstrapToggle('on');
        }
        else {
            $(this).bootstrapToggle('off');
        }
    });
}

function Modify() {
    $('#all-users').off().on('click' , '.modify-users-access' , function (e) {
        console.log($(this));
        var id = $(this).attr('id');

        $.ajax({
            url: 'users/get-usersCampaigns',
            type: 'post',
            data : {
                id : id
            },
            success: function (userRoles) {
                $.ajax({
                    url: 'users/get-categories',
                    type: 'post',
                    success: function (result) {
                        $('#updateUsers').find('#categories').append('<option value="None Selected">Tutte le categorie</option>');
                        for(var i =0 ; i < result.length ; i ++) {
                            var append;
                            append = '<option value="'+result[i].categoryName+'">'+result[i].categoryName+'</option>';
                            $('#updateUsers').find('#categories').append(append);
                        }
                        if(userRoles[0].categoriesToShow.length > 0) {
                            for(var z = 0 ; z < userRoles[0].categoriesToShow.length ; z++ ) {
                                $('select#categories').find('option').each(function() {
                                    if($(this).val() == userRoles[0].categoriesToShow[z]){
                                        $(this).attr('selected' , true)
                                    }
                                });
                            }
                        }





                        $('#categories').multiselect({
                            enableFiltering: true
                        });
                    }

                });

            }
        });

        var modal = $('#updateUsers');

        modal.off().on('click' , '.saveData' , function () {
            var roles = JSON.stringify($('.categories').val());
            $.ajax({
                url: 'users/update-userCampaigns',
                type: 'post',
                data : {
                    id : id,
                    roles : roles
                },
                success : function (response) {
                    swal(response);
                    $('.confirm').on('click' , function () {
                        location.reload();
                    })
                }
            })
        });

        $('.close').off().on('click'  , function () {
            $('#categories').multiselect('destroy');
            $('#categories').empty();
            $('#all-users').DataTable().destroy();
            $('#all-users tbody').empty();
            var table = $('#all-users').DataTable({
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
                "pageLength": 1,
                responsive: true,
                ajax: {
                    url: "/users/get-users",
                    type: "POST",
                    dataSrc: "data"
                },

                aoColumns: [
                    {
                        "mData": "_id"
                    }, {
                        "mData": "username"
                    },{
                        "mData": "ccmsId"
                    }, {
                        "mData": "name"
                    }, {
                        "mData": "title"
                    },
                    {
                        "mData": null,
                        "bSortable": false,
                        "mRender": function (o) {
                            return '<input type="checkbox" class="isAdmin" data-toggle="toggle" data-isAdmin= '+o.isAdmin+' data-on="SI" data-off="NO" ></td>'
                        }
                    },
                    {
                        "mData": null,
                        "bSortable": false,
                        "mRender": function (o) {
                            return '<button type="button" data-toggle="modal" data-target="#updateUsers" data-backdrop="static" data-keyboard="false" class="btn btn-primary modify-users-access" id="'+ o._id +'" onclick="Modify()"><i class="fa fa-check"></i>Modifica Accesso</button>'
                        }
                    }
                ],
                "fnDrawCallback": function() {
                    initToggleAdmin();
                }
            });
            $('#all-users').off().on('click' , '.toggle-group' , function () {
                $('.isAdmin').change(function () {
                    var id = $(this).closest('tr').find('td:first-of-type').text();
                    var isAdmin = $(this).prop('checked');
                    $.post("/users/update-admin", {
                        id: id,
                        isAdmin: isAdmin
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
    });



}