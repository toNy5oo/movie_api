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

const hostname = '0.0.0.0';
const port = process.env.PORT || 8080;

//ACCESS TO FS LOG.TXT
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' });

//DB CONNECTION
//mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });


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