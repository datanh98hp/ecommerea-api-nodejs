const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    icon:String,
    colotr:String,//#0021
    
})

exports.Category = mongoose.model('Category', categorySchema);
