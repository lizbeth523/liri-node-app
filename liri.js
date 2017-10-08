var fs = require("fs");

// Handle the command given on the command line
commandHandler(process.argv[2], getArgument(process.argv, 3));


// Send the command and argument to the appropriate function
function commandHandler(command, arg) {
	switch (command) {
		case "my-tweets":
			displayTweets();
			break;
		case "spotify-this-song":
			spotifyThisSong(arg);
			break;
		case "movie-this":
			movieThis(arg);
			break;
		case "do-what-it-says":
			doWhatItSays();
			break;
		default:
			var output = command + " is not a recognized command.\n";
			console.log(output);
			updateLogs(output);
	}
}


// Return argument from an array in string format beginning at startIndex
function getArgument(array, startIndex) {
	var argArray = array.slice(startIndex);
	var str = argArray.join(' ');
	return str;
}


// Display last 20 tweets for the screen name given in params
function displayTweets() {
	var Twitter = require('twitter');
	var keys = require('./keys.js');
	var client = new Twitter(keys);
	var params = {screen_name: 'liri_g7'};
	var output = "";

	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		if (error) {
	    	output = error;
	  	}
	  	// Display the date, time, and text of each tweet
	  	else {
	  		for (var i in tweets) {
	  			output += tweets[i].created_at + " - " + tweets[i].text + "\n";
	  		}
	  	}
	  	console.log(output);
	  	updateLogs(output);
	});
}


// Display artist, song name, preview link, and album for the given song
function spotifyThisSong(songName) {
	var Spotify = require('node-spotify-api');
 	var clientId = "c6679cbd80d44423852b7e393acd6af0";
 	var clientSecret = "8d322096cd644cc19b3bac10fc4453f5";
	var spotify = new Spotify({
  		id: clientId,
  		secret: clientSecret
	});
	// Index in the returned results of the song that we are searching for. 
	var index;
	// Search for song provided, if any, otherwise search for "The Sign" by Ace of Base
	var song = songName || "The Sign";
	var output = "";
 
	spotify.search({ type: 'track', query: song }, function(err, data) {
  		if (err) {
  			output = "Error: Song not found\n";
  		}
  		// If the search returns results, then display info about the song
  		else {
			index = getSongIndex(data.tracks.items, song);
			output += getArtistInfo(data.tracks.items[index]) + "\n";
			output += "Song Title: " + data.tracks.items[index].name + "\n";
			output += getPreviewUrl(data.tracks.items[index]) + "\n";
			output += "Album: " + data.tracks.items[index].album.name + "\n";
		}
		console.log(output);
		updateLogs(output);
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
	// Return artist info
	if (track.artists.length > 1) {
		return "Artists: " + artists;
	}
	else {
		return "Artist: " + artists;
	}
}


// Get preview url for song
function getPreviewUrl(track) {
	var previewUrl;

	if (track.preview_url) {
		previewUrl = track.preview_url;
	}
	else {
		previewUrl = "Not Available";
	}
	return "Preview: " + previewUrl;
}


function movieThis(movie) {
	var request = require("request");
	// If a movie title is provided, then that movie will be searched for. Mr. Nobody is default movie if none is provided
	var movieTitle = movie || "Mr. Nobody";
	var queryUrl = "http://www.omdbapi.com/?t=" + movieTitle + "&y=&plot=short&apikey=40e9cece";
	var movieInfo = {};
	var output = "";
  
	request(queryUrl, function(error, response, body) {
	  	// If the request is successful (i.e. if the response status code is 200)
	  	if (!error && response.statusCode === 200) {
	  		movieInfo = getMovieInfo(JSON.parse(body));
	  		// Display the info about the movie and add to data to be logged
	  		for (key in movieInfo) {
	  			output += key + ": " + movieInfo[key] + "\n";
	  		}
	  		console.log(output);
	  		updateLogs(output);	
	  	}  	
	});
}


// Provide title, year, imdb and rotten tomatoes ratings, country, language, plot, and actors for the given movie
function getMovieInfo(movie) {
	var movieInfo = {};

	// If the movie is found, then store info about the movie in movieInfo object
	if (movie.Response === 'True') {
		movieInfo.Title = movie.Title;
		movieInfo.Year = movie.Year;
		movieInfo['IMDB Rating'] = movie.imdbRating;
		movieInfo['Rotten Tomatoes Rating'] = getRottenTomatoesRating(movie.Ratings);
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


// Returns the Rotten Tomatoes rating of a movie, or "N/A" if none
function getRottenTomatoesRating(ratings) {
	for (i in ratings) {
		if (ratings[i].Source === "Rotten Tomatoes") {
			return ratings[i].Value;
		}
	}
	return "N/A";
}


// Does what random.txt says by reading in  command and argument from file
// then passes to command handler function
function doWhatItSays() {
	fs.readFile("random.txt", "utf8", function(error, data) {
		if (error) {
			console.log(error);
			updateLogs(error);
		}
		else {
			var argument = "";
			var command = "";
			var output;

			if (data.includes(",")) {
				command = data.substring(0, data.indexOf(","));
 				argument = data.substring(data.indexOf(",") + 1, data.length);
			}
 			else {
 				command = data;
 			}
 			output = command + " " + argument;
 			console.log(output);
 			updateLogs(output);
 			// Prevent infinite loop
 			if (command !== "do-what-it-says") {
 				commandHandler(command, argument)
 			}
		}
	});
}


// Log the command and output data in the log.txt file
function updateLogs(logData) {
	var newLog = "";
	for (var i = 2; i < process.argv.length; i++) {
		newLog += process.argv[i] + " ";
	}
	newLog += "\n" + logData + "\n";

	fs.appendFile("log.txt", newLog, function(err) {
    	// If an error was experienced we say it.
  		if (err) {
    		console.log(err);
  		}
	});
}