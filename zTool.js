export const extractLastSegment = (url) => {
  // Tách URL thành các phần bằng dấu '/'
  const segments = url.split("/");
  // Trả về phần tử cuối cùng trong mảng
  return segments[segments.length - 1];
};

export const flattenArray = (arr) => {
  return arr.reduce((acc, subArray) => acc.concat(subArray), []);
};

export const productToRows = (product) => {
  const rows = [];

  // Lấy danh sách tên của các tùy chọn
  const optionKeys = Object.keys(product.options);

  // Khởi tạo danh sách các tùy chọn hiện tại và tổng số lượng tùy chọn
  const currentOptions = new Array(optionKeys.length).fill(0);
  const optionCounts = optionKeys.map((key) => product.options[key].length);

  let done = false;

  if (product.type == "Gaiter Hoodie") {
    product.ProductIMG = [
      product.ProductIMG[0],
      "https://resize.latteprint.com/img/2000/200/resize/2023-08-10/1691643659234_0.jpg",
      "https://resize.latteprint.com/img/2000/200/resize/2023-08-10/1691643667253_1.jpg",
      "https://resize.latteprint.com/img/2000/200/resize/2023-08-10/1691643672030_2.jpg",
      "https://resize.latteprint.com/img/2000/200/resize/2023-08-10/1691643677052_3.jpg",
      "https://resize.latteprint.com/img/2000/200/resize/2023-08-10/1691643683271_4.jpg",
    ];
  }

  if (product.type == null) {
  }

  let imgCount = product.ProductIMG.length - 1;

  while (!done) {
    const row = [];

    // Nếu đây là hàng đầu tiên, thêm mô tả và hình ảnh
    if (rows.length === 0) {
      row.push(extractLastSegment(product.url)); //handle
      row.push(product.title); //title
      row.push("mzmz" + extractLastSegment(product.url)); //sku
      row.push(product.description); // bodyHtml
      row.push(product.ProductIMG[0]); // ProductIMG
      row.push(product.type); // type
      row.push(
        product.typeGroup +
          (product.league != null ? ", " + product.league : "") +
          (product.team != null ? ", " + product.team : "") +
          ", mzmz"
      ); // tag
      row.push("FALSE"); // published
      row.push("TRUE"); // variantRequiresShipping
      row.push("TRUE"); // variantTaxable
      row.push("TRUE"); // availableOnListingPages
      row.push("TRUE"); // availableOnSitemapFiles
    } else {
      row.push(extractLastSegment(product.url)); //handle
      row.push(""); //title
      row.push("mzmz-" + extractLastSegment(product.url)); //sku
      row.push(""); // bodyHtml

      if (
        imgCount == 0
        // ||
        // (product.title.toLowerCase().includes("hoodie") &&
        //   product.ProductIMG.length == 4)
      ) {
        row.push("");
      } else {
        imgCount -= 1;
        row.push(product.ProductIMG[product.ProductIMG.length - imgCount - 1]);
      } // ProductIMG

      row.push(""); // type
      row.push(""); // tag
      row.push(""); // published
      row.push(""); // variantRequiresShipping
      row.push(""); // variantTaxable
      row.push(""); // availableOnListingPages
      row.push(""); // availableOnSitemapFiles
    }

    // Thêm các thành phần khác
    row.push(product.price);
    row.push(product.priceCompare);
    row.push(1000); // Variant Grams
    row.push("continue"); // Variant Inventory Policy
    row.push("manual"); // Variant Fulfillment Service

    // Thêm thông tin biến thể
    for (let i = 0; i < currentOptions.length; i++) {
      const optionIndex = currentOptions[i];
      const optionKey = optionKeys[i];
      const optionValue = product.options[optionKey][optionIndex];
      row.push(optionKeys[i].slice(0, -1));
      row.push(optionValue);
    }

    rows.push(row);

    // Tăng tùy chọn hiện tại và kiểm tra xem chúng ta đã xong chưa
    for (let i = 0; i < currentOptions.length; i++) {
      currentOptions[i]++;
      if (currentOptions[i] < optionCounts[i]) {
        break;
      }
      if (i === currentOptions.length - 1) {
        done = true;
        break;
      }
      currentOptions[i] = 0;
    }
  }

  return rows;
};

// // Sử dụng hàm
// const product = {
//   // ...
//   // Đối tượng sản phẩm của bạn ở đây
// };

// const rows = productToRows(product);

// Bây giờ, bạn có thể sử dụng mảng `rows` để gửi đến API Google Sheets
