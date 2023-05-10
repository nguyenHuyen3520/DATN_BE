const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
require('dotenv').config();

const db = require('../models');
const Users = db.Users;
const Patients = db.Patients;
const Notifications = db.Notifications;
const Bills = db.Bills;
const Bookings = db.Bookings;
const Services = db.Services;

const Nexmo = require('nexmo');

const nexmo = new Nexmo({
    apiKey: "4d523163",
    apiSecret: "nTUUU5A6oaw0IlKH",
});

const textflow = require("textflow.js");
textflow.useKey("5xGGL2IMFB5cTYMMDtbhbzTZ2wWGQ9jshUDcpqJ5PKxhc99NSThdbXOS7e2386Ow");

exports.loginAccessToken = async (req, res) => {
    console.log("req.decode.phone: ", req.decode.phone);
    const user = await Users.findOne({
        where: { phone: req.decode.phone },
        include: [
            {
                model: Patients,
                include:[
                    {
                        model: Bookings,
                        include: [
                            {
                                model: Users,
                            },
                            {
                                model: Services,
                            },
                        ]
                    },
                ]
            },
            {
                model: Notifications,
            },
            {
                model: Bills,
            },

        ]
    });
    const doctors = await Users.findAll({
        where: {
            RoleId: 2
        }
    });    
    const services = await Services.findAll();
    return res.status(200).json({
        info: user,
        doctors,
        services,
        success: true,
    });
}

exports.register = async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    await Users.create({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: hashedPassword,
        address: req.body.address,
        description: req.body.description ?  req.body.description : 'a',
        phone: req.body.phone,
        status: 1,
        RoleId: req.body.role_id ? req.body.role_id : 3,
        sku: req.body.sku
    });
    return res.status(200).json({
        success: true,
    });
}

exports.login = async (req, res) => {
    console.log("in login")
    Users.findOne({
        where: { phone: req.query.phone },
        include: [
            {
                model: Patients,
                include:[
                    {
                        model: Bookings,
                        include: [
                            {
                                model: Users,
                            },
                            {
                                model: Services,
                            },
                        ]
                    },
                ]
            },
            {
                model: Notifications,
            },
            {
                model: Bills,
            },

        ]
    }).then(user => {
        bcrypt.compare(req.query.password, user.password).then(async (result) => {
            if (result) {
                const doctors = await Users.findAll({
                    where: {
                        RoleId: 2
                    }
                });                
                const services = await Services.findAll();
                const payload = {
                    services: services,
                    doctors: doctors,
                    ...user.dataValues,
                    tineLife: (new Date().getTime() / 1000).toFixed() + 18000  // timeLift 5h
                };
                const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
                    expiresIn: "20d",
                });
                console.log("=================================")
                return res.status(200).json({
                    accessToken: accessToken,
                    info: payload,
                    success: true,
                });
            } else {
                console.log("Wrong password. Please try again!")
                return res.status(202).json({
                    success: false,
                    message: 'Wrong password. Please try again!',
                });
            }
        });
    })
}

exports.adminLogin = async (req, res) => {
    console.log("in login", req.body)
    Users.findOne({
        where: { email: req.body.account },        
    }).then(user => {
        bcrypt.compare(req.body.password, user.password).then(async (result) => {
            if (result) {
                const payload = {
                    ...user.dataValues                   
                };
                const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
                    expiresIn: "20d",
                });
                return res.status(200).json({
                    accessToken: accessToken,
                    info: payload,
                    success: true,
                });
            } else {
                console.log("Wrong password. Please try again!")
                return res.status(202).json({
                    success: false,
                    message: 'Wrong password. Please try again!',
                });
            }
        });
    })
}

exports.sendOTP = (req, res) => {
    console.log("req.body: ", req.body);
    const { phone } = req.body;
    const findUser = Users.findOne({
        where: {
            phone: phone
        }
    });

    if (findUser && findUser.first_name) {
        return res.status(400).json({
            success: false,
            message: "Số điện thoại này đã được đăng ký",
            data: findUser
        });
    }
    nexmo.verify.request({
        number: phone,
        // You can customize this to show the name of your company
        brand: 'Vonage Demo App',
        // We could put `'6'` instead of `'4'` if we wanted a longer verification code
        code_length: '4'
    }, (err, result) => {
        if (err) {
            // If there was an error, return it to the client
            res.status(500).send(err.error_text);
            return;
        }
        // Otherwise, send back the request id. This data is integral to the next step
        const requestId = result.request_id;
        if (result.ok) {
            return res.status(200).json({
                success: true,
                requestId: requestId
            });
        }
    });
}

exports.verifyOTP = (req, res) => {
    const { phone, code } = req.body;
    var result = textflow.verifyCode(phone, code);
    if (result.valid) {
        return res.status(400).json({
            success: false,
        });
    }
    if (result.ok) {
        return res.status(200).json({
            success: true,
        });
    }
}

exports.getUsers = async(req, res)=>{
    const uses = await Users.findAll({
        where:{
            role_id: 2
        }
    });
    return res.status(200).json({
        success: true,
        data: uses
    })
}