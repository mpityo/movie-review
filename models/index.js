const User = require('./User');
const Movie = require('./Movie');
const Reviews = require('./Reviews');

User.hasMany(Reviews, {
    foreignKey: 'user_id'
});
Movie.hasMany(Reviews, {
    foreignKey: 'movie_id'
});

Reviews.belongsTo(User, {
    foreignKey: 'user_id'
});
Reviews.belongsTo(Movie, {
    foreignKey: 'movie_id'
});


module.exports = { User, Reviews, Movie };