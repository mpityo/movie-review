const router = require('express').Router();
const fetch = require('node-fetch');
const baseURL = 'https://api.themoviedb.org';
const apiKey = process.env.MOVIEDB_API_KEY;

router.post('/', (req, res) => {
    fetch(`${baseURL}/3/search/movie?api_key=${apiKey}&language=en-US&query=${req.body.search}&page=1&include_adult=false`)
    .then(response => {
        if (response) {
            return response.json()
        } else {
            console.log(response);
            return;
        }
    })
    .then(data => {
        const results = data.results;
        res.render("search", {
            results
        });
        return;
    });
});

module.exports = router;