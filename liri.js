var fs = require("fs");
var command = process.argv[2];
var output = "";

switch (command) {
	case "my-tweets":
		displayTweets();
		break;
	case "spotify-this-song":
		spotifyThisSong();
		break;
	case "movie-this":
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
	  	// Display the text of each tweet
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
	var index = 0;
	// Artist(s) of the song
	var artists = "";
	// Default song to search for is "The Sign" by Ace of Base if no song is provided
	var song = "The Sign";
	// If a song is provided, then use that song
	if (process.argv[3]) {
		song = process.argv[3];
	}
	// URL for a preview of the song
	var previewUrl;
 
	spotify.search({ type: 'track', query: song }, function(err, data) {
  		if (err) {
  			output = "No results found";
    		console.log(output);
  		}
  		// If the search returns results, then display info about the song
  		else {
	  		// Find what index the desired song is at. If exact name is not found, then use the first result
	 		for (var i in data.tracks.items) {
				if (data.tracks.items[i].name === song) {
					index = i;
					break;
				}
			}
			// Append each artist name to the artists string
			for (var i = 0; i < data.tracks.items[index].artists.length; i++) {
				artists += data.tracks.items[index].artists[i].name;
				if (i < data.tracks.items[index].artists.length - 1) {
					artists += ",";
				}
			}
			// Display artists and add to data to be logged
			if (data.tracks.items[index].artists.length > 1) {
				console.log("Artists: " + artists);
				output += "Artists: ";
			}
			else {
				console.log("Artist: " + artists);
				output += "Artist: ";
			}
			output += (artists + "\n");
			// Display song title and add to data to be logged
			console.log("Song Title: " + data.tracks.items[index].name);
			output += ("Song Title: " + data.tracks.items[index].name + "\n");
			// Display preview url if one is available and add to data to be logged
			if (data.tracks.items[index].preview_url) {
				previewUrl = data.tracks.items[index].preview_url;
			}
			else {
				previewUrl = "Not Available";
			}
			console.log("Preview URL: " + previewUrl);
			output += ("Preview URL: " + previewUrl + "\n");
		}
		
		updateLogs();
	});
}


// Log the command and output in the log.txt file
function updateLogs() {
	var newLog = command + "\n" + output + "\n";

	fs.appendFile("log.txt", newLog, function(err) {
    	// If an error was experienced we say it.
  		if (err) {
    		console.log(err);
  		}
	});
}