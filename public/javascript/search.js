
async function searchFormHandler () {
    event.preventDefault();

    const searchText = document.querySelector('input[type="text"]').value.trim();

    if (searchText) {
        const response = await fetch(`/search`, {
            method: 'post',
            body: JSON.stringify({
                search: searchText
            }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    }
}

document.querySelector('.search-container').addEventListener('click', searchFormHandler)