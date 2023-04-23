module.exports = (sequelize, DataTypes) => {
    const Bookings = sequelize.define("Bookings", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },        
        date:{
            type: DataTypes.DATE,      
            allowNull: false,      
        },
        time:{
            type: DataTypes.STRING,      
            allowNull: false,
        },
        status:{
            type: DataTypes.INTEGER,      
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

    return Bookings;
};