import getConnection from "../src/config/connection.database.js";
const connection = getConnection();
import fs from "fs";

connection.connect((err) => {
    if (err) throw err;
    console.log("Connected!");

    // Đọc nội dung của orders.json
    fs.readFile("./DB/orders.json", "utf8", (err, data) => {
        if (err) throw err;

        let orders = JSON.parse(data);

        // Lặp qua từng đơn hàng
        orders.forEach((order) => {
            let { email, cart, address, date, status } = order;

            // Chèn đơn hàng vào bảng orders
            connection.query(
                "INSERT INTO orders (email, cart_json, address_json, date, status) VALUES (?, ?, ?, ?, ?)",
                [
                    email,
                    JSON.stringify(cart),
                    JSON.stringify(address),
                    date,
                    status,
                ],
                (err, result) => {
                    if (err) throw err;
                }
            );
        });
    });
});
