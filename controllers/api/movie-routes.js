const router = require('express').Router();
const sequelize = require('../../config/connection');
const { Movie, User, Reviews } = require('../../models');
const fetch = require('node-fetch');
const baseURL = 'https://api.themoviedb.org';
const apiKey = process.env.MOVIEDB_API_KEY;

function saveToDB (data, tag = '') {
    let genre = [];
    if (Array.isArray(data.genre_ids)) {
        genre = data.genre_ids;
    } else {
        const genres = data.genres;
        if (genres.length > 1) {
            for (var i = 0; i < genres.length; i++) {
                genre.push(genres[i].id);
            }
        } else {
            genre = [genres[0].id];
        }
    }

    Movie.create({
        db_id: data.id,
        title: data.title,
        description: data.overview,
        critic_review: data.vote_average,
        poster_path: data.poster_path,
        genre,
        tag,
        release_date: data.release_date
    })
    .then(dbMovieData => {
        return dbMovieData;
    })
    .catch(err => {
        console.log(err);
    });
}

async function getFromServer (whatToGet) {
    const url = `${baseURL}/3/movie/${whatToGet}?api_key=${apiKey}&language=en-US`;
    fetch(url)
    .then(response => {
        if (response) {
            response.json()
            .then(data => {
                let returnedData = [];
                let errors = [];
                if (!Array.isArray(data.results)) {
                    return saveToDB(data);
                }
                data.results.forEach((element, index) => {
                    const saveToDbResponse = saveToDB(element, whatToGet);
                    if (Array.isArray(saveToDbResponse)) {
                        errors.push(saveToDbResponse[1]);
                    } else {
                        returnedData.push(saveToDbResponse);
                    }
                });
                return returnedData;
            });
        }
    })
}

// GET a single movie
router.get('/:id', (req, res) => {
    Movie.findOne({
        where: {
            db_id: req.params.id
        },
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
                    attributes: ['username']
                }
            }
        ]
    })
    .then(dbMovieData => {
        // if movie data doesn't exist in DB (database), find it in server api, add it to DB and send results
        // does not need to include reviews, as there are none if it wasn't in DB
        if (!dbMovieData) {
            getFromServer(req.params.id)
            .then(dbMovieData => {
                res.json(dbMovieData);
                return;
            });
        } else {
            res.json(dbMovieData);
        }
    })
});

// GET popular, top rated, now playing by using '?type='
router.post('/', (req, res) => {
    Movie.findAll({
        where: {
            tag: req.query.type
        }
    })
    .then((dbMovieData) => {
        if (dbMovieData.length === 0) {
            getFromServer(req.query.type)
            .then(dbMovieData => {
                res.json(dbMovieData);
                return;
            });
        } else {
            res.json(dbMovieData);
        }
    });
});

module.exports = router;