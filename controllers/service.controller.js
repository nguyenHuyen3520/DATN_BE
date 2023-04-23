const db = require('../models');
const Services = db.Services;
exports.getServices = async (req, res) => {
    const services = await Services.findAll();
    return res.status(200).json({
        success: true,
        data: services,
    })
}
exports.getService = async (req, res) => {
    console.log("req.params: ", req.query);
    const service = await Services.findOne({
        where: {
            id: req.query.id
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
    console.log("req.body: ", req.body);
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

