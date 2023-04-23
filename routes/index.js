const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');


const Users = require('../controllers/user.controller');
const Roles = require('../controllers/role.controller');
const Services = require('../controllers/service.controller');
const Supplies = require('../controllers/supplies.controller');
const Patients = require('../controllers/patient.controller');

const verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization');

    const token = authHeader;

    if (!token) return res.sendStatus(401);
    try {
        console.log("19")
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (decoded.timeLife < Date.now()) {
            // kiem tra timeLife 
            return res.status(401).json({
                success: false,
                timeLife: false,
            });
        }
        req.decode = decoded;
        next();
    } catch (error) {
        console.log("sai roi")
        console.log(error);
        return res.sendStatus(403);
    }
};

router.post("/sendOTP", Users.sendOTP);

router.post("/verify", Users.verifyOTP);

// ROLE
router.post("/createRole", Roles.create);

// USER
router.post("/register", Users.register);
router.get("/login", Users.login);
router.get("/loginAccessToken", verifyToken, Users.loginAccessToken);

// SERVICES
router.get("/getServices", Services.getServices);
router.get("/getService", Services.getService);
router.post("/createService", Services.createService);
router.put("/updateService", Services.updateService);

// Supplies
router.get("/getSuppliesGroup", Supplies.getSuppliesGroup);
router.post("/createSuppliesGroup", Supplies.createSuppliesGroup);

router.post("/create-patient", verifyToken, Patients.create);
router.put("/update-patient", verifyToken, Patients.update);
router.put("/change-patient-detail", verifyToken, Patients.changePatientDetail);

module.exports = router;
