var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var timestamps = require('mongoose-timestamp');

var formSchema = new Schema({
    title:String,
    form:Array,
    category:String,
    published: Boolean,
    createdBy: String
});

formSchema.plugin(timestamps,{
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

//Create the model class

var Createforms= mongoose.model('createforms', formSchema, 'createforms');
module.exports=Createforms;