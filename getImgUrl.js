import fs from "fs";
import { flattenArray } from "./zTool.js";
// Đọc file detail.json

fs.readFile("detal.json", "utf8", (err, data) => {
  if (err) {
    console.error("Lỗi khi đọc file:", err);
    return;
  }

  // Phân tích cú pháp nội dung file để lấy dữ liệu JSON
  const details = JSON.parse(data);

  let productIMGUrls = [];

  details.forEach((product) => {
    productIMGUrls.push(product.ProductIMG);
  });

  // Lưu các URL vào file ProductIMG-Link.json
  fs.writeFile(
    "ProductIMG-Link.json",
    JSON.stringify(flattenArray(productIMGUrls), null, 2),
    (writeErr) => {
      if (writeErr) {
        console.error("Lỗi khi ghi file:", writeErr);
        return;
      }
      console.log("Đã lưu thành công các URL vào ProductIMG-Link.json!");
    }
  );
});
