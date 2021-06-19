const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const Blog = require("./models/blog");

// express app
const app = express();

// connect to mongodb
const dbURI =
  "mongodb+srv://maxtasy:test12345@cluster0.j1g6a.mongodb.net/nodejs-crash-course?retryWrites=true&w=majority";
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    // console.log("connected to database");

    // listen for requests
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });

// set public directory from which we are serving the static files
app.use(express.static(__dirname + "/public"));

// register view engine
app.set("view engine", "ejs");

// package to log requests
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.redirect("/blogs");
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

// blog routes
app.get("/blogs", (req, res) => {
  Blog.find()
    .sort({ createdAt: -1 })
    .then((result) => {
      res.render("index", { title: "All Blogs", blogs: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/blogs/create", (req, res) => {
  res.render("create", { title: "Create New Blog" });
});

app.use((req, res) => {
  res.status(404).render("404", { title: "404" });
});
