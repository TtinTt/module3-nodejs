import fs from "fs";
import fetch from "node-fetch";
import path from "path";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function downloadImage(url, destination) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}. Status: ${response.status}`);
  }

  const buffer = await response.buffer();
  await fs.promises.writeFile(destination, buffer);
}

const MAX_RETRIES = 3;

async function downloadImageWithRetry(url, destination, retries = 0) {
  try {
    await downloadImage(url, destination);
  } catch (error) {
    if (retries < MAX_RETRIES) {
      console.warn(
        `Failed to download ${url}. Retrying... (${retries + 1}/${MAX_RETRIES})`
      );
      await delay(200); // delay 200ms before retrying
      return downloadImageWithRetry(url, destination, retries + 1);
    } else {
      throw new Error(
        `Failed to download ${url} after ${MAX_RETRIES} retries.`
      );
    }
  }
}

async function downloadAllImagesFromJson(filePath) {
  let urls;
  try {
    const jsonContent = await fs.promises.readFile(filePath, "utf-8");
    urls = JSON.parse(jsonContent);
  } catch (error) {
    throw new Error(`Error reading or parsing JSON file: ${error.message}`);
  }

  // Tạo một thư mục để lưu các ảnh
  if (!fs.existsSync("./downloaded_images")) {
    fs.mkdirSync("./downloaded_images");
  }

  let count = 0;

  for (let i = 0; i < urls.length; i += 10) {
    const chunk = urls.slice(i, i + 10);
    const promises = chunk.map(async (url) => {
      const fileName = path.basename(url); // Lấy tên file từ URL
      const destination = path.join("./downloaded_images", fileName);
      try {
        await downloadImageWithRetry(url, destination);
        console.log(
          `[${++count}/${urls.length}] Downloaded ${url} to ${destination}`
        );
      } catch (error) {
        console.error(`Failed to download ${url}. Reason: ${error.message}`);
      }
    });

    await Promise.all(promises);
    await delay(200); // delay 200ms before downloading the next chunk
  }
}

downloadAllImagesFromJson("./ProductIMG-Link.json")
  .then(() => console.log("All images have been downloaded."))
  .catch((error) => console.error(`An error occurred: ${error.message}`));
