const mongoose = require('mongoose')

const Schema = mongoose.Schema    //schema definition

const AdonServiceSchema = new Schema({
    adonservicename:{ type: String, required: true },
    adonserviceamount:{ type: String, required: true },
})

var AdonServiceData = mongoose.model('adonservice_tb',AdonServiceSchema) //model creation
module.exports=AdonServiceData;


