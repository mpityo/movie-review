const router = require("express").Router();
const sequelize = require("../config/connection");
const fetch = require("node-fetch");
const { Reviews, User, Movie } = require("../models");
const getFromServer = require("./api/movie-routes");
const baseURL = "https://api.themoviedb.org";
const apiKey = process.env.MOVIEDB_API_KEY;


router.get("/", (req, res) => {
  Movie.findAll({})
    .then((dbMovieData) => {
      // pass a single movie object into the homepage template
      const movies = dbMovieData.map((movie) => movie.get({ plain: true }));
      let popular = [];
      let nowPlaying = [];
      let topRated = [];
      let lastestAdded = [];
      let noTag = [];
      movies.forEach((element, index) => {
        if (element.tag === "popular") {
          popular.push(element);
        } else if (element.tag === "now_playing") {
          nowPlaying.push(element);
        } else if (element.tag === "top_rated") {
          topRated.push(element);
        } else if (element.tag === "latest") {
          lastestAdded.push(element);
        } else {
          noTag.push(element);
        }
      });
      res.render("homepage", {
        popular,
        nowPlaying,
        topRated,
        noTag,
        loggedIn: req.session.loggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/login", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }

  res.render("login");
});

router.get("/sign-up", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }

  res.render("sign-up");
});

router.get("/search", (req, res) => {
  res.render("search");
  return;
});

router.post("/search", (req, res) => {
  fetch(
    `${baseURL}/3/search/movie?api_key=${apiKey}&language=en-US&query=${req.body.search}&page=1&include_adult=false`
  )
    .then((response) => {
      if (response) {
        return response.json();
      } else {
        console.log(response);
        return;
      }
    })
    .then((data) => {
      const results = data.results;
      console.log(results);
      res.render("result", {
        results,
      });
      return;
    });
});

// DISPLAY single movie information
router.get("/movie/:id", (req, res) => {
  let movie;
  Movie.findOne({
    where: {
      movie_id: req.params.id,
    },
    include: [
      {
        model: Reviews,
        attributes: ["id", "post", "user_id", "movie_id", "stars"],
        include: {
          model: User,
          attributes: ["id", "username"],
        },
      },
    ],
  })
    .then((dbMovieData) => {
      if (!dbMovieData) {
        getFromServer(req.params.id).then((dbMovieData) => {
          movie = dbMovieData.get({ plain: true });
        });
      }
      movie = dbMovieData.get({ plain: true });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });

  Reviews.findAll({
    where: {
      movie_id: req.params.id,
    },
    attributes: [
      "id",
      "movie_id",
      "post",
      "stars",
      "user_id",
      "created_at",
      //   [
      //     sequelize.fn('sum', sequelize.col('stars')),
      //     'user_scores'
      // ]
    ],
    include: {
      model: User,
      attributes: ["id", "username"],
    },
  })
    .then((dbReviewData) => {
      if (!dbReviewData) {
        res.render("single-movie", {
          movie,
          loggedIn: req.session.loggedIn,
        });
        return;
      }
      const reviews = dbReviewData.map((review) => review.get({ plain: true }));
      res.render("single-movie", {
        movie,
        reviews,
        loggedIn: req.session.loggedIn,
      });
      return;
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
