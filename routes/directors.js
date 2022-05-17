const router = require('express').Router();
const Models = require('../models.js');

//Defining Documents variables from Database
const Directors = Models.Director;

require('../passport');

//passport.authenticate('jwt', { session: false }),
//Return a list of ALL directors
router.get('/', (req, res) => {
    Directors.find()
        .then((directors) => res.json(directors))
        .catch((err) => {
            console.error(err);
        });
});

//Return data (name, description) about a genre by id
router.get('/:director_id', (req, res) => {
    Directors.findById(req.params.director_id)
        .then(directors => {
            //Checking if the returned Object isn't empty
            if (Object.keys(directors).length != 0) res.json(directors)
            else { res.status(400).send(req.params._id + ' is not a valid id.') }
        })
        .catch((err) => res.status(500));
});

//Return data about a director (bio, birth year, death year) by name
router.get('/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
    Directors.findOne({ Name: req.params.name })
        .then((director) => { res.json(director); })
        .catch((err) => console.error(err));
});

module.exports = router;