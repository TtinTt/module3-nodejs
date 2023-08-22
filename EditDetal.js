import fs from "fs";

const readJSONFile = (path) => {
  try {
    return JSON.parse(fs.readFileSync(path, "utf8"));
  } catch (error) {
    console.error(`Failed to read or parse file ${path}:`, error);
    return [];
  }
};

const detal = readJSONFile("detal.json");
console.log("Tổng link đầu vào", detal.length);

function getProductTypeAndName(productName) {
  //   let productName = products.title;

  let clothesKeywords = [
    "Hoodie",
    "Bomber Jacket",
    "Baseball Jacket",
    "Baseball Jersey",
    "Gaiter Hoodie",
    "Jersey",
  ];

  let shoeKeywords = [
    "Air Force",
    "Air Jordan 1",
    "Air Jordan 1 3",
    "JD 13",
    "Air Jordan 13",
    "Low Top Shoes",
    "Max Soul Sneakers",
    "High Top Shoes",
    "High Top",
    "Low Top Shoes",
    "Low Top",
    "Jordan 13",
    "AJH",
    "JD13 ",
    "AF",
  ];

  // Sort the keywords in descending order of their length
  clothesKeywords = clothesKeywords.sort((a, b) => b.length - a.length);
  shoeKeywords = shoeKeywords.sort((a, b) => b.length - a.length);

  const productTypeAndName = {};

  for (let keyword of clothesKeywords) {
    if (productName.toLowerCase().includes(keyword.toLowerCase())) {
      productTypeAndName.name = "Clothes";
      if (keyword == "Jersey") {
        productTypeAndName.type = "Baseball Jersey";
      } else {
        productTypeAndName.type = keyword;
      }
      return productTypeAndName;
    }
  }

  for (let keyword of shoeKeywords) {
    if (productName.toLowerCase().includes(keyword.toLowerCase())) {
      productTypeAndName.name = "Shoe";

      if (keyword == "Low Top" || keyword == "Low Top Custom") {
        productTypeAndName.type = "Low Top Shoes";
      } else if (
        keyword == "Air Jordan 1 3" ||
        keyword == "JD 13" ||
        keyword == "Jordan 13" ||
        keyword == "JD13"
      ) {
        productTypeAndName.type = "Air Jordan 13";
      } else if (keyword == "High Top") {
        productTypeAndName.type = "High Top Shoes";
      } else if (keyword == "AJH") {
        productTypeAndName.type = "Air Jordan 1";
      } else if (keyword == "AF") {
        productTypeAndName.type = "Air Force";
      } else {
        productTypeAndName.type = keyword;
      }
      return productTypeAndName;
    }
  }

  return null; // Return null if no match is found
}

const listProductNontype = detal
  //   .filter((product) => !product.type)
  .map((product) => {
    if (!product.type) {
      const productTypeDetails = getProductTypeAndName(product.title);
      if (!productTypeDetails) return product; // trả về sản phẩm mà không thay đổi nếu không tìm thấy loại và tên

      const { type, name } = productTypeDetails;
      return {
        ...product,
        type: type,
        typeGroup: name,
      };
    } else return product;
  });

const listProductUpdateImg = listProductNontype.map((product) => {
  if (product.type == "Gaiter Hoodie") {
    let newImg = [
      product.ProductIMG[0],
      "https://resize.latteprint.com/img/2000/200/resize/2023-08-10/1691643659234_0.jpg",
      "https://resize.latteprint.com/img/2000/200/resize/2023-08-10/1691643667253_1.jpg",
      "https://resize.latteprint.com/img/2000/200/resize/2023-08-10/1691643672030_2.jpg",
      "https://resize.latteprint.com/img/2000/200/resize/2023-08-10/1691643677052_3.jpg",
      "https://resize.latteprint.com/img/2000/200/resize/2023-08-10/1691643683271_4.jpg",
    ];

    return {
      ...product,
      ProductIMG: newImg,
    };
  } else return product;
});

const listProductAnimeUpdateTeam = listProductUpdateImg.map((product) => {
  if (
    product.team == null &&
    (product.title.toLowerCase().includes("Dragon Ball".toLowerCase()) ||
      product.title.toLowerCase().includes("Dragonball".toLowerCase()) ||
      product.title.toLowerCase().includes("Songoku".toLowerCase()))
  ) {
    return {
      ...product,
      league: "ANIME",
      team: "Dragon Ball",
    };
  } else if (
    product.team == null &&
    (product.title.toLowerCase().includes("Naruto".toLowerCase()) ||
      product.title.toLowerCase().includes("Sasuke".toLowerCase()) ||
      product.title.toLowerCase().includes("Sasuno".toLowerCase()) ||
      product.title.toLowerCase().includes("Kurama".toLowerCase()) ||
      product.title.toLowerCase().includes("Itachi".toLowerCase()) ||
      product.title.toLowerCase().includes("Sharingan".toLowerCase()) ||
      product.title.toLowerCase().includes("Kakashi".toLowerCase()))
  ) {
    return {
      ...product,
      league: "ANIME",
      team: "Naruto",
    };
  } else if (
    (product.team == null &&
      product.title.toLowerCase().includes("One piece".toLowerCase())) ||
    product.title.toLowerCase().includes("DxD".toLowerCase())
  ) {
    return {
      ...product,
      league: "ANIME",
      team: "High School DxD",
    };
  } else if (
    product.team == null &&
    (product.title.toLowerCase().includes("Onepiece".toLowerCase()) ||
      product.title.toLowerCase().includes("One piece".toLowerCase()) ||
      product.title.toLowerCase().includes("Luffy".toLowerCase()))
  ) {
    return {
      ...product,
      league: "ANIME",
      team: "One Piece",
    };
  } else if (
    product.team == null &&
    (product.title.toLowerCase().includes("Ichigo".toLowerCase()) ||
      product.title.toLowerCase().includes("Bleach".toLowerCase()))
  ) {
    return {
      ...product,
      league: "ANIME",
      team: "Bleach",
    };
  } else if (
    product.team == null &&
    (product.title.toLowerCase().includes("Hunter X Hunter".toLowerCase()) ||
      product.title.toLowerCase().includes("HunterXHunter".toLowerCase()))
  ) {
    return {
      ...product,
      league: "ANIME",
      team: "Hunter X Hunter",
    };
  } else if (
    product.team == null &&
    (product.title.toLowerCase().includes("My Hero Academia".toLowerCase()) ||
      product.title.toLowerCase().includes("Hero Academia".toLowerCase()) ||
      product.title.toLowerCase().includes("Karasuno ".toLowerCase()))
  ) {
    return {
      ...product,
      league: "ANIME",
      team: "My Hero Academia",
    };
  } else if (
    product.team == null &&
    (product.title.toLowerCase().includes("Inuyasha".toLowerCase()) ||
      product.title.toLowerCase().includes("Kirara ".toLowerCase()))
  ) {
    return {
      ...product,
      league: "ANIME",
      team: "Inuyasha",
    };
  } else if (
    product.team == null &&
    (product.title.toLowerCase().includes("Demon Slayer".toLowerCase()) ||
      product.title.toLowerCase().includes("Kimetsu no Yaiba".toLowerCase()))
  ) {
    return {
      ...product,
      league: "ANIME",
      team: "Demon Slayer",
    };
  } else if (
    product.team == null &&
    (product.title.toLowerCase().includes("Black Clover".toLowerCase()) ||
      product.title.toLowerCase().includes("BlackClover".toLowerCase()))
  ) {
    return {
      ...product,
      league: "ANIME",
      team: "Black Clover",
    };
  } else if (
    product.team == null &&
    (product.title.toLowerCase().includes("Inarizaki High".toLowerCase()) ||
      product.title.toLowerCase().includes("Itachiyama".toLowerCase()) ||
      product.title.toLowerCase().includes("Fukurodani".toLowerCase()) ||
      product.title.toLowerCase().includes("Karasuno".toLowerCase()) ||
      product.title.toLowerCase().includes("Haikyuu".toLowerCase()) ||
      product.title.toLowerCase().includes("InarizakiHigh".toLowerCase()))
  ) {
    return {
      ...product,
      league: "ANIME",
      team: "Haikyuu",
    };
  } else if (
    product.team == null &&
    (product.title.toLowerCase().includes("Tokyo Ghoul".toLowerCase()) ||
      product.title.toLowerCase().includes("TokyoGhoul".toLowerCase()))
  ) {
    return {
      ...product,
      league: "ANIME",
      team: "Tokyo Ghoul",
    };
  } else if (
    product.team == null &&
    (product.title.toLowerCase().includes("Attack On Titan".toLowerCase()) ||
      product.title.toLowerCase().includes("AttackOnTitan".toLowerCase()))
  ) {
    return {
      ...product,
      league: "ANIME",
      team: "Attack On Titan",
    };
  } else if (
    product.team == null &&
    (product.title.toLowerCase().includes("champloo".toLowerCase()) ||
      product.title.toLowerCase().includes("Fuu".toLowerCase()))
  ) {
    return {
      ...product,
      league: "ANIME",
      team: "Samurai champloo",
    };
  } else if (
    product.team == null &&
    (product.title.toLowerCase().includes("Danganronpa".toLowerCase()) ||
      product.title.toLowerCase().includes("Danganronpa".toLowerCase()))
  ) {
    return {
      ...product,
      league: "ANIME",
      team: "Danganronpa",
    };
  } else if (
    product.team == null &&
    (product.title.toLowerCase().includes("Dr. Stone".toLowerCase()) ||
      product.title.toLowerCase().includes("Ishigami Senku".toLowerCase()) ||
      product.title.toLowerCase().includes("Dr Stone".toLowerCase()))
  ) {
    return {
      ...product,
      league: "ANIME",
      team: "Dr. Stone",
    };
  } else if (
    product.team == null &&
    (product.title.toLowerCase().includes("Bizarre".toLowerCase()) ||
      product.title.toLowerCase().includes("Bizarre".toLowerCase()))
  ) {
    return {
      ...product,
      league: "ANIME",
      team: "Bizarre",
    };
  } else if (
    product.team == null &&
    (product.title.toLowerCase().includes("Hitman Reborn".toLowerCase()) ||
      product.title.toLowerCase().includes("HitmanReborn".toLowerCase()))
  ) {
    return {
      ...product,
      league: "ANIME",
      team: "Hitman Reborn",
    };
  } else if (
    product.team == null &&
    (product.title.toLowerCase().includes("Saitama".toLowerCase()) ||
      product.title.toLowerCase().includes("Punch".toLowerCase()) ||
      product.title.toLowerCase().includes("One Punch Man".toLowerCase()))
  ) {
    return {
      ...product,
      league: "ANIME",
      team: "One Punch Man",
    };
  } else if (
    product.team == null &&
    (product.title.toLowerCase().includes("Fairy Tail".toLowerCase()) ||
      product.title.toLowerCase().includes("FairyTail".toLowerCase()))
  ) {
    return {
      ...product,
      league: "ANIME",
      team: "Fairy Tail",
    };
  } else if (
    product.team == null &&
    (product.title.toLowerCase().includes("Berserk".toLowerCase()) ||
      product.title.toLowerCase().includes("Berserk".toLowerCase()))
  ) {
    return {
      ...product,
      league: "ANIME",
      team: "Berserk",
    };
  } else if (
    product.team == null &&
    (product.title.toLowerCase().includes("Baki".toLowerCase()) ||
      product.title.toLowerCase().includes("Baki".toLowerCase()))
  ) {
    return {
      ...product,
      league: "ANIME",
      team: "Baki",
    };
  } else if (
    product.team == null &&
    (product.title.toLowerCase().includes("Death Note".toLowerCase()) ||
      product.title.toLowerCase().includes("DeathNote".toLowerCase()))
  ) {
    return {
      ...product,
      league: "ANIME",
      team: "Death Note",
    };
  } else if (
    product.team == null &&
    (product.title.toLowerCase().includes("Gundam".toLowerCase()) ||
      product.title.toLowerCase().includes("Gundam".toLowerCase()))
  ) {
    return {
      ...product,
      league: "ANIME",
      team: "Gundam",
    };
  } else if (
    product.team == null &&
    (product.title.toLowerCase().includes("Yu Gi Oh".toLowerCase()) ||
      product.title.toLowerCase().includes("YuGi".toLowerCase()))
  ) {
    return {
      ...product,
      league: "ANIME",
      team: "Yu Gi Oh",
    };
  } else if (
    product.team == null &&
    (product.title.toLowerCase().includes("Saint Seiya".toLowerCase()) ||
      product.title.toLowerCase().includes("SaintSeiya".toLowerCase()))
  ) {
    return {
      ...product,
      league: "ANIME",
      team: "Saint Seiya",
    };
  } else if (
    product.team == null &&
    (product.title.toLowerCase().includes("Sailor Moon".toLowerCase()) ||
      product.title.toLowerCase().includes("SailorMoon".toLowerCase()))
  ) {
    return {
      ...product,
      league: "ANIME",
      team: "Sailor Moon",
    };
  } else if (
    product.team == null &&
    (product.title.toLowerCase().includes("Pokemon".toLowerCase()) ||
      product.title.toLowerCase().includes("PIKACHU".toLowerCase()))
  ) {
    return {
      ...product,
      league: "ANIME",
      team: "Pokemon",
    };
  } else if (
    product.team == null &&
    (product.title.toLowerCase().includes("Seven Deadly Sins".toLowerCase()) ||
      product.title.toLowerCase().includes("Deadly".toLowerCase()))
  ) {
    return {
      ...product,
      league: "ANIME",
      team: "Seven Deadly Sins",
    };
  } else if (
    product.team == null &&
    (product.title.toLowerCase().includes("Gintama".toLowerCase()) ||
      product.title.toLowerCase().includes("Gintama".toLowerCase()))
  ) {
    return {
      ...product,
      league: "ANIME",
      team: "Gintama",
    };
  } else if (
    product.team == null &&
    (product.title
      .toLowerCase()
      .includes("The Promised Neverland".toLowerCase()) ||
      product.title.toLowerCase().includes("Neverland".toLowerCase()))
  ) {
    return {
      ...product,
      league: "ANIME",
      team: "The Promised Neverland",
    };
  } else if (
    product.team == null &&
    (product.title.toLowerCase().includes("Steins Gate".toLowerCase()) ||
      product.title.toLowerCase().includes("Steins Gate".toLowerCase()))
  ) {
    return {
      ...product,
      league: "ANIME",
      team: "Steins Gate",
    };
  } else if (
    product.team == null &&
    (product.title
      .toLowerCase()
      .includes("Yu Yu Hakusho Anime".toLowerCase()) ||
      product.title.toLowerCase().includes("Yu Yu".toLowerCase()))
  ) {
    return {
      ...product,
      league: "ANIME",
      team: "Yu Yu Hakusho Anime",
    };
  } else if (
    product.team == null &&
    (product.title.toLowerCase().includes("Spirited Away".toLowerCase()) ||
      product.title.toLowerCase().includes("SpiritedAway".toLowerCase()))
  ) {
    return {
      ...product,
      league: "ANIME",
      team: "Spirited Away",
    };
  } else if (
    product.team == null &&
    (product.title.toLowerCase().includes("Jojo".toLowerCase()) ||
      product.title.toLowerCase().includes("Jojo".toLowerCase()))
  ) {
    return {
      ...product,
      league: "ANIME",
      team: "JoJo",
    };
  } else if (
    product.team == null &&
    (product.title.toLowerCase().includes("Mob Pyscho".toLowerCase()) ||
      product.title.toLowerCase().includes("Pyscho".toLowerCase()))
  ) {
    return {
      ...product,
      league: "ANIME",
      team: "Mob Pyscho",
    };
  } else if (
    product.team == null &&
    (product.title.toLowerCase().includes("Black Butler".toLowerCase()) ||
      product.title.toLowerCase().includes("BlackButler".toLowerCase()))
  ) {
    return {
      ...product,
      league: "ANIME",
      team: "Black Butler",
    };
  } else if (
    product.team == null &&
    (product.title.toLowerCase().includes("Saiki Kusuo".toLowerCase()) ||
      product.title.toLowerCase().includes("Saiki".toLowerCase()))
  ) {
    return {
      ...product,
      league: "ANIME",
      team: "Saiki Kusuo",
    };
  } else if (
    product.team == null &&
    (product.title.toLowerCase().includes("Black Butler".toLowerCase()) ||
      product.title.toLowerCase().includes("Butler".toLowerCase()))
  ) {
    return {
      ...product,
      league: "ANIME",
      team: "Black Butler",
    };
  } else if (
    product.team == null &&
    (product.title.toLowerCase().includes("jujutsu kaisen".toLowerCase()) ||
      product.title.toLowerCase().includes("kaisen".toLowerCase()) ||
      product.title.toLowerCase().includes("jujutsu".toLowerCase()))
  ) {
    return {
      ...product,
      league: "ANIME",
      team: "jujutsu kaisen",
    };
  } else if (
    product.team == null &&
    (product.title.toLowerCase().includes("Air Gear".toLowerCase()) ||
      product.title.toLowerCase().includes("AirGear".toLowerCase()))
  ) {
    return {
      ...product,
      league: "ANIME",
      team: "Air Gear",
    };
  } else if (
    product.team == null &&
    (product.title.toLowerCase().includes("Kakegurui".toLowerCase()) ||
      product.title.toLowerCase().includes("Kakegurui".toLowerCase()))
  ) {
    return {
      ...product,
      league: "ANIME",
      team: "Kakegurui",
    };
  } else if (
    product.team == null &&
    (product.title
      .toLowerCase()
      .includes("Fullmetal Alchemist".toLowerCase()) ||
      product.title.toLowerCase().includes("Fullmetal".toLowerCase()))
  ) {
    return {
      ...product,
      league: "ANIME",
      team: "KakFullmetal Alchemistegurui",
    };
  } else if (
    product.team == null &&
    (product.title.toLowerCase().includes("Kingdom Hearts".toLowerCase()) ||
      product.title.toLowerCase().includes("KingdomHearts".toLowerCase()))
  ) {
    return {
      ...product,
      league: "ANIME",
      team: "Kingdom Hearts",
    };
  } else if (
    product.team == null &&
    (product.title
      .toLowerCase()
      .includes("Akame Ga Kill Esdeath".toLowerCase()) ||
      product.title
        .toLowerCase()
        .includes("Akame Ga Kill Esdeath".toLowerCase()))
  ) {
    return {
      ...product,
      league: "ANIME",
      team: "Akame Ga Kill Esdeath",
    };
  } else if (
    product.team == null &&
    (product.title.toLowerCase().includes("Afro Samurai".toLowerCase()) ||
      product.title.toLowerCase().includes("AfroSamurai".toLowerCase()))
  ) {
    return {
      ...product,
      league: "ANIME",
      team: "Afro Samurai",
    };
  } else if (
    product.team == null &&
    (product.title.toLowerCase().includes("Soul Eater".toLowerCase()) ||
      product.title.toLowerCase().includes("SoulEater".toLowerCase()))
  ) {
    return {
      ...product,
      league: "ANIME",
      team: "Soul Eater",
    };
  } else if (
    product.team == null &&
    (product.title
      .toLowerCase()
      .includes("Darling In The Franxx".toLowerCase()) ||
      product.title
        .toLowerCase()
        .includes("Darling In The Franxx".toLowerCase()))
  ) {
    return {
      ...product,
      league: "ANIME",
      team: "Darling In The Franxx",
    };
  } else if (
    product.team == null &&
    (product.title.toLowerCase().includes("Toradora".toLowerCase()) ||
      product.title.toLowerCase().includes("Toradora".toLowerCase()))
  ) {
    return {
      ...product,
      league: "ANIME",
      team: "Toradora",
    };
  } else if (product.team == null && product.league == "ANIME") {
    return {
      ...product,
      league: "ANIME",
      team: "Other",
    };
  } else if (product.team == null) {
    return {
      ...product,
      team: "Other",
    };
  } else return product;
});

if (listProductAnimeUpdateTeam.length > 0) {
  try {
    fs.writeFileSync("detal.json", JSON.stringify(listProductAnimeUpdateTeam));
    console.log("Thiếu type", listProductAnimeUpdateTeam.length, errmsg);
  } catch (error) {
    console.error("Ghi thành công", listProductAnimeUpdateTeam.length);
  }
} else {
  console.log("Không có sản phẩm nào cần cập nhật");
}
