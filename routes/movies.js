const router = require('express').Router();
const passport = require('passport');
const Models = require('../models.js');

//Defining Documents variables from Database
const Movies = Models.Movie;
const Genres = Models.Genre;

require('../passport');

//passport.authenticate('jwt', { session: false }),
//Return a list of ALL movies to the user
router.get('/', (req, res) => {
    Movies.find()
        .then((movies) => res.json(movies))
        .catch((err) => {
            console.error(err);
        });
});

//Return data (description, genre, director, image URL, whether it’s featured or not) about a single movie by id
router.get('/:movie_id', (req, res) => {
    Movies.findById(req.params.movie_id)
        .then(movie => {
            console.log('Movie search ' + req.params._id);
            //Checking if the returned Object isn't empty
            if (Object.keys(movie).length != 0) res.json(movie)
            else { res.status(400).send(req.params._id + ' is not a valid id.') }
        })
        .catch((err) => res.status(500));
});

//Return data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title
router.get('/:title', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.find({ Title: req.params.title })
        .then(movie => {
            console.log('Movie search ' + req.params.title);
            //Checking if the returned Object isn't empty
            if (Object.keys(movie).length != 0) res.json(movie)
            else { res.status(400).send(req.params.title + ' is not in our library.') }
        })
        .catch((err) => res.status(500));
});

//Return data about a genre (description) by name/title (e.g., “Thriller”)
router.get('/:title/details', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({ Title: req.params.title })
        .then(movie => {
            Genres.findById(movie.Genre)
                .then(genre => {
                    res.status(200).json(genre);
                })
                .catch((err) => console.error(err));
        })
        .catch((err) => console.error(err));

});

module.exports = router;