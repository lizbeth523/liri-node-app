var fs = require("fs");
var command = process.argv[2];
// The output that will be written to log.txt
var output = "";

switch (command) {
	case "my-tweets":
		displayTweets();
		break;
	case "spotify-this-song":
		spotifyThisSong();
		break;
	case "movie-this":
		movieThis();
		break;
	case "do-what-it-says":
		break;
	default:
		output = command + " is not a recognized command.";
		console.log(output);
		updateLogs();
}


// Display last 20 tweets for the screen name given in params
function displayTweets() {
	var Twitter = require('twitter');
	var keys = require('./keys.js');
	var client = new Twitter(keys);
	var params = {screen_name: 'liri_g7'};
	var tweet;

	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		if (error) {
	    	return console.log(error);
	  	}
	  	// Display the time and text of each tweet
	  	for (var i in tweets) {
	  		tweet = tweets[i].created_at + " - " + tweets[i].text;
	  		console.log(tweet);
	  		output += (tweet + "\n");
	  	}
	  	updateLogs();
	});
}


// Display artist, song name, preview link, and album for the given song
function spotifyThisSong() {
	var Spotify = require('node-spotify-api');
 	var clientId = "c6679cbd80d44423852b7e393acd6af0";
 	var clientSecret = "8d322096cd644cc19b3bac10fc4453f5";
	var spotify = new Spotify({
  		id: clientId,
  		secret: clientSecret
	});
	// Index in the returned results of the song that we are searching for. 
	var index;
	// Default song to search for is "The Sign" by Ace of Base if no song is provided
	var song = "The Sign";
	// If a song is provided, then use that song
	if (process.argv[3]) {
		song = process.argv[3];
	}
 
	spotify.search({ type: 'track', query: song }, function(err, data) {
  		if (err) {
  			output = "No results found\n";
    		console.log("No results found");
  		}
  		// If the search returns results, then display info about the song
  		else {
			index = getSongIndex(data.tracks.items, song);
			console.log(getArtistInfo(data.tracks.items[index]));
			console.log(getSongTitle(data.tracks.items[index]));
			console.log(getPreviewUrl(data.tracks.items[index]));
			console.log(getAlbumName(data.tracks.items[index]));
		}
		updateLogs();
	});
}

// Find what index the desired song is at. 
function getSongIndex(tracks, song) {
	for (var i in tracks) {
		if (tracks[i].name === song) {
			return i;
		}
	}
	// If exact name is not found, then use the first result
	return 0;
}


function getArtistInfo(track) {
	var artists = "";

	// Append each artist name to the artists string
	for (var i = 0; i < track.artists.length; i++) {
		artists += track.artists[i].name;
		if (i < track.artists.length - 1) {
			artists += ",";
		}
	}
	// Display artists and add to data to be logged
	if (track.artists.length > 1) {
		output += ("Artists: " + artists + "\n");
		return "Artists: " + artists;
	}
	else {
		output += ("Artist: " + artists + "\n");
		return "Artist: " + artists;
	}
}


function getSongTitle(track) {
	output += ("Song Title: " + track.name + "\n");
	return "Song Title: " + track.name;
}

// Get preview url for song searched for with spotify-this-song command
function getPreviewUrl(track) {
	if (track.preview_url) {
		previewUrl = track.preview_url;
	}
	else {
		previewUrl = "Not Available";
	}
	output += ("Preview: " + previewUrl + "\n");
	return "Preview: " + previewUrl;
}


function getAlbumName(track) {
	output += "Album: " + track.album.name + "\n";
	return "Album: " + track.album.name;
}


function movieThis() {
	var request = require("request");
	// If a movie title is provided, then that movie will be searched for. Mr. Nobody is default movie if none is provided
	var movieTitle = process.argv[3] || "Mr. Nobody";
	var queryUrl = "http://www.omdbapi.com/?t=" + movieTitle + "&y=&plot=short&apikey=40e9cece";
	var movieInfo = {};
  /* Rotten Tomatoes Rating of the movie.
  * Country where the movie was produced.
  * Language of the movie.
  * Plot of the movie.
  * Actors in the movie*/
	request(queryUrl, function(error, response, body) {
	  	// If the request is successful (i.e. if the response status code is 200)
	  	if (!error && response.statusCode === 200) {
	  		movieInfo = populateMovieInfo(JSON.parse(body));
	  		// Display the info about the movie and add to data to be logged
	  		for (key in movieInfo) {
	  			console.log(key + ": " + movieInfo[key]);
	  			output += key + ": " + movieInfo[key] + "\n";
	  		}
	  		updateLogs();	
	  	}  	
	});
}


// Provide title, year, imdb and rotten tomatoes ratings, country, language, plot, and actors for the given movie
function populateMovieInfo(movie) {
	var movieInfo = {};

	// If the movie is found, then store info about the movie in movieInfo object
	if (movie.Response === 'True') {
		movieInfo.Title = movie.Title;
		movieInfo.Year = movie.Year;
		movieInfo['IMDB Rating'] = movie.imdbRating;
		movieInfo['Rotten Tomatoes Rating'] = movie.Ratings[1].Value;
		movieInfo.Country = movie.Country;
		movieInfo.Language = movie.Language;
		movieInfo.Plot = movie.Plot;
		movieInfo.Actors = movie.Actors;
	}
	else {
		movieInfo.Error = "Movie not found";
	}	
	return movieInfo;
}


// Log the command and output in the log.txt file
function updateLogs() {
	var newLog = "";
	for (var i = 2; i < process.argv.length; i++) {
		newLog += process.argv[i] + " ";
	}
	newLog += "\n" + output + "\n";

	fs.appendFile("log.txt", newLog, function(err) {
    	// If an error was experienced we say it.
  		if (err) {
    		console.log(err);
  		}
	});
}