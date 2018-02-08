// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

// Initialize Express
var db = require("./models");
var port = process.env.PORT || 3000;
var app = express();

//Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Serve the public folder as a static directory
app.use(express.static("public"));

//Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/MongoScraper";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
    useMongoClient: true
});

//ROUTES

// A GET route for scraping the echojs website
app.get("/scrape", function (req, res) {
    // First, we grab the body of the html with request
    axios.get("http://www.echojs.com/").then(function (response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);

        // Now, we grab every h2 within an article tag, and do the following:
        $("article h2").each(function (i, element) {
            // Save an empty result object
            var result = {};

            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(this)
                .children("a")
                .text();
            result.link = $(this)
                .children("a")
                .attr("href");

            // Search DB for scraped article title
            db.Article.findOne({ title: result.title }).then(function (found) {
                // If the title exists in the DB...
                if (found) {
                    // Log message and do not add to DB.
                    console.log("Dropping dublicate");
                } else {
                    // Otherwise we create a new Article
                    console.log("New article");
                    db.Article
                        .create(result)
                        .then(function (dbArticle) {
                            console.log("Article Added");
                        })
                        .catch(function (err) {
                            // If an error occurred, send it to the client
                            return res.json(err);
                        });
                }
            });
        });
        // If we were able to successfully scrape and save an Article, reload root route.
        res.redirect("/");
    });
});

// A Route for getting all Articles from the DB
app.get("/articles", function (req, res) {
    db.Article.find({}).then(function (dbArticles) {
        res.json(dbArticles);
    })
        .catch(function (err) {
            res.json(err);
        });
});

// Route for grabbing a specific Article by id & to populate it with all notes
app.get("/articles/:id", function (req, res) {
    db.Article.findOne({ _id: req.params.id }).populate("note").then(function (dbArticle) {
        res.json(dbArticle);
    }).catch(function (err) {
        res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function (req, res) {
    db.Note.create(req.body).then(function (dbNote) {
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { note: dbNote._id } }, { new: true });
    }).then(function (dbArticle) {
        res.json(dbArticle);
    }).catch(function (err) {
        res.json(err);
    });
});

// Start the server
app.listen(port, function () {
    console.log("App running on port " + port + "!");
});