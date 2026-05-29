"use strict";

require("dotenv").config();
const fs = require("fs");
const path = require("path");
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
  const metadata = JSON.parse(
    fs.readFileSync("./public/captions.json", "utf8"),
  );

  const projectsRoot = path.join(__dirname, "public/images/projects");

  const categories = {};

  fs.readdirSync(projectsRoot).forEach((category) => {
    categories[category] = fs
      .readdirSync(path.join(projectsRoot, category))
      .map((projectFolder) => {
        const projectData = metadata?.[category]?.[projectFolder] || {};

        const imageFiles = fs.readdirSync(
          path.join(projectsRoot, category, projectFolder),
        );

        return {
          name: projectData.title || projectFolder,

          location: projectData.location || "",

          client: projectData.client || "",

          description: projectData.description || "",

          images: imageFiles.map((file) => ({
            src: `/images/projects/${category}/${projectFolder}/${file}`,
            caption: projectData.captions?.[file] || "",
          })),
        };
      });
  });

  res.render("index", { categories });
});

app.post("/contact", async (req, res) => {
  console.log(req.body);

  const { name, email, message } = req.body;

  try {
    console.log("Before sendMail");

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "New Website Contact Form",
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
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
