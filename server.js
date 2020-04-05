'use strict';

const express = require('express');

//CORS = Cross Origin Resource Sharing
const cors = require('cors');

// DOTENV (Read our Enviroment Variable)
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const server = express();

server.use(cors());

server.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
})


server.get('/location',(req,res) =>{
  // res.send('hiiii');
  const geoData = require('./data/geo.json');
  const city = req.query.city;
  const locationData = new Location(city,geoData);
  res.send(locationData);
});


server.get('/weather',(req,res) =>{
  const weatherData = require('./data/weather.json');
  const city = req.query.city;
  let allWeather=[];
  for(let i = 0 ; i<weatherData.data.length;i++){
    const locationweatherData = new Weather(city,weatherData);
    allWeather.push(locationweatherData);
  }
  res.send(allWeather);
});



function Location(city,geoData) {
  this.search_query = city;
  this.formatted_query = geoData[0].display_name;
  this.latitude = geoData[0].lat;
  this.longitude = geoData[0].lng;
}

function Weather(city,weatherData) {
  this.search_query = city;
  this.description = weatherData.data[0].weather.description;
  this.time = weatherData.data[0].valid_date;
}

// localhost:3000/
server.get('/', (request, response) => {
  response.status(200).send('Welcome 301d4,it works');
});


// localhost:3000/anything
server.use('*', (req, res) => {
  res.status(404).send('NOT FOUND');
});

server.use((error, req, res) => {
  res.status(500).send({'Status': 500,'responseText' : 'sorry something went wrong'});
})
