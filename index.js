morgan = require('morgan');
fs = require('fs');
path = require('path');

const moviesRoutes = require('./routes/movies'),
    usersRoutes = require('./routes/users'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    express = require('express'),
    cors = require('cors'),
    app = express();

const hostname = '127.0.0.1';
const port = process.env.PORT || 8080;

//ACCESS TO FS LOG.TXT
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' });

//DB CONNECTION
mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

//Parsing Object als Json in Body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Cross-Origin Resource Sharing
app.use(cors());

//Passport strategy required
let auth = require('./auth')(app);
const passport = require('passport');
const { Router } = require('express');
require('./passport');

//Logging with Mrogan
app.use(morgan('combined', { stream: accessLogStream }));

//Using the routes on separate files
app.use('/movies', moviesRoutes);
app.use('/users', usersRoutes);

app.use(express.static('public'));

// app.use((err, req, res, next) => {
//     console.error('Found an error: ' + err.message);
//     res.status(err.code).send('Error!')
// });

//Server listening on hostname:port
app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
})


// OLD CODE HERE

//______________________  ENDPOINTS

// //Return a list of ALL movies to the user
// app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
//     Movies.find()
//         .then((movies) => res.json(movies))
//         .catch((err) => {
//             console.error(err);
//         });
// });

// //Return data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title to the user
// app.get('/movies/:title', passport.authenticate('jwt', { session: false }), (req, res) => {
//     Movies.find({ Title: req.params.title })
//         .then(movie => {
//             console.log('Movie search ' + req.params.title);
//             //Checking if the returned Object isn't empty
//             if (Object.keys(movie).length != 0) res.json(movie)
//             else { res.status(400).send(req.params.title + ' is not in our library.') }
//         })
//         .catch((err) => res.status(500));
// });

// //Return data about a genre (description) by name/title (e.g., “Thriller”)
// app.get('/movies/:title/details', passport.authenticate('jwt', { session: false }), (req, res) => {
//     Movies.findOne({ Title: req.params.title })
//         .then(movie => {
//             Genres.findById(movie.Genre)
//                 .then(genre => {
//                     res.status(200).json(genre);
//                 })
//                 .catch((err) => console.error(err));
//         })
//         .catch((err) => console.error(err));

// });

// //Return data about a director (bio, birth year, death year) by name
// app.get('/movies/directors/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
//     Directors.findOne({ Name: req.params.name })
//         .then((director) => { res.json(director); })
//         .catch((err) => console.error(err));
// });

// //Retrieve all the users
// app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
//     Users.find()
//         .then((users) => {
//             res.status(201).json(users);
//         })
//         .catch((err) => {
//             console.error(err);
//             res.status(500).send('Error: ' + err);
//         });
// });

// //Retrieve one user by username
// app.get('/users/:username', passport.authenticate('jwt', { session: false }), (req, res) => {
//     Users.findOne({ Username: req.params.username })
//         .then((user) => {
//             res.json(user);
//         })
//         .catch((err) => {
//             console.error(err);
//             res.status(500).send('Error: ' + err);
//         });
// });


// //Allow new users to register
// app.post('/users/register', (req, res) => {

//     Users.findOne({ Username: req.body.Username }).then((user) => {
//         if (user) {
//             return res.status(400).send(req.body.Username + ' is already registered');
//         } else {
//             Users.create({
//                 Username: req.body.Username,
//                 Password: req.body.Password,
//                 Email: req.body.Email,
//                 Birthday: req.body.Birthday
//             }).then((user) => {
//                 res.status(201).json(user)
//             }).catch((err) => {
//                 console.error(err);
//                 res.status(500).send('Error: ' + err);
//             })
//         }
//     }).catch((err) => {
//         console.error(error);
//         res.status(500).send('Error: ' + error);
//     });

// });

// //Allow users to update their user info (username)
// app.put('/users/:username/:newUsername', passport.authenticate('jwt', { session: false }), (req, res) => {
//     Users.findOne({ Username: req.params.username }).then((user) => {
//         if (!user) {
//             return res.status(400).send("The user " + req.params.username + " doesn't exists.");
//         } else {
//             user.updateOne({ Username: req.params.newUsername }).then((user) => {
//                 res.status(201).json(user)
//             }).catch((err) => {
//                 console.error(err);
//                 res.status(500).send('Error: ' + err);
//             })
//         }
//     }).catch((err) => {
//         console.error(error);
//         res.status(500).send('Error: ' + error);
//     });
// });


// app.route('/users/:username/favourites/:movieID', passport.authenticate('jwt', { session: false }))
//     // //Allow users to add a movie to their list of favorites (showing only a text that a movie has been added—more on this later)
//     .put((req, res) => {
//         Users.findOneAndUpdate({ Username: req.params.username }, { $addToSet: { FavoriteMovies: req.params.movieID } }, { new: true },
//             (err, updatedUser) => {
//                 if (err) {
//                     console.error(err);
//                     res.status(500).send('Error ' + err);
//                 } else {
//                     res.send('Movie added to your favourite list')
//                 }
//             });
//     })
//     // //Allow users to remove a movie from their list of favorites (showing only a text that a movie has been removed)
//     .delete((req, res) => {
//         Users.findOneAndUpdate({ Username: req.params.username }, { $pull: { FavoriteMovies: req.params.movieID } })
//             .then((updatedUser) => {
//                 Movies.findOne({ _id: req.params.movieID }).then((movie => {
//                     res.send('The movie \'' + movie.Title + '\' has been removed from your favourite list.');
//                 }))
//             }).catch((err) => {
//                 console.error(err);
//                 res.status(500).send('Error ' + err);
//             });
//     });


// //Allow existing users to deregister (showing only a text that a user email has been removed—more on this later)
// app.delete('/users/:username', passport.authenticate('jwt', { session: false }), (req, res) => {
//     Users.findOneAndRemove({ Username: req.params.username })
//         .then((user) => {
//             if (!user) {
//                 res.status(400).send(req.params.username + ' was not found.');
//             } else {
//                 res.status(200).send(req.params.username + ' was deleted.');
//             }
//         }).catch((err => {
//             console.error(err);
//             res.status(500).send('Error ' + err);

//         }));
// });


//____________ ENDPOINTS








// let dataJSON = [{
//         title: 'Pulp Fiction',
//         director: 'Quentin Tarantino',
//         genre: 'Splatter'
//     },
//     {
//         title: 'Lord of the Rings',
//         director: 'Peter Jackson',
//         genre: 'Fantasy'
//     },
//     {
//         title: 'Matrix',
//         director: 'The Wachowskis',
//         genre: 'Action'
//     },
//     {
//         title: 'Life is beautiful',
//         director: 'Roberto Benigni',
//         genre: 'Drama/Historic'
//     },
//     {
//         title: 'Fight Club',
//         director: 'David Fincher',
//         genre: ''
//     },
//     {
//         title: 'Forrest Gump',
//         director: 'Robert Zemeckis',
//         genre: ''
//     },
//     {
//         title: 'The Warriors',
//         director: 'Walter Hill',
//         genre: ''
//     },
//     {
//         title: '12 years a slave',
//         director: 'Steve McQueen',
//         genre: ''
//     },
//     {
//         title: 'The Shawshank Redemption',
//         director: 'Frank Darabont',
//         genre: ''
//     },
//     {
//         title: 'The Godfather',
//         director: 'Francis Ford Coppola',
//         genre: ''
//     }
// ];