var express = require('express');
var router = express.Router();
var moment = require('moment');

var Forms = require('../models/formscomplited');
var FormsList = require('../models/formscomplited');
var Categories = require('../models/category');
/* GET users listing. */
router.get('/',function(req, res, next) {


    res.render('createfoms');



});

router.post('/get-all' , function (req, res, next) {
    console.log("13")
    Forms.find().lean().exec(function (err, result) {
        if(err){
            console.log(err)
        }
        var data = {
            data: result
        };
        res.send(data);

    })
});

router.post('/get-filled' , function (req, res, next) {
    var id = req.body.id;
    FormsList.find({
            $and : [
                {categoryId : id} , {created_at :  {
                        $gte: moment(req.body.startTime),
                        $lt: moment(req.body.endTime)
                    }}
            ]
        }, {formcomplite : 1}
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


router.post('/get-item' , function (req, res, next) {
    var id = req.body.id;
    Forms.find({
        _id : id
    }).lean().exec(function (err, data) {
        if(err){
            console.log(err)
        }


        res.send(data);

    })
});

router.post('/get-categories' , function (req, res, next) {

    Categories.find().lean().exec(function (err, data) {
        if(err){
            console.log(err)
        }

        res.send(data);

    })
});

router.post('/update-published', function (req, res, next) {
    Forms.findOneAndUpdate({_id: req.body.id}, {published: req.body.isPublished}, function (err) {
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

router.post('/saveEdited' , function (req, res, next) {
    var id = req.body.id;
    Forms.findById(id , function (err , form) {
        if(err) {
            console.log(err)
        }

        if(req.body.published == 'Yes') {
            form.title = req.body.title;
            form.category = req.body.category;
            form.published = true;
            form.form = req.body.htmlForm;
        }
        else{
            form.title = req.body.title;
            form.category = req.body.category;
            form.published = false;
            form.form = req.body.htmlForm;
        }
        form.save(function (err) {
            if (err) {
                res.send('Error')
            }
            else {
                var sms = "Forms Edit";
                res.send(sms);
            }
        });
    });

});

router.post('/delete-item' , function (req, res, next) {

    var time = moment(req.body.time);
    var inputUser = req.body.nome;
    var time2 = moment(req.body.time).add(1 , 'seconds');
    FormsList.deleteOne({
        $and : [
            {created_at : {$gte : time}} , {created_at : {$lte : time2}} , {createdBy: inputUser}
        ]

    }).lean().exec(function (err , result) {
        if(err) {
            console.log(err)
        }
        res.send(result)
    });
});



module.exports = router;