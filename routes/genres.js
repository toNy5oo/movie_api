const router = require("express").Router();
const Models = require("../models.js");
const passport = require("passport");

//Defining Documents variables from Database
const Genres = Models.Genre;

require("../passport");

/**
 * GET: Returns a list of ALL genres
 * @function [path]/genres/
 * @returns {Object[]} genres
 * @requires passport
 */
router.get(
    "/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        Genres.find()
            .then((genres) => res.json(genres))
            .catch((err) => {
                console.error(err);
            });
    }
);

/**
 * GET: Returns data about a single genre by id
 * @function [path]/genres/:genre_id
 * @param {any} genre_id
 * @returns {Object} genre
 * @requires passport
 */
router.get(
    "/:genre_id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        Genres.findById(req.params.genre_id)
            .then((genres) => {
                //Checking if the returned Object isn't empty
                if (Object.keys(genres).length != 0) res.json(genres);
                else {
                    res.status(400).send(
                        req.params._id + " is not a valid id."
                    );
                }
            })
            .catch((err) => res.status(500));
    }
);

module.exports = router;