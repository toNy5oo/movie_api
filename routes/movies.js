const router = require('express').Router();
const passport = require('passport');
const mongoose = require('mongoose');
const Models = require('../models.js');

//Defining Documents variables from Database
const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Director;

require('../passport');

//Return a list of ALL movies to the user
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.find()
        .then((movies) => res.json(movies))
        .catch((err) => {
            console.error(err);
        });
});

//Return data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title to the user
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

//Return data about a director (bio, birth year, death year) by name
router.get('/directors/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
    Directors.findOne({ Name: req.params.name })
        .then((director) => { res.json(director); })
        .catch((err) => console.error(err));
});


module.exports = router;