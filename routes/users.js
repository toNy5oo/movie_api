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

//Retrieve all the users
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.find()
        .then((users) => {
            res.status(201).json(users);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

//Retrieve one user by username
router.get('/:username', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOne({ Username: req.params.username })
        .then((user) => {
            res.json(user);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});


//Allow new users to register
router.post('/register', (req, res) => {

    Users.findOne({ Username: req.body.Username }).then((user) => {
        if (user) {
            return res.status(400).send(req.body.Username + ' is already registered');
        } else {
            Users.create({
                Username: req.body.Username,
                Password: req.body.Password,
                Email: req.body.Email,
                Birthday: req.body.Birthday
            }).then((user) => {
                res.status(201).json(user)
            }).catch((err) => {
                console.error(err);
                res.status(500).send('Error: ' + err);
            })
        }
    }).catch((err) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
    });

});

//Allow users to update their user info (username)
router.put('/:username/:newUsername', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOne({ Username: req.params.username }).then((user) => {
        if (!user) {
            return res.status(400).send("The user " + req.params.username + " doesn't exists.");
        } else {
            user.updateOne({ Username: req.params.newUsername }).then((user) => {
                res.status(201).json(user)
            }).catch((err) => {
                console.error(err);
                res.status(500).send('Error: ' + err);
            })
        }
    }).catch((err) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
    });
});


router.route('/:username/favourites/:movieID', passport.authenticate('jwt', { session: false }))
    // //Allow users to add a movie to their list of favorites (showing only a text that a movie has been added—more on this later)
    .put((req, res) => {
        Users.findOneAndUpdate({ Username: req.params.username }, { $addToSet: { FavoriteMovies: req.params.movieID } }, { new: true },
            (err, updatedUser) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('Error ' + err);
                } else {
                    res.send('Movie added to your favourite list')
                }
            });
    })
    // //Allow users to remove a movie from their list of favorites (showing only a text that a movie has been removed)
    .delete((req, res) => {
        Users.findOneAndUpdate({ Username: req.params.username }, { $pull: { FavoriteMovies: req.params.movieID } })
            .then((updatedUser) => {
                Movies.findOne({ _id: req.params.movieID }).then((movie => {
                    res.send('The movie \'' + movie.Title + '\' has been removed from your favourite list.');
                }))
            }).catch((err) => {
                console.error(err);
                res.status(500).send('Error ' + err);
            });
    });


//Allow existing users to deregister (showing only a text that a user email has been removed—more on this later)
router.delete('/:username', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndRemove({ Username: req.params.username })
        .then((user) => {
            if (!user) {
                res.status(400).send(req.params.username + ' was not found.');
            } else {
                res.status(200).send(req.params.username + ' was deleted.');
            }
        }).catch((err => {
            console.error(err);
            res.status(500).send('Error ' + err);

        }));
});

module.exports = router;