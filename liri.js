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
// Displays info for "The Sign" by Ace of Bass if no song is provided
function spotifyThisSong() {
	var Spotify = require('node-spotify-api');
 	var clientId = "c6679cbd80d44423852b7e393acd6af0";
 	var clientSecret = "8d322096cd644cc19b3bac10fc4453f5";
	var spotify = new Spotify({
  		id: clientId,
  		secret: clientSecret
	});
	var song = "The Sign";
	if (process.argv[3]) {
		song = process.argv[3];
	}
 
	spotify.search({ type: 'track', query: song }, function(err, data) {
  		if (err) {
    		return console.log('Error occurred: ' + err);
  		}
 
		console.log(data); 
		output = data;
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