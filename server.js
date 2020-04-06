'use strict';

const express = require('express');

//CORS = Cross Origin Resource Sharing
const cors = require('cors');

// DOTENV (Read our Enviroment Variable)
require('dotenv').config();

const superagent = require('superagent');

// Application Setup
const PORT = process.env.PORT || 3000;
const server = express();
server.use(cors());

server.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
})

/************************************************* Rout Definitions ************************************************* */
server.get('/location',(req,res) =>{

  const city = req.query.city;
  const key = process.env.LOCATION_API_KEY;

  // (get data from API)
  getlocation(city,key)
    .then(locationData => res.status(200).json(locationData))

});

server.get('/weather',(req,res) =>{

  const city = req.query.search_query;
  const key = process.env.WEATHER_API_KEY;

  // (get data from API)
  getWeather(key,city)
    .then(allWeatherArr => res.status(200).json(allWeatherArr));

});


server.get('/trails',(req,res) =>{
  const lat = req.query.latitude;
  const lon = req.query.longitude;
  const key = process.env.TRAIL_API_KEY;

  getTrails(key,lat,lon)
    .then(allTrails => res.status(200).json(allTrails));
});

/***********************************************get Routs functions**************************************************** */

// return location object for the city requested
function getlocation(city,key){
  let url = `https://eu1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;
  return superagent.get(url)
    .then(geoData =>{
      const locationData = new Location(city,geoData.body);
      return locationData;
    });
}


// return array of weather objects for the city requested
function getWeather(key,city){
  let url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${key}`;
  return superagent.get(url)
    .then(weatherData =>{
      let allWeather = weatherData.body.data.map(element => {
        return new Weather(city,element);
      })
      return allWeather;
    });
}

// return array of trails objects for the city requested
function getTrails(key,lat,lon){
  let url = `https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${lon}&maxDistance=100&sort=Distance&key=${key}`;
  return superagent.get(url)
    .then(trailData => {
      let allTrails = trailData.body.trails.map(element => {
        return new Trails(element);
      })
      return allTrails;
    });
}

/**********************************************Constructor functions*********************************************** */
function Trails(trailData) {
  this.name = trailData.name;
  this.location = trailData.location;
  this.length = trailData.length;
  this.stars = trailData.stars;
  this.summary= trailData.summary;
  this.trail_url= trailData.url;
  this.conditions= trailData.conditionDetails;
  this.condition_date= trailData.conditionDate.slice(0,10);
  this.condition_time=trailData.conditionDate.slice(12,19);
}

function Location(city,geoData) {
  this.search_query = city;
  this.formatted_query = geoData[0].display_name;
  this.latitude = geoData[0].lat;
  this.longitude = geoData[0].lon;
}

function Weather(city,weatherData) {
  this.forecast = weatherData.weather.description;
  this.time = weatherData.valid_date;
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
  res.status(500).send({'Status': 500,responseText:'sorry something went wrong'});
});
