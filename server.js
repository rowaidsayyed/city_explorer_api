'use strict';

const express = require('express');

//CORS = Cross Origin Resource Sharing
const cors = require('cors');

// DOTENV (Read our Enviroment Variable)
require('dotenv').config();

// const superagent = require('superagent');
const pg = require('pg');

// Application Setup
const PORT = process.env.PORT || 3000;
const server = express();
server.use(cors());
const client = new pg.Client(process.env.DATABASE_URL);

client.connect()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Listening on PORT ${PORT}`);
    });
  })

const locationRout = require('./location.js');
const weatherRout = require('./weather.js');
const trailsRout = require('./trails.js');
const moviesRout = require('./movies.js');
const yelpRout = require('./yelp');
/************************************************* Rout Definitions ************************************************* */

// http://localhost:3000/location
server.get('/location', locationRout);

// http://localhost:3000/weather
server.get('/weather', weatherRout);

// http://localhost:3000/trails
server.get('/trails', trailsRout);

// http://localhost:3000/movies
server.get('/movies', moviesRout);

// http://localhost:3000/yelp
server.get('/yelp', yelpRout);

// Rout to display all data in the database
// http://localhost:3000/cities
server.get('/cities', citiesRout);

// this rout if I want to add data to database manually
// http://localhost:3000/add?city=&formatted_query=&lat=&lon
server.get('/add', addRout);

/**************************************************** Rout function ************************************************ */

// Rout to display all data in the database
//  http://localhost:3000/cities
function citiesRout(request, response) {
  let SQL = 'SELECT * FROM locations;';
  client.query(SQL)
    .then(results => {
      response.status(200).json(results.rows);
    })
    .catch(() => server.use((error, req, res) => {
      res.status(500).send(error);
    }));
}

// this rout if I want to add data to database manually
// http://localhost:3000/add?city=&formatted_query=&lat=&lon
function addRout(request, response) {
  let search_query = request.query.city;
  let formatted_query = request.query.formatted_query;
  let latitude = request.query.lat;
  let longitude = request.query.lon;
  let SQL = 'INSERT INTO locations (search_query,formatted_query,latitude,longitude)  VALUES ($1,$2,$3,$4);';
  let safeValues = [search_query, formatted_query, latitude, longitude];
  client.query(SQL, safeValues)
    .then(results => {
      response.status(200).json(results.rows);
    })
    .catch(() => server.use((error, req, res) => {
      res.status(500).send(error);
    }));
}
/**************************************************Errors handling************************************************** */
// localhost:3000/
server.get('/', (request, response) => {
  response.status(200).send('Welcome 301d4,it works');
});

// localhost:3000/anything
server.use('*', (req, res) => {
  res.status(404).send('NOT FOUND');
});

server.use((error, req, res) => {
  res.status(500).send(error);
});
