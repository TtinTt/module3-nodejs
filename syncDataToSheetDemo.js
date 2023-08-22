// const { google } = require("googleapis");
// const fs = require("fs");
import { google } from "googleapis";
import fs from "fs";
const sheets = google.sheets("v4");

import { extractLastSegment, flattenArray, productToRows } from "./zTool.js";

// Đọc file JSON chứa sản phẩm
const products = JSON.parse(fs.readFileSync("detalDemo.json", "utf-8"));

// Xác thực thông qua file JSON bạn đã tải từ Google Developers Console
const auth = new google.auth.GoogleAuth({
  keyFile: "product-list-lattex-8fd8235ffc14.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

// ID của Google Sheet bạn muốn ghi dữ liệu
const spreadsheetId = "1l8fQdivH-ji7YguLWNTDXYTq8ZEa1k4wkzzSckVA0vo";

// Tạo mảng dữ liệu từ JSON
const dataPromises = products.map((product) => {
  // let handle = extractLastSegment(product.url);
  // let title = product.title;
  // let bodyHtml = product.description.toString();
  // let type = product.type;
  // let tag =
  //   product.typeGroup +
  //   (product.league != null ? ", " + product.league : "") +
  //   (product.team != null ? ", " + product.team : "");
  // // array
  // let published = "FALSE";
  // let options = product.options; // array
  // let variantSku = "mzmz" + extractLastSegment(product.url);
  // let variantGrams = 1000;
  // let variantInventoryQty = 99;
  // let variantInventoryPolicy = "continue";
  // let variantFulfillmentService = "manual";
  // let variantPrice = product.price;
  // let variantPriceCompare = product.priceCompare;
  // let variantRequiresShipping = "TRUE";
  // let variantTaxable = "TRUE";
  // let imageSrc = product.ProductIMG; // array
  // let availableOnListingPages = "TRUE";
  // let availableOnSitemapFiles = "TRUE";

  // const rows = [];
  // const types = product.options["Type:"];
  // const sizes = product.options["Size:"];
  return productToRows(product);
});

Promise.all(dataPromises).then((data) => {
  // Tạo request để ghi dữ liệu
  const request = {
    spreadsheetId,
    range: "Sheet1!A2", // Bắt đầu từ ô A2
    valueInputOption: "RAW",
    resource: {
      values: flattenArray(data),
    },
    auth,
  };

  async function appendData() {
    const client = await auth.getClient();
    sheets.spreadsheets.values.append(
      { ...request, auth: client },
      (err, res) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log("Dữ liệu đã được ghi thành công");
      }
    );
  }

  // Gọi hàm để thực thi
  appendData();
});
