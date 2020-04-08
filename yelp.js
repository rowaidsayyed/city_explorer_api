'use strict';

const express = require('express');

//CORS = Cross Origin Resource Sharing
const cors = require('cors');

// DOTENV (Read our Enviroment Variable)
require('dotenv').config();

const yelp = require('yelp-fusion');

// Application Setup
const server = express();
server.use(cors());

/**************************************************** Rout function ************************************************ */

// http://localhost:3000/yelp
function yelpRout(req, res) {
  const city = req.query.search_query;
  const key = process.env.YELP_API_KEY;
  const searchRequest = { location: city, };

  // (get data from API)
  getYelp(key, searchRequest)
    .then(allYelp => res.status(200).json(allYelp));
}

/***********************************************get Routs functions**************************************************** */

// return array of yelp objects for the city requested
function getYelp(key, searchRequest) {
  const yclient = yelp.client(key);
  return yclient.search(searchRequest)
    .then(yelpData => {
      let allYelps = yelpData.jsonBody.businesses.map(element => {
        return new Yelps(element);
      })
      return allYelps;
    });
}

/**********************************************Constructor functions*********************************************** */

function Yelps(yelpData) {
  this.title = yelpData.name;
  this.image_url = yelpData.image_url;
  this.price = yelpData.price;
  this.rating = yelpData.rating;
  this.url = yelpData.url;
}

/***************************************************** Export module************************************************** */

module.exports = yelpRout;
