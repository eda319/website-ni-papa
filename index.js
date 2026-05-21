"use strict";

require("dotenv").config();
const express = require("express");
const layouts = require("express-ejs-layouts");
const connectFlash = require("connect-flash");
const session = require("express-session");
const nodemailer = require("nodemailer");
const app = express();
const port = process.env.PORT || 3000;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

app.set("view engine", "ejs");
app.use(layouts);
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
  }),
);
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

app.post("/contact", async (req, res) => {
  console.log(req.body);

  const { name, email } = req.body;

  try {
    console.log("Before sendMail");

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "New Website Contact Form",
      text: `Name: ${name}\nEmail: ${email}`,
    });

    console.log("Email sent");

    req.flash("success", "Message sent successfully!");
    return res.redirect("/#contact");
  } catch (error) {
    console.error("EMAIL ERROR:", error);

    req.flash("error", "Failed to send message.");
    return res.redirect("/#contact");
  }
});

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
