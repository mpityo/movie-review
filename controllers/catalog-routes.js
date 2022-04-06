const router = require('express').Router();
const sequelize = require('../config/connection');
const { Reviews, User, Movie } = require('../models');

router.get('/', (req, res) => {
	Movie.findAll({
    order: [['title', 'ASC']],
    attributes: [
      'id',
      'db_id',
      'title',
      'description',
      'critic_review',
      'poster_path',
      'genre',
      'tag'
  ],
  include: [
      {
          model: Reviews,
          attributes: ['id', 'user_id', 'movie_id', 'post', 'stars'],
          include: {
              model: User,
              attributes: ['id', 'username']
          }
      }
    ]
  })
    .then(dbMovieData => {
      // pass a single movie object into the homepage template
	  const movies = dbMovieData.map(movie => movie.get({ plain: true }));
      res.render('catalog', { 
        movies
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;