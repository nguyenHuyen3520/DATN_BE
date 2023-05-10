module.exports = (sequelize, DataTypes) => {
    const Booking_Supplies = sequelize.define("Booking_Supplies", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        quantity:{
            type: DataTypes.INTEGER,      
            allowNull: false,    
        },
        note:{
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

    return Booking_Supplies;
};