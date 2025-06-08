const html = './dist/agrofirm-frontend/';



const port = 3001;

const apiUrl = '/';



// Express

const proxy = require('http-proxy-middleware');

const http = require('http');

const bodyParser = require('body-parser');

const compression = require('compression');

const express = require('express');

var app = express();



app

    .use(compression())

    .use(bodyParser.json())

    // Static content

    .use('/api', proxy({ target: "http://localhost:1338", changeOrigin: true, agent: new http.Agent({ keepAlive: true }) }))

    .use(express.static(html))

    // Default route

    .use(function(req, res) {

      res.sendFile(__dirname + '/dist/agrofirm-frontend/index.html');

    })

    // Start server

    .listen(port, function () {

        console.log('Port: ' + port);

        console.log('Html: ' + html);

    });
