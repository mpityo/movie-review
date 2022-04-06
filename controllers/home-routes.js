const router = require('express').Router();
const sequelize = require('../config/connection');
const { Reviews, User, Movie } = require('../models');

router.get('/', (req, res) => {
	Movie.findAll({
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
    let popular = [];
    let nowPlaying = [];
    let topRated = [];
    let noTag = [];
    movies.forEach((element, index) => {
      if (element.tag === 'popular') {
        popular.push(element);
      } else if (element.tag === 'now_playing') {
        nowPlaying.push(element);
      } else if (element.tag === 'top_rated') {
        topRated.push(element);
      } else {
        noTag.push(element);
      }
    });
      res.render('homepage', { 
        popular,
        nowPlaying,
        topRated,
        noTag,
        loggedIn: req.session.loggedIn 
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
	  res.redirect('/');
	  return;
  }
	
  res.render('login');
});

router.get("/sign-up", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }

  res.render("sign-up");
});

module.exports = router;