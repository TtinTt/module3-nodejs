const fs = require("fs");

// Đọc dữ liệu từ file
const rawData = fs.readFileSync("data.json", "utf8");

// Phân tích dữ liệu JSON thành một đối tượng JavaScript
const data = JSON.parse(rawData);

console.log(data.length); // In dữ liệu ra màn hình console
