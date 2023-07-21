// const express = require("express");

import express, { response } from "express"; //phải thêm "type":"module" ở package.json
import { request } from "http";

const application = express();

// ví dụ trả về HTML
application.get("/", (request, response) => {
  response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" }); //Để viết phần lớn các ngôn ngữ trên thế giới
  response.write("<h1>Đây là trang chủ</h1>");
  response.end();

  //   response.send("<h1>Đây là trang chủ</h1>"); //chỉ có trong express, có thể viết như thế này để thay thế 3 dòng response.writeHead , response.write , response.end
});

// ví dụ trả về JSON
application.get("/users", (req, res) => {
  //viết req, res thay cho request, response
  const users = [
    { id: 1, name: "Thái" },
    { id: 2, name: "Sáng" },
  ];

  res.send(users); //chỉ có trong express, viết send có thể thay cho cả res.write, res.end, res.writeHead
});

// ví dụ đường dẫn tương đối
application.get("/about/*", function (req, res) {
  res.send("Trang đường dẫn tương đối");
});

// ví dụ về param
application.get("/users/:id", function (req, res) {
  const users = [
    { id: 1, name: "Thái" },
    { id: 2, name: "Sáng" },
  ];

  const id = req.params.id;

  const user = users.find((u) => u.id == id);

  if (user) {
    res.send(user);
  } else {
    res.send({ error: "Người dùng không tồn tại" });
  }
});

// ví dụ lấy query string ()
application.get("/products", (req, res) => {
  const products = [
    { id: 1, name: "laptop" },
    { id: 2, name: "tablet" },
  ];

  const keyword = req.query.keyword;
  const searchResult = products.filter((product) =>
    product.name.includes(keyword)
  );

  res.send({ keyword: keyword });
});

application.listen(8000, () => {
  console.log("sever started");
});
