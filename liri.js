// Read .env for hidden variables.
require('dotenv').config();

// Assign variables to arguments passed into application.
var type = process.argv[2];
var info = process.argv[3];
var fs = require('fs');


// Default function for no results returned.
function noResults() {
  console.log("\nNo results found! Make sure your spelling is correct or try another search.\n");
  return;
};

// Spotify
if (type === "spotify-this-song" && info) {

  let Spotify = require('node-spotify-api')
  let keys = require('./keys.js');
  let spotify = new Spotify(keys.spotify);

  spotify.search({ type: 'track', query: info }, function (err, data) {

    if (err) {
     console.log('Things went very wrong: ' + err);
    };

    if (JSON.stringify(data.tracks.total) === "0") {
      noResults();
    } else {


      console.log("\n* Spotify API *\n");

      for (var i = 0; i < 5; i++) {

        console.log("-----------------------------------------------------------------");
        console.log("Artist/Band: " + JSON.stringify(data.tracks.items[i].artists[0].name));
        console.log("Title: " + JSON.stringify(data.tracks.items[i].name));
        console.log("Preview: " + JSON.stringify(data.tracks.items[i].preview_url));
        console.log("Album: " + JSON.stringify(data.tracks.items[i].album.name));
        console.log("-----------------------------------------------------------------\n");
      };
    };
  });

  // OMDb
} else if (type === "movie-this" && info) {

  let request = require('request');
  let apiKey = process.env.OMDB_API;
  let omdbURL = "http://www.omdbapi.com/?apikey=" + apiKey + "&t=" + info;

  request.get(omdbURL, {
    json: true
  }, function (err, res, body) {

    if (err) {
     console.log('Things went very wrong:' + err);
    };

    if (JSON.stringify(body.Response) === "\"False\"") {
      noResults();
    } else {
      // OMDb lolcat.
      console.log("\n* OMDb API *");
      // Title of the movie.
      console.log("\nTitle: " + body.Title);
      // Year movie was released.
      console.log("\nYear: " + body.Year);
      // IMDB movie rating.
      console.log("\nIMDB Rating: " + body.imdbRating);
      // Rotten Tomatoes movie rating. Doesn't always have one.
      if (body.Ratings[1]) {
        console.log("\nRotten Tomatoes: " + body.Ratings[1].Value);
      } else {
        console.log("\nRotten Tomatoes: No info provided.");
      };
      // Country where the movie was produced.
      console.log("\nCountry: " + body.Country);
      // Language of the movie.
      console.log("\nLanguage: " + body.Language);
      // Plot of the movie.
      console.log("\nPlot: " + body.Plot);
      // Actors in the movie.
      console.log("\nActors: " + body.Actors + "\n");
    };
  });

  // Bandsintown
} else if (type === "concert-this" && info) {

  var moment = require('moment');

  let request = require('request');
  let apiKey = process.env.BANDSINTOWN_API;
  let bandsInTownURL = "https://rest.bandsintown.com/artists/" + info + "/events?app_id=" + apiKey + "&date=upcoming"

  request.get(bandsInTownURL, {
    json: true
  }, function (err, res, body) {

    if (err) {
    console.log('Things went very wrong: ' + err);
    };

    if (body[0]) {

      var forDate = moment(body[0].datetime).format('MM-DD-YYYY');

      console.log("\n* Bandsintown API *");
      console.log("\n" + "Venue: " + body[0].venue.name + "\n");
      console.log("Lineup: " + body[0].lineup + "\n");
      console.log("Location: " + body[0].venue.city + ", " + body[0].venue.country + "\n");
      console.log("Date: " + forDate + "\n");
    } else {
      noResults();
    };
  });

} else if (type === "do-what-it-says") {
    fs.readFile("random.txt", 'utf8' ,function(error, data) {
        if (error) throw error;
        // a = data.split(',');
        loggedTxt = data.split(',');
        console.log(loggedTxt);

        var command;
        var parameter;

        command = loggedTxt[0];
        parameter = loggedTxt[1];

        parameter = parameter.replace('"', '');
        parameter = parameter.replace('"', '');

    });


};