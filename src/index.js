// const express = require("express");

import express, { response } from "express"; //phải thêm "type":"module" ở package.json
import { request } from "http";

const application = express();

application.use(express.json());
application.use(express.urlencoded());

// ví dụ trả về HTML
application.get("/", (request, response) => {
  response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" }); //Để viết phần lớn các ngôn ngữ trên thế giới
  response.write("<h1>Đây là trang chủ</h1>");
  response.end();

  //   response.send("<h1>Đây là trang chủ</h1>"); //chỉ có trong express, có thể viết như thế này để thay thế 3 dòng response.writeHead , response.write , response.end
});

// application.get("/users/create", (req, res) => {
//   res.send(`
//         <form action="http://localhost:8000/users" method="POST">
//             <input name="name" placeholder="Name"/>
//             <input name="address" placeholder="Address"/>
//             <input type="number" name="age" placeholder="Age"/>
//             <button type="submit">Create</button>
//         </form>
//     `);
// });

// Với method GET: Khi submit thì sẽ nhận dữ liệu payload sẽ lấy thông qua res.query
// Với method POST: Khi submit thì sẽ nhận dữ liệu payload sẽ lấy thông qua res.body

// user LIST GET
application.get("/users", (req, res) => {
  res.send({
    body: req.query,
  });
});

// user CREATE POST
application.post("/users", (req, res) => {
  res.send({
    body: req.body,
  });
});

// user UPDATE PUT
application.put("/users/:id", (req, res) => {
  const id = req.params.id;
  res.send(id);
});

// user FIND GET
application.get("/users/:id", (req, res) => {
  const id = req.params.id;
  res.send(id);
});

// user DELETE DELETE
application.delete("/users/:id", (req, res) => {
  const id = req.params.id;
  res.send(id);
});

// product LIST GET
application.get("/products", (req, res) => {
  res.send({
    body: req.query,
  });
});

// product CREATE POST
application.post("/products", (req, res) => {
  res.send({
    body: req.body,
  });
});

// product UPDATE PUT
application.put("/products/:id", (req, res) => {
  const id = req.params.id;
  res.send(id);
});

// product FIND GET
application.get("/products/:id", (req, res) => {
  const id = req.params.id;
  res.send(id);
});

// product DELETE DELETE
application.delete("/products/:id", (req, res) => {
  const id = req.params.id;
  res.send(id);
});

// order LIST GET
application.get("/orders", (req, res) => {
  res.send({
    body: req.query,
  });
});

// order CREATE POST
application.post("/orders", (req, res) => {
  res.send({
    body: req.body,
  });
});

// order UPDATE PUT
application.put("/orders/:id", (req, res) => {
  const id = req.params.id;
  res.send(id);
});

// order FIND GET
application.get("/orders/:id", (req, res) => {
  const id = req.params.id;
  res.send(id);
});

// order DELETE DELETE
application.delete("/orders/:id", (req, res) => {
  const id = req.params.id;
  res.send(id);
});

// contact LIST GET
application.get("/contacts", (req, res) => {
  res.send({
    body: req.query,
  });
});

// contact CREATE POST
application.post("/contacts", (req, res) => {
  res.send({
    body: req.body,
  });
});

// contact UPDATE PUT
application.put("/contacts/:id", (req, res) => {
  const id = req.params.id;
  res.send(id);
});

// contact FIND GET
application.get("/contacts/:id", (req, res) => {
  const id = req.params.id;
  res.send(id);
});

// contact DELETE DELETE
application.delete("/contacts/:id", (req, res) => {
  const id = req.params.id;
  res.send(id);
});

application.listen(8000, () => {
  console.log("Server started");
});
