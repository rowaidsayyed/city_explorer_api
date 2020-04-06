'use strict';

const express = require('express');

//CORS = Cross Origin Resource Sharing
const cors = require('cors');

// DOTENV (Read our Enviroment Variable)
require('dotenv').config();

const superagent = require('superagent');

const PORT = process.env.PORT || 3000;

const server = express();

server.use(cors());

server.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
})


server.get('/location',(req,res) =>{

  const city = req.query.city;
  const key = process.env.LOCATION_API;

  //  Lab 6 (get data from json file)
  // const geoData = require('./data/geo.json');
  //     const locationData = new Location(city,geoData.body);
  //     res.send(locationData);

  // Lab 7 (get data from API)
  // first method
  // let url = `https://eu1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;
  // superagent.get(url)
  //   .then(geoData =>{
  //     const locationData = new Location(city,geoData.body);
  //     res.send(locationData);
  //   });

  // Lab 7 (get data from API)
  // second method
  getlocation(city,key)
    .then(locationData => res.status(200).json(locationData))

});

// return location object for the city requested
function getlocation(city,key){
  let url = `https://eu1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;
  return superagent.get(url)
    .then(geoData =>{
      const locationData = new Location(city,geoData.body);
      return locationData;
    });
}



server.get('/weather',(req,res) =>{

  const city = req.query.city;
  const key = process.env.WEATHER_API;

  //  Lab 6 (get data from json file)
  // const weatherData = require('./data/weather.json');
  // let allWeather=[];
  // for(let i = 0 ; i<weatherData.data.length;i++){
  //   const locationweatherData = new Weatherlab6(city,weatherData,i);
  //   allWeather.push(locationweatherData);
  // }
  // res.send(allWeather);

  // Lab 7 (get data from API)
  // first Method
  // let url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${key}`;
  // superagent.get(url)
  //   .then(weatherData =>{
  //     let allWeather=[];
  //     console.log('hhhhhhhhhhhhhh',weatherData.body.data);
  //     for(let i = 0 ; i<weatherData.body.data.length;i++){
  //       const locationweatherData = new Weatherlab6(city,weatherData.body,i);
  //       allWeather.push(locationweatherData);
  //     }
  //     res.send(allWeather);
  //   });

  // Lab 7 (get data from API)
  // second Method
  getWeather(key,city)
    .then(allWeatherArr => res.status(200).json(allWeatherArr));

});

function getWeather(key,city){
  let url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${key}`;
  return superagent.get(url)
    .then(weatherData =>{
      // for(let i = 0 ; i<weatherData.body.data.length;i++){
      //   const locationweatherData = new Weatherlab6(city,weatherData.body,i);
      //   allWeather.push(locationweatherData);
      // }
      let allWeather = weatherData.body.data.map(element => {
        return new Weather(city,element);
      })
      return allWeather;
    });
}


function Location(city,geoData) {
  this.search_query = city;
  this.formatted_query = geoData[0].display_name;
  this.latitude = geoData[0].lat;
  this.longitude = geoData[0].lng;
}

// function Weatherlab6(city,weatherData,idx) {
//   this.search_query = city;
//   this.description = weatherData.data[idx].weather.description;
//   this.time = weatherData.data[idx].valid_date;
// }

function Weather(city,weatherData) {
  this.search_query = city;
  this.description = weatherData.weather.description;
  this.time = weatherData.valid_date;
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
