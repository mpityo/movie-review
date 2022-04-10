const baseURL = 'https://api.themoviedb.org';
//const apiKey = process.env.MOVIEDB_API_KEY;

function buttonHandler(event) {
    event.preventDefault();

    const tag = event.target.id;
    console.log(tag);
    let pageNum = 1;
    if (tag === 'popular') {
        pageNum = 2;
    }
    const url = `${baseURL}/3/movie/${tag}?api_key=7fb83451bfc0b8f635f56fa0c67dea43&language=en-US&page=${pageNum}`;
    fetch(url)
    .then(response => {
        return response.json()
    })
    .then(data => {
        return data.results;
    })
    .then(dataResults => {
        dataResults.forEach(element => {
            fetch(`/api/movies/`, {
                method: 'POST',
                body: JSON.stringify({
                    element,
                    tag
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .catch(err => {
                console.log(err);
            });
        });
    })
    .catch(err => {
        console.log(err);
    });
}

document.querySelector('.btn-popular').addEventListener('click', buttonHandler);
document.querySelector('.btn-nowplaying').addEventListener('click', buttonHandler);
document.querySelector('.btn-toprated').addEventListener('click', buttonHandler);