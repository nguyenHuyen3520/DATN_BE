module.exports = (sequelize, DataTypes) => {
    const Schedules = sequelize.define("Schedules", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        currentNumber: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        maxNumber: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }, 
        date: {
            type: DataTypes.DATE,
            allowNull: false,
        }, 
        typeNumber: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
        {
            timestamps: true,
            underscrored: true,
            createdAt: "created_at",
            updatedAt: "updated_at"
        }
    );

    return Schedules;
};