const db = require('../models');
const Services = db.Services;
const SuppliesGroup = db.SuppliesGroup;
const Supplies = db.Supplies;

exports.getSuppliesGroup = async (req, res) => {
    const suppliesGroup = await SuppliesGroup.findAll();
    return res.status(200).json({
        success: true,
        data: suppliesGroup,
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

exports.createSuppliesGroup = async (req, res) => {
    await SuppliesGroup.create({
        name: req.body.name,
        status: 1,        
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

