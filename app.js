const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const playstore = require('./playstore.js');

const app = express();

app.use(morgan('dev'));
app.use(cors());

app.get('/apps', (req, res) => {
  const {sort, genres = ''} = req.query;
 
  if(sort){
    if(!['rating', 'app'].includes(sort)) {
      return res
        .status(400)
        .send('Sort must be by rating, or by app name.');
    }
  }

  if(genres){
    if(!['action', 'puzzle', 'strategy', 'casual', 'arcade', 'card'].includes(genres)){
      return res
        .status(400)
        .send('Genre must be one of the following: Action, Puzzle, Strategy, Casual, Arcade, or Card.');
    }
  }

  let results = playstore
    .filter(singleApp => 
      singleApp
        .Genres
        .toLowerCase()
        .includes(genres.toLowerCase())
    );
  
  if(sort === 'app'){
    results
      .sort((a,b) => {
        return a.App > b.App ? 1 : a.App < b.App ? -1 : 0;
      });
  }

  if(sort === 'rating'){
    results
      .sort((a,b) => {
        return a.Rating > b.Rating ? -1 : a.Rating < b.Rating ? 1 : 0;
      });
  }

  res.
    json(results);
});

module.exports = app;