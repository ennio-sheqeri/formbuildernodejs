var express = require('express');
var router = express.Router();

var Category = require('../models/category');
var Forms = require('../models/createform');
var FromsComplited = require('../models/formscomplited');

const _ = require('lodash');
/* GET users listing. */
router.get('/',function(req, res, next) {

    res.render('home');

});


router.post('/get-items' , function (req, res, next) {
    var id = req.body.id;
    Forms.find({
        _id: id
    }).lean().exec(function (err, response) {
        if(err){
            console.log(err)
        }
        else {
            res.send(response)
        }
    })

});

router.post('/get-forms' , function (req, res, next) {
    Forms.find({
        published : true
    }).lean().exec(function (err, forms) {
        if(err) {
            console.log(err)
        }
        res.send(forms);
    })
});

router.post('/get-category' , function (req , res, next) {
    Category.find({
        published : true
    }).lean().exec(function (err, categories) {
        if(err) {
            console.log(err)
        }
        res.send(categories);
    })
});

router.post('/saveFilledForm' , function (req, res, next) {
    var data = req.body.formdata;
    var title = req.body.title;
    var campId = req.body.CampId;

    var fromComplited = new FromsComplited ({
        title : title,
        formcomplite : data,
        categoryId : campId,
        createdBy : req.user.name,
        manager: req.user.manager
    });
    var save;
    fromComplited.save(function (err) {

        if(err) {
            console.log(err);
            save = 'Error during save forms';
            res.send(save);
        }
        else {
            save = 'Forms save ';
            res.send(save);
        }
    });

});

router.post('/get-filled-by-user' , function (req, res, next) {



    FromsComplited.find({
        createdBy : req.user.name,
        categoryId : req.body.id
    }).count().exec(function (err , filled) {
        if(err) {
            console.log(err)
        }
        else {
            var data = {
                data: filled
            };
            res.send(data)
        }
    })
});

router.post('/get-filled' , function (req, res, next) {
    var id = req.body.id;

    FromsComplited.find(
        {categoryId : id , createdBy : req.user.name} , {formcomplite : 1 ,  _id: 0}
    ).lean().exec(function (err , results) {
        if(err) {
            console.log(err)
        }


        var result = {
            data: results
        };
        res.send(result);
    })



});
/*
router.post('/get-users' , function (req, res, next) {
    var id = req.user.name;
    console.log(id);
    Users.find({
        name: id
    },{categoriesToShow:1, _id:0}).lean().exec(function (err , userRoles) {
        if(err) {
            console.log(err)
        }
        res.send(userRoles)
    })
})
*/
module.exports = router;