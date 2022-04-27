const mongoose = require("mongoose");
const  Schema  = mongoose.Schema;


const BuldingDetailsSchema = new Schema({
    no_of_floors: {
        type: Number,
    },
    total_area: {
        type:Number,
    },
    no_of_bedrooms: {
        type: Number,
    },
    attached_bathrooms
    : {
        type:Number,
    },
    design_type: {
        type: String,
    },
    home_requirements: {
        type: Array,default:[]
    },
    total_budget
    : {
        type: Number,
    },
    login_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'login_tb'
        
	},
});

const BuldingDetails = mongoose.model('BuildingDetails', BuldingDetailsSchema);


module.exports = BuldingDetails;