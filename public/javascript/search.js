async function searchFormHandler (event) {
    event.preventDefault();

    const searchText = document.querySelector('input[type="search"]').value.trim();

    if (searchText) {
        const response = await fetch(`/api/search`, {
            method: 'GET',
        //     body: JSON.stringify({
        //         search: searchText
        //     }),
        // headers: {
        //     'Content-Type': 'application/json'
        // }
    });
        if(response) {
            console.log(response);
        }
    }
}

document.querySelector('.search-btn').addEventListener('submit', searchFormHandler)