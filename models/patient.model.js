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
            defaultValue: 'HSBN'+ moment().second(),
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
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        weight:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        height:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        bmi:{
            type: DataTypes.FLOAT,
            allowNull: false,
        }
    },
        {
            timestamps: true,
            underscrored: true,
            createdAt: "created_at",
            updatedAt: "updated_at"
        }
    );

    return Patients;
};