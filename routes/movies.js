const router = require("express").Router();
const passport = require("passport");
const Models = require("../models.js");

//Defining Documents variables from Database
const Movies = Models.Movie;
const Genres = Models.Genre;

require("../passport");

/**
 * GET: Returns a list of ALL movies to the user
 * @function [path]/movies/
 * @returns {Object[]} movies
 * @requires passport
 */
router.get(
    "/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        Movies.find()
            .then((movies) => res.json(movies))
            .catch((err) => {
                console.error(err);
            });
    }
);

/**
 * GET: Returns data about a single movie by id
 * @function [path]/movies/:movie_id
 * @param {any} movie_id
 * @returns {Object} movie
 * @requires passport
 */
router.get(
    "/:movie_id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        Movies.findById(req.params.movie_id)
            .then((movie) => {
                console.log("Movie search " + req.params._id);
                //Checking if the returned Object isn't empty
                if (Object.keys(movie).length != 0) res.json(movie);
                else {
                    res.status(400).send(
                        req.params._id + " is not a valid id."
                    );
                }
            })
            .catch((err) => res.status(500));
    }
);

/**
 * GET: Returns data about a single movie by title
 * @function [path]/movies/:title
 * @param title
 * @returns {Object} movie
 * @requires passport
 */
router.get(
    "/:title",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        Movies.find({ Title: req.params.title })
            .then((movie) => {
                console.log("Movie search " + req.params.title);
                //Checking if the returned Object isn't empty
                if (Object.keys(movie).length != 0) res.json(movie);
                else {
                    res.status(400).send(
                        req.params.title + " is not in our library."
                    );
                }
            })
            .catch((err) => res.status(500));
    }
);

/**
 * GET: Return data about a genre (description) by name/title (e.g., ???Thriller???)
 * @function [path]/movies/:title/:details
 * @param movie_title
 * @returns {Object} genre
 * @requires passport
 */
router.get(
    "/:title/details",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        Movies.findOne({ Title: req.params.title })
            .then((movie) => {
                Genres.findById(movie.Genre)
                    .then((genre) => {
                        res.status(200).json(genre);
                    })
                    .catch((err) => console.error(err));
            })
            .catch((err) => console.error(err));
    }
);

module.exports = router;