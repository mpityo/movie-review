const router = require('express').Router();
const fetch = require('node-fetch');
const baseURL = 'https://api.themoviedb.org';
const apiKey = process.env.MOVIEDB_API_KEY;

router.get('/', (req, res) => {
    const mockResults = [
        {
            adult: false,
            backdrop_path: null,
            genre_ids: [ 35 ],
            id: 221368,
            original_language: 'en',
            original_title: 'Tillie Wakes Up',
            overview: 'Tillie and her neighbor Mr. Pipkins are both distraught over their respective marriages. One day, they sneak off to have a lively time at Coney Island. They flee the park together just as their spouses come to find them. After a chase, each is rescued from the ocean and reconcile with their respective spouses.',
            popularity: 0.651,
            poster_path: null,
            release_date: '1917-01-29',
            title: 'Tillie Wakes Up',
            video: false,
            vote_average: 6,
            vote_count: 2
          },
          {
            adult: false,
            backdrop_path: null,
            genre_ids: [],
            id: 850303,
            original_language: 'en',
            original_title: 'James Tillis vs. Mike Tyson',
            overview: 'A boxing fight.',
            popularity: 0.6,
            poster_path: null,
            release_date: '1986-05-03',
            title: 'James Tillis vs. Mike Tyson',
            video: true,
            vote_average: 0,
            vote_count: 0
          }
        ];
    res.render("search", {
        mockResults
    });
});

router.post('/', (req, res) => {
    fetch(`${baseURL}/3/search/movie?api_key=${apiKey}&language=en-US&query=${req.body.search}&page=1&include_adult=false`)
    .then(response => {
        if (response) {
            response.json()
            .then(data => {
                const results = data.results;
                res.render("search", {
                    results
                });
                return;
            });
        } else {
            console.log(response);
            return;
        }
    })
});

module.exports = router;