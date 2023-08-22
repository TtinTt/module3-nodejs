import fs from "fs";
import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";

import router from "./src/application/routes.js";

const app = express();

// Cấu hình CORS
app.use(cors());

// Serving file
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

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
    console.log("Server started 8000");
});
