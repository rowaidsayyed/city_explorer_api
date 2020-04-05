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
  // console.log(weatherData.data.length);
  for(let i = 0 ; i<weatherData.data.length;i++){
    const locationweatherData = new Weather(city,weatherData,i);
    allWeather.push(locationweatherData);
  }
  res.send(allWeather);
});



function Location(city,geoData,idx) {
  this.search_query = city;
  this.formatted_query = geoData[idx].display_name;
  this.latitude = geoData[idx].lat;
  this.longitude = geoData[idx].lng;
}

function Weather(city,weatherData,idx) {
  this.search_query = city;
  this.description = weatherData.data[idx].weather.description;
  this.time = weatherData.data[idx].valid_date;
}

// localhost:3000/
server.get('/', (request, response) => {
  response.status(200).send('Welcome 301d4,it works');
});

// server.use('/',(req,res) =>{
//   res.send('Welcome 301d4');
// });

// localhost:3000/anything
server.use('*', (req, res) => {
  res.status(404).send('NOT FOUND');
});

server.use((error, req, res) => {
  res.status(500).send({'Status': 500,responseText:'sorry something went wrong'});
});
