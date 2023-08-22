const EventEmitter = require("events");
EventEmitter.defaultMaxListeners = 20;

const puppeteer = require("puppeteer");
const fs = require("fs");
const Promise = require("bluebird");
const teams = {
  NFL: [
    "ARIZONA CARDINALS",
    "ATLANTA FALCONS",
    "BUFFALO BILLS",
    "CAROLINA PANTHERS",
    "CHICAGO BEARS",
    "CLEVELAND BROWN",
    "CINCINNATI BENGALS",
    "DALLAS COWBOYS",
    "DENVER BRONCOS",
    "DETROIT LIONS",
    "GREEN BAY PACKERS",
    "HOUSTON TEXANS",
    "INDIANAPOLIS COLTS",
    "JACKSONVILLE JAGUARS",
    "KANSAS CITY CHIEFS",
    "LAS VEGAS RAIDERS",
    "LOS ANGELES CHARGERS",
    "LOS ANGELES RAMS",
    "MIAMI DOLPHINS",
    "MINNESOTA VIKINGS",
    "NEW ENGLAND PATRIOTS",
    "NEW ORLEANS SAINTS",
    "NEW YORK GIANTS",
    "NEW YORK JETS",
    "PHILADELPHIA EAGLES",
    "PITTSBURGH STEELERS",
    "SAN FRANCISCO 49ERS",
    "SEATTLE SEAHAWKS",
    "TAMPA BAY BUCCANEERS",
    "TENNESSEE TITANS",
    "WASHINGTON COMMANDERS",
  ],
  NBA: [
    "ATLANTA HAWKS",
    "BOSTON CELTICS",
    "BROOKLYN NETS",
    "CHARLOTTE HORNETS",
    "CHICAGO BULLS",
    "CLEVELAND CAVALIERS",
    "DALLAS MAVERICKS",
    "DENVER NUGGETS",
    "DETROIT PISTONS",
    "GOLDEN STATE WARRIORS",
    "HOUSTON ROCKETS",
    "INDIANA PACERS",
    "LA CLIPPERS",
    "LOS ANGELES LAKERS",
    "MEMPHIS GRIZZLIES",
    "MIAMI HEAT",
    "MILWAUKEE BUCKS",
    "MINNESOTA TIMBERWOLVES",
    "NEW ORLEANS PELICANS",
    "NEW YORK KNICKS",
    "OKLAHOMA CITY THUNDER",
    "ORLANDO MAGIC",
    "PHILADELPHIA 76ERS",
    "PHOENIX SUNS",
    "PORTLAND TRAIL BLAZERS",
    "SACRAMENTO KINGS",
    "SAN ANTONIO SPURS",
    "TORONTO RAPTORS",
    "UTAH JAZZ",
    "WASHINGTON WIZARDS",
  ],
  MLB: [
    "ARIZONA DIAMONDBACKS",
    "ATLANTA BRAVES",
    "BALTIMORE ORIOLES",
    "BOSTON RED SOX",
    "CHICAGO CUBS",
    "CHICAGO WHITE SOX",
    "CINCINNATI REDS",
    "CLEVELAND GUARDIANS",
    "COLORADO ROCKIES",
    "DETROIT TIGERS",
    "HOUSTON ASTROS",
    "KANSAS CITY ROYALS",
    "LOS ANGELES ANGELS",
    "LOS ANGELES DODGERS",
    "MIAMI MARLINS",
    "MILWAUKEE BREWERS",
    "MINNESOTA TWINS",
    "NEW YORK METS",
    "NEW YORK YANKEES",
    "OAKLAND ATHLETICS",
    "PHILADELPHIA PHILLIES",
    "PITTSBURGH PIRATES",
    "SAN DIEGO PADRES",
    "SAN FRANCISCO GIANTS",
    "SEATTLE MARINERS",
    "ST. LOUIS CARDINALS",
    "TAMPA BAY RAYS",
    "TEXAS RANGERS",
    "TORONTO BLUE JAYS",
    "WASHINGTON NATIONALS",
  ],
  NHL: [
    "ANAHEIM DUCKS",
    "ARIZONA COYOTES",
    "BOSTON BRUINS",
    "BUFFALO SABRES",
    "CALGARY FLAMES",
    "CAROLINA HURRICANES",
    "CHICAGO BLACKHAWKS",
    "COLORADO AVALANCHE",
    "COLUMBUS BLUE JACKETS",
    "DALLAS STARS",
    "DETROIT RED WINGS",
    "EDMONTON OILERS",
    "FLORIDA PANTHERS",
    "LOS ANGELES KINGS",
    "MINNESOTA WILD",
    "NASHVILLE PREDATORS",
    "NEW JERSEY DEVILS",
    "NEW YORK ISLANDERS",
    "NEW YORK RANGERS",
    "OTTAWA SENATORS",
    "PHILADELPHIA FLYERS",
    "PITTSBURGH PENGUINS",
    "SAN JOSE SHARKS",
    "SEATTLE KRAKEN",
    "ST. LOUIS BLUES",
    "TAMPA BAY LIGHTNING",
    "TORONTO MAPLE LEAFS",
    "VANCOUVER CANUCKS",
    "VEGAS GOLDEN KNIGHTS",
    "WASHINGTON CAPITALS",
    "WINNIPEG JETS",
  ],
  ANIME: ["anime", "anime"],
};

let errorUrls = fs.readFileSync("errorUrl.json", "utf8");
if (errorUrls.includes(`[]\r\n`)) {
  errorUrls = [];
} else {
  errorUrls = JSON.parse(errorUrls); // Parse the content as JSON
}
let completeUrls = fs.readFileSync("completeUrl.json", "utf8"); // Tạo một mảng để lưu các URL đã chạy thành công
if (completeUrls.includes(`[]\r\n`)) {
  completeUrls = [];
} else {
  completeUrls = JSON.parse(completeUrls); // Parse the content as JSON
}
let remainingUrls = []; // Mảng để lưu các URL chưa chạy
let spliceArray = 1000;
function findDifference(array1, array2) {
  return array2.filter((item) => !array1.includes(item));
}
// Sort teams in each league by name length, descending
for (let league in teams) {
  teams[league].sort((a, b) => b.length - a.length);
}

function getTeamAndLeague(str) {
  str = str.toUpperCase();

  // Check if string contains team name
  for (let league in teams) {
    for (let team of teams[league]) {
      if (str.includes(team)) {
        return { team: team, league: league };
      }
    }
  }

  // If no team name found, check if string contains league name
  for (let league in teams) {
    if (str.includes(league)) {
      return { team: null, league: league };
    }
  }

  // If no team or league name found, return null
  return null;
}

function getProductTypeAndName(productName) {
  let clothesKeywords = [
    "Hoodie",
    "Bomber Jacket",
    "Baseball Jacket",
    "Baseball Jersey",
    "Gaiter Hoodie",
  ];
  let shoeKeywords = [
    "Air Force",
    "Air Jordan 1",
    "Air Jordan 1 3",
    "Low Top Shoes",
    "Max Soul Sneakers",
  ];

  // Sort the keywords in descending order of their length
  clothesKeywords = clothesKeywords.sort((a, b) => b.length - a.length);
  shoeKeywords = shoeKeywords.sort((a, b) => b.length - a.length);

  const productTypeAndName = {};

  for (let keyword of clothesKeywords) {
    if (productName.toLowerCase().includes(keyword.toLowerCase())) {
      productTypeAndName.type = "Clothes";
      productTypeAndName.name = keyword;
      return productTypeAndName;
    }
  }

  for (let keyword of shoeKeywords) {
    if (productName.toLowerCase().includes(keyword.toLowerCase())) {
      productTypeAndName.type = "Shoe";
      productTypeAndName.name = keyword;
      return productTypeAndName;
    }
  }

  return null; // Return null if no match is found
}

async function fetchTitle(url) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 200)); // Add delay
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2", timeout: 20000 });
    const title = await page.evaluate(() => {
      return document
        .querySelector(
          ".product-name.product-name-setting.heading-setting-text"
        )
        .innerText.trim();
    });

    const TeamAndLeague = getTeamAndLeague(title);
    const team = TeamAndLeague ? TeamAndLeague.team : null;
    const league = TeamAndLeague ? TeamAndLeague.league : null;

    const priceElement = await page.evaluate(() => {
      try {
        return document
          .querySelector(".product-original-price")
          .innerText.trim();
      } catch (error) {
        return null;
      }
    });

    const price = priceElement ? priceElement.toString().slice(1) : "0";

    const priceCompareElement = await page.evaluate(() => {
      try {
        return document
          .querySelector(".product-compare-price")
          .innerText.trim();
      } catch (error) {
        return null;
      }
    });

    const priceCompare = priceCompareElement
      ? priceCompareElement.toString().slice(1)
      : "0";

    const ProductIMG = await page.evaluate(() => {
      let productPhotos = [];
      const products = document.querySelectorAll(".product-image");
      for (let product of products) {
        const photo = product.querySelector(".product-image__thumb");

        if (photo) {
          const linkphoto = photo
            .getAttribute("src")
            .toString()
            .replace("/img/60/60/", "/img/2000/0/");
          if (
            !productPhotos.includes(linkphoto) &&
            linkphoto.includes("/img/2000/0/")
          ) {
            productPhotos.push(linkphoto);
          }
        }
      }
      return productPhotos;
    });
    const options = await page.evaluate(() => {
      const optionNodes = document.querySelectorAll(".product-options");
      const options = {};

      for (const optionNode of optionNodes) {
        const label = optionNode
          .querySelector(".product-option-label")
          .innerText.trim();
        const values = Array.from(
          optionNode.querySelectorAll(".button-setting-text")
        ).map((button) => button.innerText.trim());
        options[label] = values;
      }
      return options;
    });
    const customOptions = await page.evaluate(() => {
      const optionNodes = document.querySelectorAll(".personalize-test");
      const customOptions = {};

      for (const optionNode of optionNodes) {
        const label = optionNode
          .querySelector(".product-option-label")
          .innerText.trim();
        const values = Array.from(
          optionNode.querySelectorAll(".form-control")
        ).map((button) => button.placeholder.trim());
        customOptions[label] = values[0];
      }
      return customOptions;
    });
    const cataloge = getProductTypeAndName(title);
    let typeGroup, type;
    if (cataloge) {
      // Check if cataloge is not null
      typeGroup = cataloge.type;
      type = cataloge.name;
    }
    const description = await page.evaluate(() => {
      return document.querySelector(
        'div[data-v-3d27a034][style="color: rgb(102, 102, 102);"]'
      ).outerHTML;
    });

    await browser.close();
    if (title) {
      completeUrls.push(url);
    }
    return {
      url,
      title,
      price,
      priceCompare,
      ProductIMG,
      description,
      options,
      customOptions,
      type,
      typeGroup,
      league,
      team,
    };
  } catch (error) {
    console.error(`Failed to fetch title for URL: ${url}`, error);
    errorUrls.push(url); // Thêm URL bị lỗi vào mảng
    return null; // Return null if an error occurs
  }
}

async function fetchData() {
  try {
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

    const MAX_CONCURRENT_PAGES = 10; // Đổi số này tùy thuộc vào tài nguyên máy bạn
    const requests = Promise.map(
      data.slice(0, spliceArray), //

      (url) => {
        remainingUrls.push(url); // Thêm tất cả các URL vào mảng remainingUrls
        return fetchTitle(url);
      },
      {
        concurrency: MAX_CONCURRENT_PAGES,
      }
    );

    const results = await requests;

    results.forEach((result, index) => {
      if (result) {
        console.log(result);
        if (result.title && result.price && result.ProductIMG.length > 0) {
          detalList.push(result);
          remainingUrls.splice(index, 1); // Xóa URL đã chạy khỏi mảng remainingUrls
        }
      }
    });
    // Ghi các URL đã chạy thành công vào file completeUrl.json
    try {
      fs.writeFileSync("completeUrl.json", JSON.stringify(completeUrls));
    } catch (error) {
      console.error("Failed to write complete URLs to file:", error);
    }

    // Ghi các URL chưa chạy vào file data.json
    try {
      fs.writeFileSync(
        "data.json",
        JSON.stringify(findDifference(completeUrls, data))
      );
    } catch (error) {
      console.error("Failed to write remaining URLs to file:", error);
    }

    let newdata = findDifference(completeUrls, data);
    fs.writeFileSync("data.json", JSON.stringify(newdata));

    // Ghi các URL bị lỗi vào file errorUrl.json
    try {
      fs.writeFileSync("errorUrl.json", JSON.stringify(errorUrls));
    } catch (error) {
      console.error("Failed to write error URLs to file:", error);
    }

    // Try to write to file and catch any error
    try {
      fs.writeFileSync("detal.json", JSON.stringify(detalList));
    } catch (error) {
      console.error("Failed to write to file:", error);
    }
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
}

fetchData().catch((error) => console.log(error));
