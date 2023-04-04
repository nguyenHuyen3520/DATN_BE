module.exports = (db) => {
    const {
        Roles, Users, Patients
    } = db;

    // 
    Roles.hasMany(Users); 
    Users.belongsTo(Roles);     
    
    // nguoi dung - ho so kham benh
    Users.hasMany(Patients); 
    Patients.belongsTo(Users); 

    
}