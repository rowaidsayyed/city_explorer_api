'use strict';

const express = require('express');

//CORS = Cross Origin Resource Sharing
const cors = require('cors');

// DOTENV (Read our Enviroment Variable)
require('dotenv').config();

const superagent = require('superagent');

// Application Setup
const server = express();
server.use(cors());

/**************************************************** Rout function ************************************************ */

// http://localhost:3000/weather
function weatherRout(req, res) {
  const city = req.query.search_query;
  const key = process.env.WEATHER_API_KEY;

  // (get data from API)
  getWeather(key, city)
    .then(allWeatherArr => res.status(200).json(allWeatherArr));
}

/***********************************************get Routs functions**************************************************** */

// return array of weather objects for the city requested
function getWeather(key, city) {
  let url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${key}`;
  return superagent.get(url)
    .then(weatherData => {
      let allWeather = weatherData.body.data.map(element => {
        return new Weather(city, element);
      })
      return allWeather;
    });
}

/**********************************************Constructor functions*********************************************** */

function Weather(city, weatherData) {
  this.forecast = weatherData.weather.description;
  this.time = weatherData.valid_date;
}

/***************************************************** Export module************************************************** */

module.exports = weatherRout;

