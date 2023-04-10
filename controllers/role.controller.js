const db = require('../models');
const Roles = db.Roles;
exports.create = async (req, res) => {
    const data = {
        name_role: req.body.name_role,
        display_name: req.body.display_name,
    };
    const role = await Roles.create(data);
    return res.status(201).json({
        success: true,
        data: role,
    })
}