//////////////////////

import fs from "fs";

const readJSONFile = (path) => {
  try {
    return JSON.parse(fs.readFileSync(path, "utf8"));
  } catch (error) {
    console.error(`Failed to read or parse file ${path}:`, error);
    return [];
  }
};

const data = readJSONFile("data.json");
console.log("Tổng link còn lại", data.length);

const detal = readJSONFile("detal.json");
console.log("Tổng link đã get thành công", detal.length);

const completeUrl = readJSONFile("completeUrl.json");
console.log("Tổng link đã get được thống kê", completeUrl.length);

const errorUrl = readJSONFile("errorUrl.json");
console.log("Tổng link lỗi", errorUrl.length);

const discrepancy = 10077 - data.length - detal.length;
const errmsg =
  discrepancy === 0 ? ", không có sai sót" : `, chênh lệch ${discrepancy}`;
console.log("Thống kê thiếu", detal.length - completeUrl.length, errmsg);

function removeDuplicates(arr) {
  return [...new Set(arr)];
}
const listNonType = detal
  .filter((product) => !product.type)
  .map((product) => product.url);

const listNonTypeGroup = detal
  .filter((product) => !product.typeGroup)
  .map((product) => product.url);

if (listNonType.length > 0) {
  try {
    fs.writeFileSync("listNonType.json", JSON.stringify(listNonType));
    console.log("Thiếu type", listNonType.length, errmsg);
  } catch (error) {
    console.error("Failed to write error URLs to file:", error);
  }
} else {
  console.log("Không có URL nào thiếu 'type'");
}

if (listNonTypeGroup.length > 0) {
  try {
    fs.writeFileSync("listNonTypeGroup.json", JSON.stringify(listNonTypeGroup));
    console.log("Thiếu TypeGroup", listNonTypeGroup.length, errmsg);
  } catch (error) {
    console.error("Failed to write error URLs to file:", error);
  }
} else {
  console.log("Không có URL nào thiếu 'type'");
}

const listAnimeNonTeam = detal
  .filter((product) => product.league == "ANIME" && product.team == null)
  .map((product) => product.title);

if (listAnimeNonTeam.length > 0) {
  try {
    fs.writeFileSync("listAnimeNonTeam.json", JSON.stringify(listAnimeNonTeam));
    console.log("Anime thiếu Team", listAnimeNonTeam.length, errmsg);
  } catch (error) {
    console.error("Failed to write error URLs to file:", error);
  }
} else {
  console.log("Không có sản phẩm Anime nào thiếu 'Team'");
}

const requests = detal.map((product) => {
  return product.title;
});

console.log("Số liên kết duy nhất: ", removeDuplicates(requests).length);
