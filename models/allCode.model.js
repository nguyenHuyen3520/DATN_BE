module.exports = (sequelize, DataTypes) => {
    const AllCodes = sequelize.define("AllCodes", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        key: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,            
        },
        valueVi: {
            type: DataTypes.STRING,
            allowNull: false,            
        },
        valueEn: {
            type: DataTypes.STRING,
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

    return AllCodes;
};