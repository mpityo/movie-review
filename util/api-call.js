require('dotenv').config();
const fetch = require('node-fetch');
const { connect } = require('../controllers');
const { Movie } = require('../models/Movie');
const baseURL = 'https://api.themoviedb.org';
const apiKey = process.env.MOVIEDB_API_KEY;

// takes a list of movies to add, and adds them to the DB one at a time
// if the movie is already in the database, it is skiped (dbID must be unique)
// 'tag' is defined by the user - tells us if it's important (now showing, popular, etc)
function saveToDB (data, tag) {
    console.log('in saveToDatabase')
    let errors = [];
    data.results.forEach((element) => {
        Movie.create({
            db_id: element.id,
            title: element.title,
            description: element.overview,
            critic_review: element.vote_average,
            poster_path: element.poster_path,
            genre: [element.genre_ids],
            tag
        })
        .then(dbMovieData => {
            return dbMovieData;
        })
        .catch(err => {
            errors.push(err);
        });
    });
    if (errors.length > 0) {
        console.log(`Some were not created: ${errors}`);
    } else {
        console.log(`Selected movies were added successfully (${data.results.length}`);
    }
}

// single movie
async function getSingleMovieAPI (id) {
    const url = `${baseURL}/3/movie/${id}?api_key=${apiKey}`;
    const response = await fetch(url);
        if (response.ok) {
            response.json().then(data => {
                saveToDB(data, null);
            })
            .then((dbMovieData) => {
                return dbMovieData;
            });
        } else {
            // TODO if response from server is bad
        }
}

// top rated
async function getTopRatedAPI () {
    const url = `${baseURL}/3/movie/top_rated?api_key=${apiKey}&language=en-US`;
    const response = await fetch(url);
        if (response.ok) {
            response.json().then(data => {
                saveToDB(data, 'top-rated');
            });
        } else {
            // TODO if response from server is bad
        }
}

// popular
async function getPopularAPI () {
    const url = `${baseURL}/3/movie/popular?api_key=${apiKey}&language=en-US`;
    const response = await fetch(url);
    console.log(response);
        if (response.ok) {
            response.json().then(data => {
                saveToDB(data, 'popular');
            });
        } else {
            // TODO if response from server is bad
        }
}

// now showing
async function getNowShowingAPI () {
    const url = `${baseURL}/3/movie/now_playing?api_key=${apiKey}`;
    const response = await fetch(url);
        if (response.ok) {
            response.json().then(data => {
                saveToDB(data, 'now-showing');
            });
        } else {
            // TODO if response from server is bad
        }
}

module.exports = { getTopRatedAPI, getNowShowingAPI, getPopularAPI, getSingleMovieAPI, saveToDB };