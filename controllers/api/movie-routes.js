const router = require('express').Router();
const sequelize = require('../../config/connection');
const { Movie, User, Reviews } = require('../models/Movie');
const { getTopRatedAPI, getNowShowingAPI, getPopularAPI, getSingleMovieAPI, saveToDB } = require('../../util/api-call');

// GET a single movie
router.get('/:id', (req, res) => {
    Movie.findOne({
        where: {
            dbId: req.params.id
        },
        attributes: [
            'id',
            'dbId',
            'title',
            'description',
            'critic_reviews',
            'poster_path',
            'genre',
            'tag'
        ],
        include: [
            {
                model: Reviews,
                attributes: ['id', 'user_id', 'movie_id', 'user_review_content', 'user_review_stars'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            }
        ]
    })
    .then(dbMovieData => {
        // if movie data doesn't exist in DB (database), find it in server api, add it to DB and send results
        // does not need to include reviews, as there are none if it wasn't in DB
        if (!dbMovieData) {
            getSingleMovieAPI(req.body.dbId)
            .then(dbMovieData => {
                res.json(dbMovieData);
                return;
            });
        } else {
            res.json(dbMovieData);
        }
    })
});

// GET 'popular' movie tag in db
router.get('/popular', (req, res) => {
    Movie.findAll({
        where: {
            tag: 'popular'
        }
    })
    .then((dbMovieData) => {
        if (!dbMovieData) {
            getPopularAPI()
            .then(dbMovieData => {
                res.json(dbMovieData);
                return;
            });
        } else {
            res.json(dbMovieData);
        }
    })
});

// GET 'top-rated' movie tag in db
router.get('/top-rated', (req, res) => {
    Movie.findAll({
        where: {
            tag: 'top-rated'
        }
    })
    .then((dbMovieData) => {
        if (!dbMovieData) {
            getTopRatedAPI()
            .then(dbMovieData => {
                res.json(dbMovieData);
                return;
            });
        } else {
            res.json(dbMovieData);
        }
    })
});

// GET 'now-showing' movie tag in db
router.get('/top-showing', (req, res) => {
    Movie.findAll({
        where: {
            tag: 'now-showing'
        }
    })
    .then((dbMovieData) => {
        if (!dbMovieData) {
            getNowShowingAPI()
            .then(dbMovieData => {
                res.json(dbMovieData);
                return;
            });
        } else {
            res.json(dbMovieData);
        }
    })
});

// CREATE movie
router.post('/', (req, res) => {
    saveToDB(req.body, null)
    .then(dbMovieData => res.json(dbMovieData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;