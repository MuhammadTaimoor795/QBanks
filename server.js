// Dotenv handy for local config & debugging
require("dotenv").config();

// Core Express & logging stuff
const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const errorHandler = require("./src/middleware/error-handler");
const { sequelize } = require("./models");

const app = express();

const path = require("path");

// Logging
app.use(logger("dev"));

//cors
const cors = require("cors");
const helmet = require("helmet");
app.use(
  cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
  })
);

app.use(function (req, res, next) {
  // res.header("Access-Control-Allow-Origin", "*");
  // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  // res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  //    next();

  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

//wearing a helmet

app.use(helmet());

// Parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "/public/assets")));

// Routes & controllers
app.get("/api", (req, res) => res.json({ msg: " Welcome to QBanks Api" }));
app.use("/api/user", require("./src/routes/user-route"));
app.use("/api/admin", require("./src/routes/admin-route"));

// app.use("/admin", require("./src/routes/admin"));

// Catch all route, generate an error & forward to error handler
// app.use(function (req, res, next) {
//   let err = new Error("Not Found");
//   err.status = 404;
//   next(err);
// });

// app.use(errorHandler);

app.use(function (req, res, next) {
  const { errorResponse } = require("./src/utils/constants");
  res.status(404).json(errorResponse("API NOT FOUND", res.statusCode));
});

// Get values from env vars or defaults where not provided
let port = process.env.PORT || 8000;

// Start the server
app.listen(port, async () => {
  await sequelize.authenticate();
  // console.log(__dirname)
  await sequelize.sync({ alter: true });
  //await sequelize.sync({ alter: true, force: true });
  //
  console.log(`Server Started in This Port  ${port}`);
  console.log("DB connected");

  // const fs = require("fs");
  // const csv = require("csvtojson");
  // const csvFilePath = "d.csv";
  // const questions = [];
  // csv()
  //   .fromFile(csvFilePath)
  //   .then((jsonArray) => {
  //     jsonArray.forEach((row) => {
  //       const questionText = row.questionText;
  //       const options = [];
  //       const correctOptions = [];
  //       for (let i = 1; i <= 4; i++) {
  //         const option = row[`option${i}`];
  //         options.push(option);
  //         const isCorrect =
  //           row[`option${i}_isCorrect`].toUpperCase() === "TRUE";
  //         if (isCorrect) {
  //           correctOptions.push(option);
  //         }
  //       }
  //       const question = {
  //         questionText: questionText,
  //         options: options,
  //         correctOptions: correctOptions,
  //       };
  //       questions.push(question);
  //     });
  //     // Convert the questions array to JSON
  //     const jsonData = JSON.stringify(questions);
  //     // Do something with the JSON data (e.g., write to a file, send over the network)
  //     console.log(jsonData);
  //   })
  //   .catch((error) => {
  //     console.error("Error converting CSV to JSON:", error);
  //   });
});

// exam mode
// t

module.exports = app;
