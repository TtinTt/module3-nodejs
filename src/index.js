// const express = require("express");

import express from "express"; //phải thêm "type":"module" ở package.json

const application = express();
application.listen(8000, () => {
  console.log("sever started");
});
