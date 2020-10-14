var express = require('express');
var router = express.Router();
var Forms = require('../models/createform');
var Category = require('../models/category');
router.get('/',function (req,res,next){
    res.render('admin');
});

router.post('/save',function (req,res,next){
   var title= req.body.title;
    var data = req.body.htmlForm;
    var category = req.body.category;
    var published = req.body.published;
if(published=='yes') {
    var form = new Forms({
        title: title,
        form: data,
        category: category,
        published: true,
        createdBy: req.user.name
        });
    }
    else{
        var form = new Forms({
        title: title,
        form: data,
        category: category,
        published: false,
        createdBy: req.user.name
    });
}
    Forms.find({
        title:title,
        category:category
    }).lean().exec(function (err,result){
        if(err){
            console.log(err);
        }
        if(result!=''){
            var exist = 'Forms exist in DB';
            res.send(exist);
        }
        else{
            form.save(function (err){
                if(err){
                    var exist = 'error during save form in DB';
                    res.send(exist);
                }
                else{
                    var exist = 'Form created successfully'
                    res.send(exist);
                }
            })
        }
    })
});

router.post('/newCategory',function (req,res,next){
    var category = req.body.adminnameCa;
    var userCreate = req.user.name;
    var publishedCat = req.body.adminCatPublished;
    var categories;
    var exist;
    if(publishedCat=='Yes')
    {
        categories =new Category({
            categoryName : category,
            createdBy : userCreate,
            published: true
        });
        Category.find({
            categoryName:req.body.nameCa
        }).lean().exec(function (err,result){
            if(err){
                console.log(err);
            }
            if(result!=''){
                exist='Category exits in Db';
                res.send(exist);
            }
            else {
                categories.save(function (err){
                    if(err){
                        exist='Error during save forms in DB';
                        res.send(exist);
                    }
                    else{
                        exist = 'Form created successfully'
                        res.send(exist);
                    }
                })
            }
        });
    }
    else{
        categories =new Category({
            categoryName : category,
            createdBy : userCreate,
            published: false
        });
        Category.find({
            categoryName:req.body.nameCa
        }).lean().exec(function (err,result){
            if(err){
                console.log(err);
            }
            if(result!=''){
                exist='Category exits in DB';
                res.send(exist);
            }
            else {
                categories.save(function (err){
                    if(err){
                        exist='Error during save forms in DB';
                        res.send(exist);
                    }
                    else{
                        exist = 'Form created successfully'
                        res.send(exist);
                    }
                })
            }
        });
    }
});
module.exports = router;