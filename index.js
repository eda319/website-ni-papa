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
  const { name, email } = req.body;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,

      subject: "New Website Contact Form",

      text: `
New visitor submission

Name: ${name}
Email: ${email}
      `,
    });

    req.flash("success", "Message sent successfully!");

    res.redirect("/#contact");
  } catch (error) {
    console.error(error);

    req.flash("error", "Failed to send message.");

    res.redirect("/#contact");
  }
});

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
