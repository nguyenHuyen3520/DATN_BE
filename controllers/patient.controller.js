const moment = require('moment');
const db = require('../models');
const Patients = db.Patients;
const Bookings = db.Bookings;
const Notifications = db.Notifications;
const Bills = db.Bills;
const Users = db.Users;
const Services = db.Services;

exports.create = async (req, res) => {
    const patientArray = await Patients.findAll({
        where:{
            UserId: req.decode.id,
        }
    });
    const data = {
        ...req.body,
        bmi: req.body.bmi.toFixed(1).toString(),
        UserId: req.decode.id,
        is_default: patientArray && patientArray?.length == 0 ? 1 : 0
    }
    const patient = await Patients.create(data);
    const patients = await Patients.findAll({
        where:{
            UserId: req.decode.id,
        }
    });
    return res.status(201).json({
        success: true,
        patients: patients,
    })
}

exports.update = async (req, res) => {
    await Patients.update(
        { ...req.body },
        {
            where:
            {
                id: req.body.id
            }
        },
    );
    const patientArray = await Patients.findAll({
        where:{
            UserId: req.decode.id,
        }
    });
    return res.status(201).json({
        success: true,
        patients: patientArray,
    })
}

exports.changePatientDetail = async (req, res) => {
    await Patients.update(
        {
            is_default: 0
        },
        {
        where:{
            UserId: req.decode.id,
            is_default: 1
        }
    }
    );    
    await Patients.update(
        {
            is_default: 1
        },
        {
        where:{
            UserId: req.decode.id,
            id: req.body.id
        }
    }
    );
    const patientArray = await Patients.findAll({
        where:{
            UserId: req.decode.id,
        }
    });
    const patientDetail = await Patients.findAll({
        where:{
            id: req.body.id
        }
    });
    return res.status(201).json({
        success: true,
        patients: patientArray,
        patientDetail
    })
}

exports.createCalendar = async (req, res) =>{
    const check = await Bookings.findAll({
        where: {
            UserId: req.body.doctorId,
            date: req.body.date
        }
    });
    if(check.length === 0){
        const array = [
            {
                date: req.body.date,
                UserId: req.body.doctorId,
                status: 0,
                time: "9:30 - 10:30",
                sort: 1
            },
            {
                date: req.body.date,
                UserId: req.body.doctorId,
                status: 0,
                time: "10:30 - 11:30",
                sort: 2
            },
            {
                date: req.body.date,
                UserId: req.body.doctorId,
                status: 0,
                time: "13:30 - 14:30",
                sort: 3
            },
            {
                date: req.body.date,
                UserId: req.body.doctorId,
                status: 0,
                time: "14:30 - 15:30",
                sort: 4
            },
            {
                date: req.body.date,
                UserId: req.body.doctorId,
                status: 0,
                time: "15:30 - 16:30",
                sort: 5
            },
            {
                date: req.body.date,
                UserId: req.body.doctorId,
                status: 0,
                time: "16:30 - 17:30",
                sort: 6
            },
            {
                date: req.body.date,
                UserId: req.body.doctorId,
                status: 0,
                time: "17:30 - 18:30",
                sort: 7
            },
        ];
        await Bookings.bulkCreate(array);
    }
    const bookings = await Bookings.findAll({
        where: {
            UserId: req.body.doctorId,
            date: req.body.date
        }
    });  
    return res.status(200).json({
        success: true,
        bookings: bookings,
    })
}

exports.createBooking = async (req, res) =>{
    await Bookings.update(
        {
            status: 1,
            UserId: req.body.doctorId,
            PatientId: req.body.patientId,
            ServiceId: req.body.serviceId
        },
        {
        where: {
            id: req.body.bookingId
        }
    });
    await Notifications.create({
        content: `Bạn đã đặt lịch khám bệnh thành công lịch khám bệnh vào ngày ${ moment.unix(req.body.date).format("DD/MM/YYYY")} vào khung giờ ${req.body.time}. Vui lòng để ý điện thoại để xác nhận từ phòng khám.`,
        additional: "a",
        additional_value: req.body.bookingId,
        UserId: req.decode.id,
        status: 1,
        ServiceId: req.body.serviceId
    });
    const notifications = await Notifications.findAll({
        where: {
            UserId: req.decode.id,
        }
    });
    const bookings = await Bookings.findAll(
        {
        where: {
            UserId: req.decode.id,
        },
        include: [
            {
                model: Users,
            },
            {
                model: Services,
            },
        ]
    });
    return res.status(200).json({
        success: true,
        notifications,
        bookings
    })
}