const cheerio = require("cheerio");
const request = require("request-promise");
const fs = require("fs");
const Promise = require("bluebird");

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function checkArray(mainArray, inputString) {
  // Đổi tên biến
  return mainArray.includes(inputString);
}

async function makeRequest(url, retries = 0) {
  try {
    return await request(url);
  } catch (error) {
    if (retries < 3) {
      await delay(1000);
      return await makeRequest(url, retries + 1);
    } else {
      throw error;
    }
  }
}

async function fetchData() {
  let rawData;
  try {
    rawData = fs.readFileSync("data.json", "utf8");
  } catch {
    rawData = "[]";
  }

  let data = JSON.parse(rawData);

  const requests = Array.from({ length: 501 }, (_, i) => async () => {
    await delay(200);

    const url =
      "https://www.desariodesign.com/collections/all-products?index=1&page=" +
      i;
    const html = await makeRequest(url);

    const $ = cheerio.load(html);
    $(".product-in-list__image").each((index, el) => {
      const link =
        "https://www.desariodesign.com" +
        $(el).find(".product-link").attr("href");

      if (!checkArray(data, link)) {
        // Sử dụng inputString
        data.push(link);
      }
    });
  });

  await Promise.map(requests, (request) => request(), { concurrency: 5 });

  fs.writeFileSync("data.json", JSON.stringify(data));
}

fetchData().catch((error) => console.log(error));
