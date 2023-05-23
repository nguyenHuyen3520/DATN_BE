const db = require('../models');
const Services = db.Services;

exports.deleteService = async (req, res) => {
    const service = await Services.findOne(
        {
            where: {
                id: req.body.service_id
            }
        },

    );
    service.update({
        status: 0
    });
    return res.status(200).json({
        success: true
    })
}

exports.getServices = async (req, res) => {
    const services = await Services.findAll({
        where: {
            status: 1
        }
    });
    return res.status(200).json({
        success: true,
        data: services,
    })
}
exports.getService = async (req, res) => {
    console.log("req.params: ", req.query);
    const service = await Services.findOne({
        where: {
            id: req.query.id,
            status: 1
        }
    });
    return res.status(200).json({
        success: true,
        data: service,
    })
}

exports.createService = async (req, res) => {
    await Services.create({
        service_name: req.body.name,
        description: req.body.description,
        price: req.body.price,
    });
    return res.status(200).json({
        success: true,
    })
}
exports.updateService = async (req, res) => {
    const service = await Services.findOne(
        {
            where: {
                id: req.body.id
            }
        },

    );
    service.update({
        service_name: req.body.name,
        description: req.body.description,
        price: req.body.price,
    });

    return res.status(200).json({
        success: true,
    })
}

