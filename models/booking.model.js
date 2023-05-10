module.exports = (sequelize, DataTypes) => {
    const Bookings = sequelize.define("Bookings", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },        
        date:{
            type: DataTypes.STRING,      
            allowNull: false,      
        },
        time:{
            type: DataTypes.STRING,      
            allowNull: false,
        },
        sort:{
            type: DataTypes.INTEGER,                     
        },
        status:{
            type: DataTypes.INTEGER,      
            allowNull: false,    
        },
        symptom:{
            type: DataTypes.STRING,                  
        },
        treatment:{
            type: DataTypes.STRING,                  
        },
    },
        {
            timestamps: true,
            underscored: true,
            createdAt: "created_at",
            updatedAt: "updated_at"
        }
    );

    return Bookings;
};