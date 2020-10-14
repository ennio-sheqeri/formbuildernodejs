var express = require('express');
var router = express.Router();

var Category = require('../models/category');
var Forms = require('../models/createform');
/* GET users listing. */
router.get('/',function(req, res, next) {
    res.render('categories');
});

router.post('/save', function (req, res, next) {
    var category = req.body.nameCa;
    var creatoDa = req.user.name;
    var publishCat = req.body.publicareCa;
    var categories;
    var exist;
    if(publishCat == 'Yes') {
        categories = new Category({
            categoryName : category,
            createdBy : creatoDa,
            published: true
        });

        Category.find({
            categoryName: req.body.nameCa
        }).lean().exec(function (err, result) {
            if(err) {
                console.log(err);
            }
            if(result != '') {
                exist = 'Category exist in DB';
                res.send(exist);
            }
            else {
                categories.save(function (err) {
                    if(err) {
                        exist = 'Problem during find category';
                        res.send(exist);
                    }
                    else {
                        exist = 'Categroy create';
                        res.send(exist);
                    }
                })
            }


        });
    }
    else {
        categories = new Category({
            categoryName : category,
            createdBy : creatoDa,
            published: false
        });

        Category.find({
            categoryName: req.body.nameCa
        }).lean().exec(function (err, result) {
            if(err) {
                console.log(err);
            }
            if(result != '') {
                exist = 'Category exist in DB';
                res.send(exist);
            }
            else {
                categories.save(function (err) {
                    if(err) {
                        exist = 'Problem during find category';
                        res.send(exist);
                    }
                    else {
                        exist = 'Categroy create';
                        res.send(exist);
                    }
                })
            }


        });
    }



});

router.post('/get-all' , function (req, res, next) {
    Category.find().lean().exec(function (err, result) {
        if(err){
            console.log(err)
        }
        var data = {
            data: result
        };
        res.send(data)

    })
});

router.post('/forms' , function (req, res, next) {
    var title = req.body.title;
    Forms.find({
        categoria : title
    }).lean().exec(function (err, result) {
        if(err){
            console.log(err)
        }
        var data = {
            data: result
        };
        res.send(data)

    })
});


router.post('/update-published',  function (req, res, next) {
    Category.findOneAndUpdate({_id: req.body.id}, {published: req.body.isPublished}, function (err) {
            if (err) {
                console.log(err);
                res.send({err: 'Error in DB!'})
            }
            else {
                res.send('ok');
            }
        }
    );
});

module.exports = router;