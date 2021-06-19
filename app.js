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

// needed so the form data gets send as an object with the post request
app.use(express.urlencoded({ extended: true }));

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

app.post("/blogs", (req, res) => {
  const { title, snippet, body } = req.body;

  const blog = new Blog({
    title,
    snippet,
    body,
  });

  // Or shorter
  // const blog = new Blog({ req.body });

  blog
    .save()
    .then((result) => {
      res.redirect("/blogs");
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/blogs/:id", (req, res) => {
  const id = req.params.id;

  Blog.findById(id)
    .then((result) => {
      res.render("details", { title: "Blog Details", blog: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.delete("/blogs/:id", (req, res) => {
  const id = req.params.id;

  Blog.findByIdAndDelete(id)
    .then((result) => {
      res.json({ redirect: "/blogs" });
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
