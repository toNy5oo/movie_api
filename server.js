const http = require('http'),
    fs = require('fs'),
    url = require('url');

http.createServer((request, response) => {

    //define the 3 parameter to parse the address
    let addr = request.url,
        q = url.parse(addr, true),
        filepath = '';
    response.writeHead(200, { 'Content-Type': 'text/plain' });

    //Log the request
    let logString = 'URL requested: ' + addr + '\r\nTime : ' + new Date() + '\r\n\n'
    fs.appendFile('log.txt', logString, (err) => {
        if (err) {
            console.log('Error logging: ${err}');
        }
    });

    //Check if the url has the documentation word in it, otherwise direct to index.html
    if (q.pathname.includes('documentation')) {
        filepath = (__dirname + '/documentation.html');
    } else {
        filepath = 'index.html'
    }

    fs.readFile(filepath, (err, data) => {
        if (err) {
            console.log(err)
            throw err;
        }
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.write(data);
        response.end();
    });

}).listen(8080);

console.log('-- Server started on port 8080 --');