const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');


const Users = require('../controllers/user.controller');
const Roles = require('../controllers/role.controller');
const Services = require('../controllers/service.controller');
const Supplies = require('../controllers/supplies.controller');
const Patients = require('../controllers/patient.controller');
const Notifications = require('../controllers/notification.controller');
const Schedules = require('../controllers/schedule.controller');

const verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization');

    const token = authHeader;

    if (!token) return res.sendStatus(401);
    try {
        console.log("19")
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log("decoded: ", decoded);
        if (decoded.timeLife < (new Date().getTime()/1000).toFixed()) {
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

// ADMIN
router.post("/admin/login", Users.adminLogin);
router.get("/getUsers", Users.getUsers);


// Schedule
router.get("/getSchedule", Schedules.getSchedule);
router.get("/getMySchedule", Schedules.getMySchedule);
router.post("/confirmSchedule", Schedules.confirmSchedule);
router.get("/getBooking", Schedules.getBooking);
router.post("/saveSupplies", Schedules.saveSupplies);
router.post("/saveTreatment", Schedules.saveTreatment);
router.post("/success", Schedules.success);
router.post("/sendBill", Schedules.sendBill);
router.get('/getDashboard', Schedules.getDashboard )

// SERVICES
router.get("/getServices", Services.getServices);
router.get("/getService", Services.getService);
router.post("/createService", Services.createService);
router.put("/updateService", Services.updateService);

// Supplies
router.get("/getSuppliesGroup", Supplies.getSuppliesGroup);
router.post("/createSuppliesGroup", Supplies.createSuppliesGroup);



router.get("/getSuppliesByGroup", Supplies.getSuppliesByGroup);
router.get("/getSupplies", Supplies.getSupplies);
router.post("/createSupplies", Supplies.createSupplies);

router.post("/create-patient", verifyToken, Patients.create);
router.put("/update-patient", verifyToken, Patients.update);
router.put("/change-patient-detail", verifyToken, Patients.changePatientDetail);

router.post("/create-calendar", verifyToken, Patients.createCalendar);
router.post("/create-schedule", verifyToken, Patients.createBooking);


// Notification
router.get("/read-all-notification", verifyToken, Notifications.readAll);

module.exports = router;
