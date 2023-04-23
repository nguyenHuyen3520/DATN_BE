const db = require('../models');
const Patients = db.Patients;
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