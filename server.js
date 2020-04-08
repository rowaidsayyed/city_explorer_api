'use strict';

const express = require('express');

//CORS = Cross Origin Resource Sharing
const cors = require('cors');

// DOTENV (Read our Enviroment Variable)
require('dotenv').config();

const superagent = require('superagent');
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

/******************************************************************************************************************/

// function locationRout(req, res) {
//   const city = req.query.city;
//   const key = process.env.LOCATION_API_KEY;

//   // check if the data in the database or not and return it as json
//   checkLocation(city, key)
//     .then((locationData) => {
//       res.status(200).json(locationData);
//     });
// }

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

/***********************************************get Routs functions**************************************************** */

// return location object for the city requested
function getlocation(city, key) {
  let url = `https://eu1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;
  return superagent.get(url)
    .then(geoData => {
      addToDatabase(city, geoData.body);
      const locationData = new Location(city, geoData.body);
      return locationData;
    });
}
/**********************************************Constructor functions*********************************************** */
function Location(city, geoData) {
  this.search_query = city;
  this.formatted_query = geoData[0].display_name;
  this.latitude = geoData[0].lat;
  this.longitude = geoData[0].lon;
}
/******************************************************Functions**************************************************** */

// check if the data in the database or not and return it as json
function checkLocation(city, key) {
  // let SQL = `SELECT * FROM locations  where search_query='${city}' `;
  let SQL = 'SELECT * FROM locations  where search_query=$1 ;';
  let values = [city];
  return client.query(SQL, values)
    .then(results => {
      if (results.rows.length) {
        return results.rows[0];
      } else {
        // (get data from API)
        return getlocation(city, key)
          .then(locationData => {
            return locationData;
          })
      }
    })
}

// add new city to the database
function addToDatabase(city, geoData) {
  let search_query = city;
  let formatted_query = geoData[0].display_name;
  let latitude = geoData[0].lat;
  let longitude = geoData[0].lon;
  let SQL = 'INSERT INTO locations (search_query,formatted_query,latitude,longitude)  VALUES ($1,$2,$3,$4)';
  let safeValues = [search_query, formatted_query, latitude, longitude];
  client.query(SQL, safeValues).then()
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
