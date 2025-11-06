const token =
    'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzYzNhZjExMWRhZGQ5MTY3NDhmZTE0NDA3ZWZmOGE5MyIsIm5iZiI6MTc1MTUzOTU5Mi4zNDksInN1YiI6IjY4NjY1Zjg4MTM1NDNhOGIyODc0MzIxZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.0zBYpWT_lFsiCnaaZV7SoA8XIt22wUxHAYx66BZdJyM'

const apiPopular = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=1`

let favorites = JSON.parse(localStorage.getItem('Favorites')) || []

// fav button funktion
let favHeart = function (favBtn) {
    if (favBtn.textContent === '🤍') {
        favBtn.textContent = '💓'
    } else {
        favBtn.textContent = '🤍'
    }
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
                // lägger in html kod för cardsen som visas på sidan
                card.innerHTML = `
                <div class="popularCardContent">
            <img src="${posters}" alt="movie poster">
            <h3>${movie.title}</h3>
            <p>⭐${movie.vote_average}</p>
            <button class="fav-btn">🤍</button>
                </div>
            `

                const favBtn = card.querySelector('.fav-btn')
                favBtn.addEventListener('click', () => favHeart(favBtn))


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
            fetchWholeList(page + 1)
        }
    }

    function renderMovies(movies) {
        const containerMovie = document.getElementById('allMovies')
        movies.forEach((movie) => {
            const listCard = document.createElement('div')
            listCard.classList.add('movieCard')

            listCard.innerHTML = `
            <div class="movieCardContent">
      <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}" alt="${movie.title}">
      <h3>${movie.title}</h3>
      <p>${movie.release_date}</p>
      <p>⭐${movie.vote_average}</p>
            <button class="fav-btn">🤍</button>
          </div>
      `
            const favBtn = listCard.querySelector('.fav-btn')
            favBtn.addEventListener('click', () => favHeart(favBtn))
            containerMovie.appendChild(listCard)
        })
    }
    fetchWholeList()
})
