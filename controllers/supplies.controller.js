const db = require('../models');
const Services = db.Services;
const SuppliesGroup = db.SuppliesGroup;
const Supplies = db.Supplies;

// exports.createSupplies = async (req, res) => {
//     await Supplies.create(req.body);
//     return res.status(200).json({
//         success: true,
//     });
// }

exports.deleteSupplies = async (req, res) => {
    await Supplies.destroy(
        {
            where: {
                id: req.body.id
            }
        },

    );
    return res.status(200).json({
        success: true
    })
}

exports.getSuppliesGroup = async (req, res) => {
    const suppliesGroup = await SuppliesGroup.findAll();
    return res.status(200).json({
        success: true,
        data: suppliesGroup,
    })
}

exports.getSuppliesAll = async (req, res) => {
    const { supplies_id } = req.query;
    const supplies = await Supplies.findAll({
        where: {
            supplies_group_id: supplies_id
        }
    })
    return res.status(200).json({
        success: true,
        data: supplies,
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

exports.createSupplies = async (req, res) => {
    console.log("req.body", req.body)
    await Supplies.create({
        name: req.body.name,
        description: req.body.description,
        quantity: req.body.quantity,
        price: req.body.price,
        status: req.body.status ? req.body.status : 1,
        unit: req.body.unit,
        SuppliesGroupId: req.body.supplies_group_id ? req.body.supplies_group_id : 1,
    });
    return res.status(200).json({
        success: true,
        message: 'Tạo vật tư mới thành công!'
    })
}

exports.getSupplies = async (req, res) => {
    const supplies = await Supplies.findOne({
        where: { id: req.query.id }
    });
    return res.status(200).json({
        success: true,
        data: supplies
    })
}

exports.getSuppliesByGroup = async (req, res) => {
    const supplies = await Supplies.findAll({
        where: { supplies_group_id: req.query.id }
    });
    return res.status(200).json({
        success: true,
        data: supplies
    })
}