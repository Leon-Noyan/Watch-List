const token =
    'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzYzNhZjExMWRhZGQ5MTY3NDhmZTE0NDA3ZWZmOGE5MyIsIm5iZiI6MTc1MTUzOTU5Mi4zNDksInN1YiI6IjY4NjY1Zjg4MTM1NDNhOGIyODc0MzIxZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.0zBYpWT_lFsiCnaaZV7SoA8XIt22wUxHAYx66BZdJyM'

const apiPopular = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=1`

let favorites = JSON.parse(localStorage.getItem('Favorites')) || []

// fav button funktion
let favHeart = function (favBtn, movie) {
    if (favBtn.textContent === '🤍') {
        favBtn.textContent = '💓'
        favorites.push(movie) // Lägg till filmen i favorites
    } else {
        favBtn.textContent = '🤍'
        // Använder filter för att skapa en ny array utan den borttagna filmen
        favorites = favorites.filter((fav) => fav.id !== movie.id)
    }
    // Lokal lagring uppdateras ALLTID efter ändring
    localStorage.setItem('Favorites', JSON.stringify(favorites))
}

document.addEventListener('DOMContentLoaded', () => {
    const popularCon = document.getElementById('popularContainer')
    async function fetchPopularMovies(url) {
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })
            const data = await response.json()

            console.log(data.results)
            // skapar en array med de 6 första populäraste filmerna just nu
            data.results.slice(0, 5).forEach((movie) => {
                // skapar ett kort som div element och ger den en klass
                let card = document.createElement('div')

                card.classList.add('popularCards')
                console.log(movie)
                // hanterar tillfällen då en poster är ur funktion
                let posters
                if (movie.poster_path) {
                    posters = `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                } else {
                    posters = 'fallback.jpg'
                }

                // Kontrollera om filmen redan är en favorit
                const initialHeart = favorites.some(
                    (fav) => fav.id === movie.id
                )
                    ? '💓'
                    : '🤍'

                // lägger in html kod för cardsen som visas på sidan
                card.innerHTML = `
                <div class="popularCardContent">
            <img src="${posters}" alt="movie poster">
            <h3>${movie.title}</h3>
            <p>⭐${movie.vote_average}</p>
            <button class="fav-btn">${initialHeart}</button>
                </div>
            `

                const favBtn = card.querySelector('.fav-btn')
                favBtn.addEventListener('click', () => favHeart(favBtn, movie))

                // lägger in korten i popularCon
                popularCon.appendChild(card)
            })
        } catch (error) {
            console.error('Error has accured', error)
            return []
        }
    }

    fetchPopularMovies(apiPopular)

    // fetch för alla filmer

    const allMoviesApi = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=`

    async function fetchWholeList(page = 1) {
        try {
            const res = await fetch(`${allMoviesApi}${page}`, {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })
            const data = await res.json()
            console.log(`${page}`, data.results)

            renderMovies(data.results)

            if (page < 5) {
                // Fortsätt till nästa sida upp till 5
                fetchWholeList(page + 1)
            }
        } catch (error) {
            console.error('Error fetching whole list', error)
        }
    }

    function renderMovies(movies) {
        const containerMovie = document.getElementById('allMovies')
        movies.forEach((movie) => {
            const listCard = document.createElement('div')
            listCard.classList.add('movieCard')

            // Hantera fallback för posters även här (SAKNADES tidigare)
            let posters
            if (movie.poster_path) {
                posters = `https://image.tmdb.org/t/p/w300${movie.poster_path}`
            } else {
                posters = 'fallback.jpg'
            }

            // Kontrollera om filmen redan är en favorit
            const initialHeart = favorites.some((fav) => fav.id === movie.id)
                ? '💓'
                : '🤍'

            listCard.innerHTML = `
                <div class="movieCardContent">
            <img src="${posters}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <p>${movie.release_date}</p>
            <p>⭐${movie.vote_average}</p>
            <button class="fav-btn">${initialHeart}</button>
                </div>
            `
            const favBtn = listCard.querySelector('.fav-btn')
            favBtn.addEventListener('click', () => favHeart(favBtn, movie))

            containerMovie.appendChild(listCard)
        })
    }

    fetchWholeList()
})
