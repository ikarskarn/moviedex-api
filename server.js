require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet');
const cors = require('cors')
const moviesData = require('./movies-data-small.json')

const app = express()

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN;
    const authToken = req.get('Authorization');
    
    if(!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({error: 'Unauthorized request'})
    }

    next();
})

const validGenres = ['Action', 'Adventure', 'Animation','Biography', 'Comedy', 'Crime', 'Drama', 'Documentary', 'Grotesque', 'Fantasy', 'Horror', 'Musical', 'Romantic', 'Spy', 'Thriller', 'War', 'Western'];

function handleGetGenre(req, res) {
    res.json(validGenres);
}

app.get('/genres', handleGetGenre)

function handleGetMovies(req, res) {
    let response = moviesData;
    //genre, country or avg_vote
    if(req.query.genre) {
        response = response.filter(movies => 
            movies.genre.toLowerCase().includes(req.query.genre.toLowerCase())
        )
    }
    if(req.query.country) {
        response = response.filter(movies => 
            movies.country.toLowerCase().includes(req.query.country.toLowerCase())
        )
    }
    if(req.query.avg_vote) {
        const num = Number(req.query.avg_vote);
        response = response.filter(movies =>
            Number(movies.avg_vote) >= num)
    }
    res.json({response});
}

app.get('/movies', handleGetMovies)

const PORT = 8000

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})

//Users can search for Movies by genre, country or avg_vote
//The endpoint is GET /movie