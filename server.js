var mongojs = require("mongojs");
var cheerio = require("cheerio");
var axios = require("axios");
var express = require("express");
var expresshandlebars = require('express-handlebars');

var app = express();
var PORT = process.env.PORT || 8000
app.use(express.static("public"));

app.engine("handlebars", expresshandlebars({defaultLayout: "main"}));
app.set("view engine", "handlebars");

var collection = ["scrapedData"];

var db = mongojs(process.env.MONGODB_URI || 'scraper', collection);
db.on("error", function (error) {
  console.log("Database Error:", error);
});

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

app.get("/", function(req, res) {
  res.render("index");
})

app.get("/scrape", function (req, res) {
  db.scrapedData.drop()

  axios
    .get("https://www.nytimes.com/section/world")
    .then(function (response) {
      var $ = cheerio.load(response.data);
      var results = [];

      $("div.story-body").each(function(i, element) {
			var link = $(element).find("a").attr("href");
			var title = $(element).find("h2.headline").text().trim();
			var summary = $(element).find("p.summary").text().trim();
			var image = $(element).parent().find("figure.media").find("img").attr("src");
			results.link = link;
			results.title = title;

       if (title && link && image && summary) {
        db.scrapedData.insert({
          link: link,
          title: title,
          image: image,
          summary: summary
        }, 
        function(err, inserted) {
          if (err) {
            console.log(err);
          }
          else {
            console.log("scrapedData")
            console.log(inserted);
          }
        });
      }
      });
      console.log(results);
    })
});

app.get("/all", function (req, res) {
  db.scrapedData.find({}, function (err, found) {
    if (err) {
      console.log(err)
    } else {
      res.json(found)
    }
  });
});
 
app.get("/title", function(req, res) {
 
  db.scrapedData.find().sort({ title: 1 }, function(error, found) {
    if (error) {
      console.log(error);
    }
    else {
      res.send(found);
    }
  });
});

app.listen(PORT, function () {
  console.log("APP RUNNING ON PORT 8000.");
});