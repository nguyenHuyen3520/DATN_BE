const moment = require('moment');
const db = require('../models');
const Bookings = db.Bookings;
const Users = db.Users;
const Services = db.Services;
const Patients = db.Patients;
const Booking_Supplies = db.Booking_Supplies;
const Supplies = db.Supplies;
const Bills = db.Bills;
const fs = require('fs');

const Excel = require('exceljs');
const path = require('path');
const nodemailer = require('nodemailer');

// var mail = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: 'phongkham1211@gmail.com',
//         pass: 'Huyen3520@'
//     }
// });



exports.getSchedule = async (req, res) => {
    const data = await Bookings.findAll({
        where: {
            status: [1, 2, 3, 4, 5]
        },
        include: [
            {
                model: Users,
            },
            {
                model: Services,
            },
            {
                model: Patients
            }
        ]
    });
    return res.status(200).json({
        success: true,
        data
    })
}

exports.confirmSchedule = async (req, res) => {
    console.log("body", req.body)
    await Bookings.update(
        {
            status: req.body.status + 1
        },
        {
            where: {
                id: req.body.id
            }
        }
    )
    const data = await Bookings.findAll({
        where: {
            status: [1, 2, 3, 4, 5]
        },
        include: [
            {
                model: Users,
            },
            {
                model: Services,
            },
            {
                model: Patients
            }
        ]
    });
    return res.status(200).json({
        success: true,
        data
    })
}

exports.getBooking = async (req, res) => {
    const booking = await Bookings.findOne(
        {
            where: {
                id: req.query.booking_id
            },
            include: [
                {
                    model: Users,
                },
                {
                    model: Services,
                },
                {
                    model: Patients
                },
                {
                    model: Supplies
                },
            ]
        }
    );

    const test = await Booking_Supplies.findAll();
    return res.status(200).json({
        success: true,
        data: booking,
        test
    })
}

exports.saveSupplies = async (req, res) => {
    const createData = req.body.supplies.map((item) => {
        return {
            quantity: item.quantity,
            note: item.note,
            BookingId: req.body.booking_id,
            SupplyId: parseInt(item.selected)
        }
    })
    for (let i = 0; i < createData.length; i++) {
        let test = await Booking_Supplies.create(createData[i]);
        // await Booking_Supplies.update({booking_id: createData[i].booking_id,supply_id: createData[i].supply_id, note: 'test update'  },{
        //     where:{
        //         id: test.dataValues.id
        //     }
        // })    
    }
    const booking = await Bookings.findOne(
        {
            where: {
                id: req.body.booking_id
            },
            include: [
                {
                    model: Supplies
                }
            ]
        }
    );
    return res.status(200).json({
        success: true,
        data: booking
    })
}

exports.saveTreatment = async (req, res) => {
    await Bookings.update({ symptom: req.body.symptom, treatment: req.body.treatment }, {
        where: {
            id: req.body.booking_id
        }
    });
    const booking = await Bookings.findOne(
        {
            where: {
                id: req.body.booking_id
            },
            include: [
                {
                    model: Users,
                },
                {
                    model: Services,
                },
                {
                    model: Patients
                },
                {
                    model: Supplies
                },
            ]
        }
    );
    return res.status(200).json({
        success: true,
        data: booking
    })
}

exports.success = async (req, res) => {
    const booking = await Bookings.findOne(
        {
            where: {
                id: req.body.booking_id
            },
            include: [
                {
                    model: Services,
                },
                {
                    model: Patients
                },
                {
                    model: Supplies
                },
            ]
        }
    );
    let total = booking.Service.dataValues.price + booking.dataValues.Supplies.reduce((a, b) => {
        return a + b.price * b.Booking_Supplies.quantity
    }, 0);
    for (let i = 0; i < booking.dataValues.Supplies.length; i++) {
        await Supplies.update(
            {
                quantity: booking.dataValues.Supplies[i].quantity - booking.dataValues.Supplies[i].Booking_Supplies.quantity
            },
            {
                where: {
                    id: booking.dataValues.Supplies[i].id
                }
            }
        )
    }
    const bill = await Bills.create({ price: total, status: 1, UserId: booking.dataValues.Patient.UserId });
    await Bookings.update(
        {
            status: 3,
            BillId: bill.dataValues.id
        },
        {
            where: {
                id: req.body.booking_id
            },
        }
    );
    return res.status(200).json({
        success: true,
    });
}

exports.getMySchedule = async (req, res) => {
    console.log("req.query.id: ", req.query.id)
    const data = await Bookings.findAll({
        where: {
            status: [2],
            UserId: req.query.id
        },
        include: [
            {
                model: Users,
            },
            {
                model: Services,
            },
            {
                model: Patients
            }
        ]
    });
    console.log("data; ", data)
    return res.status(200).json({
        success: true,
        data
    })
}

exports.sendBill = async (req, res) => {    
    var mail = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: "nguyenhuyennd1211@gmail.com",  
          pass: "ocipmrrkhfvcxkeu"
        }
      });
    const booking = await Bookings.findOne(
        {
            where: {
                id: req.body.booking_id
            },
            include: [
                {
                    model: Services,
                },
                {
                    model: Patients
                },
                {
                    model: Supplies
                },
            ]
        }
    );
    let total = booking.Service.dataValues.price + booking.dataValues.Supplies.reduce((a, b) => {
        return a + b.price * b.Booking_Supplies.quantity
    }, 0);
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('Hóa đơn thanh toán #' + req.body.booking_id);

    const dataWorksheet = [
        {
            STT: 1,
            name: booking.Service.dataValues.service_name,
            quantity: 1,
            price: Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(booking.Service.dataValues.price),
            total: Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(booking.Service.dataValues.price * 1)
        },
        ...booking.dataValues.Supplies.map((item, index) => {
            return {
                STT: index + 2,
                name: item?.name,
                quantity: item?.Booking_Supplies?.quantity,
                price: Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item?.price),
                total: Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item?.Booking_Supplies?.quantity * item?.price)
            }
        }),
        {

        },
        {
            price: "Tổng hóa đơn",
            total: Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)
        }
    ]
    worksheet.columns = [
        { key: 'STT', header: 'STT' },
        { key: 'name', header: 'Tên' },
        { key: 'quantity', header: 'Số lượng' },
        { key: 'price', header: 'Gía tiền' },
        { key: 'total', header: 'Thành tiền' },
    ];
    dataWorksheet.forEach((item) => {
        worksheet.addRow(item);
    });

    worksheet.columns.forEach((sheetColumn) => {
        sheetColumn.font = {
            size: 12,
        };
        sheetColumn.width = 30;
    });

    worksheet.getRow(1).font = {
        bold: true,
        size: 13,
    };
    const exportPath = path.resolve(__dirname, `Bill-#${req.body.booking_id}.xlsx`);
    console.log("exportPath: ", exportPath);
    await workbook.xlsx.writeFile(exportPath);
    let fileContent = fs.readFileSync(exportPath);
    var mailOptions = {
        from: 'phongkham1211@gmail.com',
        to: booking?.dataValues?.Patient?.email,
        subject: 'Hóa đơn thanh toán',
        text: 'Hóa đơn thanh toán',
        attachments: [
            {
                filename: 'Hóa đơn thanh toán.xlsx',
                content: fileContent,
                contentType: 'application/vnd.ms-excel'
            }
        ],
    };

    mail.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log("to: ", booking?.dataValues?.Patient?.email);
            console.log('Email sent: ' + info.response);
            console.log("info: ",info);
        }
    });

    return res.status(200).json({
        success: true,        
    })
}

exports.getDashboard = async(req, res) => {
    const users = await Users.findAll({
        where:{
            role_id: 2
        }
    });
    const bills = await Bills.findAll();
    const bookings = await Bookings.findAll();
    return res.status(200).json({
        success: true,        
        data:{
            users,
            bills,
            bookings
        }
    })
}