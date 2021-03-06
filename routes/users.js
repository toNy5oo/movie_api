const router = require("express").Router();
const passport = require("passport");
const Models = require("../models.js");

//Defining Documents variables from Database
const Movies = Models.Movie;
const Users = Models.User;

const { check, validationResult } = require("express-validator");

require("../passport");

router
    .route("/")
    /**
     * @function [path]/users/
     * GET: Retrieve informations about all users
     * @returns {Object[]} users
     */
    .get(passport.authenticate("jwt", { session: false }), (req, res) => {
        Users.find()
            .then((users) => {
                res.status(201).json(users);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send("Error: " + err);
            });
    })
    /**
     * POST: Allows new users to register; Username, Password, Email and Birthday are required.
     * Password is hashed
     * @function [path]/users/
     * @param {JSON} data from registration form
     * @returns user object
     */
    .post((req, res) => {
        //minimum value of 5 characters are only allowed
        // [
        //     check("Username", "Username is required").isLength({ min: 5 }),
        //     check("Username", "Username contains non alphanumeric characters - not allowed.").isAlphanumeric(),
        //     //is not empty
        //     check("Password", "Password is required").not().isEmpty(),
        //     //it is an email address
        //     check("Email", "Email does not appear to be valid").isEmail(),
        // ],
        // (req, res) => {
        //     // check the validation object for errors
        //     let errors = validationResult(req);

        //     if (!errors.isEmpty()) {
        //         return res.status(422).json({ errors: errors.array() });
        //     }
        // };

        let hashedPassword = Users.hashPassword(req.body.Password);
        Users.findOne({ Username: req.body.Username })
            .then((user) => {
                if (user) {
                    return res
                        .status(400)
                        .send(req.body.Username + " is already registered");
                } else {
                    Users.create({
                            Username: req.body.Username,
                            Password: hashedPassword,
                            Email: req.body.Email,
                            Birthday: req.body.Birthday,
                        })
                        .then((user) => {
                            res.status(201).json(user);
                        })
                        .catch((err) => {
                            console.error(err);
                            res.status(500).send("Error: " + err);
                        });
                }
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send("Error: " + err);
            });
    });

router
    .route("/:username")
    /**
     * GET: Returns data on a single user by username
     * @function [path]/users/:username
     * @param {string} username
     * @returns {Object} user
     * @requires passport
     */
    .get(passport.authenticate("jwt", { session: false }), (req, res) => {
        Users.findOne({ Username: req.params.username })
            .then((user) => {
                res.json(user);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send("Error: " + err);
            });
    })
    /**
     * GET: Removes a user by username
     * @function [path]/users/:username
     * @param {string} username
     * @returns {string} success or failure message
     * @requires passport
     */
    .delete(passport.authenticate("jwt", { session: false }), (req, res) => {
        Users.findOneAndRemove({ Username: req.params.username })
            .then((user) => {
                if (!user) {
                    res.status(400).send(
                        req.params.username + " was not found."
                    );
                } else {
                    res.status(200).send(req.params.username + " was deleted.");
                }
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send("Error " + err);
            });
    });

/**
 * PUT: Allow users to update their informations
 * @function [path]/users/:username/update
 * @param {string} Username
 * @returns {Object} user - with new informations
 * @requires passport
 */
router.put(
    "/:username/update",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        const updatedUser = {
            Username: req.body.Username,
            Email: req.body.Email,
            Birthday: req.body.Birthday,
        };
        if (req.body.password) {
            updatedUser.Password = Users.hashPassword(req.body.Password);
        }
        Users.findOneAndUpdate({ Username: req.params.username }, { $set: updatedUser }, { new: true })
            .then((user) => {
                if (!user) {
                    return res
                        .status(400)
                        .send(
                            "The user " +
                            req.params.username +
                            " doesn't exists."
                        );
                } else {
                    const userObjWithouPwd = updatedUser;
                    delete userObjWithouPwd.Password;
                    res.json(userObjWithouPwd); // Return json object of updatedUser
                }
            })
            .catch((error) => {
                console.error(error);
                res.status(500).send("Error: " + error);
            });
    }
);

router
    .route("/:username/favs/:movieID")
    /**
     * POST: Allow users to add a movie to their list of favorites
     * @function [path]/users/:username/favs/:movieID
     * @param {string} username
     * @param {any} movieID
     * @returns {any} movieID
     * @requires passport
     */
    .put(passport.authenticate("jwt", { session: false }), (req, res) => {
        Users.findOneAndUpdate({ Username: req.params.username }, { $addToSet: { FavoriteMovies: req.params.movieID } }, { new: true },
            (err, updatedUser) => {
                if (err) {
                    console.error(err);
                    res.status(500).send("Error " + err);
                } else {
                    res.json({ id: req.params.movieID });
                }
            }
        );
    })
    /**
     * DELETE: Allows users to remove a movie from their list of favorites
     * @function [path]/users/:username/favs/:movieID
     * @param {string} username
     * @param {any} movieID
     * @returns {any} movieID
     * @requires passport
     */
    .delete(passport.authenticate("jwt", { session: false }), (req, res) => {
        Users.findOneAndUpdate({ Username: req.params.username }, { $pull: { FavoriteMovies: req.params.movieID } })
            .then((updatedUser) => {
                Movies.findOne({ _id: req.params.movieID }).then((movie) => {
                    res.json({ id: req.params.movieID });
                });
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send("Error " + err);
            });
    });

module.exports = router;