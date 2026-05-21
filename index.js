"use strict";

const express = require("express");
const layouts = require("express-ejs-layouts");
const connectFlash = require("connect-flash");
const session = require("express-session");
const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(layouts);
app.use(session({
  secret: "your-secret-key",
  resave: false,
  saveUninitialized: false
}));
app.use(connectFlash());

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.locals.successMessage = req.flash("success");
  res.locals.errorMessage = req.flash("error");
  next();
});

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/contact", (req, res) => {
  const { name, email } = req.body;

  console.log("New contact form submission:");
  console.log("Name:", name);
  console.log("Email:", email);

  req.flash("success", "Message sent successfully!");

  res.redirect("/#contact");
});

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
