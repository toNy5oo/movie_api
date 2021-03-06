const router = require("express").Router();
const Models = require("../models.js");
const passport = require("passport");

//Defining Documents variables from Database
const Directors = Models.Director;

require("../passport");
/** Get directors  */
/**
 * GET: Returns data about all directors
 * @returns {Object[]} directors
 * @requires passport
 */
router.get(
    "/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        Directors.find()
            .then((directors) => res.json(directors))
            .catch((err) => {
                console.error(err);
            });
    }
);

/**
 * GET: Returns data about a director by id
 * @param director_id
 * @returns {Object} director
 * @requires passport
 */
router.get(
    "/:director_id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        Directors.findById(req.params.director_id)
            .then((directors) => {
                //Checking if the returned Object isn't empty
                if (Object.keys(directors).length != 0) res.json(directors);
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
 * GET: Returns data about a director by name
 * @param Name (of director)
 * @returns {Object} director
 * @requires passport
 */
router.get(
    "/:name",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        Directors.findOne({ Name: req.params.name })
            .then((director) => {
                res.json(director);
            })
            .catch((err) => console.error(err));
    }
);

module.exports = router;