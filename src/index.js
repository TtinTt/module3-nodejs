// const express = require("express");

import express from "express"; //phải thêm "type":"module" ở package.json
import bodyParser from "body-parser";
import morgan from "morgan";
import fs from "fs";
const application = express();

// application.use(express.json());
// application.use(express.urlencoded());

// Cấu hình body parser
// parse application/x-www-form-urlencoded
application.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
application.use(bodyParser.json());

// Cấu hình morgan
const accessLogStream = fs.createWriteStream("src/logs/access.log", {
  flags: "a",
});
application.use(morgan("combined", { stream: accessLogStream }));

application.get("/users", (req, res) => {
  res.send({ user: [] });
});

application.post("/users", (req, res) => {
  res.send({ requestBody: req.body });
});

application.listen(8000, () => {
  console.log("sever started");
});
