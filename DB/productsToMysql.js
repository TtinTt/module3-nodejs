import getConnection from "../src/config/connection.database.js";
const connection = getConnection();
import fs from "fs";

connection.connect((err) => {
    if (err) throw err;
    console.log("Connected!");

    // Đọc nội dung của products.json
    fs.readFile("./DB/products.json", "utf8", (err, data) => {
        if (err) throw err;

        let products = JSON.parse(data);

        // Lặp qua từng sản phẩm
        products.forEach((product) => {
            let { name, price, comparative, sku, description, img, tag } =
                product;

            // Chèn sản phẩm vào bảng products
            connection.query(
                "INSERT INTO products (name, price, comparative, sku, description) VALUES (?, ?, ?, ?, ?)",
                [name, price, comparative, sku, description],
                (err, result) => {
                    if (err) throw err;
                    let insertedProductId = result.insertId;

                    // Chèn hình ảnh vào bảng product_images
                    img.forEach((image_url) => {
                        connection.query(
                            "INSERT INTO product_images (product_id, image_url) VALUES (?, ?)",
                            [insertedProductId, image_url],
                            (err) => {
                                if (err) throw err;
                            }
                        );
                    });

                    // Chèn tag vào bảng product_tags
                    tag.forEach((tagName) => {
                        connection.query(
                            "INSERT INTO product_tags (product_id, tag) VALUES (?, ?)",
                            [insertedProductId, tagName],
                            (err) => {
                                if (err) throw err;
                            }
                        );
                    });
                }
            );
        });
    });
});
