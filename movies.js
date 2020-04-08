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

// http://localhost:3000/movies
function moviesRout(req, res) {
  const city = req.query.search_query;
  const key = process.env.MOVIES_API_KEY;
  // res.status(200).send('hiiiiis');
  // (get data from API)
  getMovies(key, city)
    .then(allMovies => res.status(200).json(allMovies));
}

/***********************************************get Routs functions**************************************************** */

// return array of movies objects for the city requested
function getMovies(key, city) {
  let url = `https://api.themoviedb.org/3/discover/movie?api_key=${key}&region=JO&sort_by=vote_average`;
  // let url = `https://api.themoviedb.org/3/search/company?api_key=${key}&query=amman`;
  return superagent.get(url)
    .then(moviesData => {
      // console.log(moviesData.body.results);
      let allMovies = moviesData.body.results.map(element => {
        return new Movie(element);
      })
      return allMovies;
    });
}

/**********************************************Constructor functions*********************************************** */

function Movie(moviesData) {
  this.title = moviesData.title;
  this.overview = moviesData.overview;
  this.averge_votes = moviesData.vote_average;
  this.total_votes = moviesData.vote_count;
  this.image_url = `https://image.tmdb.org/t/p/w500${moviesData.poster_path}`;
  this.popularity = moviesData.popularity;
  this.released_date = moviesData.release_date;
}

/***************************************************** Export module************************************************** */

module.exports = moviesRout;
