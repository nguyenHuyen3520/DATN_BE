const db = require('../models');
const Users = db.Users;

const Nexmo = require('nexmo');

const nexmo = new Nexmo({
    apiKey: "4d523163",
    apiSecret: "nTUUU5A6oaw0IlKH",
});

const textflow = require("textflow.js");
textflow.useKey("5xGGL2IMFB5cTYMMDtbhbzTZ2wWGQ9jshUDcpqJ5PKxhc99NSThdbXOS7e2386Ow");
exports.register = async (req, res) => {

}

exports.sendOTP = (req, res)=>{
    console.log("req.body: ", req.body);
    const {phone} = req.body;
    const findUser = Users.findOne({
        where:{
            phone:phone
        }
    });
    
    if(findUser && findUser.first_name){
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
        if(result.ok){
            return res.status(200).json({
                success: true,      
                requestId: requestId      
            });
        }
    });
}

exports.verifyOTP =  (req, res)=>{
    const { phone, code} = req.body;
    var result = textflow.verifyCode(phone, code);
    if(result.valid){
        return res.status(400).json({
            success: false,            
        });
    }
    if(result.ok){
        return res.status(400).json({
            success: true,            
        });
    }
}