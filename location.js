'use strict';

const express = require('express');

//CORS = Cross Origin Resource Sharing
const cors = require('cors');

// DOTENV (Read our Enviroment Variable)
require('dotenv').config();

const superagent = require('superagent');
const pg = require('pg');

// Application Setup
const server = express();
server.use(cors());
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
/**************************************************** Rout function ************************************************ */

// http://localhost:3000/location
function locationRout(req, res) {
  const city = req.query.city;
  const key = process.env.LOCATION_API_KEY;
  // check if the data in the database or not and return it as json
  checkLocation(city, key)
    .then((locationData) => {
      res.status(200).json(locationData);
    }
    )
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
  let SQL = `SELECT * FROM locations where search_query= $1; `;
  console.log(SQL);
  let val = [city];
  return client.query(SQL,val)
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

/***************************************************** Export module************************************************** */

module.exports = locationRout;
