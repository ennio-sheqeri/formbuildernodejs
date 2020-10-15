
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var timestamps = require('mongoose-timestamp');

var formscompSchema = new Schema({
    title : String,
    formcomplite : Array,
    createdBy: String,
    categoryId : String,
    manager: String
});

formscompSchema.plugin(timestamps,{
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

//create the model class

var Formscomplited = mongoose.model('Forms_Complited', formscompSchema , 'Forms_Complited');

module.exports = Formscomplited;