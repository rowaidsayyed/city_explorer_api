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

/************************************************ Rout function ************************************************** */

// http://localhost:3000/trails
function trailsRout(req, res) {
  const lat = req.query.latitude;
  const lon = req.query.longitude;
  const key = process.env.TRAIL_API_KEY;

  getTrails(key, lat, lon)
    .then(allTrails => res.status(200).json(allTrails));
}

/***********************************************get Routs functions**************************************************** */

// return array of trails objects for the city requested
function getTrails(key, lat, lon) {
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
  this.summary = trailData.summary;
  this.trail_url = trailData.url;
  this.conditions = trailData.conditionDetails;
  this.condition_date = trailData.conditionDate.slice(0, 10);
  this.condition_time = trailData.conditionDate.slice(12, 19);
}

/***************************************************** Export module************************************************** */

module.exports = trailsRout;
