var moment = require('moment');
module.exports = (sequelize, DataTypes) => {
    const Patients = sequelize.define("Patients", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        sku: {
            type: DataTypes.STRING,
            defaultValue: 'HSBN'+ moment().unix(),
        },
        gender: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        note:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        age:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        weight:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        height:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        bmi:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        address:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        is_default:{
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    },
        {
            timestamps: true,
            underscored: true,
            createdAt: "created_at",
            updatedAt: "updated_at"
        }
    );

    return Patients;
};