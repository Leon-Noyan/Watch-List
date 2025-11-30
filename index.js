import { TOKEN } from './config.js'
const token = TOKEN

const apiPopular = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=1`

const getFavorites = () => JSON.parse(localStorage.getItem('Favorites')) || []

// fav button funktion
let favHeart = function (favBtn, movie) {
    let currFavorites = getFavorites()
    if (favBtn.textContent === '🤍') {
        favBtn.textContent = '💓'
        currFavorites.push(movie) // Lägg till filmen i favorites
    } else {
        favBtn.textContent = '🤍'
        // Använder filter för att skapa en ny array utan den borttagna filmen
        currFavorites = currFavorites.filter((fav) => fav.id !== movie.id)
    }
    localStorage.setItem('Favorites', JSON.stringify(currFavorites))
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
            // skapar en array med de 5 första populäraste filmerna just nu
            data.results.slice(0, 5).forEach((movie) => {
                const latestFavs = getFavorites()
                const initialHeart = latestFavs.some(
                    (fav) => fav.id === movie.id
                )
                    ? '💓'
                    : '🤍'
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

    window.addEventListener('storage', (event) => {
        if (event.key === 'Favorites') {
            const popularCon = document.getElementById('popularContainer')
            const containerMovie = document.getElementById('allMovies')

            if (popularCon) popularCon.innerHTML = ''
            if (containerMovie) containerMovie.innerHTML = ''

            fetchPopularMovies(apiPopular)
            fetchWholeList()
        }
    })

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
            renderMovies(data.results)

            if (page < 2) {
                fetchWholeList(page + 1)
            }
        } catch (error) {
            console.error('Error fetching whole list', error)
        }
    }

    function renderMovies(movies) {
        const containerMovie = document.getElementById('allMovies')
        const latestFavs = getFavorites()

        movies.forEach((movie) => {
            const listCard = document.createElement('div')
            listCard.classList.add('movieCard')

            // Hantera fallback för posters
            let posters
            if (movie.poster_path) {
                posters = `https://image.tmdb.org/t/p/w300${movie.poster_path}`
            } else {
                posters = 'fallback.jpg'
            }

            // Kontrollera om filmen redan är en favorit
            let initialHeart
            if (latestFavs.some((fav) => fav.id === movie.id)) {
                initialHeart = '💓'
            } else {
                initialHeart = '🤍'
            }

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
