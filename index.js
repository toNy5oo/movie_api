morgan = require('morgan');
fs = require('fs');
path = require('path');

const express = require('express');
const app = express();

const hostname = '127.0.0.1';
const port = 8080;

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' });

let dataJSON = [{
        title: 'Pulp Fiction',
        director: 'Quentin Tarantino'
    },
    {
        title: 'Lord of the Rings',
        director: 'Peter Jackson'
    },
    {
        title: 'Matrix',
        director: 'The Wachowskis'
    },
    {
        title: 'Life is beautiful',
        director: 'Roberto Benigni'
    },
    {
        title: 'Fight Club',
        director: 'David Fincher'
    },
    {
        title: 'Forrest Gump',
        director: 'Robert Zemeckis'
    },
    {
        title: 'The Warriors',
        director: 'Walter Hill'
    },
    {
        title: '12 years a slave',
        director: 'Steve McQueen'
    },
    {
        title: 'The Shawshank Redemption',
        director: 'Frank Darabont'
    },
    {
        title: 'The Godfather',
        director: 'Francis Ford Coppola'
    }
];

app.use(morgan('combined', { stream: accessLogStream }));

app.get('/movies', (req, res) => {
    res.json(dataJSON);
});

// app.get('/documentation', (req, res) => {
//     res.sendFile('public/documentation.html', { root: __dirname });
// });

//Version with express
app.get('/', (req, res) => {
    res.send('Welcome to my app');
});

app.use(express.static('public'));

app.use((err, req, res, next) => {
    console.error('Found an error: ' + err.message);
    res.status(err.code).send('Error!')
});

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
})