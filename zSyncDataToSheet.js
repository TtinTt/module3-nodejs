import { google } from "googleapis";
import fs from "fs";
import { extractLastSegment, flattenArray, productToRows } from "./zTool.js";

const sheets = google.sheets("v4");
const products = JSON.parse(fs.readFileSync("detal.json", "utf-8"));

const auth = new google.auth.GoogleAuth({
  keyFile: "product-list-lattex-8fd8235ffc14.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const spreadsheetId = "1l8fQdivH-ji7YguLWNTDXYTq8ZEa1k4wkzzSckVA0vo";

const chunkSize = 1333;
let productsChunks = [];
let sheetIndex = 1;

// Chia sản phẩm thành các phần nhỏ
for (let i = 0; i < products.length; i += chunkSize) {
  productsChunks.push(products.slice(i, i + chunkSize));
  // console.log(productsChunks.length);
}
async function appendData(chunk, sheetName) {
  const dataPromises = chunk.map((product) => productToRows(product));
  const data = await Promise.all(dataPromises);

  const request = {
    spreadsheetId,
    range: `${sheetName}!A2`, // Sử dụng tên sheet tương ứng
    valueInputOption: "RAW",
    resource: {
      values: flattenArray(data),
    },
    auth,
  };

  try {
    const client = await auth.getClient();
    await sheets.spreadsheets.values.append({ ...request, auth: client });
    console.log(`Dữ liệu đã được ghi thành công vào ${sheetName}`);
  } catch (err) {
    console.error(err);
    // Thử lại sau 5 phút nếu có lỗi
    setTimeout(() => appendData(chunk, sheetName), 5 * 60 * 1000);
  }
}

// Hàm để gửi dữ liệu theo lịch trình
function scheduleSend() {
  let index = 0;

  // Gửi mỗi phút
  const interval = setInterval(() => {
    if (index < productsChunks.length) {
      const sheetName = `Sheet${sheetIndex}`;
      appendData(productsChunks[index], sheetName);
      index++;

      // Nếu đã gửi 1000 sản phẩm, chuyển sang sheet tiếp theo
      if (index % 10 === 0) sheetIndex++;
    } else {
      clearInterval(interval);
      console.log("Hoàn tất!");
    }
  }, 60 * 1000);
}

// Bắt đầu gửi dữ liệu
scheduleSend();
