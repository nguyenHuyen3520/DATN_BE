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
const Posts = db.Posts;

const { Vonage } = require('@vonage/server-sdk')

const vonage = new Vonage({
    apiKey: "2cafee80",
    apiSecret: "4DL7x1YQ71mOdhEu"
})

const accountSid = "ACd179f314f460cbce2bff1cfd16299b4b";
const authToken = "d94b02c1416bc6a94d3e1d147b13bc4a";
const client = require('twilio')(accountSid, authToken);
const myPhone = "+12525019305";


exports.sendOTP = async (req, res) => {
    // console.log("req.body: ", req.body);
    const { phone } = req.body;

    const findUser = await Users.findOne({
        where: {
            phone: phone
        }
    });
    if (findUser && findUser.first_name) {
        return res.status(200).json({
            success: false,
            message: "Số điện thoại này đã được đăng ký",
            data: findUser
        });
    }
    // client.messages
    //     .create({
    //         body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
    //         from: myPhone,
    //         to: '+840898731845'
    //     })
    //     .then(message => console.log(message));
    let to = '';
    if (phone && phone.slice(0, 1) == '0') {
        to = '84' + phone.slice(1);
    } else {
        to = '84' + phone;
    }
    const from = "Phòng khám nhi"

    vonage.verify.start({
        number: to,
        brand: from
    })
        .then(resp => {
            console.log("resp: ", resp);
            if (resp.status == '3') {
                return res.status(200).json({
                    success: false,
                    message: 'Số điện thoại bị sai định dạng. Vui lòng nhập lại.'
                })
            }
            if (resp?.errorText || resp?.error_text) {
                return res.status(200).json({
                    success: false,
                    message: resp?.errorText ? resp?.errorText : resp?.error_text ? resp?.error_text : 'Vui lòng nhập lại'
                })
            }
            return res.status(200).json({
                success: true,
                request_id: resp.request_id
            })
        })
        .catch(err => {
            return res.status(200).json({
                success: false,
                message: 'Số điện thoại bị sai định dạng. Vui lòng nhập lại.'
            })
        });
}

exports.getInfo = async (req, res) => {
    const info = await Users.findOne({
        where: { id: req.decode.id },
        include: [
            {
                model: Patients,
                include: [
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
        info,
        doctors,
        services,
        success: true,
    });
}

exports.loginAccessToken = async (req, res) => {
    const user = await Users.findOne({
        where: { phone: req.decode.phone },
        include: [
            {
                model: Patients,
                include: [
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
        description: req.body.description ? req.body.description : 'a',
        phone: req.body.phone,
        status: 1,
        RoleId: req.body.role_id ? req.body.role_id : 3,
        sku: req.body.sku ? req.body.sku : ''
    });
    return res.status(200).json({
        success: true,
    });
}

exports.login = async (req, res) => {
    Users.findOne({
        where: { phone: req.query.phone },
    }).then(user => {
        bcrypt.compare(req.query.password, user.password).then(async (result) => {
            if (result) {
                const payload = {
                    // services: services,
                    // doctors: doctors,
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
                const doctors = await Users.findAll({
                    where: {
                        role_id: 2
                    }
                })
                return res.status(200).json({
                    accessToken: accessToken,
                    info: payload,
                    success: true,
                    doctors
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


exports.verifyOTP = (req, res) => {
    const { request_id, code } = req.body;
    console.log("req.body: ", req.body)
    vonage.verify.check(request_id, code)
        .then(resp => {
            console.log(resp);
            return res.status(200).json({
                success: true,
            })
        })
        .catch(err => {
            return res.status(200).json({
                success: false,
                message: "Mã code nhập bị sai. Vui lòng nhập lại."
            })
        });
}

exports.getUsers = async (req, res) => {
    const uses = await Users.findAll({
        where: {
            role_id: 2
        }
    });
    return res.status(200).json({
        success: true,
        data: uses
    })
}

exports.getUserDetail = async (req, res) => {
    const uses = await Users.findOne({
        where: {
            id: req.query.id
        }
    });
    return res.status(200).json({
        success: true,
        data: uses
    })
}

exports.updateUser = async (req, res) => {
    const uses = await Users.update(
        {
            ...req.body
        }
        , {
            where: {
                id: req.body.id
            }
        });
    return res.status(200).json({
        success: true,
    })
}

exports.createUser = async (req, res) => {
    console.log("req.body: ", req.body)
    const findUserEmail = await Users.findOne({
        where: {
            email: req.body.email
        }
    });
    const findUserPhone = await Users.findOne({
        where: {
            phone: req.body.phone
        }
    });
    if (findUserEmail) {
        return res.status(200).json({
            success: false,
            message: 'Email đã có người đăng ký!!'
        })
    }
    if (findUserPhone) {
        return res.status(200).json({
            success: false,
            message: 'Số điện thoại đã có người đăng ký!!'
        })
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    const user = await Users.create({ ...req.body, status: 1, RoleId: 2, password: hashedPassword });
    return res.status(200).json({
        success: true,
        user
    })
}

exports.update = async (req, res) => {
    console.log("req.body update: ", req.body)
    await Users.update(
        {
            ...req.body.info
        }
        , {
            where: {
                phone: req.body.info.phone
            }
        });
    const user = await Users.findOne({
        where: {
            phone: req.body.info.phone
        }
    });
    return res.status(200).json({
        success: true,
        info: user
    })
}

exports.changePassword = async (req, res) => {
    Users.findOne({
        where: { phone: req.body.phone },
    }).then(user => {
        bcrypt.compare(req.body.oldPassword, user.password).then(async (result) => {
            console.log("result: ", result);
            if (result) {
                const hashedPassword = await bcrypt.hash(req.body.newPassword, 12);
                await Users.update(
                    {
                        password: hashedPassword
                    }
                    , {
                        where: {
                            phone: req.body.phone
                        }
                    });
                return res.status(200).json({
                    success: true,
                    message: "Đổi mật khẩu thành công"
                })
            } else {
                return res.status(200).json({
                    success: false,
                    message: "Mật khẩu cũ không đúng. Vui lòng nhập lại."
                })
            }
        });
    })
}

exports.createPost = async (req, res) => {
    await Posts.create(req.body);
    res.header("Access-Control-Allow-Origin", "*");
    return res.status(200).json({
        success: true
    })
}

exports.getPosts = async (req, res) => {
    const data = await Posts.findAll();
    return res.status(200).json({
        success: true,
        data
    })
}

exports.getPost = async (req, res) => {
    const data = await Posts.findOne({
        where: {
            id: req.query.post_id
        }
    });
    return res.status(200).json({
        success: true,
        data
    })
}

exports.updatePost = async (req, res) => {
    console.log("req.body.formData: ", req.body.formData)
    await Posts.update({
        ...req.body.formData
    },
        {
            where: {
                id: req.body.id
            }
        }
    );
    return res.status(200).json({
        success: true,
    })
}

exports.deletePost = async (req, res) => {
    await Posts.destroy({ where: { id: req.body.post_id } });
    return res.status(200).json({
        success: true,
    })
}

exports.getHomeData = async (req, res) => {
    const posts = await Posts.findAll();
    return res.status(200).json({
        success: true,
        data: {
            posts
        }
    })
}