const express=require('express')
const router=express.Router();
const auth = require('../controller/auth')
const controller=require('../controller/controller')


router.post('/sendOTP', auth.login);
router.post('/verifyOTP',auth.verifyOTP);
router.post('/home',auth.authenticateUser,auth.home);
router.post('/refresh',auth.refresh)
router.get('/logout',auth.logout)

//create plan
router.post('/createplan', controller.createPlan)
router.get('/viewplan',controller.viewplan)
router.get('/viewsingleplan/:id',controller.viewplanbyid)
router.put('/updateplan/:id',controller.updateplan)

//create adon services
router.post('/createadonservices',controller.createadonservices)
router.get('/viewadonservices',controller.viewadonservices)
router.put('/updateadonservices/:id',controller.updateadonservices)
router.delete('/deleteadonservices/:id',controller.deleteAdonServiceData)

//create user
router.post('/createuser',controller.createuser)
router.get('/viewuser',controller.viewuser)
router.put('/updateuser/:id',controller.updateuser)
router.get('/viewsingleuser/:id',controller.viewsingleuser)

//create user requiremnts
router.post('/setuserrequirements',controller.setuserrequirements)
// router.post('/getuserrequirements',controller.getuserrequirements)


router.post('/addbuildingdetails', async (req, res) => {
    let body = {
        no_of_floors: req.body.no_of_floors,
        total_area: req.body.total_area,
        no_of_bedrooms: req.body.no_of_bedrooms,
        attached_bathrooms: req.body.attached_bathrooms,
        design_type: req.body.design_type,
        home_requirements: req.body.home_requirements,
        total_budget: req.body.total_budget,
        login_id: req.body.login_id        
    };
    let response = await addBuildingDetails(body);

    if (response.success == true) {
        res.status(201).json(response);
        console.log('success');
    } else {
        res.status(404).json(response);
    }
});

router.get('/getallbuildingdetails', async (req, res) => {
    let response = await getAllBuildingDetails();
    if (response.success == true) {
        res.status(200).json(response);
    } else {
        res.status(404).json(response);
    }
});

router.get('/getbuildingdetailsbyid/:id', async (req, res) => {
    let response = await getBuildingDetailsById(req.params.id);
    res.json(response);
});


router.put('/updatebuildingdetails/:id', async (req, res) => {
    let no_of_floors = null,  total_area = null, no_of_bedrooms = null, attached_bathrooms=null,design_type=null,home_requirements=null,total_budget=null;
    if (req.body.no_of_floors) {no_of_floors= req.body.no_of_floors}
    if (req.body.total_area) {total_area = req.body.total_area}
    if (req.body.no_of_bedrooms) {no_of_bedrooms = req.body.no_of_bedrooms}
    if (req.body.attached_bathrooms) {attached_bathrooms = req.body.attached_bathrooms}
    if (req.body.design_type) {design_type = req.body.design_type}
    if (req.body.home_requirements) {home_requirements = req.body.home_requirements}
    if (req.body.total_budget) {total_budget = req.body.total_budget}
    let response = await updateBuildingDetails(req.params.id, no_of_floors, total_area, no_of_bedrooms,attached_bathrooms,design_type,home_requirements,total_budget);

    if (response.success == true) {
        res.status(201).json(response);
    } else {
        res.status(404).json(response);
    }
});


module.exports= router