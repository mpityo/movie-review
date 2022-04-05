const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Reviews extends Model {}  

Reviews.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        post: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
        },
        movie_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'movie',
                key: 'id'
            }
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'user',
                key: 'id'
            }
        }
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'reviews'
    }
);

module.exports = Reviews;