morgan = require('morgan');
fs = require('fs');
path = require('path');

const express = require('express');
const app = express();

const hostname = '127.0.0.1';
const port = 8080;

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' });

let dataJSON = [{
        title: 'Pulp Fiction',
        director: 'Quentin Tarantino',
        genre: 'Splatter'
    },
    {
        title: 'Lord of the Rings',
        director: 'Peter Jackson',
        genre: 'Fantasy'
    },
    {
        title: 'Matrix',
        director: 'The Wachowskis',
        genre: 'Action'
    },
    {
        title: 'Life is beautiful',
        director: 'Roberto Benigni',
        genre: 'Drama/Historic'
    },
    {
        title: 'Fight Club',
        director: 'David Fincher',
        genre: ''
    },
    {
        title: 'Forrest Gump',
        director: 'Robert Zemeckis',
        genre: ''
    },
    {
        title: 'The Warriors',
        director: 'Walter Hill',
        genre: ''
    },
    {
        title: '12 years a slave',
        director: 'Steve McQueen',
        genre: ''
    },
    {
        title: 'The Shawshank Redemption',
        director: 'Frank Darabont',
        genre: ''
    },
    {
        title: 'The Godfather',
        director: 'Francis Ford Coppola',
        genre: ''
    }
];

app.use(morgan('combined', { stream: accessLogStream }));

//Return a list of ALL movies to the user
app.get('/movies', (req, res) => {
    res.json(dataJSON);
});

//Return data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title to the user
app.get('/movies/:title', (req, res) => {
    //res.send('Looking for movie ' + req.params.title);
    res.json(dataJSON.find((movie) => { return movie.title === req.params.title; }));
});

//Return data about a genre (description) by name/title (e.g., “Thriller”)
app.get('/movies/:title/details', (req, res) => {

    let movie = dataJSON.find((movie) => { return movie.title === req.params.title; });

    if (movie) {
        console.log('Movie found: ' + movie.title);
        res.send(movie.genre);
    } else
        res.send('Movie not found');
});

//Return data about a director (bio, birth year, death year) by name
app.get('/movies/directors/:name', (req, res) => {
    res.send('Details about the director: ' + req.params.name);
});

//Allow new users to register
app.post('/users/register', (req, res) => {
    res.status(201);
    res.send('User account created');
});

//Allow users to update their user info (username)
app.put('/users/:user', (req, res) => {
    res.send('User account updated');
});

//Allow users to add a movie to their list of favorites (showing only a text that a movie has been added—more on this later)
app.post('/users/:user/favourites', (req, res) => {
    res.status(201);
    res.send('The movie has been add to favorites');
});

//Allow users to remove a movie from their list of favorites (showing only a text that a movie has been removed—more on this later)
app.delete('/users/:user/favourites', (req, res) => {
    res.send('The movie has been removed from favorites');
});

//Allow existing users to deregister (showing only a text that a user email has been removed—more on this later)
app.delete('/users/:user', (req, res) => {
    res.send('You have been removed')
});

app.use(express.static('public'));

app.use((err, req, res, next) => {
    console.error('Found an error: ' + err.message);
    res.status(err.code).send('Error!')
});

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
})