module.exports = (sequelize, DataTypes) => {
    const Notifications = sequelize.define("Notifications", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        additional: {
            type: DataTypes.STRING,
        },
        additional_value: {
            type: DataTypes.STRING,            
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
        {
            timestamps: true,
            underscored: true,
            createdAt: "created_at",
            updatedAt: "updated_at"
        }
    );

    return Notifications;
};