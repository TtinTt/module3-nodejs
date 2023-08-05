const puppeteer = require("puppeteer");
const fs = require("fs");
const Promise = require("bluebird");

async function fetchTitle(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });
  const title = await page.evaluate(() => {
    return document
      .querySelector(".product-name.product-name-setting.heading-setting-text")
      .innerText.trim();
  });
  const price =
    (
      await page.evaluate(() => {
        try {
          return document
            .querySelector(".product-original-price")
            .innerText.trim();
        } catch (error) {
          return null;
        }
      })
    )
      .toString()
      .slice(1) ?? "0"; // Trả về "0" nếu không tìm thấy giá
  await browser.close();
  return { title, price };
}

async function fetchData() {
  let rawData;
  try {
    rawData = fs.readFileSync("data.json", "utf8");
  } catch {
    rawData = "[]";
  }

  let data = JSON.parse(rawData);

  let rawData2;
  try {
    rawData2 = fs.readFileSync("detal.json", "utf8");
  } catch {
    rawData2 = "[]";
  }

  let detalList = JSON.parse(rawData2);

  const requests = data.slice(0, 3).map((url) => async () => {
    const detalProduct = await fetchTitle(url);
    console.log(detalProduct);
    detalList.push(detalProduct);
  });

  await Promise.map(requests, (request) => request(), { concurrency: 5 });
  fs.writeFileSync("detal.json", JSON.stringify(detalList));
}

fetchData().catch((error) => console.log(error));
