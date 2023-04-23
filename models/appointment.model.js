module.exports = (sequelize, DataTypes) => {
    const Appointments = sequelize.define("Appointments", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        time: {
            type: DataTypes.TIME,
            allowNull: false,
        },
        diagnose: {
            type: DataTypes.STRING,            
        }, 
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        }, 
        treatment:{
            type: DataTypes.STRING,            
        }
    },
        {
            timestamps: true,
            underscrored: true,
            createdAt: "created_at",
            updatedAt: "updated_at"
        }
    );

    return Appointments;
};