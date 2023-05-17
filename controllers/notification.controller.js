const db = require('../models');
const Notifications = db.Notifications;
exports.readAll = async (req, res) => {
    await Notifications.update({
        status: 0,
    },{
        where:{
            status: 1,
        }
    })    
    const notifications = await Notifications.findAll({
        where: {
            UserId: req.decode.id,
        }
    });
    return res.status(200).json({
        success: true,
        notifications: notifications,
    })
}