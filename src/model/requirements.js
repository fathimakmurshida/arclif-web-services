const mongoose = require('mongoose')
const Schema = mongoose.Schema    //schema definition

const RequirementSchema = new Schema({
    login_id: { type: Schema.Types.ObjectId, ref: "login_tb", required: true },
    paymentplan_id:{ type: Schema.Types.ObjectId, ref: "paymentplan_tb", required: true },
    description:{type:String},
    requirement_status:{type:String}
})

var RequirementsData = mongoose.model('requirements_tb', RequirementSchema) //model creation
module.exports = RequirementsData;
