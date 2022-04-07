const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Movie extends Model {}  

Movie.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        movie_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        genre: {
            type: DataTypes.STRING,
            allowNull: false,
            get() {
                return this.getDataValue('genre').split(';')
            },
            set(val) {
               this.setDataValue('genre',val.join(';'));
            },
        },
        release_date: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        critic_review: {
            type: DataTypes.DOUBLE(2,1),
            allowNull: true
        },
        user_review: {
            type: DataTypes.DOUBLE,
            allowNull: true,
        },
        poster_path: {
            type: DataTypes.STRING
        },
        tag: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'movie'
    }
);

module.exports = Movie;