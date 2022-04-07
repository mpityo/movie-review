async function reviewButtonHandler () {  
    event.preventDefault();

    const review_text = document.querySelector('textarea[name="review-body"]').value.trim();
    const stars = document.querySelector('#review-range').value;
    const movie_id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];

    if (review_text) {
        const response = await fetch('/api/reviews', {
            method: 'POST',
            body: JSON.stringify({
                movie_id,
                post: review_text,
                stars
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response) {
            document.location.reload();
        } else {
            alert(response.statusText);
        }
    }
}

document.querySelector('.review-form').addEventListener('submit', reviewButtonHandler);