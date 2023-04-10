const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');


const Users = require('../controllers/user.controller');
const Roles = require('../controllers/role.controller');


const verifyToken = (req, res, next) => {    
    const authHeader = req.header('Authorization');

    const token = authHeader;    

    if (!token) return res.sendStatus(401);
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.decode = decoded;
        next();
    } catch (error) {
        console.log("sai roi")
        console.log(error);
        return res.sendStatus(403);
    }
};

router.post("/sendOTP", Users.sendOTP );

router.post("/verify", Users.verifyOTP);

// ROLE
router.post("/createRole", Roles.create);

// USER
router.post("/register", Users.register);

module.exports = router;
