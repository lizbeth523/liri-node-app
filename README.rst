Liri Node App
#############

:Author: Elizabeth Tom
:Date: October 8, 2017

LIRI is like iPhone's SIRI. However, while SIRI is a Speech Interpretation and Recognition Interface, LIRI is a Language Interpretation and Recognition Interface. LIRI is a command line node app that takes in parameters and gives you back data.

Available Commands
******************

* my-tweets
* spotify-this-song
* movie-this
* do-what-it-says

Usage
******

Before using, you must run "npm install" to install the following required packages:

* twitter
* node-spotify-api
* request
* date-and-time

my-tweets
=========

| Returns the last 20 tweets for the username specified in the program.
| To use, enter "node liri.js my-tweets" on the command line.

spotify-this-song
=================

| Searches for and displays information on a song.
| To use, enter "node liri.js spotify-this song <song title>" on the command line. The song title is optional. If no song is provided by the user, then the program will search for "The Sign" by Ace of Base.

movie-this
==========

| Searches for and displays information on a movie.
| To use, enter "node liri.js movie this <movie title>" on the command line. The movie title is optional. If no movie is provided by the user, then the program will search for the movie "Mr. Nobody."

do-what-it-says
===============

Reads a command and argument from the file random.txt and does what it says. The command is required, but the argument is optional. The command and argument must be separated by a comma.

Examples of acceptable input:

* spotify-this-song,"I Want it That Way"
* movie-this
* movie-this, The Conjuring
* my-tweets

If random.txt says "do-what-it-says," then this command will not be carried out.
