module.exports = (db) => {
    const {
        Roles, Users, Patients, Notifications, SuppliesGroup, Supplies
    } = db;

    // 
    Roles.hasMany(Users); 
    Users.belongsTo(Roles);     
    
    // nguoi dung - ho so kham benh
    Users.hasMany(Patients); 
    Patients.belongsTo(Users); 

    Users.hasMany(Notifications); 
    Notifications.belongsTo(Users); 

    SuppliesGroup.hasMany(Supplies); 
    Supplies.belongsTo(SuppliesGroup); 
}