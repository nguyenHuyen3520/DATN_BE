module.exports = (sequelize, DataTypes) => {
    const Bills = sequelize.define("Bills", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
            // 0 - pending  1 - success 
        },
    },
        {
            timestamps: true,
            underscored: true,
            createdAt: "created_at",
            updatedAt: "updated_at"
        }
    );

    return Bills;
};