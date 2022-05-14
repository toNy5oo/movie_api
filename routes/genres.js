const router = require('express').Router();
const Models = require('../models.js');

//Defining Documents variables from Database
const Genres = Models.Genre;

require('../passport');

//passport.authenticate('jwt', { session: false }),
//Return a list of ALL genres
router.get('/', (req, res) => {
    Genres.find()
        .then((genres) => res.json(genres))
        .catch((err) => {
            console.error(err);
        });
});

//Return data (name, description) about a genre by id
router.get('/:genre_id', (req, res) => {
    Genres.findById(req.params.genre_id)
        .then(genres => {
            //Checking if the returned Object isn't empty
            if (Object.keys(genres).length != 0) res.json(genres)
            else { res.status(400).send(req.params._id + ' is not a valid id.') }
        })
        .catch((err) => res.status(500));
});

module.exports = router;