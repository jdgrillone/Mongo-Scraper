// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

// Initialize Express
var db = require("./models");
var PORT = 3000;
var app = express();

//Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Serve the public folder as a static directory
app.use(express.static("public"));

//Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/MongoScraper", {
    useMongoClient: true
});

//ROUTES

// A GET route to scrape the website

// A Route for getting all Articles from the DB

// Route for grabbing a specific Article by id & to populate it with all notes

// Route for saving/updating an Article's associated Note

// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});