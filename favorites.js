function getCards() {
    const favStringText = localStorage.getItem('Favorites')

    if (favStringText) {
        return JSON.parse(favStringText)
    } else {
        return []
    }
}

function renderCards(fav) {
    const favContainer = document.getElementById('fav-movie-container')

    if (favContainer) {
        favContainer.innerHTML = ''
    }

    if (fav.length === 0) {
        favContainer.innerHTML = '<p id="tom">Listan är tom</p>'
        return
    }

    fav.forEach((movie) => {
        const listCard = document.createElement('div')
        listCard.classList.add('movieCard')

        let posters
        if (movie.poster_path) {
            posters = `https://image.tmdb.org/t/p/w300${movie.poster_path}`
        } else {
            posters = 'fallback.jpg'
        }

        listCard.innerHTML = `
                <div class="movieCardContent">
            <img src="${posters}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <p>${movie.release_date}</p>
            <p>⭐${movie.vote_average}</p>
            <button class="delete-btn" data-movie-id="${movie.id}">Ta bort</button>
                </div>
            ` // kolla koden ovan data-movie-id
        const deleteBtn = listCard.querySelector('.delete-btn')
        deleteBtn.addEventListener('click', () => {
            removeFavorite(movie.id)
        })

        favContainer.appendChild(listCard)
    })
}

function removeFavorite(movieId) {
    let currentFavorites = getCards()
    currentFavorites = currentFavorites.filter((movie) => movie.id != movieId)
    localStorage.setItem('Favorites', JSON.stringify(currentFavorites))

    renderCards(currentFavorites)
}

document.addEventListener('DOMContentLoaded', () => {
    const favoriteMovies = getCards()
    renderCards(favoriteMovies)
})

window.addEventListener('storage', (event) => {
    if (event.key === 'Favorites') {
        const updatedList = getCards()
        renderCards(updatedList)
    }
})
