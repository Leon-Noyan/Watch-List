const token =
    'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzYzNhZjExMWRhZGQ5MTY3NDhmZTE0NDA3ZWZmOGE5MyIsIm5iZiI6MTc1MTUzOTU5Mi4zNDksInN1YiI6IjY4NjY1Zjg4MTM1NDNhOGIyODc0MzIxZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.0zBYpWT_lFsiCnaaZV7SoA8XIt22wUxHAYx66BZdJyM'

const apiPopular = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=1`

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
        return data.results
    } catch (error) {
        console.error('Error has accured', error)
        return []
    }
}

fetchPopularMovies(apiPopular)
