import fs from "fs";
import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";

import router from "./src/application/router.js";

const app = express();

// Cấu hình body parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Cấu hình morgan
const accessLogStream = fs.createWriteStream("logs/access.log", { flags: "a" });
app.use(morgan("combined", { stream: accessLogStream }));

app.use("/", router);

app.listen(8000, () => {
  console.log("Server started");
});
