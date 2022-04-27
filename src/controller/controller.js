const BuldingDetails = require('../model/buildingDetails');

const PaymentPlanData = require('../model/paymentplan')
const AdonServiceData = require('../model/adonservices')
const userData = require('../model/user')
const Logindata = require('../model/login')
const Requiremnts = require('../model/requirements')

//create plan
const createPlan = (req, res) => {

    console.log(req.body)
    const paymentplandata = PaymentPlanData(req.body)
    paymentplandata.save().then((response) => {
        res.status(200).json({ msg: "plan added", details: response })
    }).catch((err) => {
        console.error(err);
        res.json({ msg: `error : plan not added !! ${err}`, })
    })

}
//view all plan
const viewplan = (req, res) => {

    PaymentPlanData.find().then((response) => {
        console.log(response);
        res.status(200).json({ msg: "success", details: response })
    }).catch((err) => {
        console.error(err);
        res.json({ msg: `error : ${err}`, })
    })

}
//view single plan_name
const viewplanbyid = (req, res) => {

    const id = req.params.id;
    PaymentPlanData.findById({ _id: id }).then((response) => {
        console.log(response);
        res.status(200).json({ msg: "success", details: response })
    }).catch((err) => {
        console.error(err);
        res.json({ msg: `error : ${err}`, })
    })
}
//update plan
const updateplan = (req, res) => {
    const id = req.params.id;
    const data = req.body;

    PaymentPlanData.findByIdAndUpdate(id, data).then((response) => {
        console.log(response);

        res.status(200).json({ msg: "plan data updated !!" })
    }).catch((err) => {
        console.error(err);
        res.json({ msg: `error : ${err}`, })
    })
}
//createadonservices
const createadonservices = (req, res) => {

    console.log(req.body)
    const adonServiceData = AdonServiceData(req.body)
    adonServiceData.save().then((response) => {
        res.status(200).json({ msg: "AdonServiceData added", details: response })
    }).catch((err) => {
        console.error(err);
        res.json({ msg: `error : AdonService not added !! ${err}`, })
    })

}

//viewadonservices
const viewadonservices = (req, res) => {
    AdonServiceData.find().then((response) => {
        console.log(response);
        res.status(200).json({ msg: "success", details: response })
    }).catch((err) => {
        console.error(err);
        res.json({ msg: `error : ${err}`, })
    })

}
//updateadonservices
const updateadonservices = (req, res) => {
    const id = req.params.id;
    const data = req.body;

    AdonServiceData.findByIdAndUpdate(id, data).then((response) => {
        console.log(response);
        res.status(200).json({ msg: "AdonService data updated !!", })
    }).catch((err) => {
        console.error(err);
        res.json({ msg: `error : ${err}`, })
    })
}
//delete AdonServiceData
const deleteAdonServiceData = (req, res) => {
    const id = req.params.id;

    AdonServiceData.findByIdAndDelete(id).then((response) => {
        console.log(response);
        res.status(200).json({ msg: "AdonService data deleted !!", })
    }).catch((err) => {
        console.error(err);
        res.json({ msg: `error : ${err}`, })
    })
}

//create user
const createuser = (req, res) => {
    console.log(req.body)
    const userdata = userData(req.body)
    userdata.save().then((response) => {
        res.status(200).json({ msg: "user added", details: response })
    }).catch((err) => {
        console.error(err);
        res.json({ msg: `error : user not added !! ${err}`, })
    })
}
//view user
const viewuser = (req, res) => {

    userData.aggregate([
        {
            $lookup:
            {
                from: 'login_tbs',
                localField: 'login_id',
                foreignField: '_id',
                as: 'userlogindetails'
            }
        }
    ]).then((response) => {
        res.status(200).json({ msg: "success", details: response })
    })
}

//view user by id
const viewsingleuser = (req, res) => {

    const id = req.params.id;
    userData.aggregate([
        { $match: { login_id: id } },
        {
            $lookup:
            {
                from: 'login_tbs',
                localField: 'login_id',
                foreignField: '_id',
                as: 'userlogindetails'
            }
        }
    ]).then((response) => {
        res.status(200).json({ msg: "success", details: response })
    })
    // userData.find({ login_id: id }).then((respons) => {
    //     Logindata.find({ _id: id }).then((response) => {
    //         const data = { userdetails: respons, logindetails: response }
    //         console.log(response);
    //         res.status(200).json({ msg: "success", details: data })
    //     })
    // }).catch((err) => {
    //     console.error(err);
    //     res.json({ msg: `error : ${err}`, })
    // })
}

//update user
const updateuser = (req, res) => {
    const id = req.params.id;
    const data = req.body;

    userData.findByIdAndUpdate(id, data).then((response) => {
        console.log(response);
        res.status(200).json({ msg: "userData  updated !!", })
    }).catch((err) => {
        console.error(err);
        res.json({ msg: `error : ${err}`, })
    })
}

//setuserrequirements 
const setuserrequirements = (req, res) => {
    console.log(req.body)
    const userRequiremnts = Requiremnts(req.body)
    userRequiremnts.save().then((response) => {
        res.status(200).json({ msg: "user added", details: response })
    }).catch((err) => {
        console.error(err);
        res.json({ msg: `error : user not added !! ${err}`, })
    })
}
//getuserrequirements
// const getuserrequirements= (req, res) => {
//     Requiremnts.aggregate([
//         {
//             $lookup:
//             {
//                 from: 'login_tbs',
//                 localField: 'login_id',
//                 foreignField: '_id',
//                 as: 'userlogindetails'
//             }
//         },{
//             $lookup:
//             {
//                 from: 'buildingdetails',
//                 localField: 'buildingdetails_id',
//                 foreignField: '_id',
//                 as: 'paymentplandetails'
//             }
//         },{
//             $lookup:
//             {
//                 from: 'paymentplan_tb',
//                 localField: 'paymentplan_id',
//                 foreignField: '_id',
//                 as: 'paymentplandetails'
//             }
//         },{

//         }
//     ])
// }


// add building details


async function addBuildingDetails(body) {
    const buildingDetails = new BuldingDetails(body);

    try {
        const newBuildingDetails = await buildingDetails.save();
        return {
            success: true,
            data: newBuildingDetails,
        };
    } catch (err) {
        return { success: false, message: "Failed to add building details" };
    }
}


async function getAllBuildingDetails(){

    try {
        const buildingdetails = await BuldingDetails.find();
        return {
            success: true,
            data: buildingdetails,
            
        };
    } catch (err) {
        return { success: false, message: "Building Details  not found" };
    }

}


async function getBuildingDetailsById(id) {
    
    const buildingdetails = await BuldingDetails.find({login_id:id});
    
    try {
      
       
      
        if (buildingdetails == null) {
            return { success: false, message: 'Cannot find  buildingdetails' };
        }
    } catch (err) {
        return { success: false, message: err.message };
    }

    return {
        success: true,
        data:  buildingdetails,
    };
}



async function updateBuildingDetails(id, no_of_floors = null,  total_area = null, no_of_bedrooms = null, attached_bathrooms=null,design_type=null,home_requirements=null,total_budget=null) {
    //let buildingdetails;
    const buildingdetails = await BuldingDetails.findOne({_id:id});
    console.log(buildingdetails);
    try {
       
        if ( buildingdetails == null) {
            return { success: false, message: 'Cannot find  buildingdetails' };
        }
        if (no_of_floors != null) {
            buildingdetails.no_of_floors = no_of_floors
        }
        if (total_area != null) {
            buildingdetails.total_area = total_area
        }
        if (no_of_bedrooms != null) {
            buildingdetails.no_of_bedrooms = no_of_bedrooms
        }

        if (attached_bathrooms != null) {
            buildingdetails.attached_bathrooms = attached_bathrooms
        }
        if (design_type!= null) {
            buildingdetails.design_type = design_type
        }
        if (home_requirements != null) {
            buildingdetails.home_requirements = home_requirements
        }
        if (total_budget != null) {
            buildingdetails.total_budget =total_budget
        }
        try {
            const updatedBuildingDetails = await buildingdetails.save()
            return {
                success: true,
                data: updatedBuildingDetails,
                message: "BuildingDetails updated successfully"
            };
        } catch (err) {
            return { sucess: false ,message: "Failed to update BuildingDetails" };
        }
    } catch (err) {
        return { success: false, message: err.message };
    }
}








module.exports = {
    createPlan,
    viewplan,
    viewplanbyid,
    updateplan,
    createadonservices,
    viewadonservices,
    updateadonservices,
    deleteAdonServiceData,
    createuser,
    viewuser,
    viewsingleuser,
    updateuser,
    setuserrequirements,

    addBuildingDetails,getAllBuildingDetails,getBuildingDetailsById,updateBuildingDetails
    // getuserrequirements
}