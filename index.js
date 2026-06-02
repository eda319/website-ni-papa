"use strict";

require("dotenv").config();

const fs = require("fs");
const path = require("path");
const express = require("express");
const layouts = require("express-ejs-layouts");
const connectFlash = require("connect-flash");
const session = require("express-session");

const app = express();
const port = process.env.PORT || 3000;

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
  let metadata = {};

  try {
    if (fs.existsSync("./public/captions.json")) {
      const json = JSON.parse(
        fs.readFileSync("./public/captions.json", "utf8"),
      );

      metadata = {
        current: json.current || {},
        past: json.past || {},
      };
    }
  } catch (err) {
    console.error("Error reading captions.json:", err);
  }

  /* PROJECTS */

  const projectsRoot = path.join(__dirname, "public/images/projects");

  const categories = {
    current: [],
    past: [],
  };

  if (fs.existsSync(projectsRoot)) {
    fs.readdirSync(projectsRoot).forEach((category) => {
      const categoryPath = path.join(projectsRoot, category);

      if (!fs.statSync(categoryPath).isDirectory()) return;

      categories[category] = fs
        .readdirSync(categoryPath)

        .filter((projectFolder) =>
          fs.statSync(path.join(categoryPath, projectFolder)).isDirectory(),
        )

        .map((projectFolder) => {
          const projectData = metadata?.[category]?.[projectFolder] || {};

          const projectFolderPath = path.join(categoryPath, projectFolder);

          const images = fs
            .readdirSync(projectFolderPath)

            .filter((file) => file.endsWith(".webp"))

            .sort((a, b) =>
              a.localeCompare(b, undefined, {
                numeric: true,
              }),
            )

            .map((file) => ({
              src: `/images/projects/${category}/${projectFolder}/${file}`,

              caption: path.parse(file).name.replace(/[-_]/g, " "),
            }));

          return {
            name: projectData.name || projectFolder,

            location: projectData.location || "",

            client: projectData.client || "",

            description: projectData.description || "",

            images,
          };
        });
    });
  }

  /* CERTIFICATES */

  const certDir = path.join(__dirname, "public/images/certificates");

  let certifications = [];

  if (fs.existsSync(certDir)) {
    certifications = fs
      .readdirSync(certDir)

      .filter((file) => file.endsWith(".webp"))

      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))

      .map((file) => ({
        src: `/images/certificates/${file}`,
      }));
  }

  res.render("index", {
    categories,
    certifications,
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
