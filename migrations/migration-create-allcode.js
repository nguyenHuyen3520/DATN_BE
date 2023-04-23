'use strict';
model.exports ={
    up: async (queryInterface, Sequelize) =>{
        await queryInterface.createTable("AllCodes",{
            id:{
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
        })
    }
}