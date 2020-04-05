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

// server.use('/',(req,res) =>{
//   res.send('Welcome 301d4');
// });

server.get('/location',(req,res) =>{
  // res.send('hiiii');
  const geoData = require('./data/geo.json');
  const city = req.query.city;
  console.log(city);
  const locationData = new Location(city,geoData);
  res.send(locationData);
});

function Location(city,geoData) {
  this.search_query = city;
  this.formatted_query = geoData[0].display_name;
  this.latitude = geoData[0].lat;
  this.longitude = geoData[0].lng;
}
