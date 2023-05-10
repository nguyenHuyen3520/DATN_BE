module.exports = (db) => {
    const {
        Roles, Users, Patients, Notifications, SuppliesGroup, Supplies, Appointments, Prescriptions, Bills, Bookings, Services,Booking_Supplies
    } = db;

    // quyen - nguoi dung
    Roles.hasMany(Users);
    Users.belongsTo(Roles);

    // nguoi dung - ho so kham benh
    Users.hasMany(Patients);
    Patients.belongsTo(Users);

    // nguoi dung - thong bao
    Users.hasMany(Notifications);
    Notifications.belongsTo(Users);

    // vat tu - nhom vat tu
    SuppliesGroup.hasMany(Supplies);
    Supplies.belongsTo(SuppliesGroup);

    // HO SO - Lich hen
    Patients.hasMany(Appointments);
    Appointments.belongsTo(Patients);

    // lich hen - don thuoc 
    Appointments.hasMany(Prescriptions);
    Prescriptions.belongsTo(Appointments);

    // nguoi dung - hoa don
    Users.hasMany(Bills);
    Bills.belongsTo(Users);

    // hoa don - lich hen
    Bills.hasOne(Appointments);
    Appointments.belongsTo(Bills);

    // HO SO - Lich hen
    Patients.hasMany(Bookings);
    Bookings.belongsTo(Patients);

    // Dich vu - Lich hen
    Services.hasMany(Bookings);
    Bookings.belongsTo(Services);

    // BAC SI - Lich hen
    Users.hasMany(Bookings);
    Bookings.belongsTo(Users);

    // hoa don - lich hen
    Bills.hasOne(Bookings);
    Bookings.belongsTo(Bills);

    Bookings.belongsToMany(Supplies, { through: Booking_Supplies });
    Supplies.belongsToMany(Bookings, { through: Booking_Supplies });

}